import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectorProps {
  title: string;
  values: { value: number; label: string }[];
  numberOfSpaces: { value: number; label: string };
  setNumberOfSpaces: (value: { value: number; label: string }) => void;
}

const Selector = ({
  title,
  values,
  numberOfSpaces,
  setNumberOfSpaces,
}: SelectorProps) => {
  const handleChange = (value: string) => {
    const selectedValue = values.find(
      (element) => element.value === parseInt(value)
    );
    if (selectedValue) {
      setNumberOfSpaces({
        value: selectedValue.value,
        label: selectedValue.label,
      });
    }
  };

  return (
    <>
      <Select defaultValue="16" onValueChange={handleChange}>
        <SelectTrigger className="w-[150px] border-brand text-brand">
          <SelectValue placeholder={title}>
            <p>{numberOfSpaces.label}</p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {values.map((value) => (
            <SelectItem key={value.value} value={value.value.toString()}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* <select
        className={`block w-fit rounded-lg border border-black-400 cursor-pointer h-10 px-6 pr-10 text-primary-gray sm:text-sm sm:leading-6`}
        onChange={handleChange}
        value={numberOfSpaces.value}
      >
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select> */}
    </>
  );
};

export default Selector;
