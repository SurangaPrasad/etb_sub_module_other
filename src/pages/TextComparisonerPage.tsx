"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import TextArea from "@apps/small-tools/src/components/text-comparisoner/TextArea";
import { LuCheck, LuCopy, LuFileSymlink, LuX } from "react-icons/lu";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { Button } from "@/components/ui/button";

export default function DiffViewerComponent() {
  const initialOriginalText = "";
  const initialNewText = "";

  const [originalText, setOriginalText] = useState<string>(initialOriginalText);
  const [newText, setNewText] = useState<string>(initialNewText);
  const [showDifferences, setShowDifferences] = useState<boolean>(false);

  const diffViewerRef = useRef<HTMLDivElement | null>(null);
  const originalFileRef = useRef<HTMLInputElement | null>(null);
  const newFileRef = useRef<HTMLInputElement | null>(null);

  const [isOriginalCopied, copyOriginalToClipboard] = useCopyToClipboard();
  const [isNewCopied, copyNewToClipboard] = useCopyToClipboard();

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setTextSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setTextSetter(result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFindDifferences = () => {
    if (originalText === "") return;

    setShowDifferences(true);
    setTimeout(() => {
      diffViewerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleClearInputs = () => {
    setOriginalText(initialOriginalText);
    setNewText(initialNewText);
    setShowDifferences(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 py-6">
      {showDifferences && (
        <div className="mb-4 border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-brand-100 shadow flex items-center gap-6 text-sm">
            <button
              className="bg-danger text-white hover:opacity-80 py-1.5 px-4 rounded-lg ml-auto transition-opacity duration-300"
              onClick={handleClearInputs}
            >
              Clear
            </button>
          </div>
          <div ref={diffViewerRef} className="p-3 bg-white">
            <ReactDiffViewer
              oldValue={originalText}
              newValue={newText}
              splitView
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 h-1/2">
        {/* Original Text Section */}
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-4 pl-6">
            <p className="font-bold font-Mulish">Original Text:</p>
            <input
              className="mb-2"
              ref={originalFileRef}
              type="file"
              accept=".txt"
              hidden
              onChange={(e) => handleFileUpload(e, setOriginalText)}
            />
            <Button onClick={() => originalFileRef.current?.click()}>
              <LuFileSymlink />
              Open from file
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg">
            <div className="bg-brand-400 px-2.5 py-1 w-full flex justify-end items-center">
              <button
                className="hover:bg-white/10 p-2 rounded-full"
                onClick={() => copyOriginalToClipboard(originalText)}
              >
                {isOriginalCopied ? (
                  <LuCheck className="text-white" size={18} />
                ) : (
                  <LuCopy className="text-white" size={18} />
                )}
              </button>
              <button
                className="hover:bg-red-500/10 p-2 rounded-full"
                onClick={() => setOriginalText("")}
              >
                <LuX className="text-red-500" size={20} />
              </button>
            </div>
            <TextArea
              initialInput={originalText}
              onInputChange={(input: string) => setOriginalText(input)}
              name="original-text-area"
            />
          </div>
        </div>

        {/* New Text Section */}
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-4 pl-6">
            <p className="font-bold font-Mulish">New Text:</p>
            <input
              className="mb-2"
              ref={newFileRef}
              type="file"
              accept=".txt"
              hidden
              onChange={(e) => handleFileUpload(e, setNewText)}
            />
            <Button onClick={() => newFileRef.current?.click()}>
              <LuFileSymlink />
              Open from file
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg">
            <div className="bg-brand-400 px-2.5 py-1 w-full flex justify-end items-center">
              <button
                className="hover:bg-white/10 p-2 rounded-full"
                onClick={() => copyNewToClipboard(newText)}
              >
                {isNewCopied ? (
                  <LuCheck className="text-white" size={18} />
                ) : (
                  <LuCopy className="text-white" size={18} />
                )}
              </button>
              <button
                className="hover:bg-red-500/10 p-2 rounded-full"
                onClick={() => setNewText("")}
              >
                <LuX className="text-red-500" size={20} />
              </button>
            </div>
            <TextArea
              initialInput={newText}
              onInputChange={(input: string) => setNewText(input)}
              name="new-text-area"
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Button
          size="lg"
          onClick={handleFindDifferences}
          disabled={showDifferences}
        >
          Find the difference
        </Button>
      </div>
    </div>
  );
}
