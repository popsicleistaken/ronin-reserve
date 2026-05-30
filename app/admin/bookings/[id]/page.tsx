import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import BookingDetailClient from "./BookingDetailClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Booking Detail | Ronin Admin" };

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      "id, booking_reference, booking_date, booking_time, party_size, customer_name, customer_phone, customer_email, occasion, special_request, status, internal_note, created_at, branches(name, address, phone)"
    )
    .eq("id", params.id)
    .single();

  if (error || !booking) notFound();

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-card px-8 py-5">
        <Link
          href="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {booking.booking_reference}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            รายละเอียดการจอง
          </p>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Booking info card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">
              ข้อมูลการจอง
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Reference" value={booking.booking_reference} />
              <InfoRow
                label="วันที่"
                value={new Date(booking.booking_date + "T00:00:00").toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoRow label="เวลา" value={booking.booking_time.slice(0, 5)} />
              <InfoRow label="จำนวนคน" value={`${booking.party_size} คน`} />
              <InfoRow label="สาขา" value={(booking.branches as unknown as { name: string; address: string; phone: string } | null)?.name ?? "-"} />
              <InfoRow
                label="ที่อยู่สาขา"
                value={(booking.branches as unknown as { name: string; address: string; phone: string } | null)?.address ?? "-"}
              />
            </dl>
          </div>

          {/* Customer info card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">
              ข้อมูลลูกค้า
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="ชื่อ" value={booking.customer_name} />
              <InfoRow label="เบอร์โทร" value={booking.customer_phone} />
              <InfoRow label="อีเมล" value={booking.customer_email ?? "-"} />
              <InfoRow label="โอกาสพิเศษ" value={booking.occasion ?? "-"} />
              {booking.special_request && (
                <div className="sm:col-span-2">
                  <InfoRow
                    label="คำขอพิเศษ"
                    value={booking.special_request}
                  />
                </div>
              )}
            </dl>
          </div>

          {/* Status + notes — interactive client component */}
          <BookingDetailClient
            id={booking.id}
            currentStatus={booking.status}
            currentNote={booking.internal_note ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
