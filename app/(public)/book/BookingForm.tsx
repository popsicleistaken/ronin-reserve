"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBooking, getSlotAvailability } from "./actions";

type Branch = { id: string; name: string; slug: string };

const LUNCH_SLOTS = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
const DINNER_SLOTS = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

function getDateLimits() {
  const today = new Date();
  const max = new Date();
  max.setDate(max.getDate() + 30);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { min: fmt(today), max: fmt(max) };
}

export default function BookingForm({ branches }: { branches: Branch[] }) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [branch, setBranch] = useState(searchParams.get("branch") ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [special, setSpecial] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [dateLimits, setDateLimits] = useState({ min: "", max: "" });
  const [fullSlots, setFullSlots] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDateLimits(getDateLimits());
  }, []);

  // Refresh availability when branch or date changes
  useEffect(() => {
    if (!branch || !date) { setFullSlots({}); return; }
    getSlotAvailability(branch, date).then(setFullSlots);
  }, [branch, date]);

  function clearError(field: string) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!branch) e.branch = "กรุณาเลือกสาขา";
    if (!date) e.date = "กรุณาเลือกวันที่";
    if (!time) e.time = "กรุณาเลือกเวลา";
    if (!name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!phone.trim()) e.phone = "กรุณากรอกเบอร์โทร";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setServerError("");
    startTransition(async () => {
      const result = await createBooking({
        branchSlug: branch,
        date,
        time,
        partySize: guests,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        occasion: (occasion && occasion !== "none") ? occasion : undefined,
        specialRequest: special || undefined,
      });
      if (result?.error) {
        setServerError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Server error banner */}
      {serverError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Branch */}
      <div className="space-y-2">
        <Label htmlFor="branch">
          สาขา <span className="text-destructive">*</span>
        </Label>
        <Select
          value={branch}
          onValueChange={(v) => { if (v) { setBranch(v); clearError("branch"); } }}
          disabled={isPending}
        >
          <SelectTrigger
            id="branch"
            className={errors.branch ? "border-destructive" : ""}
          >
            <SelectValue placeholder="เลือกสาขา..." />
          </SelectTrigger>
          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">
          วันที่ <span className="text-destructive">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          min={dateLimits.min}
          max={dateLimits.max}
          value={date}
          onChange={(e) => { setDate(e.target.value); clearError("date"); }}
          className={errors.date ? "border-destructive" : ""}
          disabled={isPending}
        />
        {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        <p className="text-xs text-muted-foreground">จองได้ล่วงหน้าสูงสุด 30 วัน</p>
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        <Label>
          เวลา <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-4">
          <SlotGroup
            label="มื้อกลางวัน"
            slots={LUNCH_SLOTS}
            selected={time}
            onSelect={(t) => { setTime(t); clearError("time"); }}
            disabled={isPending}
            fullSlots={fullSlots}
          />
          <SlotGroup
            label="มื้อเย็น"
            slots={DINNER_SLOTS}
            selected={time}
            onSelect={(t) => { setTime(t); clearError("time"); }}
            disabled={isPending}
            cols="grid-cols-3 sm:grid-cols-4"
            fullSlots={fullSlots}
          />
        </div>
        {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
      </div>

      {/* Guests */}
      <div className="space-y-3">
        <Label>
          จำนวนคน <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setGuests(n)}
              disabled={isPending}
              className={cn(
                "rounded-md border py-2 text-sm font-medium transition",
                guests === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          มากกว่า 12 คน? กรุณาโทรติดต่อสาขาโดยตรง
        </p>
      </div>

      <Separator />

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          ชื่อ-นามสกุล <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="เช่น สมชาย ใจดี"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError("name"); }}
          className={errors.name ? "border-destructive" : ""}
          disabled={isPending}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">
          เบอร์โทร <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="เช่น 081-234-5678"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
          className={errors.phone ? "border-destructive" : ""}
          disabled={isPending}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      {/* Email (optional) */}
      <div className="space-y-2">
        <Label htmlFor="email">
          อีเมล{" "}
          <span className="text-xs text-muted-foreground">(ไม่จำเป็น)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">สำหรับรับอีเมลยืนยันการจอง</p>
      </div>

      {/* Occasion (optional) */}
      <div className="space-y-2">
        <Label htmlFor="occasion">
          โอกาสพิเศษ{" "}
          <span className="text-xs text-muted-foreground">(ไม่จำเป็น)</span>
        </Label>
        <Select value={occasion} onValueChange={(v) => setOccasion(v ?? "")} disabled={isPending}>
          <SelectTrigger id="occasion">
            <SelectValue placeholder="ไม่ระบุ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">ไม่ระบุ</SelectItem>
            <SelectItem value="birthday">วันเกิด 🎂</SelectItem>
            <SelectItem value="anniversary">วันครบรอบ 💑</SelectItem>
            <SelectItem value="business">ทานข้าวธุรกิจ 💼</SelectItem>
            <SelectItem value="date">เดท ❤️</SelectItem>
            <SelectItem value="other">อื่นๆ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special request (optional) */}
      <div className="space-y-2">
        <Label htmlFor="special">
          ความต้องการพิเศษ{" "}
          <span className="text-xs text-muted-foreground">(ไม่จำเป็น)</span>
        </Label>
        <Textarea
          id="special"
          placeholder="เช่น ต้องการโต๊ะริมหน้าต่าง, แพ้อาหารบางอย่าง..."
          rows={3}
          value={special}
          onChange={(e) => setSpecial(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-6 text-base"
        size="lg"
      >
        {isPending ? "กำลังจอง..." : "ยืนยันการจอง →"}
      </Button>
    </form>
  );
}

function SlotGroup({
  label,
  slots,
  selected,
  onSelect,
  disabled,
  cols = "grid-cols-3 sm:grid-cols-6",
  fullSlots = {},
}: {
  label: string;
  slots: string[];
  selected: string;
  onSelect: (t: string) => void;
  disabled: boolean;
  cols?: string;
  fullSlots?: Record<string, boolean>;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className={cn("grid gap-2", cols)}>
        {slots.map((t) => {
          const isFull = fullSlots[t];
          const isSelected = selected === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => !isFull && onSelect(t)}
              disabled={disabled || isFull}
              title={isFull ? "เวลานี้เต็มแล้ว" : undefined}
              className={cn(
                "relative rounded-md border px-2 py-2 text-sm font-medium transition",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : isFull
                  ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-60"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
            >
              {t}
              {isFull && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive">
                  <span className="text-[6px] font-bold text-white">✕</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
