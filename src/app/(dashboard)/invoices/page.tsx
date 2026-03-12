"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "danger"> = {
  DRAFT: "default",
  SUBMITTED: "primary",
  APPROVED: "success",
  PAID: "success",
  DISPUTED: "danger",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-white/[0.06] text-[#9e9eab]",
  SUBMITTED: "bg-[#9d7663]/15 text-[#c4a47a]",
  APPROVED: "bg-emerald-500/10 text-emerald-400/80",
  PAID: "bg-emerald-500/10 text-emerald-400/80",
  DISPUTED: "bg-red-500/10 text-red-400/80",
};

const sampleInvoices = [
  { id: 1, project: "Midnight Runner", vendor: "Stellar Catering Co.", amount: "$8,500.00", status: "APPROVED", date: "Mar 6, 2026" },
  { id: 2, project: "Midnight Runner", vendor: "GripTech Rentals", amount: "$3,200.00", status: "SUBMITTED", date: "Mar 8, 2026" },
  { id: 3, project: "City Pulse", vendor: "LA Transport Services", amount: "$5,100.00", status: "PAID", date: "Feb 28, 2026" },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Invoices</h1>
          <p className="text-sm text-[#9e9eab] mt-2 tracking-wide">Submit and manage invoices for your services.</p>
        </div>
        <Button className="gap-2 rounded-xl bg-[#9d7663] text-white hover:bg-[#c4a47a] transition-all duration-300">
          <PlusIcon className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {sampleInvoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#131318]/50 p-20 text-center">
          <DocumentTextIcon className="h-12 w-12 text-[#9e9eab]/40 mx-auto mb-5" />
          <h3 className="text-lg font-light text-[#f0efe6] mb-2">No invoices yet</h3>
          <p className="text-sm text-[#9e9eab] mb-6">Create an invoice to bill a production for your services.</p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-12 px-7 text-xs uppercase tracking-[0.2em] text-[#9e9eab]">
            <div className="col-span-4">Vendor</div>
            <div className="col-span-3">Project</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {/* Invoice Rows */}
          <div className="space-y-3">
            {sampleInvoices.map((inv) => (
              <div
                key={inv.id}
                className="group grid grid-cols-12 items-center rounded-2xl bg-[#1f1f2a] border border-white/[0.08] px-7 py-5 hover:bg-[#2a2a38] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
              >
                <div className="col-span-4">
                  <h3 className="text-sm font-normal text-[#f0efe6] group-hover:text-white transition-colors">{inv.vendor}</h3>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-[#9d7663]">{inv.project}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#9e9eab]">{inv.date}</p>
                </div>
                <div className="col-span-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ${statusStyles[inv.status] || "bg-white/[0.06] text-[#9e9eab]"}`}>
                    {inv.status}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-lg font-light text-[#f0efe6] tabular-nums">{inv.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
