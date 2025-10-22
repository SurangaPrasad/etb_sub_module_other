import React from "react";

interface DropDownProps {
  colorBands: number;
  optionSelected: (value: string) => void;
}

function DropDown(props: DropDownProps) {
  return (
    <div className="dropdown mb-6 flex items-center gap-4">
      <label htmlFor="color-bands" className="font-bold text-xl">
        Number of Color Bands:
      </label>
      <select
        id="color-bands"
        value={props.colorBands}
        onChange={(e) => {
          props.optionSelected(e.target.value);
        }}
        className="rounded-lg px-4 text- text-black w-auto border border-black-100 pr-9 placeholder:text-primary-gray/70 font-medium"
      >
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
    </div>
  );
}

export default DropDown;
