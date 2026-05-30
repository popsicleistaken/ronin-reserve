"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus, updateBookingNote } from "../../actions";

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  seated: "secondary",
  completed: "outline",
  cancelled: "destructive",
  no_show: "outline",
};

export default function BookingDetailClient({
  id,
  currentStatus,
  currentNote,
}: {
  id: string;
  currentStatus: string;
  currentNote: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(currentNote);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    startTransition(async () => {
      setMessage("");
      const [statusResult, noteResult] = await Promise.all([
        updateBookingStatus(id, status),
        updateBookingNote(id, note),
      ]);
      if (statusResult?.error || noteResult?.error) {
        setMessage(statusResult?.error ?? noteResult?.error ?? "เกิดข้อผิดพลาด");
      } else {
        setMessage("บันทึกสำเร็จ");
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold text-foreground">
        จัดการสถานะ
      </h3>

      <Separator className="my-5" />

      {/* Current status badge + selector */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">สถานะปัจจุบัน:</span>
          <Badge variant={STATUS_VARIANTS[status] ?? "outline"}>
            {STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            เปลี่ยนสถานะ
          </label>
          <Select value={status} onValueChange={(v) => { if (v) setStatus(v); }}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Internal note */}
      <div className="mb-6 space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Internal Note
        </label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="บันทึกภายในสำหรับทีม เช่น VIP, allergy, ฉลองวันเกิด..."
        />
      </div>

      {/* Save button + feedback */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
        {message && (
          <span
            className={
              message === "บันทึกสำเร็จ"
                ? "text-sm font-semibold text-primary"
                : "text-sm font-semibold text-destructive"
            }
          >
            {message === "บันทึกสำเร็จ" ? "✓ " + message : message}
          </span>
        )}
      </div>
    </div>
  );
}
