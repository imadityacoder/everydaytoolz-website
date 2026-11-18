export type Currency = "INR" | "USD";

export type InvestmentMode = "sip" | "lumpsum";

export interface SipInputs {
  mode: InvestmentMode;
  currency: Currency;
  amount: number;
  returnRate: number;
  timeYears: number;
  stepUpPercent: number;
}

export interface YearlyBreakdown {
  year: number;
  monthlyDeposit: number;
  investedThisYear: number;
  totalInvested: number;
  interestThisYear: number;
  totalInterest: number;
  endingBalance: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
  wealthMultiplier: number;
  yearlyBreakdown: YearlyBreakdown[];
}
