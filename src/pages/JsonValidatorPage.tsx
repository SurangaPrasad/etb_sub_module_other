"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import JsonOutput from "@apps/small-tools/src/components/json-validator/JsonOutput";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { LuCheck, LuCopy, LuFileInput, LuScan, LuX } from "react-icons/lu";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import JsonFullView from "@apps/small-tools/src/components/json-validator/JsonFullView";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";

export default function JsonValidatorPage() {
  const [input, setInput] = useState<string>("");
  const [formattedOutput, setFormattedOutput] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hide, setHide] = useState<boolean>(true);
  const [showModel, setShowModel] = useState<boolean>(false);

  const InputRef = useRef<HTMLInputElement | null>(null);
  const [isCopied, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    setInput(initialInput);
  }, []);

  const handleCheckJson = () => {
    try {
      const parsedJson = JSON.parse(input);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setFormattedOutput(formattedJson);
      setIsValid(true);
      setHide(false);
    } catch (err) {
      setIsValid(false);
      setFormattedOutput("");
      setHide(false);
    }
  };

  const onChange: ReactCodeMirrorProps["onChange"] = useCallback(
    (val: string) => {
      setInput(val);
    },
    []
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setInput(result);
        } else {
          console.error("File could not be read as text.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  return (
    <>
      <div className="w-full py-10">
        {!hide && (
          <div
            className={`${
              isValid
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20 "
            } p-4 flex items-center justify-between mb-4 border rounded-sm`}
          >
            <p
              className={`flex-1 text-center ${
                isValid
                  ? "text-green-600 font-medium"
                  : "text-red-500 font-medium"
              }`}
            >
              {isValid ? "Your json is valid" : "Your json is invalid"}
            </p>
            <button
              className="text-black w-5 h-5"
              onClick={() => setHide(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="w-full h-full flex flex-col md:flex-row gap-12 md:gap-6">
          <div className={`flex flex-col w-full`}>
            <div className="flex justify-between items-center mb-4 pl-6">
              <p className="font-bold text-xl font-Mulish"> Input: </p>
              <Button onClick={() => InputRef.current?.click()}>
                <LuFileInput size={18} />
                Choose file
              </Button>
              <input
                type="file"
                id="jsonFileInput"
                ref={InputRef}
                accept=".json"
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
            </div>
            <div className="overflow-hidden rounded-lg border">
              <div className="bg-brand-400 px-2.5 py-1 w-full">
                <div className="flex items-center gap-2 ml-auto w-min">
                  <button
                    className="hover:bg-white/10 p-2 rounded-full"
                    onClick={() => copyToClipboard(input)}
                  >
                    {isCopied ? (
                      <LuCheck className="text-white" size={18} />
                    ) : (
                      <LuCopy className="text-white" size={18} />
                    )}
                  </button>
                  <button
                    className="hover:bg-white/10 p-2 rounded-full disabled:cursor-not-allowed"
                    disabled={input.length === 0}
                    onClick={() => setShowModel(true)}
                  >
                    <LuScan className="text-white" size={18} />
                  </button>
                  <button
                    className="hover:bg-red-500/10 p-2 rounded-full"
                    onClick={() => setInput("")}
                  >
                    <LuX className="text-red-500 " size={20} />
                  </button>
                </div>
              </div>
              <CodeMirror
                value={input}
                height="355px"
                extensions={[json()]}
                onChange={onChange}
                basicSetup={{
                  foldGutter: false,
                }}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleCheckJson}>
                <FaCheckCircle />
                Validate JSON
              </Button>
            </div>
          </div>
          <div className={`w-full`}>
            <JsonOutput value={formattedOutput} input={input} />
          </div>
        </div>
      </div>

      <JsonFullView
        jsonCode={input}
        open={showModel}
        onClose={() => setShowModel(false)}
      />
    </>
  );
}

const initialInput = `{
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
            },
            {
                "category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99
            },
            {
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99
            },
            {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    },
    "expensive": 10
}`;
