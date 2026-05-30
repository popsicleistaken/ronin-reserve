import { createServerClient } from "@/lib/supabase";
import BookingsDashboard, { type Booking } from "./BookingsDashboard";

export const metadata = { title: "Dashboard | Ronin Admin" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const supabase = createServerClient();
  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.date ?? today;

  const [{ data: bookings }, { data: branches }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, booking_reference, booking_date, booking_time, party_size, customer_name, customer_phone, status, branches(name, slug)")
      .eq("booking_date", date)
      .order("booking_time"),
    supabase
      .from("branches")
      .select("name, slug")
      .eq("is_active", true)
      .order("name"),
  ]);

  const list = bookings ?? [];
  const stats = {
    total: list.length,
    confirmed: list.filter((b) => b.status === "confirmed").length,
    seated: list.filter((b) => b.status === "seated").length,
    cancelled: list.filter((b) => b.status === "cancelled").length,
  };

  return (
    <BookingsDashboard
      bookings={list as unknown as Booking[]}
      stats={stats}
      date={date}
      branches={branches ?? []}
    />
  );
}
