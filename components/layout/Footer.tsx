import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <p className="font-heading text-lg font-bold text-primary">Ronin Reserve</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ระบบจองโต๊ะออนไลน์ Ronin Pizza
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">สาขา</p>
              {[
                { label: "Ladprao 18", slug: "ladprao-18" },
                { label: "Sukhumvit 34", slug: "sukhumvit-34" },
                { label: "Ari", slug: "ari" },
                { label: "Phayathai", slug: "phayathai" },
              ].map((b) => (
                <Link
                  key={b.slug}
                  href={`/book?branch=${b.slug}`}
                  className="block text-muted-foreground transition hover:text-foreground"
                >
                  {b.label}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">ลิงก์</p>
              <Link href="/book" className="block text-muted-foreground transition hover:text-foreground">
                จองโต๊ะ
              </Link>
              <Link href="/#locations" className="block text-muted-foreground transition hover:text-foreground">
                สาขาของเรา
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ronin Pizza · Bangkok · All rights reserved
        </div>
      </div>
    </footer>
  );
}
