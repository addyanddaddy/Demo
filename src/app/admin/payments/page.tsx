"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CurrencyDollarIcon,
  ClockIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DateRange = "7d" | "30d" | "90d" | "all";

type InvoiceStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "PAID" | "DISPUTED" | "CANCELLED";

interface Invoice {
  id: string;
  projectName: string;
  vendorName: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: string;
}

type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Payout {
  id: string;
  recipientName: string;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  completedAt: string | null;
}

interface PaymentsData {
  kpis: {
    totalRevenue: number;
    pendingPayments: number;
    totalPayouts: number;
    outstanding: number;
  };
  invoices: Invoice[];
  invoiceCount: number;
  payouts: Payout[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
}

// ---------------------------------------------------------------------------
// Status styles
// ---------------------------------------------------------------------------

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  DRAFT: "bg-white/[0.06] text-[#9e9eab]",
  SUBMITTED: "bg-amber-500/10 text-amber-400/80",
  APPROVED: "bg-blue-500/10 text-blue-400/80",
  PAID: "bg-emerald-500/10 text-emerald-400/80",
  DISPUTED: "bg-red-500/10 text-red-400/80",
  CANCELLED: "bg-white/[0.06] text-[#9e9eab]",
};

const payoutStatusStyles: Record<PayoutStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-400/80",
  PROCESSING: "bg-blue-500/10 text-blue-400/80",
  COMPLETED: "bg-emerald-500/10 text-emerald-400/80",
  FAILED: "bg-red-500/10 text-red-400/80",
};

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function KpiSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7 animate-pulse">
      <div className="h-3 w-24 rounded bg-white/[0.06] mb-4" />
      <div className="h-8 w-32 rounded bg-white/[0.06] mb-3" />
      <div className="h-3 w-20 rounded bg-white/[0.04]" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 w-full max-w-[100px] rounded bg-white/[0.06] animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

export default function AdminPaymentsPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const [data, setData] = useState<PaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/payments?range=${range}&page=${page}&pageSize=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Failed to fetch payments data");
      const json: PaymentsData = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [range, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show toast
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Invoice actions
  const handleAction = async (invoiceId: string, action: "approve" | "mark-paid") => {
    setActionLoading(invoiceId);
    try {
      const res = await fetch(`/api/admin/payments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      showToast(action === "approve" ? "Invoice approved" : "Invoice marked as paid");
      fetchData();
    } catch {
      showToast("Failed to perform action");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = data ? Math.ceil(data.invoiceCount / PAGE_SIZE) : 1;

  // Date range buttons
  const ranges: { label: string; value: DateRange }[] = [
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "90 days", value: "90d" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-[#2a2a38] border border-white/[0.08] px-5 py-3 text-sm text-[#f0efe6] shadow-2xl shadow-black/40 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header + Date Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Payments</h1>
          <p className="text-sm text-[#9e9eab] mt-2 tracking-wide">
            Monitor revenue, invoices, and payouts across the platform.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] p-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => { setRange(r.value); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                range === r.value
                  ? "bg-[#9d7663] text-white"
                  : "text-[#9e9eab] hover:text-[#cdc9bc] hover:bg-white/[0.04]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-950/20 border border-red-500/[0.12] p-6 text-center">
          <ExclamationCircleIcon className="h-8 w-8 text-red-400/60 mx-auto mb-3" />
          <p className="text-sm text-red-400/80">{error}</p>
          <button onClick={fetchData} className="mt-3 text-xs text-[#c4a47a] hover:text-[#9d7663] transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : data ? (
          <>
            <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
              <div className="flex items-center gap-2 mb-3">
                <CurrencyDollarIcon className="h-4 w-4 text-[#9e9eab]" />
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab]">Total Revenue</p>
              </div>
              <p className="text-3xl font-light text-[#c4a47a] tracking-tight font-mono">
                {formatCurrency(data.kpis.totalRevenue)}
              </p>
              <p className="text-[11px] text-[#9e9eab] mt-3 tracking-wide">From paid invoices</p>
            </div>

            <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="h-4 w-4 text-[#9e9eab]" />
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab]">Pending Payments</p>
              </div>
              <p className="text-3xl font-light text-[#f0efe6] tracking-tight font-mono">
                {formatCurrency(data.kpis.pendingPayments)}
              </p>
              <p className="text-[11px] text-[#9e9eab] mt-3 tracking-wide">Submitted + approved</p>
            </div>

            <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
              <div className="flex items-center gap-2 mb-3">
                <BanknotesIcon className="h-4 w-4 text-[#9e9eab]" />
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab]">Total Payouts</p>
              </div>
              <p className="text-3xl font-light text-[#f0efe6] tracking-tight font-mono">
                {formatCurrency(data.kpis.totalPayouts)}
              </p>
              <p className="text-[11px] text-[#9e9eab] mt-3 tracking-wide">Completed payouts</p>
            </div>

            <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
              <div className="flex items-center gap-2 mb-3">
                <ExclamationCircleIcon className="h-4 w-4 text-[#9e9eab]" />
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab]">Outstanding</p>
              </div>
              <p className="text-3xl font-light text-[#f0efe6] tracking-tight font-mono">
                {formatCurrency(data.kpis.outstanding)}
              </p>
              <p className="text-[11px] text-[#9e9eab] mt-3 tracking-wide">Approved but unpaid</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Invoice Table */}
      <div>
        <h2 className="text-lg font-light text-[#f0efe6] mb-5 tracking-wide">Invoices</h2>
        <div className="rounded-2xl bg-[#1f1f2a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a38]">
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Invoice ID
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Project
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Vendor
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Date
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                ) : data && data.invoices.length > 0 ? (
                  data.invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-[#cdc9bc]" title={inv.id}>
                          {truncateId(inv.id)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#f0efe6]">{inv.projectName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#cdc9bc]">{inv.vendorName}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm text-[#f0efe6] font-mono">
                          {formatCurrency(inv.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium ${
                            invoiceStatusStyles[inv.status]
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#9e9eab]">{formatDate(inv.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.06] transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>

                          {inv.status === "SUBMITTED" && (
                            <button
                              onClick={() => handleAction(inv.id, "approve")}
                              disabled={actionLoading === inv.id}
                              className="p-1.5 rounded-lg text-blue-400/80 hover:text-blue-300 hover:bg-blue-500/10 transition-colors disabled:opacity-40"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}

                          {inv.status === "APPROVED" && (
                            <button
                              onClick={() => handleAction(inv.id, "mark-paid")}
                              disabled={actionLoading === inv.id}
                              className="p-1.5 rounded-lg text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
                              title="Mark Paid"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <CurrencyDollarIcon className="h-10 w-10 text-[#9e9eab]/30 mx-auto mb-3" />
                      <p className="text-sm text-[#9e9eab]">No invoices found for this period.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.invoiceCount > PAGE_SIZE && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.04]">
              <p className="text-[11px] text-[#9e9eab]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.invoiceCount)} of{" "}
                {data.invoiceCount}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                        page === pageNum
                          ? "bg-[#9d7663] text-white"
                          : "text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.06]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-1 text-[#9e9eab]">...</span>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payouts Section */}
      <div>
        <h2 className="text-lg font-light text-[#f0efe6] mb-5 tracking-wide">Recent Payouts</h2>
        {loading ? (
          <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-white/[0.06]" />
                  <div className="h-3 w-24 rounded bg-white/[0.04]" />
                </div>
                <div className="h-4 w-20 rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : data && data.payouts.length > 0 ? (
          <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] overflow-hidden divide-y divide-white/[0.04]">
            {data.payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04]">
                    <BanknotesIcon className="h-4 w-4 text-[#9e9eab]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#f0efe6]">{payout.recipientName}</p>
                    <p className="text-xs text-[#9e9eab] mt-0.5">{formatDate(payout.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-[#f0efe6] font-mono">{formatCurrency(payout.amount)}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium ${
                      payoutStatusStyles[payout.status]
                    }`}
                  >
                    {payout.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-12 text-center">
            <BanknotesIcon className="h-10 w-10 text-[#9e9eab]/30 mx-auto mb-3" />
            <p className="text-sm text-[#9e9eab]">No payouts to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
