import Link from "next/link";
import { CheckCircle } from "lucide-react";

const BRANCH_NAMES: Record<string, string> = {
  "ladprao-18": "Ronin Pizza Ladprao 18",
  "sukhumvit-34": "Ronin Pizza Sukhumvit 34",
  ari: "Ronin Pizza Ari",
  phayathai: "Ronin Pizza Phayathai",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: {
    ref?: string;
    branch?: string;
    date?: string;
    time?: string;
    guests?: string;
    name?: string;
    phone?: string;
  };
}) {
  const { ref, branch, date, time, guests, name, phone } = searchParams;
  const branchName = BRANCH_NAMES[branch ?? ""] ?? branch ?? "-";

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        {/* Icon + heading */}
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-heading text-3xl font-bold text-primary">
            จองโต๊ะสำเร็จ!
          </h1>
          <p className="mt-2 text-muted-foreground">
            เราได้รับการจองของคุณแล้ว ขอบคุณที่เลือก Ronin Pizza
          </p>
        </div>

        {/* Reference */}
        <div className="mt-8 rounded-lg border border-border bg-secondary px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground">รหัสการจอง</p>
          <p className="mt-1 font-heading text-2xl font-bold tracking-widest text-primary">
            {ref ?? "RON-XXXXXXXX-0001"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            กรุณาจดรหัสนี้ไว้เพื่อใช้อ้างอิงในวันที่มาใช้บริการ
          </p>
        </div>

        {/* Booking details */}
        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
          <dl className="divide-y divide-border">
            <Row label="สาขา" value={branchName} />
            <Row label="วันที่" value={formatDate(date ?? "")} />
            <Row label="เวลา" value={time ?? "-"} />
            <Row label="จำนวนคน" value={`${guests ?? "-"} คน`} />
            <Row label="ชื่อ" value={name ?? "-"} />
            <Row label="เบอร์โทร" value={phone ?? "-"} />
          </dl>
        </div>

        {/* Late arrival policy */}
        <div className="mt-6 rounded-lg border border-pizza-accent/30 bg-pizza-accent/5 p-4">
          <p className="text-sm font-semibold text-pizza-accent">⏰ นโยบายการมาสาย</p>
          <p className="mt-1 text-sm text-foreground/80">
            ทางร้านจะสงวนโต๊ะให้{" "}
            <span className="font-semibold">15 นาที</span>{" "}
            หลังจากเวลาที่จอง หากไม่มาถึงภายในเวลาที่กำหนด
            โต๊ะอาจถูกจัดสรรให้ลูกค้าท่านอื่น
          </p>
        </div>

        {/* Back home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block rounded-lg border border-primary px-6 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-6 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
