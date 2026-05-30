"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingInput = {
  branchSlug: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  occasion?: string;
  specialRequest?: string;
};

export type BookingResult = { error: string } | undefined;

export async function getSlotAvailability(
  branchSlug: string,
  date: string,
): Promise<Record<string, boolean>> {
  if (!branchSlug || !date) return {};

  const supabase = createServerClient();

  const { data: branch } = await supabase
    .from("branches")
    .select("id, capacity_per_slot")
    .eq("slug", branchSlug)
    .eq("is_active", true)
    .single();

  if (!branch) return {};

  const { data: bookings } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("branch_id", branch.id)
    .eq("booking_date", date)
    .in("status", ["confirmed", "seated"]);

  // Count bookings per time slot
  const counts: Record<string, number> = {};
  for (const b of bookings ?? []) {
    const slot = b.booking_time.slice(0, 5);
    counts[slot] = (counts[slot] ?? 0) + 1;
  }

  // Return { "HH:MM": true } for full slots
  const full: Record<string, boolean> = {};
  for (const [slot, count] of Object.entries(counts)) {
    if (count >= branch.capacity_per_slot) full[slot] = true;
  }
  return full;
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const supabase = createServerClient();

  // 1. Validate: booking must be at least 2 hours in advance (Bangkok UTC+7)
  const bookingDateTime = new Date(`${input.date}T${input.time}:00+07:00`);
  const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
  if (bookingDateTime < twoHoursFromNow) {
    return { error: "กรุณาจองล่วงหน้าอย่างน้อย 2 ชั่วโมง" };
  }

  // 2. Validate: max 30 days ahead
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  if (bookingDateTime > thirtyDaysLater) {
    return { error: "ไม่สามารถจองล่วงหน้าเกิน 30 วัน" };
  }

  // 3. Get branch info
  const { data: branch, error: branchErr } = await supabase
    .from("branches")
    .select("id, name, address, phone, capacity_per_slot")
    .eq("slug", input.branchSlug)
    .eq("is_active", true)
    .single();

  if (branchErr || !branch) {
    return { error: "ไม่พบสาขาที่เลือก" };
  }

  // 4. Check slot capacity (count confirmed + seated bookings)
  const { count: slotCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("branch_id", branch.id)
    .eq("booking_date", input.date)
    .eq("booking_time", input.time)
    .in("status", ["confirmed", "seated"]);

  if ((slotCount ?? 0) >= branch.capacity_per_slot) {
    return { error: "เวลาดังกล่าวเต็มแล้ว กรุณาเลือกเวลาอื่น" };
  }

  // 5. Generate booking reference: RON-YYYYMMDD-XXXX
  const dateStr = input.date.replace(/-/g, "");
  const { count: dayCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .like("booking_reference", `RON-${dateStr}-%`);

  const seq = String((dayCount ?? 0) + 1).padStart(4, "0");
  const bookingReference = `RON-${dateStr}-${seq}`;

  // 6. Insert booking
  const { error: insertErr } = await supabase.from("bookings").insert({
    booking_reference: bookingReference,
    branch_id: branch.id,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    customer_email: input.customerEmail || null,
    booking_date: input.date,
    booking_time: input.time,
    party_size: input.partySize,
    occasion: input.occasion || null,
    special_request: input.specialRequest || null,
    status: "confirmed",
  });

  if (insertErr) {
    return { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }

  // 7. Send confirmation email (non-blocking — booking already saved)
  if (input.customerEmail) {
    resend.emails
      .send({
        from: "Ronin Reserve <onboarding@resend.dev>",
        to: input.customerEmail,
        subject: `ยืนยันการจอง ${bookingReference} — Ronin Pizza`,
        html: buildEmailHtml({
          ref: bookingReference,
          branchName: branch.name,
          address: branch.address,
          date: input.date,
          time: input.time,
          partySize: input.partySize,
          customerName: input.customerName,
        }),
      })
      .catch(() => {
        // Email failure should not cancel the booking
      });
  }

  // 8. Redirect to confirmation page
  const params = new URLSearchParams({
    ref: bookingReference,
    branch: input.branchSlug,
    date: input.date,
    time: input.time,
    guests: String(input.partySize),
    name: input.customerName,
    phone: input.customerPhone,
  });
  redirect(`/confirmation?${params.toString()}`);
}

function buildEmailHtml(data: {
  ref: string;
  branchName: string;
  address: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
}) {
  const rows = [
    ["รหัสการจอง", `<strong style="color:#396542">${data.ref}</strong>`],
    ["สาขา", data.branchName],
    ["ที่อยู่", data.address],
    ["วันที่", data.date],
    ["เวลา", data.time],
    ["จำนวนคน", `${data.partySize} คน`],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;color:#666;border-bottom:1px solid #eee;width:40%">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee">${value}</td>
      </tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="background:#396542;padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:2px">RONIN RESERVE</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#396542;margin-top:0">จองโต๊ะสำเร็จ! 🎉</h2>
        <p style="color:#333">สวัสดีคุณ <strong>${data.customerName}</strong></p>
        <p style="color:#333">เราได้รับการจองของคุณแล้ว</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">${rows}</table>
        <div style="background:#fff8f0;border:1px solid #f0c080;padding:16px;border-radius:4px;margin-top:24px">
          <strong style="color:#964915">⏰ นโยบายการมาสาย</strong>
          <p style="margin:8px 0 0;color:#555;font-size:14px">
            ทางร้านจะสงวนโต๊ะให้ <strong>15 นาที</strong> หลังจากเวลาที่จอง
            หากไม่มาถึงภายในเวลาที่กำหนด โต๊ะอาจถูกจัดสรรให้ลูกค้าท่านอื่น
          </p>
        </div>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">
        © Ronin Pizza · Bangkok
      </div>
    </div>`;
}
