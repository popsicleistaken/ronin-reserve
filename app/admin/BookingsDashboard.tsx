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
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function BookingsDashboard({
  bookings,
  stats,
  date,
  branches,
}: {
  bookings: Booking[];
  stats: Stats;
  date: string;
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
      const matchBranch =
        branchFilter === "all" || b.branches?.slug === branchFilter;
      const matchStatus =
        statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [bookings, search, branchFilter, statusFilter]);

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-8 py-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date(date + "T00:00:00").toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <input
          type="date"
          defaultValue={date}
          onChange={(e) => {
            if (e.target.value)
              window.location.href = `/admin?date=${e.target.value}`;
          }}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </header>

      <div className="flex-1 p-8">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="จองวันนี้ทั้งหมด" value={stats.total} />
          <StatCard label="Confirmed" value={stats.confirmed} accent="green" />
          <StatCard label="Seated" value={stats.seated} accent="blue" />
          <StatCard label="Cancelled" value={stats.cancelled} accent="red" />
        </div>

        {/* Bookings table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Reservations
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, เบอร์, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-primary w-52"
                />
              </div>

              {/* Branch filter */}
              <Select value={branchFilter} onValueChange={(v) => setBranchFilter(v ?? "all")}>
                <SelectTrigger className="w-36">
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

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
                <SelectTrigger className="w-36">
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
                <TableHead>เวลา</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>สาขา</TableHead>
                <TableHead>คน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    ไม่มีการจองในวันนี้
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-semibold">
                      {b.booking_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials(b.customer_name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{b.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{b.customer_phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-2 font-heading text-4xl font-bold", accentClass)}>
        {value}
      </p>
    </div>
  );
}
