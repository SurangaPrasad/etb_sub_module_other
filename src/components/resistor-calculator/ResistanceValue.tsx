import React from "react";
import { BandColors } from "@apps/small-tools/src/pages/ResistorCalPage";

function formatResistance(resistance: number) {
  if (resistance >= 1e9) {
    return (resistance / 1e9).toFixed(2) + " GΩ";
  } else if (resistance >= 1e6) {
    return (resistance / 1e6).toFixed(2) + " MΩ";
  } else if (resistance >= 1e3) {
    return (resistance / 1e3).toFixed(2) + " kΩ";
  } else {
    return resistance.toFixed(2) + " Ω";
  }
}

interface ResistanceValueProps {
  values: BandColors;
  bandCount: number;
}

function ResistanceValue(props: ResistanceValueProps) {
  let resistance = 0;
  let tolerance = "";
  let temperatureCoefficient = "";

  const values = Object.fromEntries(
    Object.entries(props.values).map(([key, value]) => [
      key,
      key !== "5" && key !== "6" ? parseInt(value, 10) : value,
    ])
  );

  if (props.bandCount === 3) {
    resistance = (values[1] * 10 + values[2]) * Math.pow(10, values[4]);
  } else if (props.bandCount === 4) {
    resistance = (values[1] * 10 + values[2]) * Math.pow(10, values[4]);
    tolerance = ` with ${values[5]}% tolerance`;
  } else if (props.bandCount === 5) {
    resistance =
      (values[1] * 100 + values[2] * 10 + values[3]) * Math.pow(10, values[4]);
    tolerance = ` with ${values[5]}% tolerance`;
  } else if (props.bandCount === 6) {
    resistance =
      (values[1] * 100 + values[2] * 10 + values[3]) * Math.pow(10, values[4]);
    tolerance = ` with ${values[5]}% tolerance`;
    temperatureCoefficient = ` and ${values[6]} ppm/K temperature coefficient`;
  } else {
    return "Invalid number of color bands";
  }

  return (
    <div className="pl-4 pr-4 w-full text-center rounded-lg">
      {/*bg-primary-green-100 mt-6 rounded-lg p-4 border border-primary-green-500*/}
      <h2 className="text-normal tracking-wide font-medium mb-4 bg-brand-900 p-1 text-white">
        Resistance Value
      </h2>
      <p className="text-2xl font-semibold">
        {formatResistance(resistance)}
        {tolerance}
        {temperatureCoefficient}
      </p>
    </div>
  );
}

export default ResistanceValue;
