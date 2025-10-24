"use client";

import { useState } from "react";
import { availableAPIs } from "@apps/small-tools/src/constants/apiShowcase";
import APIItem from "@apps/small-tools/src/components/api-showcase/APIItem";
import APIList from "@apps/small-tools/src/components/api-showcase/APIList ";
import { ProgressLink } from "@/components/nprogress/ProgressLink";
import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";

const APIShowcasePage = () => {
  const [selectedAPI, setSelectedAPI] = useState(availableAPIs[0]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 md:gap-8 py-6 items-start">
      <div className="w-full md:w-1/3 rounded-md">
        <APIList
          apis={availableAPIs}
          setSelectedAPI={setSelectedAPI}
          selectedAPI={selectedAPI}
        />
      </div>
      <div className="w-full md:w-2/3">
        <div className="w-full p-2 flex items-center justify-between gap-8 shadow mb-4 bg-white rounded-md">
          <p className="text-base font-medium ml-2 text-brand">
            Generate an API key to get started using the etoolsbuddy API.
          </p>
          <Button asChild variant="ai" className="rounded-md ">
            <ProgressLink
              href="/dashboard/api-key/"
              className="flex items-center gap-2"
            >
              <BsStars />
              Generate API Key
            </ProgressLink>
          </Button>
        </div>
        {selectedAPI ? (
          <APIItem key={selectedAPI.endpoint} api={selectedAPI} />
        ) : (
          <p className="text-primary-gray py-3">
            Please select an API from the list.
          </p>
        )}
      </div>
    </div>
  );
};

export default APIShowcasePage;
