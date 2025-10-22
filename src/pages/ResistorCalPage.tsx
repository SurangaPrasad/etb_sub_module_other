"use client";

import React, { useState } from "react";
import ColorSelector from "@apps/small-tools/src/components/resistor-calculator/ColorSelector";
import ResistanceValue from "@apps/small-tools/src/components/resistor-calculator/ResistanceValue";
import ResistorImage from "@apps/small-tools/src/components/resistor-calculator/ResistorImage";
import { FaCalculator } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import DropDown from "../components/resistor-calculator/DropDown";

// --- Type definitions ---
export interface BandColors {
  [key: number]: string;
}

const ResistorCal: React.FC = () => {
  const [colorBands, setColorBands] = useState<number>(5);
  const [buttonClicked, setButtonClicked] = useState<boolean | null>(null);
  const [bandColors, setBandColors] = useState<BandColors>({
    1: "0",
    2: "0",
    3: "0",
    4: "0",
    5: "0",
    6: "0",
  });

  // Handle change in number of color bands
  function handleColorBandsChange(value: string) {
    const parsedValue = parseInt(value, 10);
    setColorBands(parsedValue);
    // Optionally reset band colors if needed
    // setBandColors(getDefaultBandColors(parsedValue));
  }

  // Handle color selection from dropdown
  function handleBandChange(bandId: number, value: number | string) {
    setButtonClicked(false);
    setBandColors((prevValue) => ({
      ...prevValue,
      [bandId]: value.toString(),
    }));
  }

  function handleClick() {
    setButtonClicked(true);
  }

  return (
    <div className="flex items-start justify-center flex-col md:flex-row mt-10 gap-6 md:gap-8 lg:gap-10">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 flex-1 font-Mulish w-full">
        <DropDown
          colorBands={colorBands}
          optionSelected={handleColorBandsChange}
        />

        <ColorSelector
          colorBands={colorBands}
          optionSelected={handleBandChange}
        />

        <Button onClick={handleClick} className="mt-10 w-full">
          <FaCalculator />
          Calculate the Resistance
        </Button>
      </div>

      <div className="flex flex-col items-center flex-1 w-full p-6 space-y-4 rounded-lg shadow-sm border border-gray-200 bg-white">
        {buttonClicked && (
          <div className="w-[90%] mb-4">
            <ResistanceValue bandCount={colorBands} values={bandColors} />
          </div>
        )}
        <div className="w-[90%]">
          <ResistorImage bandCount={colorBands} />
        </div>
      </div>
    </div>
  );
};

export default ResistorCal;
