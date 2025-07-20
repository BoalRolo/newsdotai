import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  isMock?: boolean;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isDarkMode: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  isDarkMode,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    console.log("🔘 Toggle dropdown clicked, current state:", isOpen);
    setIsOpen(!isOpen);
    console.log("🔘 New state will be:", !isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div
      className="relative dropdown-force-top"
      ref={dropdownRef}
      style={{ zIndex: 999999 }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-left ${
          isDarkMode
            ? "bg-slate-700/50 text-white border-slate-600/50 focus:border-blue-500/50 focus:ring-blue-500/20"
            : "bg-white/80 text-slate-900 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
        }`}
        tabIndex={0}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? "" : "text-slate-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute w-full mt-2 rounded-xl border-2 shadow-2xl transition-all duration-200 dropdown-force-top ${
            isDarkMode
              ? "bg-slate-800/95 border-slate-600/50 backdrop-blur-xl"
              : "bg-white/95 border-slate-200 backdrop-blur-xl"
          }`}
          style={{ zIndex: 999999 }}
        >
          <div className="py-2 max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("🎯 Dropdown option clicked:", option.value);
                  onChange(option.value);
                  setIsOpen(false);
                  setHighlightedIndex(-1);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center space-x-3 ${
                  index === highlightedIndex
                    ? isDarkMode
                      ? "bg-blue-600/20 text-blue-300"
                      : "bg-blue-50 text-blue-700"
                    : ""
                } ${
                  option.value === value
                    ? isDarkMode
                      ? "bg-blue-600/30 text-blue-200 font-semibold"
                      : "bg-blue-100 text-blue-800 font-semibold"
                    : isDarkMode
                    ? "text-slate-200 hover:bg-slate-700/50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {/* Checkmark for selected option */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {option.value === value && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Option content */}
                <div className="flex-1">
                  <span
                    className={`${
                      option.isMock
                        ? isDarkMode
                          ? "text-purple-300 font-semibold"
                          : "text-purple-600 font-semibold"
                        : ""
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.isMock && (
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-purple-600/20 text-purple-300"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      MOCK
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
