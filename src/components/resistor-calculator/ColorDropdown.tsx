"use client";

import React, { useState, useEffect, useRef } from "react";
import { colorsValuesMapping } from "@apps/small-tools/src/constants/resistorCalculator";
import { FiChevronDown } from "react-icons/fi";

// --- Types ---
interface ColorOption {
  color: string;
  value: number | string;
}

interface ColorDropdownProps {
  id: number;
  optionSelected: (id: number, value: number | string) => void;
}

// --- Component ---
const ColorDropdown: React.FC<ColorDropdownProps> = ({
  id,
  optionSelected,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const descriptions: Record<number, string> = {
    1: "Color for the first band",
    2: "Color for the second band",
    3: "Color for the third band",
    4: "Multiplier Color",
    5: "Tolerance Color",
    6: "Temperature Coefficient Color",
  };

  const getBandColors = (bandId: number): ColorOption[] | null => {
    switch (bandId) {
      case 1:
      case 2:
      case 3: {
        const band = colorsValuesMapping.bands.find(
          (b: { colorBand: string }) => b.colorBand === "1"
        );
        return band ? band.colors : null;
      }
      case 4: {
        const band = colorsValuesMapping.bands.find(
          (b: { colorBand: string }) => b.colorBand === "2"
        );
        return band ? band.colors : null;
      }
      case 5: {
        const band = colorsValuesMapping.bands.find(
          (b: { colorBand: string }) => b.colorBand === "3"
        );
        return band ? band.colors : null;
      }
      case 6: {
        const band = colorsValuesMapping.bands.find(
          (b: { colorBand: string }) => b.colorBand === "4"
        );
        return band ? band.colors : null;
      }
      default:
        return null;
    }
  };

  const bandColors = getBandColors(id);

  const getTextColor = (color: string): string => {
    const darkColors = ["Black", "Blue", "Violet", "Green", "Red", "Brown"];
    return darkColors.includes(color) ? "white" : "black";
  };

  // Set initial selected color
  useEffect(() => {
    if (!bandColors) return;
    if (bandColors.length > 0 && !selectedColor) {
      setSelectedColor(bandColors[0]);
      optionSelected(id, bandColors[0].value);
    }
  }, [bandColors]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorSelect = (colorOption: ColorOption) => {
    setSelectedColor(colorOption);
    optionSelected(id, colorOption.value);
    setIsOpen(false);
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label
        htmlFor={`color-select-${id}`}
        className="block text-sm font-bold text-primary-gray"
      >
        {descriptions[id]}:
      </label>
      <div className="relative mt-1">
        <div
          className="mt-1 flex items-center justify-between w-full pl-3 pr-3 py-2 text-base border-primary-gray-300 focus:outline-none border border-black-100 h-11 sm:text-sm rounded-lg cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          id={`color-select-${id}`}
        >
          <span className="flex items-center gap-2">
            {selectedColor && (
              <span
                className="w-3 h-3 rounded-full border border-gray-400"
                style={{ backgroundColor: selectedColor.color.toLowerCase() }}
              ></span>
            )}
            {selectedColor ? selectedColor.color : "Select a color"}
          </span>

          <FiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base focus:outline-none sm:text-sm border border-gray-300">
            {bandColors?.map((colorOption, index) => (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleColorSelect(colorOption)}
                onMouseOver={(e) => {
                  const target = e.target as HTMLDivElement;
                  target.style.backgroundColor =
                    colorOption.color === "primary-gray"
                      ? "gray"
                      : colorOption.color.toLowerCase();
                  target.style.color = getTextColor(colorOption.color);
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLDivElement;
                  target.style.backgroundColor = "";
                  target.style.color = "";
                }}
              >
                {colorOption.color}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorDropdown;
