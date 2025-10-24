import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export type Country = {
  name: { common: string };
  flags: { png: string };
  cca2: string;
};

interface Props {
  value: Country | null;
  setValue: (value: Country | null) => void;
  hasImage?: boolean;
}

const Dropdown: React.FC<Props> = ({ value, setValue, hasImage }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (item: Country) => {
    setValue(item);
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/country/getAll"
        );
        if (!res.ok) {
          setError("Error fetching countries");
          return;
        }
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error("Error occured while fetching countries");
        setError("Unexpected error!");
      } finally {
        setLoading(false);
      }
    };
    getCountries();
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex items-center justify-between gap-4 h-10 bg-primary-gray-50 border cursor-pointer bg-white border-black-500 text-black-900 text-primary-gray-900 text-sm rounded-md focus:ring-brand w-full px-3 py-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <div className="flex items-center gap-4 text-sm">
            {hasImage && (
              <Image src={value?.flags.png} width={25} height={20} alt="" />
            )}
            {value?.name.common}
          </div>
        ) : (
          <p className="text-sm">Select a country</p>
        )}
        <LuChevronDown size={20} />
      </div>
      {isOpen && (
        <div className="absolute bg-white z-10 shadow-md bg-primary-gray-50 border border-black-100 text-primary-gray-900 text-sm rounded-md block w-full overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            <div className="w-full border-b border-black-100 sticky top-0 z-10">
              <input
                type="text"
                className="w-full outline-none border-0 px-2 py-2.5 placeholder:text-f-dark-shade text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-brand-dark-400/50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </span>
            </div>
            {loading ? (
              <div className="p-2">Loading...</div>
            ) : error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : (
              ""
            )}
            {countries
              .filter((item) =>
                item?.name?.common
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 border-b border-black-100 cursor-pointer hover:bg-black-200/50"
                  onClick={() => handleClick(item)}
                >
                  {hasImage && (
                    <div className="relative w-[25px] h-[16px]">
                      <Image
                        src={item.flags.png}
                        fill
                        alt=""
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span>{item.name.common}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
