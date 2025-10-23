import CurrencyPicker, { TCurrency } from "@/components/common/CurrencyPicker";
import React from "react";
// import LabeledInput from "../common/form/LabelInput";
// import TextInputWithUnit from "../common/form/TextInputWithUnit";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BsCalculator } from "react-icons/bs";
import { LuRefreshCcw } from "react-icons/lu";
import { InputWithLabel } from "@/components/common/form/InputWithLabel";
import { InputWithUnit } from "@/components/common/form/InputWithUnit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompoundFormState } from "./CompoundInterestCal";

// --- Types ---

interface CompoundInterestProps {
  selectedCurrency: TCurrency;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<TCurrency>>;
  onFormSubmit: () => void;
  formState: CompoundFormState;
  onFieldChange: (field: keyof CompoundFormState, value: string) => void;
  resetForm: () => void;
  error: string;
}

const CompoundInterst = ({
  selectedCurrency,
  setSelectedCurrency,
  onFormSubmit,
  formState,
  onFieldChange,
  resetForm,
  error,
}: CompoundInterestProps) => {
  const {
    initialInvest,
    contribution,
    selectedContributionFrequency,
    compoundTermYears,
    compoundTermMonths,
    rate,
    selectedCompoundFrequency,
  } = formState;

  return (
    <Card className="border-gray-200 bg-white shadow-sm flex-shrink-0">
      <CardContent className="p-8 max-sm:p-6">
        <form className="w-full space-y-4">
          <InputWithLabel
            label="Initial investment :"
            id="initialInvest"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <InputWithUnit
              id="initialInvest"
              placeholder="ex: 100,000"
              value={initialInvest}
              onChange={(e) => onFieldChange("initialInvest", e.target.value)}
              adornment={selectedCurrency.symbol}
            />
          </InputWithLabel>
          <InputWithLabel
            label="Contribution :"
            id="contribution"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <div className="flex items-center gap-3 w-full">
              <InputWithUnit
                id="contribution"
                placeholder="ex: 100"
                value={contribution}
                onChange={(e) => onFieldChange("contribution", e.target.value)}
                required={true}
                adornment={selectedCurrency.symbol}
              />
              <Select
                value={selectedContributionFrequency}
                onValueChange={(value) =>
                  onFieldChange("selectedContributionFrequency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </InputWithLabel>
          <InputWithLabel
            label="Period that plan to save :"
            id="loanTermYears"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <div className="flex items-center gap-3 w-full">
              <InputWithUnit
                id="loanTermYears"
                placeholder="ex: 10"
                value={compoundTermYears}
                onChange={(e) =>
                  onFieldChange("compoundTermYears", e.target.value)
                }
                required={true}
                adornment="Years"
              />
              <InputWithUnit
                id="loanTermMonths"
                placeholder="ex: 5"
                value={compoundTermMonths}
                onChange={(e) =>
                  onFieldChange("compoundTermMonths", e.target.value)
                }
                required={true}
                adornment="Months"
              />
            </div>
          </InputWithLabel>
          <InputWithLabel
            label="Estimated Interest Rate :"
            id="rate"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <InputWithUnit
              id="rate"
              placeholder="ex: 1.5"
              value={rate}
              onChange={(e) => onFieldChange("rate", e.target.value)}
              required={true}
              adornment="%"
            />
          </InputWithLabel>
          <InputWithLabel
            label="Compound Frequency :"
            id="compoundFrequency"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <Select
              value={selectedCompoundFrequency}
              onValueChange={(value) =>
                onFieldChange("selectedCompoundFrequency", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="3months">Quarterly</SelectItem>
                <SelectItem value="6months">Per Six months</SelectItem>
                <SelectItem value="yearly">Annually</SelectItem>
              </SelectContent>
            </Select>
          </InputWithLabel>
          <InputWithLabel
            label="Currency :"
            id="currency"
            direction="horizontal"
            labelClassName="w-full max-w-[180px]"
          >
            <CurrencyPicker
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              width="full"
            />
          </InputWithLabel>

          {error && <p className="text-red-500 text-[14px] mt-2">{error}</p>}
          <div className="pt-10">
            <div className="flex justify-end gap-2 w-full">
              <Button
                type="button"
                onClick={onFormSubmit}
                className="flex-1 min-w-0"
              >
                <BsCalculator className="text-lg" />
                Calculate returns
              </Button>
              <Button
                onClick={resetForm}
                type="button"
                variant="brand-outline"
                className="text-black-900 hover:text-black-900 hover:bg-brand-100 border-gray-300 w-[100px] flex-shrink-0"
              >
                <LuRefreshCcw className="text-lg" />
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default CompoundInterst;
