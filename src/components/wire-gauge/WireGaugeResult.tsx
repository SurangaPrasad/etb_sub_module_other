import React from "react";

export default function WireGaugeResult({ result }) {
  return (
    <div className="flex justify-between mb-4 pl-7 pr-7">
      <div className="flex flex-col ">
        <p className="text-black-900 text-sm mb-1">Wire gauge:</p>
        <p className="flex flex-col text-brand font-semibold text-2xl">
          {result.AWG} AWG
        </p>
      </div>
      <div className="flex flex-col ">
        <p className="text-black-900 text-sm mb-1">Cross-sectional Area:</p>
        <p className="flex flex-col text-brand font-semibold text-2xl">
          {result.areaMM2} mm²
        </p>
      </div>
      <div className="flex flex-col ">
        <p className="text-black-900 text-sm mb-1">Diameter:</p>
        <p className="flex flex-col text-brand font-semibold text-2xl">
          {result.diameterMM} mm
        </p>
      </div>
    </div>
  );
}
