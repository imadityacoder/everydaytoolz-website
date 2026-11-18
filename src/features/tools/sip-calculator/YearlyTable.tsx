"use client";

import React, { useState } from "react";
import { Currency, SipInputs, SipResult } from "./types";
import { formatCurrency } from "./formatters";
import { exportSipToCsv } from "./csv";
import { Download, Table, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

interface YearlyTableProps {
  inputs: SipInputs;
  result: SipResult;
  currency: Currency;
}

export function YearlyTable({ inputs, result, currency }: YearlyTableProps) {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isSip = inputs.mode === "sip";

  const totalRows = result.yearlyBreakdown.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = result.yearlyBreakdown.slice(startIndex, startIndex + pageSize);

  const handleExport = () => {
    exportSipToCsv(inputs, result);
  };

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
      {/* Header with Title and CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Year-by-Year Growth Schedule
            </h4>
            <p className="text-xs text-muted-foreground">
              Detailed annual compounding progression of your capital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider border-b border-border/50">
            <tr>
              <th className="py-3 px-4">Year</th>
              {isSip && <th className="py-3 px-4">Monthly Deposit</th>}
              <th className="py-3 px-4">Yearly Deposit</th>
              <th className="py-3 px-4">Total Invested</th>
              <th className="py-3 px-4">Returns (This Yr)</th>
              <th className="py-3 px-4">Total Returns</th>
              <th className="py-3 px-4 text-right">Ending Corpus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {currentRows.map((row) => (
              <tr
                key={row.year}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 font-bold text-foreground">
                  Year {row.year}
                </td>
                {isSip && (
                  <td className="py-3 px-4 text-foreground/80">
                    {formatCurrency(row.monthlyDeposit, currency)}
                  </td>
                )}
                <td className="py-3 px-4 text-foreground/80">
                  {formatCurrency(row.investedThisYear, currency)}
                </td>
                <td className="py-3 px-4 font-semibold text-foreground">
                  {formatCurrency(row.totalInvested, currency)}
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(row.interestThisYear, currency)}
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  +{formatCurrency(row.totalInterest, currency)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-primary">
                  {formatCurrency(row.endingBalance, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>All</option>
            </select>
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + pageSize, totalRows)} of {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-border/60 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
