"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDollarIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from "@heroicons/react/24/outline";

const sampleTransactions = [
  { id: 1, type: "incoming", description: "Payment for Midnight Runner - DP Services", amount: "$12,800.00", date: "Mar 8, 2026", status: "COMPLETED" },
  { id: 2, type: "incoming", description: "Payment for City Pulse - Camera Op", amount: "$4,400.00", date: "Mar 1, 2026", status: "COMPLETED" },
  { id: 3, type: "outgoing", description: "Pro Supply Subscription", amount: "$19.00", date: "Mar 1, 2026", status: "COMPLETED" },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Payments</h1>
          <p className="text-sm text-[#9e9eab] mt-2 tracking-wide">Track earnings, payouts, and subscription billing.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-white/[0.08] bg-white/[0.04] text-[#cdc9bc] hover:bg-white/[0.08] hover:text-[#f0efe6] transition-all duration-300">
          <CurrencyDollarIcon className="h-4 w-4" />
          Connect Stripe
        </Button>
      </div>

      {/* Balance / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-3">Total Earned</p>
          <p className="text-3xl font-light text-[#c4a47a] tracking-tight">$17,200.00</p>
          <p className="text-xs text-emerald-400/80 mt-3 tracking-wide">+$12,800 this month</p>
        </div>
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-3">Pending Payouts</p>
          <p className="text-3xl font-light text-[#c4a47a] tracking-tight">$0.00</p>
          <p className="text-xs text-[#9e9eab] mt-3 tracking-wide">All caught up</p>
        </div>
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-3">Subscription</p>
          <p className="text-3xl font-light text-[#c4a47a] tracking-tight">$19<span className="text-lg text-[#9e9eab]">/mo</span></p>
          <p className="text-xs text-[#9e9eab] mt-3 tracking-wide">Pro Supply &middot; Renews Apr 1</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-light text-[#f0efe6] mb-6 tracking-wide">Recent Transactions</h2>
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06]">
          {sampleTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === "incoming" ? "bg-emerald-500/10" : "bg-white/[0.04]"}`}>
                  {tx.type === "incoming" ? (
                    <ArrowDownLeftIcon className="h-4 w-4 text-emerald-400/80" />
                  ) : (
                    <ArrowUpRightIcon className="h-4 w-4 text-[#9e9eab]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-normal text-[#f0efe6]">{tx.description}</p>
                  <p className="text-xs text-[#9e9eab] mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`text-sm font-light tabular-nums ${tx.type === "incoming" ? "text-emerald-400/90" : "text-[#f0efe6]"}`}>
                  {tx.type === "incoming" ? "+" : "-"}{tx.amount}
                </p>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-emerald-400/80">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
