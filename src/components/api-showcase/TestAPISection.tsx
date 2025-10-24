"use client";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiOutlineUpload, HiOutlineDownload } from "react-icons/hi";
import Dropdown, {
  Country,
} from "@apps/small-tools/src/components/api-showcase/Dropdown";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LuCopy } from "react-icons/lu";
import { BiTestTube } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";
import { availableAPIs } from "../../constants/apiShowcase";

const validParams = [
  "name",
  "flags",
  "currencies",
  "capital",
  "cities",
  "languages",
  "population",
  "region",
  "subregion",
  "timezones",
];

const TestAPISection = ({ api }: { api: (typeof availableAPIs)[0] }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true); // Default to true to show details initially
  const [selectedParameters, setSelectedParameters] = useState<
    { name: string; description?: string; type?: string; value: boolean }[]
  >([]);
  const [selectValue, setSelectValue] = useState("");

  const generateQueryString = () => {
    return selectedParameters
      .map((param) => `${param.name}=${param.value}`)
      .join("&");
  };

  const urlBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const urlQuery = !selectedCountry
    ? api.endpoint
    : api.endpoint +
      `/getOne/${selectedCountry?.cca2}?` +
      generateQueryString();

  const url = urlBase + urlQuery;

  const handleSubmit = async () => {
    setResponse(null);
    setError(null);

    const requestOptions = {
      method: api.method,
      headers: { "Content-Type": "application/json" },
    };

    try {
      setError(null);
      const res = await fetch(url, requestOptions);
      if (!res.ok) {
        setError("Unexpected error occured. Please try again later!");
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Unexpected error occured. Please try again later!");
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleParameters = (value: string) => {
    if (selectedParameters.some((param) => param.name === value)) {
      return;
    }
    setSelectedParameters((prev) => [...prev, { name: value, value: true }]);
    setSelectValue("");
  };

  const removeParam = (index: number) => {
    setSelectedParameters((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BiTestTube className="text-brand" size={20} />
          <h3 className="font-bold text-lg">Test API</h3>
        </div>
        <button
          onClick={toggleDetails}
          className="flex items-center text-primary-gray-700"
        >
          {showDetails ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {showDetails && (
        <div>
          {api.endpoint === "/api/country" && (
            <CountryApiRequest
              api={api}
              selectValue={selectValue}
              handleParameters={handleParameters}
              handleSubmit={handleSubmit}
              selectedCountry={selectedCountry}
              selectedParameters={selectedParameters}
              setSelectedCountry={setSelectedCountry}
              url={url}
              validParams={validParams}
              removeParam={removeParam}
            />
          )}

          {response && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineDownload className="text-brand" size={20} />
                <h3 className="font-semibold text-black-900 text-lg">
                  Response:
                </h3>
              </div>
              <pre className="bg-primary-gray-50 p-4 rounded border border-black-100 max-h-80 overflow-y-auto font-normal">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
          {error && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <MdErrorOutline className="text-red-500" size={20} />
                <h3 className="font-semibold text-black-900 text-lg">Error:</h3>
              </div>
              <pre className="bg-red-500/5 p-4 rounded border border-red-500/30 text-red-500 max-h-40 overflow-y-auto">
                {error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestAPISection;

interface CountryApiRequestProps {
  api: (typeof availableAPIs)[0];
  selectedCountry: Country | null;
  setSelectedCountry: React.Dispatch<React.SetStateAction<Country | null>>;
  handleParameters: (value: string) => void;
  selectValue: string;
  validParams: string[];
  selectedParameters: {
    name: string;
    description?: string;
    type?: string;
    value: boolean;
  }[];
  url: string;
  handleSubmit: () => void;
  removeParam: (index: number) => void;
}

function CountryApiRequest({
  api,
  selectedCountry,
  setSelectedCountry,
  handleParameters,
  selectValue,
  validParams,
  selectedParameters,
  url,
  handleSubmit,
  removeParam,
}: CountryApiRequestProps) {
  const [isCopied, copyToClipboard] = useCopyToClipboard();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <p className="font-medium text-primary-gray mb-4 text-sm">
            Endpoint:{" "}
            <span className="font-semibold text-primary-gray text-base">
              {api.endpoint}
            </span>
          </p>
          <Dropdown
            value={selectedCountry}
            setValue={setSelectedCountry}
            hasImage={true}
          />
        </div>
        <div className="w-full">
          <Select value={selectValue} onValueChange={handleParameters}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue
                className="text-base"
                placeholder="Select parameters"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {validParams.map((param) => (
                  <SelectItem key={param} className="capitalize" value={param}>
                    {param}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedParameters.length > 0 && (
        <div className="flex items-center gap-2 justify-start mt-3">
          {selectedParameters.map((param, index) => (
            <div
              onClick={() => removeParam(index)}
              key={param.name}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-400 text-white text-sm rounded-full cursor-pointer border border-transparent hover:bg-brand-500 transition group"
            >
              <p className="text-white">{param.name}</p>
              <span className="transition-colors group-hover:text-brand-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <div className="">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineUpload className="text-brand" size={20} />
            <h3 className="font-bold text-lg">Request:</h3>
          </div>
          <div className="flex items-stretch gap-4 max-sm:flex-col">
            <div className="relative flex-1 rounded pr-4 pl-3 py-1.5 bg-primary-gray-50 border border-brand-400 overflow-hidden flex items-center justify-start">
              <code className="text-sm font-mono text-black-900">{url}</code>
              <div className="absolute top-0 bottom-0 grid place-items-center right-0 px-3 h-full bg-brand-200 w-20">
                {isCopied ? (
                  <span className="text-base text-brand font-semibold">
                    Copied
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(url)}
                    className="flex gap-1.5 text-brand"
                  >
                    <LuCopy size={16} />
                    <span className="block mb-px text-xs font-medium">
                      Copy
                    </span>
                  </button>
                )}
              </div>
            </div>

            <Button onClick={handleSubmit}>Test API</Button>
          </div>
        </div>
      </div>
    </>
  );
}
