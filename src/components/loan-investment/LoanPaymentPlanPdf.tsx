"use client";

import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { LuDownload, LuLoader } from "react-icons/lu";
import formatToThousands from "@/utils/currency";

// ---------- Types ----------
interface LoanPaymentPlanPdfProps {
  interestPayments: number[];
  capitalPayments: number[];
  currencySymbol: string;
  loanAmount: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PaymentsPdfDownloadButtonProps extends LoanPaymentPlanPdfProps {}

// ---------- Styles ----------
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 12,
  },
});

const getTableStyles = (color: string) =>
  StyleSheet.create({
    table: {
      width: "100%",
      fontSize: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #EDEDED",
      backgroundColor: "#F7F7F7",
    },
    tableBottomRow: {
      flexDirection: "row",
      borderTop: "1px solid #D3D3D3",
      backgroundColor: "#F7F7F7",
      fontSize: 11,
    },
    tableHeader: {
      flexDirection: "row",
      borderBottom: "1px solid #EDEDED",
      backgroundColor: color,
    },
    smallHeaderCell: {
      color: "#FFF",
      padding: 8,
      width: 100,
      textAlign: "center" as const,
    },
    tableHeaderCell: {
      color: "#FFF",
      padding: 8,
      flex: 1,
      textAlign: "center" as const,
    },
    tableHeaderCellDeductionsLeft: {
      color: "#FFF",
      padding: 8,
      flex: 1,
      textAlign: "left" as const,
    },
    tableHeaderCellDeductionsRight: {
      color: "#FFF",
      padding: 8,
      flex: 1,
      textAlign: "right" as const,
    },
    smallCell: {
      padding: 8,
      width: 100,
      color: "#64666E",
      textAlign: "center" as const,
    },
    tableCell: {
      padding: 8,
      flex: 1,
      color: "#64666E",
      textAlign: "center" as const,
    },
    tableCellLeft: {
      padding: 8,
      flex: 1,
      color: "#64666E",
      textAlign: "left" as const,
    },
    tableCellRight: {
      padding: 8,
      flex: 1,
      color: "#64666E",
      textAlign: "right" as const,
    },
  });

// ---------- PDF Component ----------
const LoanPaymentPlanPdf: React.FC<LoanPaymentPlanPdfProps> = ({
  interestPayments,
  capitalPayments,
  currencySymbol,
  loanAmount,
}) => {
  const [tableStyles] = useState(getTableStyles("#489CF7"));

  return (
    <Document>
      <Page style={styles.page}>
        <View style={tableStyles.table}>
          {/* Header */}
          <View style={tableStyles.tableHeader}>
            <Text style={tableStyles.smallHeaderCell}>INSTALLMENT</Text>
            <Text style={tableStyles.tableHeaderCell}>
              INTEREST PAYMENT ({currencySymbol})
            </Text>
            <Text style={tableStyles.tableHeaderCell}>
              CAPITAL PAYMENT ({currencySymbol})
            </Text>
            <Text style={tableStyles.tableHeaderCell}>
              CAPITAL OUTSTANDING ({currencySymbol})
            </Text>
          </View>

          {/* Rows */}
          {interestPayments.map((item, index) => {
            const remainCapital =
              loanAmount -
              capitalPayments
                .slice(0, index + 1)
                .reduce((acc, curr) => acc + curr, 0);

            return (
              <View style={tableStyles.tableRow} key={index}>
                <Text style={tableStyles.smallCell}>{index + 1}</Text>
                <Text style={tableStyles.tableCell}>
                  {formatToThousands(item)}
                </Text>
                <Text style={tableStyles.tableCell}>
                  {formatToThousands(capitalPayments[index])}
                </Text>
                <Text style={tableStyles.tableCell}>
                  {formatToThousands(remainCapital)}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

// ---------- Download Button ----------
export const PaymentsPdfDownloadButton: React.FC<
  PaymentsPdfDownloadButtonProps
> = (props) => {
  return (
    <PDFDownloadLink
      document={<LoanPaymentPlanPdf {...props} />}
      fileName="loan-payment-plan.pdf"
      className="text-brand font-semibold flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
    >
      {({ loading }: { loading: boolean }) => (
        <span className="flex items-center gap-2">
          {loading ? (
            <LuLoader className="text-lg" />
          ) : (
            <LuDownload className="text-xl stroke-[2.5]" />
          )}
          Download PDF
        </span>
      )}
    </PDFDownloadLink>
  );
};
