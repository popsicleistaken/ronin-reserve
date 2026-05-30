import { createServerClient } from "@/lib/supabase";
import BookingsDashboard, { type Booking } from "./BookingsDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard | Ronin Admin" };

function bangkokToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const supabase = createServerClient();
  const today = bangkokToday();
  const filterDate = searchParams.date ?? null; // null = show all upcoming

  const [bookingsQuery, { data: branches }] = await Promise.all([
    filterDate
      ? supabase
          .from("bookings")
          .select("id, booking_reference, booking_date, booking_time, party_size, customer_name, customer_phone, status, branches(name, slug)")
          .eq("booking_date", filterDate)
          .order("booking_time")
      : supabase
          .from("bookings")
          .select("id, booking_reference, booking_date, booking_time, party_size, customer_name, customer_phone, status, branches(name, slug)")
          .gte("booking_date", today)
          .order("booking_date")
          .order("booking_time")
          .limit(200),
    supabase
      .from("branches")
      .select("name, slug")
      .eq("is_active", true)
      .order("name"),
  ]);

  const list = (bookingsQuery.data ?? []) as unknown as Booking[];

  const stats = {
    total: list.length,
    confirmed: list.filter((b) => b.status === "confirmed").length,
    seated: list.filter((b) => b.status === "seated").length,
    cancelled: list.filter((b) => b.status === "cancelled").length,
  };

  return (
    <BookingsDashboard
      bookings={list}
      stats={stats}
      today={today}
      filterDate={filterDate}
      branches={branches ?? []}
    />
  );
}
