import React, { useEffect, useState } from "react";

interface TextAreaProps {
  initialInput: string;
  onInputChange: (newInput: string) => void;
  name: string;
}

function TextArea({ initialInput, onInputChange, name }: TextAreaProps) {
  const [input, setInput] = useState(initialInput);

  useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInput(newValue);
    onInputChange(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <textarea
        className="px-3 py-2 text-black/70 border border-brand-400 rounded-lg rounded-tl-none rounded-tr-none focus:outline-none focus:ring-0"
        value={input}
        name={name}
        onChange={handleChange}
        rows={10}
      />
    </div>
  );
}

export default TextArea;
