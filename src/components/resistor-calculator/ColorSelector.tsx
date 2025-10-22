"use client";

import React from "react";
import ColorDropdown from "./ColorDropdown";

// --- Props type ---
interface ColorSelectorProps {
  colorBands: number; // e.g. 3, 4, 5, or 6
  optionSelected: (id: number, value: number | string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colorBands,
  optionSelected,
}) => {
  const colorBandMapping: Record<number, number[]> = {
    3: [1, 2, 4],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
  };

  const renderColorSelectors = () => {
    const bandIds = colorBandMapping[colorBands] || [];
    return bandIds.map((id) => (
      <ColorDropdown key={id} id={id} optionSelected={optionSelected} />
    ));
  };

  return <div>{renderColorSelectors()}</div>;
};

export default ColorSelector;
