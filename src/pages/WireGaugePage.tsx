"use client";
import React, { useState, useCallback, JSX } from "react";
import LabeledInput from "@/components/common/form/LabeledInput";
import WireGaugeResult from "@apps/small-tools/src/components/wire-gauge/WireGaugeResult";
import { Card, CardContent } from "@/components/ui/card";
import { FaCalculator } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { LuExpand, LuRefreshCcw } from "react-icons/lu";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdWarningAmber } from "react-icons/md";
import { InputWithLabel } from "@/components/common/form/InputWithLabel";
import wireGaugeChart from "@apps/small-tools/public/wire-gauge-chart.png";

// Types
type Material = "copper" | "aluminum";
type Phases = "single-phase" | "three-phases";
type VoltageUnit = "mV" | "V" | "kV" | "MV";
type CurrentUnit = "µA" | "mA" | "A";
type DistanceUnit = "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi";
type TemperatureUnit = "C" | "F" | "K";

interface VoltageValue {
  value: string;
  unit: VoltageUnit;
}

interface CurrentValue {
  value: string;
  unit: CurrentUnit;
}

interface DistanceValue {
  value: string;
  unit: DistanceUnit;
}

interface TemperatureValue {
  value: string;
  unit: TemperatureUnit;
}

interface FormData {
  material: Material;
  phases: Phases;
  voltage: VoltageValue;
  distance: DistanceValue;
  current: CurrentValue;
  temperature: TemperatureValue;
  voltageDrop: string;
}

interface CalculationResult {
  AWG: number;
  areaMM2: number;
  diameterMM: number;
  resistance: number;
  powerLoss: number;
  currentCapacity: number;
}

interface SelectOption {
  label: string;
  value: string;
}

const INITIAL_STATE: FormData = {
  material: "copper",
  phases: "single-phase",
  voltage: {
    value: "",
    unit: "V",
  },
  distance: {
    value: "",
    unit: "m",
  },
  current: {
    value: "",
    unit: "A",
  },
  temperature: {
    value: "",
    unit: "C",
  },
  voltageDrop: "3",
};

// Unit conversion factors
const VOLTAGE_CONVERSION: Record<VoltageUnit, number> = {
  mV: 0.001,
  V: 1,
  kV: 1000,
  MV: 1000000,
};

const CURRENT_CONVERSION: Record<CurrentUnit, number> = {
  µA: 0.000001,
  mA: 0.001,
  A: 1,
};

const DISTANCE_CONVERSION: Record<DistanceUnit, number> = {
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.34,
};

const TEMPERATURE_CONVERSION: Record<
  TemperatureUnit,
  (value: number) => number
> = {
  C: (value: number) => value,
  F: (value: number) => ((value - 32) * 5) / 9,
  K: (value: number) => value - 273.15,
};

const voltageOptions: SelectOption[] = [
  { label: "milivolts (mV)", value: "mV" },
  { label: "Volts (V)", value: "V" },
  { label: "Kilovolts (kV)", value: "kV" },
  { label: "Megavolts (MV)", value: "MV" },
];

const currentOptions: SelectOption[] = [
  { label: "amperes (A)", value: "A" },
  { label: "milliamperes (mA)", value: "mA" },
  { label: "microamperes (µA)", value: "µA" },
];

const distanceOptions: SelectOption[] = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" },
];

const temperatureOptions: SelectOption[] = [
  { label: "Celsius (°C)", value: "C" },
  { label: "Fahrenheit (°F)", value: "F" },
  { label: "Kelvin (K)", value: "K" },
];

export default function WireGaugePage(): JSX.Element {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMaterialChange = (material: string) => {
    setFormData((prev) => ({ ...prev, material: material as Material }));
    setResult(null);
    setError(null);
  };

  const handlePhasesChange = (phases: string) => {
    setFormData((prev) => ({ ...prev, phases: phases as Phases }));
    setResult(null);
    setError(null);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      temperature: { ...prev.temperature, value: e.target.value },
    }));
    setResult(null);
    setError(null);
  };

  const handleVoltageDropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, voltageDrop: e.target.value }));
    setResult(null);
    setError(null);
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      voltage: { ...prev.voltage, value: e.target.value },
    }));
    setResult(null);
    setError(null);
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      current: { ...prev.current, value: e.target.value },
    }));
    setResult(null);
    setError(null);
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      distance: { ...prev.distance, value: e.target.value },
    }));
    setResult(null);
    setError(null);
  };

  const handleUnitChange = useCallback(
    (field: "voltage" | "current" | "distance" | "temperature") =>
      (newUnit: string) => {
        setFormData((prev) => {
          const currentValue = prev[field].value;
          const currentUnit = prev[field].unit;

          if (!currentValue) {
            return {
              ...prev,
              [field]: {
                ...prev[field],
                unit: newUnit,
              },
            };
          }

          // Convert the value to the new unit
          let convertedValue: number;
          switch (field) {
            case "voltage":
              convertedValue =
                (parseFloat(currentValue) *
                  VOLTAGE_CONVERSION[currentUnit as VoltageUnit]) /
                VOLTAGE_CONVERSION[newUnit as VoltageUnit];
              break;
            case "current":
              convertedValue =
                (parseFloat(currentValue) *
                  CURRENT_CONVERSION[currentUnit as CurrentUnit]) /
                CURRENT_CONVERSION[newUnit as CurrentUnit];
              break;
            case "distance":
              convertedValue =
                (parseFloat(currentValue) *
                  DISTANCE_CONVERSION[currentUnit as DistanceUnit]) /
                DISTANCE_CONVERSION[newUnit as DistanceUnit];
              break;
            case "temperature":
              // First convert to Celsius, then to the new unit
              const celsiusValue = TEMPERATURE_CONVERSION[
                currentUnit as TemperatureUnit
              ](parseFloat(currentValue));
              if (newUnit === "C") {
                convertedValue = celsiusValue;
              } else if (newUnit === "F") {
                convertedValue = (celsiusValue * 9) / 5 + 32;
              } else if (newUnit === "K") {
                convertedValue = celsiusValue + 273.15;
              } else {
                convertedValue = celsiusValue;
              }
              break;
            default:
              convertedValue = parseFloat(currentValue);
          }

          return {
            ...prev,
            [field]: {
              value: convertedValue.toString(),
              unit: newUnit,
            },
          };
        });
        setResult(null);
        setError(null);
      },
    []
  );

  const calculateWireGauge = useCallback(() => {
    try {
      // Convert all values to base units (V, A, m, °C)
      const voltageNum =
        parseFloat(formData.voltage.value) *
        VOLTAGE_CONVERSION[formData.voltage.unit];
      const distanceMeters =
        parseFloat(formData.distance.value) *
        DISTANCE_CONVERSION[formData.distance.unit];
      const currentNum =
        parseFloat(formData.current.value) *
        CURRENT_CONVERSION[formData.current.unit];
      const temperatureCelsius = TEMPERATURE_CONVERSION[
        formData.temperature.unit
      ](parseFloat(formData.temperature.value));
      const voltageDropPercent = parseFloat(formData.voltageDrop);

      // Basic validation
      if (
        isNaN(voltageNum) ||
        isNaN(distanceMeters) ||
        isNaN(currentNum) ||
        isNaN(temperatureCelsius) ||
        isNaN(voltageDropPercent)
      ) {
        throw new Error("Please enter valid numeric values for all fields");
      }

      if (voltageNum <= 0 || distanceMeters <= 0 || currentNum <= 0) {
        throw new Error("Values must be greater than zero");
      }

      // Material resistivity at 20°C (Ω·mm²/m)
      const resistivity20 =
        formData.material === "copper" ? 0.017241 : 0.028265;

      // Temperature coefficient (1/°C)
      const alpha = formData.material === "copper" ? 0.00393 : 0.00403;

      // Calculate resistivity at given temperature
      const resistivityTemp =
        resistivity20 * (1 + alpha * (temperatureCelsius - 20));

      // Allowed voltage drop in volts
      const deltaV = (voltageNum * voltageDropPercent) / 100;

      // Phase factor: 2 for single-phase (round trip), √3 for three-phase
      const phaseFactor = formData.phases === "single-phase" ? 2 : Math.sqrt(3);

      // Calculate cross-sectional area in mm²
      // Formula: A = (ρ * L * I * phaseFactor) / ΔV
      // where:
      // A = cross-sectional area (mm²)
      // ρ = resistivity (Ω·mm²/m)
      // L = length (m)
      // I = current (A)
      // ΔV = voltage drop (V)
      const area =
        (resistivityTemp * distanceMeters * currentNum * phaseFactor) / deltaV;

      // Calculate diameter in mm
      const diameter = 2 * Math.sqrt(area / Math.PI);

      // Convert diameter to AWG using standard formula
      // Formula: AWG = 36 - 39 * log92(d/0.005 inches)
      // Convert diameter from mm to inches for the formula
      const diameterInches = diameter / 25.4;
      const awgFloat =
        36 - (39 * Math.log10(diameterInches / 0.005)) / Math.log10(92);

      // Ensure AWG is non-negative and round to nearest integer
      const AWG = Math.max(0, Math.round(awgFloat));

      // Calculate additional metrics
      // include phaseFactor so R = ρ·L·phaseFactor / A
      const resistance =
        (resistivityTemp * distanceMeters * phaseFactor) / area;
      const powerLoss = currentNum * currentNum * resistance;
      const currentCapacity = Math.sqrt(area * 10); // Simplified ampacity estimation

      setResult({
        AWG,
        areaMM2: parseFloat(area.toFixed(3)),
        diameterMM: parseFloat(diameter.toFixed(3)),
        resistance: parseFloat(resistance.toFixed(4)),
        powerLoss: parseFloat(powerLoss.toFixed(2)),
        currentCapacity: parseFloat(currentCapacity.toFixed(1)),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    }
  }, [formData]);

  const handleReset = useCallback(() => {
    setFormData(INITIAL_STATE);
    setResult(null);
    setError(null);
  }, []);

  const materialOptions = [
    { value: "copper", label: "Copper" },
    { value: "aluminum", label: "Aluminum" },
  ];

  const phaseOptions = [
    { value: "single-phase", label: "Single Phase" },
    { value: "three-phase", label: "Three Phase" },
  ];

  return (
    <div className="flex items-start justify-center flex-col md:flex-row mt-10 gap-6 md:gap-8 lg:gap-10">
      <Card className="flex-1 w-full md:max-w-[600px]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-y-4">
            <InputWithLabel
              id="material"
              label="Wire Material"
              direction="horizontal"
              labelClassName="w-[170px]"
            >
              <Select
                value={formData.material}
                onValueChange={handleMaterialChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  {materialOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWithLabel>
            <InputWithLabel
              id="phases"
              label="Phases"
              direction="horizontal"
              labelClassName="w-[170px]"
            >
              <Select
                value={formData.phases}
                onValueChange={handlePhasesChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  {phaseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWithLabel>
            <LabeledInput
              label="Temperature"
              id="temperature"
              type="number"
              value={formData.temperature.value}
              inputClassName="h-11"
              onChange={handleTemperatureChange}
              placeholder="Enter the temperature"
              adornment={
                <AdornmentSelect
                  adornmentOptions={temperatureOptions}
                  defaultValue={formData.temperature.unit}
                  onValueChange={handleUnitChange("temperature")}
                />
              }
              labelClassName="w-[170px]"
            />
            <LabeledInput
              label="Allowable Voltage Drop"
              id="voltage-drop"
              type="number"
              value={formData.voltageDrop}
              inputClassName="h-11"
              onChange={handleVoltageDropChange}
              placeholder="Enter the voltage drop"
              adornment="%"
              labelClassName="w-[170px]"
            />
            <LabeledInput
              label="Voltage"
              id="voltage"
              type="number"
              value={formData.voltage.value}
              inputClassName="h-11"
              onChange={handleVoltageChange}
              placeholder="Enter the voltage"
              adornment={
                <AdornmentSelect
                  adornmentOptions={voltageOptions}
                  defaultValue={formData.voltage.unit}
                  onValueChange={handleUnitChange("voltage")}
                />
              }
              labelClassName="w-[170px]"
            />
            <LabeledInput
              label="Distance"
              id="distance"
              type="number"
              value={formData.distance.value}
              inputClassName="h-11"
              onChange={handleDistanceChange}
              placeholder="Enter the distance"
              adornment={
                <AdornmentSelect
                  adornmentOptions={distanceOptions}
                  defaultValue={formData.distance.unit}
                  onValueChange={handleUnitChange("distance")}
                />
              }
              labelClassName="w-[170px]"
            />
            <LabeledInput
              label="Current"
              id="current"
              type="number"
              value={formData.current.value}
              inputClassName="h-11"
              onChange={handleCurrentChange}
              placeholder="Enter the current"
              adornment={
                <AdornmentSelect
                  adornmentOptions={currentOptions}
                  defaultValue={formData.current.unit}
                  onValueChange={handleUnitChange("current")}
                />
              }
              labelClassName="w-[170px]"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6 w-full">
            <Button
              type="button"
              onClick={calculateWireGauge}
              className="flex-1 min-w-0"
            >
              <FaCalculator />
              Calculate Wire Gauge
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleReset}
              className="w-[100px] flex-shrink-0"
            >
              <LuRefreshCcw />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 w-full md:max-w-[600px]">
        <CardContent className="p-6">
          {error && (
            <div className="flex flex-col md:flex gap-2 p-3 bg-red-100 pb-3 mb-4">
              <div className="flex flex-col text-red-600 pl-4 pr-4">
                {error}
              </div>
            </div>
          )}

          {result && <WireGaugeResult result={result} />}
          <WireGaugeChart />
          <div className="flex items-start gap-3 p-4 mt-4 rounded-md bg-yellow-100 border-l-4 border-yellow-400 shadow-sm">
            <MdWarningAmber className="text-yellow-600 text-5xl mt-1" />
            <p className="text-xs text-yellow-900">
              <span className="font-semibold tracking-wide">Disclaimer:</span>{" "}
              The results provided are for general informational purposes only
              and should not be considered as professional advice. Always
              consult a licensed electrician before any electrical work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WireGaugeChart(): JSX.Element {
  return (
    <div className="relative group">
      <Image
        src={wireGaugeChart}
        alt="wire-gauge-calculator"
        width={0}
        height={0}
        sizes="100%"
        style={{ width: "100%", height: "auto" }}
        className="object-contain"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="absolute top-4 right-4 group-hover:flex hidden rounded-full items-center justify-center bg-brand-100 text-brand border border-brand/30 size-8 hover:text-white"
          >
            <LuExpand />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-1 w-full aspect-auto sm:max-w-4xl max-h-[70vh] overflow-hidden [&>button]:bg-white [&>button]:size-8 [&>button]:rounded-full [&>button]:opacity-100 [&>button]:flex [&>button]:items-center [&>button]:justify-center">
          <DialogTitle className="hidden">
            Wire Gauge Calculator Chart
          </DialogTitle>
          <Image
            src={wireGaugeChart}
            alt="wire-gauge-calculator"
            width={0}
            height={0}
            sizes="100%"
            style={{ width: "100%", height: "auto" }}
            className="object-contain w-full h-full"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AdornmentSelectProps {
  adornmentOptions: SelectOption[];
  defaultValue: string;
  onValueChange: (value: string) => void;
}

function AdornmentSelect({
  adornmentOptions,
  defaultValue,
  onValueChange,
}: AdornmentSelectProps): JSX.Element {
  return (
    <Select value={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-Poppins flex justify-between items-center px-1.5 min-w-[60px]">
        <SelectValue placeholder="Select a value" asChild>
          <span className="font-Poppins">{defaultValue}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {adornmentOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="font-Poppins "
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
