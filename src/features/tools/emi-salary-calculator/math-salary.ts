import { SalaryBreakdownItem, SalaryInputs, SalaryResult } from "./types";

/**
 * Computes Indian CTC to In-Hand Take-Home Monthly Salary and detailed deductions.
 */
export function calculateSalary(inputs: SalaryInputs): SalaryResult {
  const {
    annualCtc,
    basicPercent,
    hraPercent,
    taxRegime,
    standardDeduction,
    capEpfAtStatutoryLimit,
    monthlyProfessionalTax,
  } = inputs;

  const validCtc = Math.max(0, annualCtc || 0);

  // 1. Basic & HRA
  const annualBasic = validCtc * (Math.max(10, Math.min(80, basicPercent)) / 100);
  const annualHra = annualBasic * (Math.max(10, Math.min(60, hraPercent)) / 100);

  // 2. Employer EPF (part of CTC)
  const fullEmployerEpf = annualBasic * 0.12;
  const annualEmployerEpf = capEpfAtStatutoryLimit
    ? Math.min(fullEmployerEpf, 1800 * 12)
    : fullEmployerEpf;

  // 3. Special / Other Allowance
  const annualSpecialAllowance = Math.max(
    0,
    validCtc - annualBasic - annualHra - annualEmployerEpf
  );

  // 4. Gross Salary (Cash salary before employee deductions)
  const annualGrossSalary = annualBasic + annualHra + annualSpecialAllowance;
  const monthlyGrossSalary = annualGrossSalary / 12;

  // 5. Employee EPF deduction
  const fullEmployeeEpf = annualBasic * 0.12;
  const annualEmployeeEpf = capEpfAtStatutoryLimit
    ? Math.min(fullEmployeeEpf, 1800 * 12)
    : fullEmployeeEpf;
  const monthlyEmployeeEpf = annualEmployeeEpf / 12;

  // 6. Professional Tax
  const annualProfessionalTax = Math.max(0, monthlyProfessionalTax * 12);

  // 7. Income Tax Calculation
  let taxableIncome = 0;
  let annualIncomeTax = 0;

  if (taxRegime === "new") {
    // New Tax Regime (FY 2024-25 / FY 2025-26)
    taxableIncome = Math.max(0, annualGrossSalary - standardDeduction);

    if (taxableIncome <= 700000) {
      // Full rebate under Section 87A
      annualIncomeTax = 0;
    } else {
      let rawTax = 0;
      // 0 to 3,00,000 @ 0%
      // 3,00,001 to 7,00,000 @ 5%
      if (taxableIncome > 300000) {
        rawTax += Math.min(400000, taxableIncome - 300000) * 0.05;
      }
      // 7,00,001 to 10,00,000 @ 10%
      if (taxableIncome > 700000) {
        rawTax += Math.min(300000, taxableIncome - 700000) * 0.10;
      }
      // 10,00,001 to 12,00,000 @ 15%
      if (taxableIncome > 1000000) {
        rawTax += Math.min(200000, taxableIncome - 1000000) * 0.15;
      }
      // 12,00,001 to 15,00,000 @ 20%
      if (taxableIncome > 1200000) {
        rawTax += Math.min(300000, taxableIncome - 1200000) * 0.20;
      }
      // Above 15,00,000 @ 30%
      if (taxableIncome > 1500000) {
        rawTax += (taxableIncome - 1500000) * 0.30;
      }

      // Add 4% Cess
      annualIncomeTax = rawTax * 1.04;
    }
  } else {
    // Old Tax Regime with standard deduction + 80C deduction
    const deduction80c = Math.min(150000, annualEmployeeEpf);
    taxableIncome = Math.max(0, annualGrossSalary - 50000 - deduction80c);

    if (taxableIncome <= 500000) {
      annualIncomeTax = 0; // Section 87A rebate
    } else {
      let rawTax = 0;
      // 2.5L to 5L @ 5%
      if (taxableIncome > 250000) {
        rawTax += Math.min(250000, taxableIncome - 250000) * 0.05;
      }
      // 5L to 10L @ 20%
      if (taxableIncome > 500000) {
        rawTax += Math.min(500000, taxableIncome - 500000) * 0.20;
      }
      // Above 10L @ 30%
      if (taxableIncome > 1000000) {
        rawTax += (taxableIncome - 1000000) * 0.30;
      }

      annualIncomeTax = rawTax * 1.04;
    }
  }

  const monthlyIncomeTax = annualIncomeTax / 12;

  // 8. Total Deductions
  const totalAnnualDeductions =
    annualEmployeeEpf + annualProfessionalTax + annualIncomeTax;
  const totalMonthlyDeductions = totalAnnualDeductions / 12;

  // 9. Net In-Hand
  const annualInHand = Math.max(0, annualGrossSalary - totalAnnualDeductions);
  const monthlyInHand = annualInHand / 12;

  const effectiveTaxRate =
    annualGrossSalary > 0 ? (annualIncomeTax / annualGrossSalary) * 100 : 0;

  // 10. Breakdown Items for Pay Slip
  const breakdownItems: SalaryBreakdownItem[] = [
    {
      name: "Basic Salary",
      category: "earning",
      monthly: annualBasic / 12,
      annual: annualBasic,
      description: `${basicPercent}% of total CTC`,
    },
    {
      name: "House Rent Allowance (HRA)",
      category: "earning",
      monthly: annualHra / 12,
      annual: annualHra,
      description: `${hraPercent}% of Basic Salary`,
    },
    {
      name: "Special & Other Allowances",
      category: "earning",
      monthly: annualSpecialAllowance / 12,
      annual: annualSpecialAllowance,
      description: "Remaining flexible component of Gross Pay",
    },
    {
      name: "Gross Monthly Salary",
      category: "earning",
      monthly: monthlyGrossSalary,
      annual: annualGrossSalary,
      description: "Pre-tax, pre-deduction cash compensation",
    },
    {
      name: "Employee Provident Fund (EPF 12%)",
      category: "deduction",
      monthly: monthlyEmployeeEpf,
      annual: annualEmployeeEpf,
      description: "12% statutory retiral savings from employee basic",
    },
    {
      name: "Professional Tax (PT)",
      category: "deduction",
      monthly: monthlyProfessionalTax,
      annual: annualProfessionalTax,
      description: "State government employment tax",
    },
    {
      name: `Income Tax / TDS (${taxRegime === "new" ? "New Regime" : "Old Regime"})`,
      category: "deduction",
      monthly: monthlyIncomeTax,
      annual: annualIncomeTax,
      description: `Estimated TDS after ₹${(standardDeduction / 1000).toFixed(0)}k Std Deduction`,
    },
    {
      name: "Employer Provident Fund (EPF)",
      category: "retiral",
      monthly: annualEmployerEpf / 12,
      annual: annualEmployerEpf,
      description: "Employer contribution towards PF (part of CTC)",
    },
  ];

  return {
    annualCtc: validCtc,
    monthlyCtc: validCtc / 12,
    monthlyGrossSalary,
    annualGrossSalary,
    monthlyEmployeeEpf,
    annualEmployeeEpf,
    monthlyEmployerEpf: annualEmployerEpf / 12,
    annualEmployerEpf,
    monthlyProfessionalTax,
    annualProfessionalTax,
    monthlyIncomeTax,
    annualIncomeTax,
    totalMonthlyDeductions,
    totalAnnualDeductions,
    monthlyInHand,
    annualInHand,
    taxableIncome,
    effectiveTaxRate,
    breakdownItems,
  };
}
