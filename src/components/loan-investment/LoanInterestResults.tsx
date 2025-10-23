import formatToThousands from "@/utils/currency";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HiOutlineClipboardList } from "react-icons/hi";

interface FormState {
  selectedCurrency: {
    symbol: string;
  };
  loanAmount: string;
  loanTermYears: string;
  loanTermMonths: string;
  loanRate: string;
}

interface LoanInterestResultsProps {
  formState: FormState;
  setTableData: React.Dispatch<
    React.SetStateAction<{
      showTable: boolean;
      totalPages: number;
      interestPayments: number[];
      capitalPayments: number[];
    } | null>
  >;
}

const LoanInterestResults = ({
  formState,
  setTableData,
}: LoanInterestResultsProps) => {
  const {
    selectedCurrency,
    loanAmount,
    loanTermYears,
    loanTermMonths,
    loanRate,
  } = formState;

  const frequencyFactors = {
    monthly: 1,
    "3months": 3,
    "6months": 6,
    yearly: 12,
  };

  const loanValue = loanAmount ? parseFloat(loanAmount) : 0;
  const years = loanTermYears ? parseFloat(loanTermYears) : 0;
  const months = loanTermMonths ? parseFloat(loanTermMonths) : 0;
  const yearlyRate = loanRate ? parseFloat(loanRate) / 100 : 0;
  const paybackCategory = "amortized"; // Adjust category as needed

  const monthToYear = 12;
  const totalPeriods = years * monthToYear + months;

  let monthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  const interestPayments: number[] = [];
  const capitalPayments: number[] = [];

  let totalPages = 1;

  if (paybackCategory === "amortized") {
    const monthlyInterestRate = yearlyRate / monthToYear;
    let loanBalance = loanValue;
    const interestFactor = Math.pow(1 + monthlyInterestRate, totalPeriods);

    // Calculate the monthly payment
    monthlyPayment =
      (loanValue * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -totalPeriods));
    totalPayment = monthlyPayment * totalPeriods;

    // Initialize arrays to store the monthly payments for interest and deduction of capital

    for (let i = 0; i < totalPeriods; i++) {
      const interestPayment = loanBalance * monthlyInterestRate;
      const capitalPayment = monthlyPayment - interestPayment;
      loanBalance -= capitalPayment;

      interestPayments.push(interestPayment);
      capitalPayments.push(capitalPayment);
    }

    // Calculate the total interest and capital payments
    totalInterest = interestPayments.reduce((acc, curr) => acc + curr, 0);
    const totalCapital = capitalPayments.reduce((acc, curr) => acc + curr, 0);
    totalPages = Math.ceil(interestPayments.length / 20);
  } else if (paybackCategory === "deferred") {
    // https://www.omnicalculator.com/finance/deferred-payment-loan
    totalPayment =
      loanValue * Math.pow(1 + yearlyRate / monthToYear, totalPeriods);
    totalInterest = totalPayment - loanValue;
    monthlyPayment = totalPayment / totalPeriods;
  } else if (paybackCategory === "bond") {
    totalPayment =
      loanValue / Math.pow(1 + yearlyRate / monthToYear, totalPeriods);
    totalInterest = loanValue - totalPayment;
    monthlyPayment = totalPayment / totalPeriods;
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardContent className="p-6 max-sm:p-4">
        <h2 className="text-xl text-center font-semibold font-Poppins mb-2">
          Your Loan Plan
        </h2>

        <div className="flex flex-col gap-3 w-full justify-center items-center p-6 font-Poppins">
          <p className="text-brand-900 font-bold text-5xl">
            <span>{selectedCurrency.symbol}</span>{" "}
            {formatToThousands(monthlyPayment.toString())}
          </p>
          <p className="text-black-600">Your Monthly Payment</p>
        </div>
        <div className="border-t border-gray-400 mt-4 py-3 font-Poppins text-black px-16">
          <div className="flex justify-between">
            <p className="font-medium">Total Payment :</p>
            <p>
              {selectedCurrency.symbol}{" "}
              {formatToThousands(totalPayment.toString())}
            </p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="font-medium">Total Interest :</p>
            <p>
              {selectedCurrency.symbol}{" "}
              {formatToThousands(totalInterest.toString())}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() =>
              setTableData({
                showTable: true,
                interestPayments,
                capitalPayments,
                totalPages,
              })
            }
            className="flex items-center gap-2 text-brand hover:text-brand-300 font-semibold text-sm sm:text-base transition"
          >
            <HiOutlineClipboardList className="text-xl font-semibold mb-1" />
            Click to view the payment schedule
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanInterestResults;
