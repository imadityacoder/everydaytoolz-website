"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Currency, EmiInputs, TenureUnit } from "./types";
import { calculateLoanEmi } from "./math-emi";
import { formatCurrency, formatCompact, formatPercent } from "./formatters";
import { exportEmiScheduleToCsv } from "./csv";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  Coins,
  Percent,
  Calendar,
  Download,
  Table,
  ChevronLeft,
  ChevronRight,
  PieChart as PieIcon,
  IndianRupee,
  DollarSign,
  Sparkles,
  Info,
} from "lucide-react";

export function LoanEmiTab() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [principal, setPrincipal] = useState<number>(2500000); // 25 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureValue, setTenureValue] = useState<number>(20);
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");

  // Schedule View Mode & Pagination
  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCurrencyChange = (newCurr: Currency) => {
    if (newCurr === currency) return;
    setCurrency(newCurr);
    if (newCurr === "USD") {
      if (principal >= 500000) setPrincipal(100000);
    } else {
      if (principal <= 150000) setPrincipal(2500000);
    }
  };

  const principalLimits = useMemo(() => {
    if (currency === "INR") {
      return { min: 50000, max: 20000000, step: 25000 };
    }
    return { min: 2000, max: 1000000, step: 1000 };
  }, [currency]);

  const tenureLimits = useMemo(() => {
    return tenureUnit === "years"
      ? { min: 1, max: 30, step: 1 }
      : { min: 6, max: 360, step: 6 };
  }, [tenureUnit]);

  const inputs: EmiInputs = useMemo(
    () => ({
      principal,
      annualInterestRate: interestRate,
      tenureValue,
      tenureUnit,
      currency,
    }),
    [principal, interestRate, tenureValue, tenureUnit, currency]
  );

  const result = useMemo(() => calculateLoanEmi(inputs), [inputs]);

  // Donut chart data
  const donutData = [
    {
      name: "Principal Amount",
      value: Math.round(principal),
      color: "#7C4DFF",
    },
    {
      name: "Total Interest",
      value: Math.round(result.totalInterest),
      color: "#F59E0B", // Amber / warm gold for interest
    },
  ];

  const totalSum = principal + result.totalInterest;
  const principalShare = totalSum > 0 ? (principal / totalSum) * 100 : 0;
  const interestShare = totalSum > 0 ? (result.totalInterest / totalSum) * 100 : 0;

  // Pagination for schedule
  const activeSchedule = scheduleView === "yearly" ? result.yearlySchedule : result.monthlySchedule;
  const totalRows = activeSchedule.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedRows = activeSchedule.slice(startIndex, startIndex + pageSize);

  const applyLoanPreset = (p: number, r: number, t: number, u: TenureUnit) => {
    setPrincipal(p);
    setInterestRate(r);
    setTenureValue(t);
    setTenureUnit(u);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Currency Switcher & Preset Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Quick Scenarios:
          </span>
          <button
            type="button"
            onClick={() =>
              applyLoanPreset(
                currency === "INR" ? 4000000 : 250000,
                8.5,
                20,
                "years"
              )
            }
            className="px-3 py-1.5 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-xs font-medium text-foreground transition-all cursor-pointer"
          >
            🏡 Home Loan (8.5%, 20y)
          </button>
          <button
            type="button"
            onClick={() =>
              applyLoanPreset(
                currency === "INR" ? 1000000 : 35000,
                9.25,
                5,
                "years"
              )
            }
            className="px-3 py-1.5 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-xs font-medium text-foreground transition-all cursor-pointer"
          >
            🚗 Car Loan (9.25%, 5y)
          </button>
          <button
            type="button"
            onClick={() =>
              applyLoanPreset(
                currency === "INR" ? 400000 : 15000,
                12.5,
                3,
                "years"
              )
            }
            className="px-3 py-1.5 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-xs font-medium text-foreground transition-all cursor-pointer"
          >
            💳 Personal Loan (12.5%, 3y)
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
          <button
            type="button"
            onClick={() => handleCurrencyChange("INR")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currency === "INR"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            INR (₹)
          </button>
          <button
            type="button"
            onClick={() => handleCurrencyChange("USD")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              currency === "USD"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            USD ($)
          </button>
        </div>
      </div>

      {/* Grid: Inputs (5 Cols) vs Cards & Visualizer (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Loan Terms
              </h3>
              <span className="text-[11px] font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                Fixed Rate
              </span>
            </div>

            {/* Input 1: Loan Principal Amount */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Loan Amount (Principal)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    {currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    type="number"
                    min={principalLimits.min}
                    max={principalLimits.max * 5}
                    step={principalLimits.step}
                    value={principal}
                    onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                    className="w-32 py-1.5 pl-6 pr-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <input
                type="range"
                min={principalLimits.min}
                max={principalLimits.max}
                step={principalLimits.step}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatCurrency(principalLimits.min, currency)}</span>
                <span className="font-semibold text-foreground">
                  {formatCompact(principal, currency)}
                </span>
                <span>{formatCurrency(principalLimits.max, currency)}</span>
              </div>
            </div>

            {/* Input 2: Interest Rate (%) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-primary" />
                  Interest Rate (p.a)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0.5}
                    max={25}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                    className="w-24 py-1.5 pr-6 pl-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>1%</span>
                <span className="font-semibold text-foreground">{interestRate}%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Input 3: Loan Tenure (Years / Months Toggle) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Loan Tenure
                  </label>
                  {/* Tenure Unit Toggle */}
                  <div className="inline-flex bg-muted p-0.5 rounded-lg border border-border/40 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (tenureUnit !== "years") {
                          setTenureUnit("years");
                          setTenureValue(Math.max(1, Math.round(tenureValue / 12)));
                        }
                      }}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        tenureUnit === "years"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Years
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (tenureUnit !== "months") {
                          setTenureUnit("months");
                          setTenureValue(Math.min(360, tenureValue * 12));
                        }
                      }}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        tenureUnit === "months"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Months
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min={tenureLimits.min}
                    max={tenureLimits.max}
                    step={tenureLimits.step}
                    value={tenureValue}
                    onChange={(e) => setTenureValue(Math.max(1, Number(e.target.value)))}
                    className="w-24 py-1.5 pr-8 pl-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    {tenureUnit === "years" ? "Yr" : "Mo"}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={tenureLimits.min}
                max={tenureLimits.max}
                step={tenureLimits.step}
                value={tenureValue}
                onChange={(e) => setTenureValue(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{tenureLimits.min} {tenureUnit}</span>
                <span className="font-semibold text-foreground">
                  {tenureValue} {tenureUnit} ({tenureUnit === "years" ? `${tenureValue * 12} Mos` : `${(tenureValue / 12).toFixed(1)} Yrs`})
                </span>
                <span>{tenureLimits.max} {tenureUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Cards & Chart */}
        <div className="lg:col-span-7 space-y-5">
          {/* Real-time Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Monthly EMI */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Monthly EMI</span>
                <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-md bg-primary/15">
                  Monthly Due
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  {formatCurrency(result.monthlyEmi, currency, false)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Exact: {formatCurrency(result.monthlyEmi, currency, true)}
                </p>
              </div>
            </div>

            {/* Card 2: Total Interest */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Total Interest
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/15">
                  {formatPercent(interestShare)}
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {formatCurrency(result.totalInterest, currency, false)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCompact(result.totalInterest, currency)} finance charge
                </p>
              </div>
            </div>

            {/* Card 3: Total Payment */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Payment</span>
                <span className="text-[10px] font-bold text-foreground px-2 py-0.5 rounded-md bg-muted">
                  Principal + Int
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(result.totalPayment, currency, false)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCompact(result.totalPayment, currency)} total outflow
                </p>
              </div>
            </div>
          </div>

          {/* Donut Chart Visualizing Loan Split */}
          <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Breakdown: Principal vs Total Interest
                </h4>
              </div>
              <span className="text-xs text-muted-foreground">
                Ratio: 1 : {(result.interestToPrincipalRatio / 100).toFixed(2)}
              </span>
            </div>

            {isMounted ? (
              <div className="w-full h-56 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-full sm:w-1/2 h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`emi-cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            return (
                              <div className="rounded-xl border border-border/80 bg-popover/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
                                <span className="font-medium text-foreground">{data.name}: </span>
                                <span className="font-bold text-primary">
                                  {formatCurrency(data.value as number, currency)}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Interest Share
                    </span>
                    <span className="text-lg font-black text-amber-500">
                      {formatPercent(interestShare)}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="w-3 h-3 rounded-md bg-[#7C4DFF]" />
                      Principal Loan Amount
                    </span>
                    <span className="font-bold text-foreground">
                      {formatPercent(principalShare)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-border/40 bg-amber-500/5 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                      <span className="w-3 h-3 rounded-md bg-[#F59E0B]" />
                      Total Interest Due
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {formatPercent(interestShare)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-56 rounded-xl border border-border/40 bg-muted/20 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
                Rendering chart...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table & CSV Download */}
      <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Loan Amortization Repayment Schedule
              </h4>
              <p className="text-xs text-muted-foreground">
                Detailed split of principal repayment vs interest charge over time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Yearly vs Monthly */}
            <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
              <button
                type="button"
                onClick={() => {
                  setScheduleView("yearly");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  scheduleView === "yearly"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly View
              </button>
              <button
                type="button"
                onClick={() => {
                  setScheduleView("monthly");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  scheduleView === "monthly"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly View
              </button>
            </div>

            {/* CSV Export Button */}
            <button
              type="button"
              onClick={() => exportEmiScheduleToCsv(inputs, result)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Schedule (CSV)
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider border-b border-border/50">
              <tr>
                <th className="py-3 px-4">
                  {scheduleView === "yearly" ? "Year" : "Month / Year"}
                </th>
                <th className="py-3 px-4">Opening Balance</th>
                <th className="py-3 px-4">
                  {scheduleView === "yearly" ? "Total Annual EMI" : "Monthly EMI"}
                </th>
                <th className="py-3 px-4">Principal Repaid</th>
                <th className="py-3 px-4">Interest Paid</th>
                <th className="py-3 px-4 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {pagedRows.map((row, idx) => {
                const isMonthly = "month" in row;
                const key = isMonthly ? `m-${row.month}` : `y-${row.year}`;
                const periodLabel = isMonthly
                  ? `Mo ${row.month} (Yr ${row.year})`
                  : `Year ${row.year}`;
                const emiAmount = isMonthly ? row.emi : row.totalEmi;

                return (
                  <tr key={key} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {periodLabel}
                    </td>
                    <td className="py-3 px-4 text-foreground/80">
                      {formatCurrency(row.openingBalance, currency)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {formatCurrency(emiAmount, currency)}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(row.principalPaid, currency)}
                    </td>
                    <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-medium">
                      {formatCurrency(row.interestPaid, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">
                      {formatCurrency(row.closingBalance, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
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
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={120}>All</option>
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
    </div>
  );
}
