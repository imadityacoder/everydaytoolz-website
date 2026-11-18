import {
  EmiInputs,
  EmiResult,
  MonthlyAmortizationRow,
  YearlyAmortizationRow,
} from "./types";

export function calculateLoanEmi(inputs: EmiInputs): EmiResult {
  const { principal, annualInterestRate, tenureValue, tenureUnit } = inputs;

  const validPrincipal = Math.max(0, principal || 0);
  const validRate = Math.max(0, annualInterestRate || 0);
  const totalMonths = Math.max(
    1,
    tenureUnit === "years" ? Math.round(tenureValue * 12) : Math.round(tenureValue)
  );

  const monthlyRate = validRate / 12 / 100;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = validPrincipal / totalMonths;
  } else {
    const ratePow = Math.pow(1 + monthlyRate, totalMonths);
    monthlyEmi = (validPrincipal * monthlyRate * ratePow) / (ratePow - 1);
  }

  // Generate Month-by-Month Amortization
  const monthlySchedule: MonthlyAmortizationRow[] = [];
  let balance = validPrincipal;
  let totalInterestCalculated = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const openingBalance = balance;
    const interestForMonth = openingBalance * monthlyRate;
    let principalForMonth = monthlyEmi - interestForMonth;
    let actualEmi = monthlyEmi;

    // Adjust for the final month or rounding
    if (m === totalMonths || principalForMonth > openingBalance) {
      principalForMonth = openingBalance;
      actualEmi = principalForMonth + interestForMonth;
      balance = 0;
    } else {
      balance = Math.max(0, openingBalance - principalForMonth);
    }

    totalInterestCalculated += interestForMonth;
    const currentYear = Math.floor((m - 1) / 12) + 1;

    monthlySchedule.push({
      month: m,
      year: currentYear,
      openingBalance,
      emi: actualEmi,
      principalPaid: principalForMonth,
      interestPaid: interestForMonth,
      closingBalance: balance,
    });
  }

  // Aggregate into Yearly Amortization Schedule
  const totalYears = Math.ceil(totalMonths / 12);
  const yearlySchedule: YearlyAmortizationRow[] = [];

  for (let y = 1; y <= totalYears; y++) {
    const monthsInYear = monthlySchedule.filter((row) => row.year === y);
    if (monthsInYear.length === 0) continue;

    const openingBalance = monthsInYear[0].openingBalance;
    const closingBalance = monthsInYear[monthsInYear.length - 1].closingBalance;
    const totalEmi = monthsInYear.reduce((acc, curr) => acc + curr.emi, 0);
    const principalPaid = monthsInYear.reduce((acc, curr) => acc + curr.principalPaid, 0);
    const interestPaid = monthsInYear.reduce((acc, curr) => acc + curr.interestPaid, 0);

    yearlySchedule.push({
      year: y,
      openingBalance,
      totalEmi,
      principalPaid,
      interestPaid,
      closingBalance,
    });
  }

  const totalPayment = validPrincipal + totalInterestCalculated;
  const interestToPrincipalRatio =
    validPrincipal > 0 ? (totalInterestCalculated / validPrincipal) * 100 : 0;

  return {
    monthlyEmi,
    totalInterest: totalInterestCalculated,
    totalPayment,
    interestToPrincipalRatio,
    monthlySchedule,
    yearlySchedule,
  };
}
