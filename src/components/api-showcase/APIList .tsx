import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { availableAPIs } from "../../constants/apiShowcase";

interface APIListProps {
  apis: typeof availableAPIs;
  setSelectedAPI: (api: (typeof availableAPIs)[0]) => void;
  selectedAPI: (typeof availableAPIs)[0] | null;
}

const APIList = ({ apis, setSelectedAPI, selectedAPI }: APIListProps) => {
  return (
    <div className="sticky top-4 rounded-lg shadow-sm border border-brand-400 bg-brand-100 overflow-hidden">
      <div className="px-6 py-4">
        <h3 className="text-lg font-Poppins tracking-wide">Available APIs</h3>
      </div>
      <ul className="">
        {apis.map((api, index) => (
          <li
            key={api.endpoint}
            className={`cursor-pointer px-6 py-2 hover:bg-brand-200 transition-colors border-black-100 ${
              selectedAPI === api && ""
            }`}
            onClick={() => setSelectedAPI(api)}
          >
            <div className="flex items-center gap-3 justify-between mb-3">
              <p className="text-black-900 font-medium">
                {index + 1}. {api.name}
              </p>
              {selectedAPI === api && (
                <FaCheckCircle className="text-brand" size={21} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default APIList;
