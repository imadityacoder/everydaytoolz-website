import { EmiInputs, EmiResult, SalaryInputs, SalaryResult } from "./types";
import { formatCurrency } from "./formatters";

/**
 * Downloads full Month-by-Month Loan Amortization Schedule as CSV.
 */
export function exportEmiScheduleToCsv(inputs: EmiInputs, result: EmiResult): void {
  const { principal, annualInterestRate, tenureValue, tenureUnit, currency } = inputs;

  const rows: string[][] = [
    ["=== Loan EMI Amortization Schedule ==="],
    ["Generated on", new Date().toLocaleString()],
    ["Loan Amount (Principal)", formatCurrency(principal, currency)],
    ["Annual Interest Rate", `${annualInterestRate}%`],
    ["Tenure", `${tenureValue} ${tenureUnit}`],
    ["Monthly EMI", formatCurrency(result.monthlyEmi, currency, true)],
    ["Total Interest", formatCurrency(result.totalInterest, currency, true)],
    ["Total Payment", formatCurrency(result.totalPayment, currency, true)],
    [],
    [
      "Payment Month",
      "Year",
      "Opening Balance",
      "Monthly EMI",
      "Principal Repaid",
      "Interest Paid",
      "Closing Balance",
    ],
  ];

  for (const row of result.monthlySchedule) {
    rows.push([
      `Month ${row.month}`,
      `Year ${row.year}`,
      row.openingBalance.toFixed(2),
      row.emi.toFixed(2),
      row.principalPaid.toFixed(2),
      row.interestPaid.toFixed(2),
      row.closingBalance.toFixed(2),
    ]);
  }

  downloadCsv(rows, `loan_amortization_schedule_${Date.now()}.csv`);
}

/**
 * Downloads detailed CTC to In-Hand Salary breakdown as CSV.
 */
export function exportSalaryBreakdownToCsv(
  inputs: SalaryInputs,
  result: SalaryResult
): void {
  const rows: string[][] = [
    ["=== Indian CTC to In-Hand Take-Home Salary Breakdown ==="],
    ["Generated on", new Date().toLocaleString()],
    ["Annual CTC", formatCurrency(inputs.annualCtc, "INR")],
    ["Monthly CTC", formatCurrency(result.monthlyCtc, "INR")],
    ["Tax Regime", inputs.taxRegime === "new" ? "New Tax Regime" : "Old Tax Regime"],
    ["Standard Deduction", formatCurrency(inputs.standardDeduction, "INR")],
    ["Annual In-Hand (Net Pay)", formatCurrency(result.annualInHand, "INR")],
    ["Monthly In-Hand (Net Pay)", formatCurrency(result.monthlyInHand, "INR")],
    ["Total Monthly Deductions", formatCurrency(result.totalMonthlyDeductions, "INR")],
    ["Effective Tax Rate", `${result.effectiveTaxRate.toFixed(2)}%`],
    [],
    ["Component", "Category", "Monthly (INR)", "Annual (INR)", "Description"],
  ];

  for (const item of result.breakdownItems) {
    rows.push([
      item.name,
      item.category.toUpperCase(),
      item.monthly.toFixed(2),
      item.annual.toFixed(2),
      item.description ?? "",
    ]);
  }

  // Summary row
  rows.push([]);
  rows.push([
    "NET MONTHLY TAKE-HOME PAY",
    "FINAL IN-HAND",
    result.monthlyInHand.toFixed(2),
    result.annualInHand.toFixed(2),
    "Net cash credited to bank account every month",
  ]);

  downloadCsv(rows, `ctc_take_home_salary_slip_${Date.now()}.csv`);
}

function downloadCsv(rows: string[][], filename: string): void {
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
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
