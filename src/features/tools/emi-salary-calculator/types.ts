export type Currency = "INR" | "USD";

// --- Tab 1: Loan EMI Types ---
export type TenureUnit = "years" | "months";

export interface EmiInputs {
  principal: number;
  annualInterestRate: number;
  tenureValue: number;
  tenureUnit: TenureUnit;
  currency: Currency;
}

export interface MonthlyAmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface YearlyAmortizationRow {
  year: number;
  openingBalance: number;
  totalEmi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  interestToPrincipalRatio: number;
  monthlySchedule: MonthlyAmortizationRow[];
  yearlySchedule: YearlyAmortizationRow[];
}

// --- Tab 2: Salary Calculator Types ---
export type TaxRegime = "new" | "old";

export interface SalaryInputs {
  annualCtc: number;
  basicPercent: number; // e.g. 50%
  hraPercent: number; // e.g. 40% or 50% of Basic
  taxRegime: TaxRegime;
  standardDeduction: number; // 75000 or 50000
  capEpfAtStatutoryLimit: boolean; // cap at 1800/mo vs full 12%
  monthlyProfessionalTax: number; // default 200
}

export interface SalaryBreakdownItem {
  name: string;
  category: "earning" | "deduction" | "retiral";
  monthly: number;
  annual: number;
  description?: string;
}

export interface SalaryResult {
  annualCtc: number;
  monthlyCtc: number;
  monthlyGrossSalary: number;
  annualGrossSalary: number;
  
  // Deductions
  monthlyEmployeeEpf: number;
  annualEmployeeEpf: number;
  monthlyEmployerEpf: number;
  annualEmployerEpf: number;
  monthlyProfessionalTax: number;
  annualProfessionalTax: number;
  monthlyIncomeTax: number;
  annualIncomeTax: number;
  
  totalMonthlyDeductions: number;
  totalAnnualDeductions: number;
  
  // Net In-Hand
  monthlyInHand: number;
  annualInHand: number;
  
  taxableIncome: number;
  effectiveTaxRate: number;
  
  breakdownItems: SalaryBreakdownItem[];
}
