"use client";

import React, { useCallback, useState } from "react";
import LoanInterest from "./LoanInterest";
import LoanInterestResults from "./LoanInterestResults";
import { defaultCurrency } from "@/components/common/CurrencyPicker";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PaymentsPdfDownloadButton } from "./LoanPaymentPlanPdf";
import formatToThousands from "@/utils/currency";
import PlaceholderCard from "./PlaceholderCard";

// ---------------- Types ----------------
export interface Currency {
  flag: string;
  symbol: string;
  name: string;
}

export interface LoanFormState {
  loanAmount: string;
  loanTermYears: string;
  loanTermMonths: string;
  loanRate: string;
}

interface SubmittedFormState extends LoanFormState {
  selectedCurrency: Currency;
}

interface TableData {
  showTable: boolean;
  totalPages: number;
  interestPayments: number[];
  capitalPayments: number[];
}

interface PaymentPlanProps {
  interestPayments: number[];
  totalPages: number;
  capitalPayments: number[];
  currencySymbol: string;
  loanAmount: number;
}

// ---------------- Main Component ----------------
const LoanInterestCalculator: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(defaultCurrency);
  const [formState, setFormState] = useState<LoanFormState>({
    loanAmount: "",
    loanTermYears: "",
    loanTermMonths: "",
    loanRate: "",
  });
  const [submittedFormState, setSubmittedFormState] =
    useState<SubmittedFormState>({
      selectedCurrency: defaultCurrency,
      loanAmount: "",
      loanTermYears: "",
      loanTermMonths: "",
      loanRate: "",
    });
  const [showResults, setShowResults] = useState(false);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState("");

  const handleFieldChange = useCallback(
    (field: keyof LoanFormState, value: string) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
      setError("");
    },
    []
  );

  const handleSubmit = () => {
    if (
      !formState.loanAmount ||
      !formState.loanRate ||
      (!formState.loanTermYears && !formState.loanTermMonths)
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmittedFormState({
      selectedCurrency,
      loanAmount: formState.loanAmount,
      loanTermYears: formState.loanTermYears,
      loanTermMonths: formState.loanTermMonths,
      loanRate: formState.loanRate,
    });

    setShowResults(true);
    setError("");
  };

  const resetLoanData = useCallback(() => {
    setSelectedCurrency(defaultCurrency);
    setFormState({
      loanAmount: "",
      loanTermYears: "",
      loanTermMonths: "",
      loanRate: "",
    });
    setShowResults(false);
    setTableData(null);
    setError("");
  }, []);

  return (
    <div className="relative pt-6">
      <div className="font-medium text-brand-800 bg-[#f6e0ff] px-4 py-2 rounded-sm text-[14px] tracking-wide w-max">
        <p className="font-Poppins p-0 m-0">
          Planning a loan? Enter details to calculate and view your installment
          plan, interest, and total payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 pb-6">
        <LoanInterest
          formState={formState}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onReset={resetLoanData}
          error={error}
        />

        {showResults ? (
          <LoanInterestResults
            formState={submittedFormState}
            setTableData={setTableData}
          />
        ) : (
          <PlaceholderCard />
        )}
      </div>

      {tableData?.showTable && (
        <PaymentPlan
          interestPayments={tableData.interestPayments}
          totalPages={tableData.totalPages}
          capitalPayments={tableData.capitalPayments}
          currencySymbol={selectedCurrency.symbol}
          loanAmount={Number(formState.loanAmount)}
        />
      )}
    </div>
  );
};

export default LoanInterestCalculator;

// ---------------- PaymentPlan Component ----------------
const PaymentPlan: React.FC<PaymentPlanProps> = ({
  interestPayments,
  totalPages,
  capitalPayments,
  currencySymbol,
  loanAmount,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <PaymentsPdfDownloadButton
          interestPayments={interestPayments}
          capitalPayments={capitalPayments}
          currencySymbol={currencySymbol}
          loanAmount={loanAmount}
        />
      </div>

      <div className="relative w-full overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full table-auto text-sm text-center text-gray-700 font-Poppins">
          <thead className="bg-gray-100 text-brand-900 text-[13px] uppercase font-semibold tracking-wide">
            <tr>
              <th className="px-6 py-3 font-semibold">Installment</th>
              <th className="px-6 py-3 font-semibold">
                Interest Payment ({currencySymbol})
              </th>
              <th className="px-6 py-3 font-semibold">
                Capital Payment ({currencySymbol})
              </th>
              <th className="px-6 py-3 font-semibold">
                Capital Outstanding ({currencySymbol})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {interestPayments
              .slice((currentPage - 1) * 10, currentPage * 10)
              .map((interestPayment, index) => {
                const globalIndex = (currentPage - 1) * 10 + index;
                const remainCapital =
                  loanAmount -
                  capitalPayments
                    .slice(0, globalIndex + 1)
                    .reduce((acc, curr) => acc + curr, 0);

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {globalIndex + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatToThousands(interestPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatToThousands(capitalPayments[globalIndex])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatToThousands(remainCapital)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white text-base text-gray-600 font-medium">
          <button
            className="flex items-center gap-1 text-brand hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <LuChevronLeft className="text-lg" />
            Previous
          </button>
          <button
            className="flex items-center gap-1 text-brand hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <LuChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};
