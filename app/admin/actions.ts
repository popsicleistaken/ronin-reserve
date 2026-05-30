"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase";

export async function logout() {
  const supabase = createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) return { error: "บันทึกไม่สำเร็จ กรุณาลองใหม่" };
}

export async function updateBookingNote(id: string, note: string) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("bookings")
    .update({ internal_note: note })
    .eq("id", id);
  if (error) return { error: "บันทึกไม่สำเร็จ กรุณาลองใหม่" };
}
