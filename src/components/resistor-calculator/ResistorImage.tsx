"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";

import ThreeBandImage from "@apps/small-tools/public/resistor-cal/Three-Band-Resistor-Color-Code.jpg";
import FourBandImage from "@apps/small-tools/public/resistor-cal/Four-Band-Resistor-Color-Code.jpg";
import FiveBandImage from "@apps/small-tools/public/resistor-cal/Five-Band-Resistor-Color-Code.jpg";
import SixBandImage from "@apps/small-tools/public/resistor-cal/Six-Band-Resistor-Color-Code.jpg";

// --- Props type ---
interface ResistorImageProps {
  bandCount: number;
}

const ResistorImage: React.FC<ResistorImageProps> = ({ bandCount }) => {
  // Fix #1: define type as Record<3|4|5|6, StaticImageData>
  const imageMap: Record<3 | 4 | 5 | 6, StaticImageData> = {
    3: ThreeBandImage,
    4: FourBandImage,
    5: FiveBandImage,
    6: SixBandImage,
  };

  // Ensure bandCount is one of the valid keys
  const imageSrc = imageMap[bandCount as 3 | 4 | 5 | 6] || FiveBandImage;

  return (
    <div className="w-full">
      <Image
        src={imageSrc}
        alt={`Resistor with ${bandCount} bands`}
        width={600}
        height={400}
        className="mx-auto"
        placeholder="blur" // ✅ valid Next.js prop
      />
    </div>
  );
};

export default ResistorImage;
