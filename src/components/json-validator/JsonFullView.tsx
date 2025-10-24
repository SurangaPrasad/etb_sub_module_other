import CodeMirror from "@uiw/react-codemirror";
import React from "react";
import { json } from "@codemirror/lang-json";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface JsonFullViewProps {
  jsonCode: string | null;
  open: boolean;
  onClose: () => void;
}

const JsonFullView = ({ jsonCode, open, onClose }: JsonFullViewProps) => {
  let formattedJson = "";

  try {
    // Only try to parse and format if jsonCode exists and is not empty
    if (jsonCode) {
      const parsedJson = JSON.parse(jsonCode);
      formattedJson = JSON.stringify(parsedJson, null, 2);
    }
  } catch (err) {
    // If parsing fails, just display the raw input
    formattedJson = jsonCode || "";
    console.warn("Invalid JSON:", err);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="mt-4">
          <CodeMirror
            value={formattedJson}
            className="max-h-[80vh] overflow-auto"
            extensions={[json()]}
            basicSetup={{
              foldGutter: false,
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
            }}
            editable={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JsonFullView;
