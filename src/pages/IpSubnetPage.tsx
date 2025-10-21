"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Loader from "@/components/loaders/IconLoading";

import { LuCheck, LuCopy, LuDownload } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { FaCalculator, FaEraser, FaBook } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateSubnet,
  processBatchData,
} from "@apps/small-tools/src/utils/ipSubnetCalculator";
import Article from "@apps/small-tools/src/components/ipSubnet/Article";
import { FaArrowLeft } from "react-icons/fa";
import { Combobox } from "@/components/ui/combobox";

type OptionType = { value: string; label: string };
export interface ResultData {
  [key: string]: string | number;
}

// Add subnet mask options for IPv4 (sorted in descending order)
const ipv4Options: OptionType[] = [
  { value: "255.255.255.255", label: "255.255.255.255 (/32)" },
  { value: "255.255.255.254", label: "255.255.255.254 (/31)" },
  { value: "255.255.255.252", label: "255.255.255.252 (/30)" },
  { value: "255.255.255.248", label: "255.255.255.248 (/29)" },
  { value: "255.255.255.240", label: "255.255.255.240 (/28)" },
  { value: "255.255.255.224", label: "255.255.255.224 (/27)" },
  { value: "255.255.255.192", label: "255.255.255.192 (/26)" },
  { value: "255.255.255.128", label: "255.255.255.128 (/25)" },
  { value: "255.255.255.0", label: "255.255.255.0 (/24)" },
  { value: "255.255.254.0", label: "255.255.254.0 (/23)" },
  { value: "255.255.252.0", label: "255.255.252.0 (/22)" },
  { value: "255.255.248.0", label: "255.255.248.0 (/21)" },
  { value: "255.255.240.0", label: "255.255.240.0 (/20)" },
  { value: "255.255.224.0", label: "255.255.224.0 (/19)" },
  { value: "255.255.192.0", label: "255.255.192.0 (/18)" },
  { value: "255.255.128.0", label: "255.255.128.0 (/17)" },
  { value: "255.255.0.0", label: "255.255.0.0 (/16)" },
  { value: "255.254.0.0", label: "255.254.0.0 (/15)" },
  { value: "255.252.0.0", label: "255.252.0.0 (/14)" },
  { value: "255.248.0.0", label: "255.248.0.0 (/13)" },
  { value: "255.240.0.0", label: "255.240.0.0 (/12)" },
  { value: "255.224.0.0", label: "255.224.0.0 (/11)" },
  { value: "255.192.0.0", label: "255.192.0.0 (/10)" },
  { value: "255.128.0.0", label: "255.128.0.0 (/9)" },
  { value: "255.0.0.0", label: "255.0.0.0 (/8)" },
];

const IPSubnetPage = () => {
  const [mainTab, setMainTab] = useState<"calculator" | "article">(
    "calculator"
  ); // "calculator" or "article"
  const [tab, setTab] = useState<1 | 2>(1);
  // Single Entry
  const [ipAddress, setIpAddress] = useState<string>("");
  const [subnetMask, setSubnetMask] = useState<string>("/64"); // Default IPv6 subnet
  const [ipVersion, setIpVersion] = useState<"ipv4" | "ipv6">("ipv4"); // Default to IPv4
  // Multiple Entry
  const [file, setFile] = useState<File | null>(null);
  // Calculating
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  // Result
  const [result, setResult] = useState<ResultData | null>(null);
  const [batchResultData, setBatchResult] = useState<ResultData[] | null>(null);
  // Copy Data
  const [copiedTable, setCopiedTable] = useState<boolean>(false);
  const [copiedRow, setCopiedRow] = useState<Record<string, boolean>>({});
  // Error state
  const [error, setError] = useState<string>("");

  const handleIpVersionChange = (version: "ipv4" | "ipv6") => {
    setIpVersion(version);
    setSubnetMask(version === "ipv6" ? "/64" : "255.255.255.0");
    setIpAddress("");
    setResult(null);
    setError("");
  };

  const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    setError("");

    try {
      if (!ipAddress) {
        throw new Error("Please enter an IP address");
      }

      if (!subnetMask) {
        throw new Error("Please select a subnet mask");
      }

      let calculationResult: ResultData | null = null;
      if (ipVersion === "ipv4") {
        // Convert subnet mask to CIDR notation
        const binaryMask = subnetMask
          .split(".")
          .map((num) => parseInt(num).toString(2).padStart(8, "0"))
          .join("");
        const cidr = binaryMask.split("1").length - 1;
        calculationResult = calculateSubnet(ipAddress, cidr);

        if (!calculationResult) {
          throw new Error("Invalid IPv4 address or subnet mask");
        }
      } else {
        // For IPv6, extract the prefix length from the subnet mask
        const prefixLength = parseInt(subnetMask.replace("/", ""));
        if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 128) {
          throw new Error("Invalid prefix length for IPv6");
        }

        try {
          // Try to expand the IPv6 address first
          const expandedAddress = expandIPv6(ipAddress);
          if (!expandedAddress) {
            throw new Error("Invalid IPv6 address format");
          }

          // Calculate IPv6 subnet
          calculationResult = {
            "IP Address": ipAddress,
            "Prefix Length": subnetMask,
            "Network Address": calculateIPv6Network(ipAddress, prefixLength),
            "First Host": calculateIPv6FirstHost(ipAddress, prefixLength),
            "Last Host": calculateIPv6LastHost(ipAddress, prefixLength),
            "Number of Addresses": calculateIPv6Hosts(prefixLength),
            "Address Type": getIPv6AddressType(ipAddress),
            Scope: getIPv6Scope(ipAddress),
          };
        } catch (error) {
          console.error("Error expanding IPv6 address:", error);
          throw new Error("Invalid IPv6 address format");
        }
      }

      setResult(calculationResult);
      setError("");
    } catch (err) {
      console.error("Calculation error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Invalid ${ipVersion.toUpperCase()} address or subnet mask`);
      }
      setResult(null);
    }
  };

  // Helper functions for IPv6 calculations
  const expandIPv6 = (address: string): string | null => {
    try {
      address = address.trim().replace(/^\[|\]$/g, "");
      if (!address || address.length < 2) return null;

      if (address.includes("::")) {
        const parts = address.split("::");
        if (parts.length > 2) return null;

        const left = parts[0] ? parts[0].split(":") : [];
        const right = parts[1] ? parts[1].split(":") : [];
        const missing = 8 - (left.length + right.length);

        if (missing < 0) return null;

        const middle = Array(missing).fill("0");
        const full = [...left, ...middle, ...right];

        if (full.length !== 8) return null;
        if (!full.every((part) => /^[0-9a-fA-F]{0,4}$/.test(part))) return null;

        return full.map((part) => part.padStart(4, "0")).join(":");
      }

      const parts = address.split(":");
      if (parts.length !== 8) return null;
      if (!parts.every((part) => /^[0-9a-fA-F]{0,4}$/.test(part))) return null;
      return parts.map((part) => part.padStart(4, "0")).join(":");
    } catch {
      return null;
    }
  };

  function calculateIPv6Network(address: string, prefixLength: number): string {
    const expanded = expandIPv6(address);
    if (!expanded) return "Unknown";
    const parts = expanded.split(":").map((part: string) => parseInt(part, 16));
    const networkParts = parts.map((part: number, index: number) => {
      if (index * 16 >= prefixLength) return 0;
      if ((index + 1) * 16 <= prefixLength) return part;
      const remainingBits = prefixLength - index * 16;
      const mask = 0xffff << (16 - remainingBits);
      return part & mask;
    });
    return networkParts
      .map((part) => part.toString(16).padStart(4, "0"))
      .join(":");
  }

  function calculateIPv6FirstHost(address: string, prefixLength: number) {
    const network = calculateIPv6Network(address, prefixLength);
    const parts = network.split(":").map((part) => parseInt(part, 16));
    parts[7] = parts[7] | 1;
    return parts.map((part) => part.toString(16).padStart(4, "0")).join(":");
  }

  function calculateIPv6LastHost(address: string, prefixLength: number) {
    const network = calculateIPv6Network(address, prefixLength);
    const parts = network.split(":").map((part) => parseInt(part, 16));
    for (let i = Math.floor(prefixLength / 16); i < 8; i++) {
      parts[i] = i === 7 ? 0xfffe : 0xffff;
    }
    return parts.map((part) => part.toString(16).padStart(4, "0")).join(":");
  }

  function calculateIPv6Hosts(prefixLength: number) {
    // Use BigInt for large numbers
    return (2n ** BigInt(128 - prefixLength)).toString();
  }

  function getIPv6AddressType(address: string) {
    const expanded = expandIPv6(address);
    if (!expanded) return "Unknown";
    const firstWord = parseInt(expanded.split(":")[0], 16);

    if (address === "::1") return "Loopback";
    if (address === "::") return "Unspecified";
    if ((firstWord & 0xfe00) === 0xfc00) return "Unique Local";
    if ((firstWord & 0xffc0) === 0xfe80) return "Link Local";
    if ((firstWord & 0xe000) === 0x2000) return "Global Unicast";
    if ((firstWord & 0xff00) === 0xff00) return "Multicast";
    return "Global Unicast";
  }

  function getIPv6Scope(address: string) {
    const expanded = expandIPv6(address);
    if (!expanded) return "Unknown";
    const firstWord = parseInt(expanded.split(":")[0], 16);

    if (address === "::1") return "Host";
    if (address === "::") return "Reserved";
    if ((firstWord & 0xfe00) === 0xfc00) return "Private";
    if ((firstWord & 0xffc0) === 0xfe80) return "Link";
    if ((firstWord & 0xff00) === 0xff00) return "Multicast";
    return "Global";
  }

  const handleMultipleEntry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (batchResultData) {
      try {
        downloadCSV(batchResultData);
        setBatchResult(null);
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (!file) {
      setError("No file selected");
      return;
    }

    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (fileType !== "csv") {
      setError("Please select a CSV file.");
      return;
    }

    setIsCalculating(true);
    try {
      const fileContent = await file.text();
      const results = processBatchData(fileContent);
      setBatchResult(results);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error processing file";
      setError(message);
    } finally {
      setIsCalculating(false);
    }
  };

  const downloadCSV = (data: ResultData[]) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filename.csv");
    document.body.appendChild(link);
    link.click();
  };

  const convertToCSV = (json: ResultData[]): string => {
    const headers = Object.keys(json[0]);
    const rows = json.map((obj) => headers.map((header) => obj[header]));
    const csvArray = [headers.join(","), ...rows.map((row) => row.join(","))];
    return csvArray.join("\n");
  };

  const copyToClipboard = () => {
    if (!result) return;
    const formattedData = Object.entries(result)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    navigator.clipboard.writeText(formattedData);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 1500);
  };

  const handleCopyRow = (key: string, value: string | number) => {
    navigator.clipboard.writeText(String(value));
    setCopiedRow({ [key]: true });
    setTimeout(() => setCopiedRow({}), 1500);
  };

  function downloadTemplate() {
    // Create a link element
    const link = document.createElement("a");
    link.href =
      "https://xoftify-bucket.s3.eu-north-1.amazonaws.com/etoolsbuddy/ip_calculator_template.csv"; // Replace with the actual path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleClear = () => {
    setIpAddress("");
    setSubnetMask(ipVersion === "ipv6" ? "/64" : "255.255.255.0");
    setResult(null);
    setError("");
  };

  // Update subnet mask when IP version changes
  useEffect(() => {
    setSubnetMask(ipVersion === "ipv6" ? "/64" : "255.255.255.0");
    setResult(null);
    setError("");
  }, [ipVersion]);

  const ipv6Options = Array.from({ length: 129 }, (_, i) => ({
    value: `/${128 - i}`,
    label: `/${128 - i}`,
  }));

  const options = ipVersion === "ipv6" ? ipv6Options : ipv4Options;

  return (
    <div className="mt-6">
      {/* Main tabs for Calculator and Article */}
      {mainTab === "article" ? (
        <div className="flex justify-start items-center gap-6 mb-8">
          <button
            className="flex items-center gap-2 mt-2 font-semibold text-lg text-brand hover:text-[#5749DF] transition-colors"
            onClick={() => setMainTab("calculator")}
          >
            <FaArrowLeft />
            Go to Subnet Calculator
          </button>
        </div>
      ) : (
        <div className="flex justify-end items-center gap-6 mb-8">
          <button
            className="flex items-center gap-2 py-2.5 px-4 border-2 mt-2 border-brand font-medium text-brand rounded-md hover:bg-brand hover:text-white transition-colors"
            onClick={() => setMainTab("article")}
          >
            <FaBook />
            Learn more
          </button>
        </div>
      )}

      {mainTab === "calculator" ? (
        <>
          {/* Calculator tabs */}
          <div className="flex items-center gap-6">
            <button
              className={`py-2 cursor-pointer ${
                tab === 1 &&
                "border-b-[3px] border-brand font-semibold tracking-wide text-brand"
              }`}
              onClick={() => setTab(1)}
            >
              Single Entry
            </button>
            <button
              className={`py-2 cursor-pointer ${
                tab === 2 &&
                "border-b-[3px] border-brand font-semibold tracking-wide text-brand"
              }`}
              onClick={() => setTab(2)}
            >
              Multiple Entry
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-10">
            {tab === 1 && (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="bg-white shadow p-10 rounded-lg w-full md:w-1/2 h-[350px]">
                  <form
                    className="w-full h-full flex flex-col"
                    onSubmit={handleCalculate}
                  >
                    {/* IP Version Toggle */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <Label className="text-base font-medium text-black shrink-0 w-[110px]">
                        IP Version:
                      </Label>
                      <div className="inline-flex rounded-lg border border-gray-100 p-1 bg-gray-100 w-full">
                        <button
                          type="button"
                          onClick={() => handleIpVersionChange("ipv4")}
                          className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${
                            ipVersion === "ipv4"
                              ? "bg-white text-black-900 font-semibold shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          IPv4 Version
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIpVersionChange("ipv6")}
                          className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${
                            ipVersion === "ipv6"
                              ? "bg-white text-black-900 font-semibold shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          IPv6 Version
                        </button>
                      </div>
                    </div>

                    {/* IP Address */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <Label
                        className="text-base font-medium text-black shrink-0 w-[110px]"
                        htmlFor="ipAddress"
                      >
                        IP Address:
                      </Label>
                      <Input
                        type="text"
                        id="ipAddress"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder={
                          ipVersion === "ipv4"
                            ? "ex: 192.168.1.1"
                            : "ex: 2001:db8::1"
                        }
                        required
                        className="w-full text-left text-sm tracking-wide h-11"
                      />
                    </div>

                    {/* Subnet Mask */}
                    <div className="flex items-center justify-between gap-4">
                      <Label
                        className="text-base font-Poppins text-black shrink-0 w-[110px]"
                        htmlFor="subnetMask"
                      >
                        Subnet Mask:
                      </Label>

                      <div className="w-full">
                        <Combobox
                          value={subnetMask}
                          onChange={setSubnetMask}
                          options={options}
                          placeholder={
                            ipVersion === "ipv6"
                              ? "Select prefix length"
                              : "Select subnet mask"
                          }
                          searchPlaceholder="Search..."
                          emptyMessage="No results found."
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto flex items-center gap-3">
                      <Button type="submit" className="h-10 w-1/2">
                        <FaCalculator className="" />
                        Calculate
                      </Button>
                      <Button
                        onClick={handleClear}
                        className="text-primary-blue-500 bg-brand-100 hover:bg-brand-200 hover:text-primary-blue-500 px-6 h-10 w-1/2"
                        variant="outline"
                      >
                        <FaEraser className="" />
                        Clear
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Result */}
                <div className="w-full md:w-1/2">
                  {result && Object.keys(result).length > 0 ? (
                    <div className="bg-white shadow rounded-lg w-full">
                      <div className="w-full flex flex-col">
                        <div className="w-full text-primary-gray text-sm rounded-lg overflow-hidden overflow-x-auto">
                          <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-black-900 font-bold uppercase text-sm rounded-t-lg tracking-wide">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 rounded-tl-lg"
                                >
                                  Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Value
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 rounded-tr-lg"
                                ></th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(result).map(([key, value]) => (
                                <tr
                                  key={key}
                                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                  <th
                                    scope="row"
                                    className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap"
                                  >
                                    {key}
                                  </th>
                                  <td className="px-6 py-2 font-mono text-gray-600">
                                    {value}
                                  </td>
                                  <td className="px-4 py-2">
                                    <div
                                      onClick={() => handleCopyRow(key, value)}
                                      className="cursor-pointer"
                                    >
                                      {copiedRow[key] ? (
                                        <span className="text-success  flex items-center justify-center">
                                          <LuCheck
                                            size={16}
                                            strokeWidth={2.5}
                                            className="text-lg"
                                          />
                                        </span>
                                      ) : (
                                        <Button
                                          className="text-brand-500 hover:text-brand hover:bg-brand/10 rounded-full size-8"
                                          size="icon"
                                          variant="ghost"
                                        >
                                          <LuCopy size={16} />
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Copy all section */}
                        <div className="w-full flex items-center justify-end px-5 py-3 border-t border-gray-400">
                          <p className="text-xs mr-2 text-primary-gray">
                            Copy All
                          </p>
                          {copiedTable ? (
                            <span className="text-sm text-green-500 font-semibold size-8 flex items-center justify-center">
                              <LuCheck size={16} />
                            </span>
                          ) : (
                            <Button
                              onClick={copyToClipboard}
                              className="text-brand hover:text-brand hover:bg-brand/10 rounded-full size-8"
                              size="icon"
                              variant="ghost"
                            >
                              <LuCopy size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className=" w-full p-16 flex flex-col items-center justify-center">
                      <FaCalculator
                        className="mb-5 text-brand opacity-40"
                        size={100}
                      />
                      <p className="text-lg text-center text-brand-400 font-medium">
                        Your calculations will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multiple Entry tab content */}
            {tab === 2 && (
              <div className="bg-white shadow p-6 rounded-lg w-full md:w-1/2">
                <div className="w-full">
                  <form action="" onSubmit={handleMultipleEntry}>
                    <div className="space-y-2">
                      <Label htmlFor="file_input">Upload .csv file</Label>
                      <input
                        className="block w-full file:h-full file:mr-3 file:bg-brand-100 hover:file:bg-brand-200 file:text-brand file:border-0 file:px-4 file:py-2 text-sm text-primary-gray border h-11 rounded-md cursor-pointer bg-primary-gray-50"
                        aria-describedby="file_input_help"
                        id="file_input"
                        type="file"
                        onChange={(e) =>
                          e.target.files && setFile(e.target.files[0])
                        }
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-8 w-full flex-col md:flex-row">
                      <Button type="submit" className="flex-1/2">
                        {batchResultData ? (
                          <>
                            <LuDownload className="mr-2" />
                            Download Results
                          </>
                        ) : isCalculating ? (
                          <Loader />
                        ) : (
                          <>
                            <FaCalculator className="mr-2" />
                            Calculate
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={downloadTemplate}
                        variant="brand-outline"
                        className="flex-1/2"
                      >
                        <LuDownload className="" size={18} strokeWidth={2.5} />
                        Download Template
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-8">
          <Article />
        </div>
      )}
    </div>
  );
};

export default IPSubnetPage;
