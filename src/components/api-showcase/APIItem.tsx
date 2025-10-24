// APIItem.js
import FeatureList from "./FeatureList";
import ResponseSection from "./ResponseSection";
import TestAPISection from "./TestAPISection";
import ParameterDetails from "./ParameterDetails";
import { availableAPIs } from "../../constants/apiShowcase";

const APIItem = ({ api }: { api: (typeof availableAPIs)[0] }) => {
  return (
    <div className="mb-6 rounded-lg bg-white shadow-md border border-black-200">
      <div className="p-6 pb-0">
        <p className="text-2xl font-bold text-black-900">{api.name}</p>
      </div>
      <div className="p-3 md:p-6 text-black-900">
        <p className="mb-8 leading-relaxed ">{api.description}</p>
        <FeatureList features={api.features} />
        {api.params && Array.isArray(api.params) && api.params.length > 0 && (
          <ParameterDetails params={api.params} />
        )}
        <ResponseSection api={api} />
        <TestAPISection api={api} />
      </div>
    </div>
  );
};

export default APIItem;
