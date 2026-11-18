"use client";

import React, { useState, useMemo } from "react";
import { Currency, InvestmentMode, SipInputs } from "./types";
import { calculateInvestment } from "./math";
import { formatCurrency, formatCompact, formatPercent } from "./formatters";
import { SipChart } from "./SipChart";
import { YearlyTable } from "./YearlyTable";
import {
  Coins,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Info,
  DollarSign,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

export default function SipCalculator() {
  const [mode, setMode] = useState<InvestmentMode>("sip");
  const [currency, setCurrency] = useState<Currency>("INR");

  // Inputs
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [timeYears, setTimeYears] = useState<number>(10);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);

  // Active amount depending on mode
  const currentAmount = mode === "sip" ? sipAmount : lumpsumAmount;
  const setCurrentAmount = (val: number) => {
    if (mode === "sip") setSipAmount(val);
    else setLumpsumAmount(val);
  };

  // Switch currency helper with sensible defaults if necessary
  const handleCurrencySwitch = (newCurrency: Currency) => {
    if (newCurrency === currency) return;
    setCurrency(newCurrency);
    if (newCurrency === "USD") {
      if (mode === "sip" && sipAmount >= 5000) setSipAmount(500);
      if (mode === "lumpsum" && lumpsumAmount >= 50000) setLumpsumAmount(10000);
    } else {
      if (mode === "sip" && sipAmount <= 1000) setSipAmount(10000);
      if (mode === "lumpsum" && lumpsumAmount <= 20000) setLumpsumAmount(100000);
    }
  };

  // Bounds for Amount
  const amountLimits = useMemo(() => {
    if (currency === "INR") {
      return mode === "sip"
        ? { min: 500, max: 200000, step: 500 }
        : { min: 5000, max: 5000000, step: 5000 };
    }
    return mode === "sip"
      ? { min: 25, max: 10000, step: 25 }
      : { min: 500, max: 250000, step: 250 };
  }, [currency, mode]);

  // Prepared inputs object
  const inputs: SipInputs = useMemo(
    () => ({
      mode,
      currency,
      amount: currentAmount,
      returnRate,
      timeYears,
      stepUpPercent,
    }),
    [mode, currency, currentAmount, returnRate, timeYears, stepUpPercent]
  );

  // Computed results
  const result = useMemo(() => calculateInvestment(inputs), [inputs]);

  // Preset quick triggers
  const applyPreset = (preset: {
    mode: InvestmentMode;
    amount: number;
    returnRate: number;
    timeYears: number;
    stepUpPercent: number;
  }) => {
    setMode(preset.mode);
    if (preset.mode === "sip") setSipAmount(preset.amount);
    else setLumpsumAmount(preset.amount);
    setReturnRate(preset.returnRate);
    setTimeYears(preset.timeYears);
    setStepUpPercent(preset.stepUpPercent);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header bar: Title, Currency switcher & Mode switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        {/* Investment Mode: Monthly SIP vs Lumpsum */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/40">
          <button
            type="button"
            onClick={() => setMode("sip")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === "sip"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly SIP
          </button>
          <button
            type="button"
            onClick={() => setMode("lumpsum")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === "lumpsum"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            One-Time Lumpsum
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Currency:
          </span>
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => handleCurrencySwitch("INR")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                currency === "INR"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              INR (₹ Lakh/Cr)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencySwitch("USD")}
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
      </div>

      {/* Main Grid: Inputs Column & Outputs / Charts Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Investment Parameters
              </h3>
              <span className="text-[11px] font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                {mode === "sip" ? "Systematic Plan" : "Lumpsum"}
              </span>
            </div>

            {/* Input 1: Investment Amount */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {mode === "sip" ? "Monthly Investment" : "Total Investment"}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    {currency === "INR" ? "₹" : "$"}
                  </span>
                  <input
                    type="number"
                    min={amountLimits.min}
                    max={amountLimits.max * 5}
                    step={amountLimits.step}
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Math.max(0, Number(e.target.value)))}
                    className="w-32 py-1.5 pl-6 pr-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <input
                type="range"
                min={amountLimits.min}
                max={amountLimits.max}
                step={amountLimits.step}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatCurrency(amountLimits.min, currency)}</span>
                <span className="font-medium text-foreground">
                  {formatCompact(currentAmount, currency)}
                </span>
                <span>{formatCurrency(amountLimits.max, currency)}</span>
              </div>
            </div>

            {/* Input 2: Expected Return Rate (p.a %) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-primary" />
                  Expected Return Rate (p.a)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={0.5}
                    value={returnRate}
                    onChange={(e) => setReturnRate(Math.max(0.1, Number(e.target.value)))}
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
                max={30}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>1%</span>
                <span className="font-medium text-foreground">{returnRate}%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Input 3: Time Period (Years) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Time Horizon (Years)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={40}
                    step={1}
                    value={timeYears}
                    onChange={(e) => setTimeYears(Math.max(1, Number(e.target.value)))}
                    className="w-24 py-1.5 pr-6 pl-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    Yr
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={timeYears}
                onChange={(e) => setTimeYears(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>1 Year</span>
                <span className="font-medium text-foreground">{timeYears} Years</span>
                <span>40 Years</span>
              </div>
            </div>

            {/* Input 4: Annual Step-Up % (Only for Monthly SIP) */}
            {mode === "sip" ? (
              <div className="space-y-2.5 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Annual Step-Up (%)
                    </label>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md">
                      Salary Hike
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={25}
                      step={1}
                      value={stepUpPercent}
                      onChange={(e) =>
                        setStepUpPercent(Math.max(0, Math.min(25, Number(e.target.value))))
                      }
                      className="w-20 py-1.5 pr-6 pl-2.5 text-right font-bold text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>0% (Fixed)</span>
                  <span className="font-medium text-foreground">{stepUpPercent}% / yr</span>
                  <span>25% Max</span>
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Automatically increases your monthly contribution by {stepUpPercent}% each year as
                  your career earnings grow.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-dashed border-border/70 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2.5">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>Step-Up compounding is exclusive to Systematic Monthly SIPs.</span>
              </div>
            )}

            {/* Quick Strategy Presets */}
            <div className="pt-2 border-t border-border/40 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Popular Wealth Scenarios
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      mode: "sip",
                      amount: currency === "INR" ? 5000 : 250,
                      returnRate: 12,
                      timeYears: 15,
                      stepUpPercent: 10,
                    })
                  }
                  className="p-2.5 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-left transition-all cursor-pointer"
                >
                  <p className="font-semibold text-foreground">10% Step-Up SIP</p>
                  <p className="text-[10px] text-muted-foreground">
                    {currency === "INR" ? "₹5k" : "$250"}/mo • 15 Yrs • 12%
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      mode: "sip",
                      amount: currency === "INR" ? 25000 : 1000,
                      returnRate: 13,
                      timeYears: 20,
                      stepUpPercent: 10,
                    })
                  }
                  className="p-2.5 rounded-xl border border-border/50 bg-background hover:bg-muted/50 text-left transition-all cursor-pointer"
                >
                  <p className="font-semibold text-foreground">Retirement Goal</p>
                  <p className="text-[10px] text-muted-foreground">
                    {currency === "INR" ? "₹25k" : "$1k"}/mo • 20 Yrs • 13%
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Output Cards & Visuals (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Real-time Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Total Invested */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Invested</span>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Coins className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(result.totalInvested, currency)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCompact(result.totalInvested, currency)} principal
                </p>
              </div>
            </div>

            {/* Card 2: Est. Returns */}
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Est. Returns
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  +{formatCurrency(result.estimatedReturns, currency)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCompact(result.estimatedReturns, currency)} profit gain
                </p>
              </div>
            </div>

            {/* Card 3: Total Future Value */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Total Future Value</span>
                <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-md bg-primary/15">
                  {result.wealthMultiplier.toFixed(2)}x
                </span>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-primary tracking-tight">
                  {formatCurrency(result.futureValue, currency)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCompact(result.futureValue, currency)} maturity
                </p>
              </div>
            </div>
          </div>

          {/* Recharts Visualizations */}
          <SipChart result={result} currency={currency} />
        </div>
      </div>

      {/* Year-by-Year Growth Table and CSV Download */}
      <YearlyTable inputs={inputs} result={result} currency={currency} />
    </div>
  );
}
