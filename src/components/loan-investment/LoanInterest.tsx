import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BsCalculator } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import CurrencyPicker from "@/components/common/CurrencyPicker";
import { InputWithLabel } from "@/components/common/form/InputWithLabel";
import { InputWithUnit } from "@/components/common/form/InputWithUnit";
import { Currency, LoanFormState } from "./LoanInterestCal";

// --- Props type ---
interface LoanInterestProps {
  formState: LoanFormState;
  selectedCurrency: Currency;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  onFieldChange: (field: keyof LoanFormState, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  error: string | null;
}

const LoanInterest = ({
  formState,
  selectedCurrency,
  setSelectedCurrency,
  onFieldChange,
  onSubmit,
  onReset,
  error,
}: LoanInterestProps) => {
  const { loanAmount, loanTermYears, loanTermMonths, loanRate } = formState;

  const handleLoanAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("loanAmount", e.target.value);
    },
    [onFieldChange]
  );

  const handleLoanTermYearsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("loanTermYears", e.target.value);
    },
    [onFieldChange]
  );

  const handleLoanTermMonthsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("loanTermMonths", e.target.value);
    },
    [onFieldChange]
  );

  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange("loanRate", e.target.value);
    },
    [onFieldChange]
  );

  return (
    <Card className="border-gray-200 bg-white shadow-sm flex-shrink-0">
      <CardContent className="p-8 max-sm:p-6">
        <div>
          <form className="w-full space-y-4">
            {/* Loan Amount */}
            <InputWithLabel
              label="Loan Amount :"
              direction="horizontal"
              id="loanAmount"
            >
              <InputWithUnit
                adornment={selectedCurrency.symbol}
                id="loanAmount"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                placeholder="ex: 100,000"
              />
            </InputWithLabel>
            {/* Loan Term */}
            <InputWithLabel
              label="Loan Term :"
              direction="horizontal"
              id="loanTermYears"
            >
              <InputWithUnit
                adornment="Years"
                id="loanTermYears"
                value={loanTermYears}
                onChange={handleLoanTermYearsChange}
                placeholder="ex: 10"
              />
              <InputWithUnit
                adornment="Months"
                id="loanTermMonths"
                value={loanTermMonths}
                onChange={handleLoanTermMonthsChange}
                placeholder="ex: 5"
              />
            </InputWithLabel>
            <InputWithLabel
              label="Interest Rate :"
              direction="horizontal"
              id="loanRate"
            >
              <InputWithUnit
                adornment="%"
                id="loanRate"
                value={loanRate}
                onChange={handleRateChange}
                placeholder="ex: 3"
              />
            </InputWithLabel>
            {/* Currency Picker */}
            <InputWithLabel
              label="Currency :"
              direction="horizontal"
              id="currency"
            >
              <CurrencyPicker
                setSelectedCurrency={setSelectedCurrency}
                selectedCurrency={selectedCurrency}
                width="full"
              />
            </InputWithLabel>
            {error && <p className="text-red-500 text-[14px] mt-2">{error}</p>}
          </form>
          <div className="flex justify-end gap-2 pt-10 w-full">
            <Button type="button" onClick={onSubmit} className="flex-1 min-w-0">
              <BsCalculator className="text-lg" />
              Calculate loan
            </Button>
            <Button
              variant="brand-outline"
              type="button"
              onClick={onReset}
              className="text-black-900 hover:text-black-900 hover:bg-brand-100 border-gray-300 w-[100px] flex-shrink-0"
            >
              <LuRefreshCcw className="text-lg" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default LoanInterest;
