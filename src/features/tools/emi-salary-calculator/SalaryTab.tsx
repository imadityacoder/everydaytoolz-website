"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SalaryInputs, TaxRegime } from "./types";
import { calculateSalary } from "./math-salary";
import { formatCurrency, formatCompact, formatPercent } from "./formatters";
import { exportSalaryBreakdownToCsv } from "./csv";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Wallet,
  IndianRupee,
  FileSpreadsheet,
  Download,
  Info,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  PieChart as PieIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function SalaryTab() {
  const [annualCtc, setAnnualCtc] = useState<number>(1200000); // 12 LPA default
  const [basicPercent, setBasicPercent] = useState<number>(50); // 50%
  const [hraPercent, setHraPercent] = useState<number>(40); // 40% of Basic
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [standardDeduction, setStandardDeduction] = useState<number>(75000);
  const [capEpfAtStatutoryLimit, setCapEpfAtStatutoryLimit] = useState<boolean>(false);
  const [monthlyProfessionalTax, setMonthlyProfessionalTax] = useState<number>(200);

  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inputs: SalaryInputs = useMemo(
    () => ({
      annualCtc,
      basicPercent,
      hraPercent,
      taxRegime,
      standardDeduction: taxRegime === "new" ? standardDeduction : 50000,
      capEpfAtStatutoryLimit,
      monthlyProfessionalTax,
    }),
    [
      annualCtc,
      basicPercent,
      hraPercent,
      taxRegime,
      standardDeduction,
      capEpfAtStatutoryLimit,
      monthlyProfessionalTax,
    ]
  );

  const result = useMemo(() => calculateSalary(inputs), [inputs]);

  // Donut chart representation of CTC distribution
  const chartData = [
    {
      name: "Net In-Hand Salary",
      value: Math.round(result.annualInHand),
      color: "#10B981", // Emerald
    },
    {
      name: "Income Tax (TDS)",
      value: Math.round(result.annualIncomeTax),
      color: "#EF4444", // Red / Coral
    },
    {
      name: "EPF Retirals (Employee + Employer)",
      value: Math.round(result.annualEmployeeEpf + result.annualEmployerEpf),
      color: "#7C4DFF", // Indigo
    },
    {
      name: "Professional Tax",
      value: Math.round(result.annualProfessionalTax),
      color: "#64748B", // Slate
    },
  ].filter((item) => item.value > 0);

  const takeHomeRatio =
    result.annualCtc > 0 ? (result.annualInHand / result.annualCtc) * 100 : 0;

  const applyPresetCtc = (ctc: number) => {
    setAnnualCtc(ctc);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Bar: Quick CTC Presets & Tax Regime Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Standard CTC Slabs:
          </span>
          <button
            type="button"
            onClick={() => applyPresetCtc(600000)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              annualCtc === 600000
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/50 bg-background hover:bg-muted/50 text-foreground"
            }`}
          >
            ₹6 LPA
          </button>
          <button
            type="button"
            onClick={() => applyPresetCtc(1200000)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              annualCtc === 1200000
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/50 bg-background hover:bg-muted/50 text-foreground"
            }`}
          >
            ₹12 LPA
          </button>
          <button
            type="button"
            onClick={() => applyPresetCtc(2500000)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              annualCtc === 2500000
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/50 bg-background hover:bg-muted/50 text-foreground"
            }`}
          >
            ₹25 LPA
          </button>
          <button
            type="button"
            onClick={() => applyPresetCtc(5000000)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              annualCtc === 5000000
                ? "border-primary bg-primary/10 text-primary font-bold"
                : "border-border/50 bg-background hover:bg-muted/50 text-foreground"
            }`}
          >
            ₹50 LPA
          </button>
        </div>

        {/* Tax Regime Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Tax Regime:
          </span>
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => {
                setTaxRegime("new");
                setStandardDeduction(75000);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                taxRegime === "new"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              New Regime (FY 2024-25)
            </button>
            <button
              type="button"
              onClick={() => {
                setTaxRegime("old");
                setStandardDeduction(50000);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                taxRegime === "old"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Old Regime
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Hero Outputs & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CTC Input & Component Config */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Cost to Company (CTC)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                INR (₹) Annual
              </span>
            </div>

            {/* CTC Main Slider & Numeric Input */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Annual Package (CTC)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={200000}
                    max={20000000}
                    step={50000}
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(Math.max(0, Number(e.target.value)))}
                    className="w-36 py-1.5 pl-6 pr-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <input
                type="range"
                min={300000}
                max={10000000}
                step={50000}
                value={annualCtc}
                onChange={(e) => setAnnualCtc(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>₹3 Lakh</span>
                <span className="font-semibold text-foreground">
                  {formatCompact(annualCtc, "INR")} / yr ({formatCurrency(annualCtc / 12, "INR")}/mo)
                </span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* Collapsible Advanced Salary Structure Customizer */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/10">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="w-full p-3 flex items-center justify-between text-xs font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  <span>Customize Salary Structure & Exemptions</span>
                </div>
                {advancedOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {advancedOpen && (
                <div className="p-4 space-y-4 border-t border-border/40 bg-card text-xs">
                  {/* Basic Salary % Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Basic Salary (% of CTC):</span>
                      <span className="font-bold text-foreground">{basicPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={60}
                      step={5}
                      value={basicPercent}
                      onChange={(e) => setBasicPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>30%</span>
                      <span>Standard: 50%</span>
                      <span>60%</span>
                    </div>
                  </div>

                  {/* HRA % of Basic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">HRA (% of Basic Salary):</span>
                      <span className="font-bold text-foreground">{hraPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={50}
                      step={10}
                      value={hraPercent}
                      onChange={(e) => setHraPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>20%</span>
                      <span>40% (Non-Metro)</span>
                      <span>50% (Metro)</span>
                    </div>
                  </div>

                  {/* Standard Deduction Toggle */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Standard Deduction</p>
                      <p className="text-[10px] text-muted-foreground">
                        {taxRegime === "new" ? "₹75,000 (Budget 2024 revised)" : "₹50,000 (Old Regime)"}
                      </p>
                    </div>
                    <span className="font-bold text-primary">
                      {formatCurrency(inputs.standardDeduction, "INR")}
                    </span>
                  </div>

                  {/* EPF Statutory Cap Toggle */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Cap EPF to Statutory Limit</p>
                      <p className="text-[10px] text-muted-foreground">
                        {capEpfAtStatutoryLimit
                          ? "Capped at ₹1,800/mo (₹21,600/yr)"
                          : "Full 12% of Basic Salary"}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={capEpfAtStatutoryLimit}
                      onChange={(e) => setCapEpfAtStatutoryLimit(e.target.checked)}
                      className="w-4 h-4 rounded border-border/70 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Professional Tax Input */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Monthly Professional Tax (PT)</p>
                      <p className="text-[10px] text-muted-foreground">Standard state deduction</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">₹</span>
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        step={50}
                        value={monthlyProfessionalTax}
                        onChange={(e) =>
                          setMonthlyProfessionalTax(Math.max(0, Number(e.target.value)))
                        }
                        className="w-16 py-1 px-1.5 text-right font-bold rounded-lg border border-border/60 bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tax Info Banner */}
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {taxRegime === "new" ? "New Tax Regime (Section 115BAC)" : "Old Tax Regime"}
                </p>
                <p className="text-[11px] mt-0.5">
                  {taxRegime === "new"
                    ? "Zero tax for income up to ₹7.75 Lakhs (with standard deduction ₹75k & 87A rebate). Lower slab rates with simplified filing."
                    : "Standard ₹50,000 deduction plus Section 80C deductions (EPF up to ₹1.5L accounted for)."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Net Salary Cards & Distribution Chart */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Hero Card: In-Hand Monthly Take-Home */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Estimated Monthly In-Hand Salary
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/15">
                {takeHomeRatio.toFixed(1)}% of CTC
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(result.monthlyInHand, "INR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Net credited to your bank account every month
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-muted-foreground uppercase font-semibold">
                  Annual Take-Home
                </span>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {formatCurrency(result.annualInHand, "INR")}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Total Deductions */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Monthly Deductions
                </span>
                <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(result.totalMonthlyDeductions, "INR")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  EPF + PT + Monthly TDS
                </p>
              </div>
            </div>

            {/* Card 2: Annual Income Tax */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Annual Tax (TDS)
                </span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10">
                  {formatPercent(result.effectiveTaxRate)} Eff.
                </span>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                  {formatCurrency(result.annualIncomeTax, "INR")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCurrency(result.monthlyIncomeTax, "INR")}/month TDS
                </p>
              </div>
            </div>

            {/* Card 3: Total EPF Retirals */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Annual EPF Savings</span>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">
                  {formatCurrency(result.annualEmployeeEpf + result.annualEmployerEpf, "INR")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Employee + Employer PF
                </p>
              </div>
            </div>
          </div>

          {/* Visual: Donut Chart showing Where your CTC goes */}
          <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Where Does Your CTC Go?
                </h4>
              </div>
              <span className="text-xs text-muted-foreground">
                Gross: {formatCurrency(result.annualGrossSalary, "INR")}
              </span>
            </div>

            {isMounted ? (
              <div className="w-full h-52 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-full sm:w-1/2 h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`salary-cell-${index}`} fill={entry.color} stroke="none" />
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
                                  {formatCurrency(data.value as number, "INR")}
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
                      Take-Home
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {takeHomeRatio.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 space-y-2 text-xs">
                  {chartData.map((slice) => (
                    <div
                      key={slice.name}
                      className="p-2 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2 text-foreground font-medium truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="truncate">{slice.name}</span>
                      </span>
                      <span className="font-bold text-foreground flex-shrink-0 ml-2">
                        {formatCompact(slice.value, "INR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-52 rounded-xl border border-border/40 bg-muted/20 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
                Rendering salary breakdown...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Salary Slip & Breakdown Table */}
      <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Itemized Salary Slip & Tax Computation
              </h4>
              <p className="text-xs text-muted-foreground">
                Detailed line-by-line earnings, statutory withholdings, and employer contributions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => exportSalaryBreakdownToCsv(inputs, result)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Salary Slip (CSV)
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider border-b border-border/50">
              <tr>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Monthly (₹)</th>
                <th className="py-3 px-4 text-right">Annual (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {result.breakdownItems.map((item, idx) => {
                const isEarning = item.category === "earning";
                const isDeduction = item.category === "deduction";
                const isGross = item.name.includes("Gross Monthly");

                let badgeColor = "bg-muted text-muted-foreground";
                if (isEarning) badgeColor = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
                if (isDeduction) badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
                if (item.category === "retiral") badgeColor = "bg-purple-500/10 text-purple-600 dark:text-purple-400";

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-muted/30 transition-colors ${
                      isGross ? "bg-muted/20 font-bold" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {item.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold ${badgeColor}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {item.description}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        isDeduction
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {isDeduction ? "-" : ""}
                      {formatCurrency(item.monthly, "INR")}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        isDeduction
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {isDeduction ? "-" : ""}
                      {formatCurrency(item.annual, "INR")}
                    </td>
                  </tr>
                );
              })}

              {/* Highlighted Final Net In-Hand Row */}
              <tr className="bg-emerald-500/10 border-t-2 border-emerald-500/30">
                <td className="py-3.5 px-4 font-black text-sm text-emerald-600 dark:text-emerald-400">
                  FINAL NET IN-HAND TAKE-HOME
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    NET PAY
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Net cash deposited to bank account after all deductions
                </td>
                <td className="py-3.5 px-4 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.monthlyInHand, "INR")}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-sm text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.annualInHand, "INR")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
