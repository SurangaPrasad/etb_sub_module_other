import { useEffect, useState } from "react";
import Selector from "./Selector";
import { LuCheck, LuCopy, LuDownload, LuScan, LuX } from "react-icons/lu";
import { BsStars } from "react-icons/bs";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import JsonFullView from "./JsonFullView";
import { useGetValidatedJsonMutation } from "@/lib/redux/jsonvalidator/jsonValidatorApiSlice";
import { globalErrorHandler } from "@/utils/errors";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

const spacingOptions = [
  { value: 2, label: "2 spaces" },
  { value: 4, label: "4 spaces" },
  { value: 8, label: "8 spaces" },
  { value: 16, label: "16 spaces" },
];

interface FormattedJsonOutputV2Props {
  value: string | null;
  input: string;
  title?: string;
}

export default function FormattedJsonOutputV2({
  value,
  input,
  title = "Output",
}: FormattedJsonOutputV2Props) {
  const initialValue = value || "";
  const [numberOfSpaces, setNumberOfSpaces] = useState({
    value: 2,
    label: "2 spaces",
  });
  const [output, setOutput] = useState<string | null>(initialValue);
  const [showModel, setShowModel] = useState(false);
  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const [fixWithAI, { isLoading }] = useGetValidatedJsonMutation();

  useEffect(() => {
    setOutput(initialValue);
  }, [initialValue]);

  const outputBlock = (__html = "") => {
    return (
      <pre
        className="px-4 py-2 block rounded-lg border-0 whitespace-pre-wrap overflow-y-scroll"
        dangerouslySetInnerHTML={{ __html }}
        style={{ height: "calc(100% - 96px)" }}
      />
    );
  };

  const JsonObject = ({ jsonValue }: { jsonValue: string }) => {
    try {
      const emptyBraces = `<span class="text-white-400">{}</span>`;
      if (!jsonValue || typeof document === "undefined") {
        return outputBlock(emptyBraces);
      }
      if (typeof jsonValue !== "object") return outputBlock(emptyBraces);

      const formattedJson = JSON.stringify(
        jsonValue,
        null,
        numberOfSpaces.value
      );
      return (
        <div className="rounded-md overflow-y-scroll bg-primary-gray-50/20 h-full">
          <CodeMirror
            value={formattedJson}
            height="100%"
            extensions={[json()]}
            basicSetup={{
              foldGutter: false,
              lineNumbers: true,
            }}
            editable={false}
          />
        </div>
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const dangerousHtml = `<span class="text-red-400">${message}</span>`;
      return outputBlock(dangerousHtml);
    }
  };

  let parsedOutput;
  if (output) {
    try {
      parsedOutput = JSON.parse(output);
    } catch (err) {
      console.error("Invalid JSON:", err);
      parsedOutput = null;
    }
  }

  const downloadFile = () => {
    const fileData = JSON.stringify(output, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json"; // Name of the file to be downloaded
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  const handleFixWithAI = async () => {
    try {
      const response = await fixWithAI(input).unwrap();
      const jsonString = JSON.stringify(response);
      try {
        JSON.parse(jsonString);
        setOutput(jsonString);
      } catch (error) {
        toast.error("Sorry! Server unable to fix the JSON");
        console.error("Response is not valid JSON:", response);
        globalErrorHandler(error);
      }
    } catch (error) {
      globalErrorHandler(error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center mb-4 gap-4 justify-between">
          <p className="font-bold text-xl font-Mulish"> {title}: </p>
          <div className="flex gap-4">
            <Selector
              title="Spacing"
              values={spacingOptions}
              numberOfSpaces={numberOfSpaces}
              setNumberOfSpaces={setNumberOfSpaces}
            />
          </div>
        </div>
        <div className="h-[400px] rounded-lg overflow-hidden bg-brand-100 border">
          <div className="bg-brand-400 px-2.5 py-1 w-full">
            <div className="flex items-center gap-2 ml-auto w-min">
              <button
                className="hover:bg-white/10 p-2 rounded-full"
                onClick={() => copyToClipboard(output || "")}
              >
                {isCopied ? (
                  <LuCheck className="text-white" size={18} />
                ) : (
                  <LuCopy className="text-white" size={18} />
                )}
              </button>
              <button
                className="hover:bg-white/10 p-2 rounded-full disabled:cursor-not-allowed"
                disabled={!output}
                onClick={() => setShowModel(true)}
              >
                <LuScan className="text-white" size={18} />
              </button>
              <button
                className="hover:bg-red-500/10 p-2 rounded-full"
                onClick={() => setOutput(null)}
              >
                <LuX className="text-red-500 " size={20} />
              </button>
            </div>
          </div>
          <JsonObject jsonValue={parsedOutput} />
        </div>

        <div className="flex items-center gap-3 mt-6 justify-end">
          <Button onClick={handleFixWithAI} variant="ai" className="rounded-md">
            <BsStars />
            {isLoading ? "Fixing..." : "Fix with AI"}
          </Button>
          <Button
            onClick={downloadFile}
            className="hover:bg-brand-200 hover:text-brand"
            variant="brand-outline"
          >
            <LuDownload />
            Download
          </Button>
        </div>
      </div>
      <JsonFullView
        jsonCode={output}
        open={showModel}
        onClose={() => setShowModel(false)}
      />
    </>
  );
}
