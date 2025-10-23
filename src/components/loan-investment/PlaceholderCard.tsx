import React from "react";
import { FaCalculator } from "react-icons/fa6";
const PlaceholderCard = () => {
  return (
    <div className="  w-full  flex flex-col items-center justify-center">
      <FaCalculator className="mb-5 text-brand opacity-40" size={100} />
      <p className="text-lg text-center text-brand-400 font-medium">
        Your calculations will appear here
      </p>
    </div>
  );
};

export default PlaceholderCard;
