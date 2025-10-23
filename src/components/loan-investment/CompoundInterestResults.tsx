"use client";

import React, { useState, useEffect } from "react";
import CompoundInterestChart from "./CompoundInterestChart";
import formatToThousands from "@/utils/currency";
import { Card, CardContent } from "@/components/ui/card";

// ---------------- Types ----------------
interface Currency {
  flag: string;
  symbol: string;
  name: string;
}

interface FormState {
  initialInvest: string;
  contribution: string;
  selectedContributionFrequency: keyof typeof frequencyFactors;
  compoundTermYears: string;
  compoundTermMonths: string;
  rate: string;
  selectedCompoundFrequency: keyof typeof frequencyFactors;
  selectedCurrency: Currency;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[] | string[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// frequency factors map type
const frequencyFactors = {
  monthly: 1,
  "3months": 3,
  "6months": 6,
  yearly: 12,
} as const;

// ---------------- Component ----------------
const CompoundInterestResults: React.FC<{ formState: FormState }> = ({
  formState,
}) => {
  const {
    initialInvest,
    contribution,
    selectedContributionFrequency,
    compoundTermYears,
    compoundTermMonths,
    rate,
    selectedCompoundFrequency,
    selectedCurrency,
  } = formState;

  // numeric conversions
  const initialInvestmentAmount = initialInvest ? parseFloat(initialInvest) : 0;
  const additionalContribution = contribution ? parseFloat(contribution) : 0;
  const contributionFrequency =
    frequencyFactors[selectedContributionFrequency] || 0;
  const years = compoundTermYears ? parseFloat(compoundTermYears) : 0;
  const months = compoundTermMonths ? parseFloat(compoundTermMonths) : 0;
  const yearlyRate = rate ? parseFloat(rate) / 100 : 0;
  const compoundFrequency = frequencyFactors[selectedCompoundFrequency] || 0;

  const [totalAmount, setTotalAmount] = useState<number>(
    initialInvestmentAmount
  );
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // ---------------- Calculate Interest ----------------
  function calculateInterest(
    initialInvestmentAmount: number,
    additionalContribution: number,
    contributionFrequency: number,
    years: number,
    months: number,
    yearlyRate: number,
    compoundFrequency: number
  ): number {
    const monthToYear = 12;
    const totalPeriods = years * monthToYear + months;
    let totalInterest = 0;
    let totalInterestPerCompound = 0;
    let currentAmount = initialInvestmentAmount;

    for (let i = 0; i < totalPeriods; i++) {
      const interest = currentAmount * (yearlyRate / monthToYear);

      if (contributionFrequency > 0 && i % contributionFrequency === 0) {
        currentAmount += additionalContribution;
      }

      totalInterest += interest;
      totalInterestPerCompound += interest;

      if (compoundFrequency > 0 && i % compoundFrequency === 0 && i !== 0) {
        currentAmount += totalInterestPerCompound;
        totalInterestPerCompound = 0;
      }
    }

    return totalInterest;
  }

  // ---------------- Compute Totals ----------------
  useEffect(() => {
    const interest = calculateInterest(
      initialInvestmentAmount,
      additionalContribution,
      contributionFrequency,
      years,
      months,
      yearlyRate,
      compoundFrequency
    );

    const monthToYear = 12;
    const totalPeriods = years * monthToYear + months;
    const totalContributions =
      initialInvestmentAmount +
      (contributionFrequency > 0
        ? additionalContribution *
          Math.floor(totalPeriods / contributionFrequency)
        : 0);
    const totalReturn = totalContributions + interest;

    setTotalAmount(totalReturn);
  }, [
    initialInvestmentAmount,
    additionalContribution,
    contributionFrequency,
    years,
    months,
    yearlyRate,
    compoundFrequency,
  ]);

  // ---------------- Chart Data ----------------
  useEffect(() => {
    const newChartData: ChartData = {
      labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
      datasets: [
        {
          label: "Total Amount",
          data: Array.from({ length: years + 1 }, (_, i) => {
            const totalContributions =
              initialInvestmentAmount +
              (contributionFrequency > 0
                ? additionalContribution *
                  Math.floor((i * 12) / contributionFrequency)
                : 0);
            const interest = calculateInterest(
              initialInvestmentAmount,
              additionalContribution,
              contributionFrequency,
              i,
              0,
              yearlyRate,
              compoundFrequency
            );
            return Number((totalContributions + interest).toFixed(2));
          }),
          backgroundColor: "rgba(69, 53, 219, 0.2)",
          borderColor: "rgba(69, 53, 219, 1)",
          borderWidth: 2,
        },
      ],
    };

    setChartData(newChartData);
  }, [
    initialInvestmentAmount,
    additionalContribution,
    contributionFrequency,
    years,
    yearlyRate,
    compoundFrequency,
  ]);

  // ---------------- Render ----------------
  return (
    <Card className="border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden">
      <CardContent className="p-8 max-sm:p-6">
        <h2 className="text-2xl text-center font-bold font-Poppins text-gray-800 mb-8">
          Your Investment Plan
        </h2>

        <div className="flex flex-col gap-4 my-8 font-Poppins px-8 py-4 bg-brand-100 border border-brand-200 rounded-2xl">
          <p className="text-center text-base text-gray-700 font-Poppins tracking-wide">
            Invest{" "}
            <span className="font-semibold text-black-900">
              {selectedCurrency.symbol}
              {formatToThousands(initialInvestmentAmount)}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-black-900">
              {compoundTermYears} years
            </span>{" "}
            and
            <span className="font-semibold text-black-900">
              {" "}
              {months} months
            </span>{" "}
            at
            <span className="font-semibold text-black-900"> {rate}%</span>{" "}
            monthly interest — your return grows to
          </p>

          <div className="text-brand text-xl sm:text-2xl font-semibold text-center">
            {selectedCurrency.symbol}
            {formatToThousands(totalAmount)}
          </div>
        </div>

        <div className="mt-8">
          {chartData && (
            <CompoundInterestChart
              chartData={chartData}
              initialInvestment={initialInvestmentAmount}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompoundInterestResults;
