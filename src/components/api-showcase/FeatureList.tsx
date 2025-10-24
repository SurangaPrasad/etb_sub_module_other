import React from "react";
import { MdOutlineExtension } from "react-icons/md";

const FeatureList = ({ features }: { features?: string[] }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <MdOutlineExtension className="text-brand" size={20} />
      <h3 className="font-bold text-lg">Features</h3>
    </div>
    {features && Array.isArray(features) && (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 mb-4 list-disc list-inside">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    )}
  </div>
);

export default FeatureList;
