"use client";

import React, { useCallback, useState } from "react";
import CompoundInterest from "./CompoundInterst";
import CompoundInterestResults from "./CompoundInterestResults";
import { defaultCurrency, TCurrency } from "@/components/common/CurrencyPicker";
import PlaceholderCard from "./PlaceholderCard";

// ---------------- Types ----------------

export type Frequency = "monthly" | "3months" | "6months" | "yearly";

export interface CompoundFormState {
  initialInvest: string;
  contribution: string;
  selectedContributionFrequency: Frequency;
  compoundTermYears: string;
  compoundTermMonths: string;
  rate: string;
  selectedCompoundFrequency: Frequency;
}

interface SubmittedCompoundFormState extends CompoundFormState {
  selectedCurrency: TCurrency;
}

const CompoundInterestCalculator: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] =
    useState<TCurrency>(defaultCurrency);

  const [formState, setFormState] = useState<CompoundFormState>({
    initialInvest: "",
    contribution: "",
    selectedContributionFrequency: "monthly",
    compoundTermYears: "",
    compoundTermMonths: "",
    rate: "",
    selectedCompoundFrequency: "monthly",
  });

  const [submitedFormState, setSubmitedFormState] =
    useState<SubmittedCompoundFormState>({
      selectedCurrency: defaultCurrency,
      initialInvest: "",
      contribution: "",
      selectedContributionFrequency: "monthly",
      compoundTermYears: "",
      compoundTermMonths: "",
      rate: "",
      selectedCompoundFrequency: "monthly",
    });

  const [showResults, setShowResults] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFieldChange = useCallback(
    (field: keyof CompoundFormState, value: string) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
      setError(""); // Clear error when user makes changes
    },
    []
  );

  const handleCompoundFormSubmit = useCallback(() => {
    if (
      !formState.initialInvest ||
      !formState.rate ||
      (!formState.compoundTermYears && !formState.compoundTermMonths)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitedFormState({
      selectedCurrency,
      ...formState,
    });
    setShowResults(true);
    setError("");
  }, [formState, selectedCurrency]);

  const resetData = useCallback(() => {
    setSelectedCurrency(defaultCurrency);
    setFormState({
      initialInvest: "",
      contribution: "",
      selectedContributionFrequency: "monthly",
      compoundTermYears: "",
      compoundTermMonths: "",
      rate: "",
      selectedCompoundFrequency: "monthly",
    });
    setShowResults(false);
    setError("");
  }, []);

  return (
    <div className="relative pt-6">
      <div className="font-medium text-brand-800 bg-[#f6e0ff] px-4 py-2 rounded-sm text-[14px] tracking-wide w-max">
        <p className="font-Poppins m-0">
          Planning an investment? Enter details and calculate your returns
          graphically over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-4">
        <CompoundInterest
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          onFormSubmit={handleCompoundFormSubmit}
          formState={formState}
          onFieldChange={handleFieldChange}
          resetForm={resetData}
          error={error}
        />
        {showResults ? (
          <CompoundInterestResults formState={submitedFormState} />
        ) : (
          <PlaceholderCard />
        )}
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
