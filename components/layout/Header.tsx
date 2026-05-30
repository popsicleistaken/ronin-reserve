import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-sm font-bold text-primary-foreground">R</span>
          </div>
          <span className="font-heading text-lg font-bold text-primary">
            Ronin Reserve
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/#locations"
            className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
          >
            สาขา
          </Link>
          <Link
            href="/book"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            จองโต๊ะ
          </Link>
        </nav>
      </div>
    </header>
  );
}
