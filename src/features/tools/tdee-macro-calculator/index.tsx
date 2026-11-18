"use client";

import React, { useState, useId } from "react";
import {
  Activity,
  Flame,
  Scale,
  Utensils,
  Dumbbell,
  Heart,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";

interface ActivityLevel {
  id: string;
  label: string;
  sublabel: string;
  multiplier: number;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    id: "sedentary",
    label: "Sedentary",
    sublabel: "Desk job, little or no structured exercise",
    multiplier: 1.2,
  },
  {
    id: "light",
    label: "Lightly Active",
    sublabel: "Light exercise / sports 1–3 days/week",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    label: "Moderately Active",
    sublabel: "Moderate exercise / training 3–5 days/week",
    multiplier: 1.55,
  },
  {
    id: "heavy",
    label: "Very Active",
    sublabel: "Intense daily exercise / sports 6–7 days/week",
    multiplier: 1.725,
  },
  {
    id: "extreme",
    label: "Extremely Active",
    sublabel: "Elite athlete, grueling two-a-days, or heavy manual labor",
    multiplier: 1.9,
  },
];

interface FitnessGoal {
  id: string;
  name: string;
  description: string;
  calorieDeltaPercent: number; // e.g. -20 for cut, 0 for maintenance, +15 for bulk
  icon: typeof TrendingDown;
  color: string;
}

const FITNESS_GOALS: FitnessGoal[] = [
  {
    id: "aggressive_cut",
    name: "Aggressive Cut",
    description: "Rapid fat loss (~25% calorie deficit)",
    calorieDeltaPercent: -25,
    icon: TrendingDown,
    color: "text-rose-500",
  },
  {
    id: "moderate_cut",
    name: "Moderate Cut",
    description: "Sustainable fat loss (~15% calorie deficit)",
    calorieDeltaPercent: -15,
    icon: TrendingDown,
    color: "text-amber-500",
  },
  {
    id: "maintain",
    name: "Maintain Weight",
    description: "Energy balance at full TDEE",
    calorieDeltaPercent: 0,
    icon: Minus,
    color: "text-emerald-500",
  },
  {
    id: "lean_bulk",
    name: "Lean Bulk",
    description: "Clean muscle gain (~10% surplus)",
    calorieDeltaPercent: 10,
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    id: "aggressive_bulk",
    name: "Aggressive Bulk",
    description: "Maximum size & strength gain (~20% surplus)",
    calorieDeltaPercent: 20,
    icon: TrendingUp,
    color: "text-indigo-500",
  },
];

interface MacroPreset {
  id: string;
  name: string;
  proteinPct: number;
  carbPct: number;
  fatPct: number;
}

const MACRO_PRESETS: MacroPreset[] = [
  {
    id: "balanced",
    name: "Balanced (30P / 40C / 30F)",
    proteinPct: 30,
    carbPct: 40,
    fatPct: 30,
  },
  {
    id: "high_protein",
    name: "High Protein / Cutting (40P / 35C / 25F)",
    proteinPct: 40,
    carbPct: 35,
    fatPct: 25,
  },
  {
    id: "low_carb",
    name: "Low Carb / Keto (30P / 10C / 60F)",
    proteinPct: 30,
    carbPct: 10,
    fatPct: 60,
  },
  {
    id: "endurance",
    name: "High Carb / Athletic (20P / 60C / 20F)",
    proteinPct: 20,
    carbPct: 60,
    fatPct: 20,
  },
  {
    id: "custom",
    name: "Custom Macro Ratio",
    proteinPct: 30,
    carbPct: 40,
    fatPct: 30,
  },
];

export default function TdeeMacroCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(28);

  // Metric values
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial values
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  // Activity & Goal
  const [activityId, setActivityId] = useState<string>("moderate");
  const [goalId, setGoalId] = useState<string>("moderate_cut");

  // Macros
  const [macroPresetId, setMacroPresetId] = useState<string>("high_protein");
  const [customProteinPct, setCustomProteinPct] = useState<number>(40);
  const [customCarbPct, setCustomCarbPct] = useState<number>(35);
  const [customFatPct, setCustomFatPct] = useState<number>(25);

  // Meals count
  const [mealCount, setMealCount] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  // Accessible IDs for inputs
  const ageId = useId();
  const weightKgId = useId();
  const heightCmId = useId();
  const weightLbsId = useId();
  const heightFtId = useId();
  const heightInId = useId();
  const macroPresetSelectId = useId();
  const mealCountSelectId = useId();
  const customProteinSliderId = useId();
  const customCarbSliderId = useId();
  const customFatSliderId = useId();

  // Unit toggle synchronizer
  const handleUnitToggle = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === "imperial") {
      // Metric to Imperial
      const lbs = Math.round(weightKg * 2.20462);
      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setWeightLbs(lbs);
      setHeightFeet(ft);
      setHeightInches(inches);
    } else {
      // Imperial to Metric
      const kg = Math.round((weightLbs / 2.20462) * 10) / 10;
      const totalInches = heightFeet * 12 + heightInches;
      const cm = Math.round(totalInches * 2.54);
      setWeightKg(kg);
      setHeightCm(cm);
    }
    setUnitSystem(newUnit);
  };

  // Standardized values for calculations
  const effectiveWeightKg =
    unitSystem === "metric" ? weightKg : weightLbs * 0.45359237;
  const effectiveHeightCm =
    unitSystem === "metric"
      ? heightCm
      : (heightFeet * 12 + heightInches) * 2.54;

  // Mifflin-St Jeor Formula
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
  const bmr = Math.round(
    gender === "male"
      ? 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age + 5
      : 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age - 161
  );

  const selectedActivity =
    ACTIVITY_LEVELS.find((a) => a.id === activityId) || ACTIVITY_LEVELS[2];
  const tdee = Math.round(bmr * selectedActivity.multiplier);

  const selectedGoal =
    FITNESS_GOALS.find((g) => g.id === goalId) || FITNESS_GOALS[1];
  const targetCalories = Math.max(
    1000,
    Math.round(tdee * (1 + selectedGoal.calorieDeltaPercent / 100))
  );

  // BMI Calculation
  const heightM = effectiveHeightCm / 100;
  const bmi =
    heightM > 0
      ? Math.round((effectiveWeightKg / (heightM * heightM)) * 10) / 10
      : 0;

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-amber-500" };
    if (val < 25) return { label: "Normal weight", color: "text-emerald-500" };
    if (val < 30) return { label: "Overweight", color: "text-amber-500" };
    return { label: "Obese range", color: "text-rose-500" };
  };

  const bmiCategory = getBmiCategory(bmi);

  // Macro calculation
  let proteinPct = 30;
  let carbPct = 40;
  let fatPct = 30;

  if (macroPresetId === "custom") {
    proteinPct = customProteinPct;
    carbPct = customCarbPct;
    fatPct = customFatPct;
  } else {
    const preset = MACRO_PRESETS.find((p) => p.id === macroPresetId);
    if (preset) {
      proteinPct = preset.proteinPct;
      carbPct = preset.carbPct;
      fatPct = preset.fatPct;
    }
  }

  // Exact grams:
  // Protein = 4 kcal/g
  // Carbs = 4 kcal/g
  // Fat = 9 kcal/g
  const proteinGrams = Math.round(((targetCalories * (proteinPct / 100)) / 4));
  const carbGrams = Math.round(((targetCalories * (carbPct / 100)) / 4));
  const fatGrams = Math.round(((targetCalories * (fatPct / 100)) / 9));

  // Calories per macro
  const proteinCals = proteinGrams * 4;
  const carbCals = carbGrams * 4;
  const fatCals = fatGrams * 9;

  // Copy full summary
  const handleCopySummary = async () => {
    const summary = `🏋️ TDEE & Nutrition Breakdown
----------------------------------
• Gender: ${gender === "male" ? "Male" : "Female"} | Age: ${age}
• Weight: ${unitSystem === "metric" ? `${weightKg} kg` : `${weightLbs} lbs`}
• Height: ${unitSystem === "metric" ? `${heightCm} cm` : `${heightFeet}'${heightInches}"`}
• Activity: ${selectedActivity.label} (${selectedActivity.multiplier}x)
• Goal: ${selectedGoal.name} (${selectedGoal.calorieDeltaPercent > 0 ? `+${selectedGoal.calorieDeltaPercent}%` : `${selectedGoal.calorieDeltaPercent}%`})
----------------------------------
🔥 Basal Metabolic Rate (BMR): ${bmr} kcal
⚡ Total Daily Energy (TDEE): ${tdee} kcal
🎯 Daily Target Calories: ${targetCalories} kcal
⚖️ Body Mass Index (BMI): ${bmi} (${bmiCategory.label})
----------------------------------
🥗 Daily Macronutrient Split:
• Protein: ${proteinGrams}g (${proteinPct}% • ${proteinCals} kcal)
• Carbohydrates: ${carbGrams}g (${carbPct}% • ${carbCals} kcal)
• Fats: ${fatGrams}g (${fatPct}% • ${fatCals} kcal)
• Per Meal (${mealCount} meals): ~${Math.round(targetCalories / mealCount)} kcal | ${Math.round(proteinGrams / mealCount)}g P | ${Math.round(carbGrams / mealCount)}g C | ${Math.round(fatGrams / mealCount)}g F
----------------------------------
Generated via RePlaner Fitness Engine`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const resetDefaults = () => {
    setGender("male");
    setAge(28);
    setWeightKg(75);
    setHeightCm(175);
    setWeightLbs(165);
    setHeightFeet(5);
    setHeightInches(9);
    setActivityId("moderate");
    setGoalId("moderate_cut");
    setMacroPresetId("high_protein");
    setMealCount(3);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header controls: Unit toggle & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Mifflin-St Jeor Metabolic Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex rounded-lg bg-secondary p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleUnitToggle("metric")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                unitSystem === "metric"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle("imperial")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                unitSystem === "imperial"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Imperial (lbs / ft)
            </button>
          </div>

          <button
            type="button"
            onClick={resetDefaults}
            title="Reset to defaults"
            className="p-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN: INPUTS (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Biometrics */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              <span>1. Physical Profile</span>
            </h3>

            {/* Gender Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  gender === "male"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-secondary text-foreground"
                }`}
              >
                Male (+5 MSJ)
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  gender === "female"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-secondary text-foreground"
                }`}
              >
                Female (-161 MSJ)
              </button>
            </div>

            {/* Age, Weight, Height Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Age */}
              <div>
                <label htmlFor={ageId} className="block text-xs font-medium text-muted-foreground mb-1">
                  Age (years)
                </label>
                <input
                  id={ageId}
                  type="number"
                  min="14"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Math.max(14, Math.min(100, parseInt(e.target.value) || 20)))}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Weight */}
              {unitSystem === "metric" ? (
                <div>
                  <label htmlFor={weightKgId} className="block text-xs font-medium text-muted-foreground mb-1">
                    Weight (kg)
                  </label>
                  <input
                    id={weightKgId}
                    type="number"
                    min="30"
                    max="250"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor={weightLbsId} className="block text-xs font-medium text-muted-foreground mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    id={weightLbsId}
                    type="number"
                    min="65"
                    max="550"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Height */}
              {unitSystem === "metric" ? (
                <div>
                  <label htmlFor={heightCmId} className="block text-xs font-medium text-muted-foreground mb-1">
                    Height (cm)
                  </label>
                  <input
                    id={heightCmId}
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-xs font-medium text-muted-foreground mb-1">
                    Height (ft / in)
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      id={heightFtId}
                      aria-label="Height in feet"
                      type="number"
                      min="3"
                      max="7"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
                      className="w-1/2 px-2.5 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="ft"
                    />
                    <input
                      id={heightInId}
                      aria-label="Height in inches"
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                      className="w-1/2 px-2.5 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="in"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Activity Multiplier */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span>2. Activity Multiplier</span>
            </h3>

            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActivityId(act.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    activityId === act.id
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 hover:border-primary/40 bg-background"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>{act.label}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-secondary text-primary font-bold">
                        {act.multiplier}×
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {act.sublabel}
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                      activityId === act.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Goal Selection */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span>3. Target Fitness Goal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FITNESS_GOALS.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = goalId === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setGoalId(goal.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      <IconComponent className={`w-4 h-4 ${goal.color}`} />
                      <span>{goal.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: OUTPUTS & MACROS (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Calorie Output Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-card border border-primary/30 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Daily Calorie Target
                </span>
                <div className="text-4xl font-extrabold text-foreground mt-1 font-mono">
                  {targetCalories.toLocaleString()}{" "}
                  <span className="text-base font-normal text-muted-foreground">kcal/day</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-card border border-border flex items-center gap-1 ${selectedGoal.color}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {selectedGoal.calorieDeltaPercent > 0 ? `+${selectedGoal.calorieDeltaPercent}%` : `${selectedGoal.calorieDeltaPercent}%`}
              </span>
            </div>

            {/* Secondary Stats: BMR, TDEE, BMI */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/80 text-center">
              <div className="p-2 rounded-lg bg-card/60 border border-border/60">
                <span className="text-[11px] text-muted-foreground block">BMR</span>
                <span className="text-sm font-bold text-foreground font-mono">{bmr}</span>
                <span className="text-[10px] text-muted-foreground block">kcal</span>
              </div>
              <div className="p-2 rounded-lg bg-card/60 border border-border/60">
                <span className="text-[11px] text-muted-foreground block">TDEE</span>
                <span className="text-sm font-bold text-foreground font-mono">{tdee}</span>
                <span className="text-[10px] text-muted-foreground block">maintenance</span>
              </div>
              <div className="p-2 rounded-lg bg-card/60 border border-border/60">
                <span className="text-[11px] text-muted-foreground block">BMI</span>
                <span className="text-sm font-bold text-foreground font-mono">{bmi}</span>
                <span className={`text-[10px] font-semibold block ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </span>
              </div>
            </div>
          </div>

          {/* Macro Split Section */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <span>Macronutrient Breakdown</span>
              </h3>
            </div>

            {/* Preset Selector */}
            <div>
              <label htmlFor={macroPresetSelectId} className="block text-xs font-medium text-muted-foreground mb-1">
                Diet / Macro Distribution Preset
              </label>
              <select
                id={macroPresetSelectId}
                value={macroPresetId}
                onChange={(e) => setMacroPresetId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {MACRO_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Sliders if Custom is selected */}
            {macroPresetId === "custom" && (
              <div className="space-y-3 p-3 rounded-xl bg-secondary/40 border border-border text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor={customProteinSliderId} className="font-semibold text-indigo-500">
                      Protein: {customProteinPct}%
                    </label>
                    <span className="text-muted-foreground">{proteinGrams}g</span>
                  </div>
                  <input
                    id={customProteinSliderId}
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={customProteinPct}
                    onChange={(e) => setCustomProteinPct(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor={customCarbSliderId} className="font-semibold text-cyan-500">
                      Carbs: {customCarbPct}%
                    </label>
                    <span className="text-muted-foreground">{carbGrams}g</span>
                  </div>
                  <input
                    id={customCarbSliderId}
                    type="range"
                    min="5"
                    max="70"
                    step="5"
                    value={customCarbPct}
                    onChange={(e) => setCustomCarbPct(parseInt(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor={customFatSliderId} className="font-semibold text-amber-500">
                      Fats: {customFatPct}%
                    </label>
                    <span className="text-muted-foreground">{fatGrams}g</span>
                  </div>
                  <input
                    id={customFatSliderId}
                    type="range"
                    min="10"
                    max="70"
                    step="5"
                    value={customFatPct}
                    onChange={(e) => setCustomFatPct(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                {customProteinPct + customCarbPct + customFatPct !== 100 && (
                  <p className="text-[11px] text-rose-500">
                    Total: {customProteinPct + customCarbPct + customFatPct}% (should equal 100%)
                  </p>
                )}
              </div>
            )}

            {/* Visual Stacked Distribution Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-secondary border border-border">
                <div
                  style={{ width: `${proteinPct}%` }}
                  className="h-full bg-indigo-600 transition-all duration-300"
                  title={`Protein: ${proteinPct}%`}
                />
                <div
                  style={{ width: `${carbPct}%` }}
                  className="h-full bg-cyan-500 transition-all duration-300"
                  title={`Carbs: ${carbPct}%`}
                />
                <div
                  style={{ width: `${fatPct}%` }}
                  className="h-full bg-amber-500 transition-all duration-300"
                  title={`Fats: ${fatPct}%`}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Protein ({proteinPct}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Carbs ({carbPct}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Fats ({fatPct}%)
                </span>
              </div>
            </div>

            {/* Macro Gram Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-xs font-semibold text-indigo-500">Protein</span>
                <div className="text-xl font-bold text-foreground font-mono mt-0.5">
                  {proteinGrams}g
                </div>
                <span className="text-[10px] text-muted-foreground">{proteinCals} kcal</span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-xs font-semibold text-cyan-500">Carbs</span>
                <div className="text-xl font-bold text-foreground font-mono mt-0.5">
                  {carbGrams}g
                </div>
                <span className="text-[10px] text-muted-foreground">{carbCals} kcal</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-semibold text-amber-500">Fats</span>
                <div className="text-xl font-bold text-foreground font-mono mt-0.5">
                  {fatGrams}g
                </div>
                <span className="text-[10px] text-muted-foreground">{fatCals} kcal</span>
              </div>
            </div>

            {/* Meal Distribution Planner */}
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-primary" />
                  Per Meal Target
                </span>
                <label htmlFor={mealCountSelectId} className="sr-only">
                  Number of meals per day
                </label>
                <select
                  id={mealCountSelectId}
                  value={mealCount}
                  onChange={(e) => setMealCount(parseInt(e.target.value))}
                  className="text-xs font-medium px-2 py-1 rounded border border-input bg-background cursor-pointer"
                >
                  <option value={2}>2 Meals/day</option>
                  <option value={3}>3 Meals/day</option>
                  <option value={4}>4 Meals/day</option>
                  <option value={5}>5 Meals/day</option>
                  <option value={6}>6 Meals/day</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>
                  ~<strong className="text-foreground">{Math.round(targetCalories / mealCount)}</strong> kcal
                </span>
                <span>
                  <strong className="text-indigo-500">{Math.round(proteinGrams / mealCount)}g</strong> P
                </span>
                <span>
                  <strong className="text-cyan-500">{Math.round(carbGrams / mealCount)}g</strong> C
                </span>
                <span>
                  <strong className="text-amber-500">{Math.round(fatGrams / mealCount)}g</strong> F
                </span>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Nutrition Summary Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Meal & Macro Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
