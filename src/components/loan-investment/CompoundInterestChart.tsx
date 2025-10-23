"use client";

import React from "react";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(...registerables);

// ---------------- Types ----------------
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

interface CompoundInterestChartProps {
  chartData: ChartData;
  initialInvestment: number;
  className?: string;
}

// ---------------- Component ----------------
const CompoundInterestChart: React.FC<CompoundInterestChartProps> = ({
  chartData,
  initialInvestment,
}) => {
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 30,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      point: {
        radius: 2.5,
        hoverRadius: 4,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Poppins",
            size: 14,
            weight: 500,
          },
          color: "#000000",
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      title: {
        display: true,
        text: "Investment Growth Over Time",
        font: {
          family: "Poppins",
          size: 16,
          weight: 600,
        },
        color: "#000000",
        padding: {
          top: 10,
          bottom: 15,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#d1d5db",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `Amount: ${context.parsed.y.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Years",
          padding: 12,
          font: {
            family: "Poppins",
            size: 14,
            weight: 500,
          },
          color: "#000000",
        },
        ticks: {
          color: "#000000",
          font: {
            family: "Poppins",
            size: 12,
          },
        },
        offset: true,
        // grace: "10%",
      },
      y: {
        type: "linear",
        min: initialInvestment,
        grid: {
          color: "#f3f4f6",
        },
        title: {
          display: true,
          text: "Total Amount",
          padding: 12,
          font: {
            family: "Poppins",
            size: 14,
            weight: 500,
          },
          color: "#000000",
        },
        ticks: {
          color: "#000000",
          font: {
            family: "Poppins",
            size: 12,
          },
          callback: (value) =>
            value.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            }),
        },
      },
    },
  };

  return (
    <div className="chart-container bg-white rounded-2xl p-6 h-[500px] w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default CompoundInterestChart;
