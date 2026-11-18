import { SipInputs, SipResult } from "./types";
import { formatCurrency } from "./formatters";

/**
 * Generates and triggers download of a CSV file containing the investment projection schedule.
 */
export function exportSipToCsv(inputs: SipInputs, result: SipResult): void {
  const { mode, currency, amount, returnRate, timeYears, stepUpPercent } = inputs;
  const isSip = mode === "sip";

  const rows: string[][] = [
    ["=== SIP & Compound Interest Investment Report ==="],
    ["Generated on", new Date().toLocaleString()],
    ["Investment Mode", isSip ? "Monthly SIP" : "One-Time Lumpsum"],
    [
      "Initial Investment Amount",
      `${formatCurrency(amount, currency)} ${isSip ? "/ month" : "(lumpsum)"}`,
    ],
    ["Expected Annual Return (CAGR)", `${returnRate}%`],
    ["Investment Horizon", `${timeYears} Years`],
    ["Annual Step-Up", isSip ? `${stepUpPercent}%` : "N/A"],
    ["Total Invested", formatCurrency(result.totalInvested, currency)],
    ["Estimated Returns", formatCurrency(result.estimatedReturns, currency)],
    ["Total Future Value", formatCurrency(result.futureValue, currency)],
    ["Wealth Multiplier", `${result.wealthMultiplier.toFixed(2)}x`],
    [],
    [
      "Year",
      isSip ? "Monthly Deposit" : "Initial Deposit",
      "Invested in Year",
      "Cumulative Invested",
      "Gains in Year",
      "Cumulative Returns",
      "Ending Portfolio Value",
    ],
  ];

  for (const item of result.yearlyBreakdown) {
    rows.push([
      `Year ${item.year}`,
      Math.round(item.monthlyDeposit).toString(),
      Math.round(item.investedThisYear).toString(),
      Math.round(item.totalInvested).toString(),
      Math.round(item.interestThisYear).toString(),
      Math.round(item.totalInterest).toString(),
      Math.round(item.endingBalance).toString(),
    ]);
  }

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const str = cell ?? "";
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const filename = `${mode}_calculator_${timeYears}yr_${Date.now()}.csv`;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
