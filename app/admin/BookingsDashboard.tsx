"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Booking = {
  id: string;
  booking_reference: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  status: string;
  branches: { name: string; slug: string } | null;
};

type Stats = {
  total: number;
  confirmed: number;
  seated: number;
  cancelled: number;
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  seated: "Seated",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  seated: "secondary",
  completed: "outline",
  cancelled: "destructive",
  no_show: "outline",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("th-TH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function BookingsDashboard({
  bookings,
  stats,
  today,
  filterDate,
  branches,
}: {
  bookings: Booking[];
  stats: Stats;
  today: string;
  filterDate: string | null;
  branches: { name: string; slug: string }[];
}) {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q) ||
        b.booking_reference.toLowerCase().includes(q);
      const matchBranch = branchFilter === "all" || b.branches?.slug === branchFilter;
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [bookings, search, branchFilter, statusFilter]);

  const isUpcomingView = !filterDate;

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4 sm:px-8 sm:py-5">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Dashboard</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isUpcomingView
              ? "การจองที่กำลังจะมาถึง (ทั้งหมด)"
              : formatDate(filterDate!)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filterDate && (
            <Link
              href="/admin"
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-secondary/60"
            >
              ← ทั้งหมด
            </Link>
          )}
          <input
            type="date"
            defaultValue={filterDate ?? ""}
            min={today}
            onChange={(e) => {
              window.location.href = e.target.value
                ? `/admin?date=${e.target.value}`
                : "/admin";
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-8">
        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 sm:mb-8 sm:gap-4">
          <StatCard label="ทั้งหมด" value={stats.total} />
          <StatCard label="Confirmed" value={stats.confirmed} accent="green" />
          <StatCard label="Seated" value={stats.seated} accent="blue" />
          <StatCard label="Cancelled" value={stats.cancelled} accent="red" />
        </div>

        {/* Bookings table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
              {isUpcomingView ? "Upcoming Reservations" : "Reservations"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, เบอร์, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-48"
                />
              </div>
              <Select value={branchFilter} onValueChange={(v) => setBranchFilter(v ?? "all")}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="ทุกสาขา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสาขา</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.slug} value={b.slug}>
                      {b.name.replace("Ronin Pizza ", "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="ทุกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                {isUpcomingView && <TableHead>วันที่</TableHead>}
                <TableHead>เวลา</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead className="hidden sm:table-cell">สาขา</TableHead>
                <TableHead>คน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isUpcomingView ? 7 : 6}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    {isUpcomingView
                      ? "ยังไม่มีการจองที่กำลังจะมาถึง"
                      : "ไม่มีการจองในวันที่เลือก"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id}>
                    {isUpcomingView && (
                      <TableCell className="text-sm font-semibold text-primary">
                        {formatDate(b.booking_date)}
                      </TableCell>
                    )}
                    <TableCell className="font-semibold">
                      {b.booking_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials(b.customer_name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{b.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{b.customer_phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {b.branches?.name.replace("Ronin Pizza ", "") ?? "-"}
                    </TableCell>
                    <TableCell>{b.party_size}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[b.status] ?? "outline"}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        View →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "green" | "blue" | "red";
}) {
  const accentMap: Record<string, string> = {
    green: "text-primary",
    blue: "text-blue-600",
    red: "text-destructive",
  };
  const accentClass = accent ? (accentMap[accent] ?? "text-foreground") : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p className={cn("mt-1 font-heading text-3xl font-bold sm:mt-2 sm:text-4xl", accentClass)}>
        {value}
      </p>
    </div>
  );
}
