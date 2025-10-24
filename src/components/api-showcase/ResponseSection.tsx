// ResponseSection.js
import { FaCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { availableAPIs } from "../../constants/apiShowcase";

const ResponseSection = ({ api }: { api: (typeof availableAPIs)[0] }) => {
  return (
    <div className="flex flex-col mb-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
          <div className="flex items-center gap-2 mb-4">
            <FaCheckCircle className="text-green-500" size={20} />
            <h3 className="font-bold text-lg">Successful Response:</h3>
          </div>
        </div>
        <div className="mb-8">
          <div
            className="p-2 bg-brand-900 max-h-60 overflow-y-auto rounded-md"
            data-lenis-prevent
          >
            <pre className="text-brand-100 p-3 rounded-lg text-sm font-mono overflow-x-auto tracking-wide leading-relaxed">
              {JSON.stringify(api.successResponse, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex justify-between items-start md:items-center mb-3 flex-col md:flex-row ">
          <div className="flex items-center gap-2 mb-4">
            <MdErrorOutline className="text-red-500" size={20} />
            <h3 className="font-bold text-lg">Error Response:</h3>
          </div>
        </div>
        <div className="border border-primary-gray-300 p-2 rounded bg-brand-900 max-h-40 overflow-y-auto">
          <pre className="text-brand-100 p-3 rounded-lg text-sm font-mono overflow-x-auto tracking-wide leading-relaxed">
            {JSON.stringify(api.errorResponse, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResponseSection;
