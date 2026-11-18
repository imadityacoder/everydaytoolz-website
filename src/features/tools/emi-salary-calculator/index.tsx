"use client";

import React, { useState } from "react";
import { LoanEmiTab } from "./LoanEmiTab";
import { SalaryTab } from "./SalaryTab";
import { Landmark, Wallet2 } from "lucide-react";

export default function EmiSalaryCalculator() {
  const [activeTab, setActiveTab] = useState<"emi" | "salary">("emi");

  return (
    <div className="w-full space-y-6">
      {/* Primary Tab Switcher */}
      <div className="flex p-1.5 bg-muted/60 rounded-2xl border border-border/50 max-w-xl mx-auto shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("emi")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "emi"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Landmark className="w-4 h-4 text-primary" />
          <span>Loan EMI Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("salary")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "salary"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wallet2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>CTC to In-Hand Salary</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="w-full transition-opacity duration-200">
        {activeTab === "emi" ? <LoanEmiTab /> : <SalaryTab />}
      </div>
    </div>
  );
}
