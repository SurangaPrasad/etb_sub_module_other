"use client";
import LoanInterestCal from "@apps/small-tools/src/components/loan-investment/LoanInterestCal";
import CompoundInterestCal from "@apps/small-tools/src/components/loan-investment/CompoundInterestCal";
import { useState } from "react";

const LoanAndInvestmentCalPage = () => {
  const [tabId, setTabId] = useState(1);
  return (
    <section className="pt-4">
      <div className="flex items-center justify-start gap-6 text-lg">
        <button
          className={`py-2.5 hover:bg-primary-gray-100 font-medium ${
            tabId === 1 &&
            "border-b-[3px] border-brand text-brand font-semibold"
          }`}
          onClick={() => setTabId(1)}
        >
          Loan Calculator
        </button>
        <button
          className={`py-2.5 hover:bg-primary-gray-100 font-medium ${
            tabId === 2 &&
            "border-b-[3px] border-brand text-brand font-semibold"
          }`}
          onClick={() => setTabId(2)}
        >
          Investment Calculator
        </button>
      </div>
      {tabId === 1 ? <LoanInterestCal /> : <CompoundInterestCal />}
    </section>
  );
};

export default LoanAndInvestmentCalPage;
