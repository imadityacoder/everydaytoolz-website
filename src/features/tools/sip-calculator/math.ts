import { SipInputs, SipResult, YearlyBreakdown } from "./types";

/**
 * Calculates SIP / Lumpsum growth, returns, and year-by-year projections.
 */
export function calculateInvestment(inputs: SipInputs): SipResult {
  const { mode, amount, returnRate, timeYears, stepUpPercent } = inputs;

  const validAmount = Math.max(0, amount || 0);
  const validRate = Math.max(0, returnRate || 0);
  const validYears = Math.min(50, Math.max(1, Math.round(timeYears || 1)));
  const validStepUp = mode === "sip" ? Math.max(0, Math.min(100, stepUpPercent || 0)) : 0;

  if (mode === "lumpsum") {
    return calculateLumpsum(validAmount, validRate, validYears);
  }

  return calculateSip(validAmount, validRate, validYears, validStepUp);
}

function calculateSip(
  monthlyAmount: number,
  annualRate: number,
  years: number,
  stepUpPercent: number
): SipResult {
  const monthlyRate = annualRate / 12 / 100;
  const stepUpRate = stepUpPercent / 100;
  const yearlyBreakdown: YearlyBreakdown[] = [];

  let balance = 0;
  let totalInvested = 0;

  for (let y = 1; y <= years; y++) {
    // Current year monthly deposit with step-up compounded annually
    const currentMonthlyDeposit = Math.round(monthlyAmount * Math.pow(1 + stepUpRate, y - 1));
    let investedThisYear = 0;
    const startOfYearBalance = balance;

    for (let m = 1; m <= 12; m++) {
      balance += currentMonthlyDeposit;
      investedThisYear += currentMonthlyDeposit;
      totalInvested += currentMonthlyDeposit;

      if (monthlyRate > 0) {
        balance *= 1 + monthlyRate;
      }
    }

    const endingBalance = balance;
    const interestThisYear = endingBalance - startOfYearBalance - investedThisYear;
    const totalInterest = endingBalance - totalInvested;

    yearlyBreakdown.push({
      year: y,
      monthlyDeposit: currentMonthlyDeposit,
      investedThisYear,
      totalInvested,
      interestThisYear: Math.max(0, interestThisYear),
      totalInterest: Math.max(0, totalInterest),
      endingBalance,
    });
  }

  const futureValue = balance;
  const estimatedReturns = Math.max(0, futureValue - totalInvested);
  const wealthMultiplier = totalInvested > 0 ? futureValue / totalInvested : 1;

  return {
    totalInvested,
    estimatedReturns,
    futureValue,
    wealthMultiplier,
    yearlyBreakdown,
  };
}

function calculateLumpsum(
  principal: number,
  annualRate: number,
  years: number
): SipResult {
  const yearlyBreakdown: YearlyBreakdown[] = [];
  const rateFactor = 1 + annualRate / 100;

  let prevBalance = principal;

  for (let y = 1; y <= years; y++) {
    const endingBalance = principal * Math.pow(rateFactor, y);
    const interestThisYear = endingBalance - prevBalance;
    const totalInterest = endingBalance - principal;

    yearlyBreakdown.push({
      year: y,
      monthlyDeposit: 0,
      investedThisYear: y === 1 ? principal : 0,
      totalInvested: principal,
      interestThisYear: Math.max(0, interestThisYear),
      totalInterest: Math.max(0, totalInterest),
      endingBalance,
    });

    prevBalance = endingBalance;
  }

  const futureValue = principal * Math.pow(rateFactor, years);
  const estimatedReturns = Math.max(0, futureValue - principal);
  const wealthMultiplier = principal > 0 ? futureValue / principal : 1;

  return {
    totalInvested: principal,
    estimatedReturns,
    futureValue,
    wealthMultiplier,
    yearlyBreakdown,
  };
}
