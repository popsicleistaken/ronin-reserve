import Link from "next/link";
import { MapPin, Clock, Phone, Star } from "lucide-react";

const BRANCHES = [
  {
    name: "Ronin Pizza Ladprao 18",
    area: "Ladprao",
    slug: "ladprao-18",
    address: "18 Ladprao Road, Chatuchak, Bangkok 10900",
    phone: "02-xxx-xxxx",
    color: "from-[#4a7c52] to-[#2d5235]",
  },
  {
    name: "Ronin Pizza Sukhumvit 34",
    area: "Sukhumvit",
    slug: "sukhumvit-34",
    address: "34 Sukhumvit Road, Khlong Toei, Bangkok 10110",
    phone: "02-xxx-xxxx",
    color: "from-[#7a5a3a] to-[#5a3f27]",
  },
  {
    name: "Ronin Pizza Ari",
    area: "Ari",
    slug: "ari",
    address: "Ari BTS Area, Phahon Yothin Road, Phaya Thai, Bangkok 10400",
    phone: "02-xxx-xxxx",
    color: "from-[#964915] to-[#7a3a0f]",
  },
  {
    name: "Ronin Pizza Phayathai",
    area: "Phayathai",
    slug: "phayathai",
    address: "Phayathai Road, Ratchathewi, Bangkok 10400",
    phone: "02-xxx-xxxx",
    color: "from-[#396542] to-[#254530]",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ronin-green py-28 text-white sm:py-40">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-pizza-accent/20" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 fill-pizza-accent-light text-pizza-accent-light" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Bangkok · 4 Locations
            </span>
          </div>

          <h1 className="mt-4 font-heading text-5xl font-bold leading-tight sm:text-7xl">
            Reserve Your
            <span className="block text-pizza-accent-light">Perfect Table</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Artisanal Neapolitan pizza crafted with care — enjoy an unforgettable dining experience at Ronin Pizza Bangkok
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="rounded-lg bg-pizza-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-pizza-accent/90 hover:shadow-xl"
            >
              Book a Table →
            </Link>
            <a
              href="#locations"
              className="rounded-lg border border-white/30 px-8 py-4 text-lg font-semibold text-white/90 transition hover:border-white/60 hover:bg-white/10"
            >
              View Locations
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span> จองออนไลน์ ฟรี
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span> ยืนยันทันที
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span> รองรับ 1–12 คน
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary">✓</span> จองล่วงหน้าได้ 30 วัน
            </span>
          </div>
        </div>
      </section>

      {/* Branch cards */}
      <section id="locations" className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
              Our Locations
            </h2>
            <p className="mt-3 text-muted-foreground">
              4 สาขาในกรุงเทพฯ — เลือกสาขาที่สะดวกได้เลย
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {BRANCHES.map((branch) => (
              <div
                key={branch.slug}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                {/* Color band (simulates food photo) */}
                <div
                  className={`flex h-28 items-end bg-gradient-to-br p-5 ${branch.color}`}
                >
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                    {branch.area}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {branch.name}
                  </h3>

                  <div className="mt-3 flex-1 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      <span>เปิดทุกวัน 11:00 – 21:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>

                  <Link
                    href={`/book?branch=${branch.slug}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    จองสาขานี้
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
            จองง่าย 3 ขั้นตอน
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "เลือกสาขา & วันเวลา", desc: "เลือกสาขาที่ต้องการ วันที่ และช่วงเวลาที่สะดวก" },
              { step: "02", title: "กรอกข้อมูลการจอง", desc: "ระบุชื่อ เบอร์โทร จำนวนคน และความต้องการพิเศษ" },
              { step: "03", title: "รับยืนยันทันที", desc: "ได้รับรหัสการจองและอีเมลยืนยันพร้อมรายละเอียดครบ" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            พร้อมจองแล้วใช่ไหม?
          </h2>
          <p className="mt-3 text-muted-foreground">
            จองโต๊ะได้ล่วงหน้าสูงสุด 30 วัน · รองรับ 1–12 คน · ฟรี ไม่มีค่าธรรมเนียม
          </p>
          <Link
            href="/book"
            className="mt-8 inline-block rounded-lg bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 hover:shadow-md"
          >
            จองโต๊ะตอนนี้ →
          </Link>
        </div>
      </section>
    </>
  );
}
