import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import BookingForm from "./BookingForm";

export const metadata = { title: "จองโต๊ะ | Ronin Reserve" };

export default async function BookPage() {
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            จองโต๊ะ
          </h1>
          <p className="mt-2 text-muted-foreground">
            กรอกข้อมูลด้านล่างเพื่อจองโต๊ะที่ Ronin Pizza
          </p>
        </div>

        {/* >12 guests notice */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-pizza-accent/30 bg-pizza-accent/5 p-4">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-sm font-semibold text-pizza-accent">มากกว่า 12 คน?</p>
            <p className="mt-0.5 text-sm text-foreground/80">
              สำหรับกลุ่มใหญ่กรุณาติดต่อสาขาโดยตรง — เราจะช่วยจัดเตรียมให้เหมาะสม
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Suspense>
            <BookingForm branches={branches ?? []} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
