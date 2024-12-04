import { FC, useState, useEffect, useRef } from "react";
import _ from "lodash"; // Import lodash for debounce

interface FilterProps {
  filter: "all" | "draft" | "not-started";
  setFilter: React.Dispatch<React.SetStateAction<"all" | "draft" | "not-started">>;
  filterCounts: { all: number; draft: number; "not-started": number };
  loadRoadmaps: (searchTerm: string, filter: "all" | "draft" | "not-started") => void;
  searchTerm: string;
}

const Filter: FC<FilterProps> = ({ filter, setFilter, filterCounts, loadRoadmaps, searchTerm }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

  // Debounced filter change handler
  const handleFilterChange = _.debounce((newFilter: "all" | "draft" | "not-started") => {
    setFilter(newFilter); // Update the filter state
    loadRoadmaps(searchTerm, newFilter); // Trigger loadRoadmaps with the correct filter
  }, 500); // Adjust debounce delay as needed

  useEffect(() => {
    return () => {
      handleFilterChange.cancel(); // Cleanup debounce
    };
  }, [handleFilterChange]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false); // Close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-md w-56 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown state
      >
        <span>
          {filter === "all" && `All (${filterCounts.all})`}
          {filter === "draft" && `Draft (${filterCounts.draft})`}
          {filter === "not-started" && `Not Started (${filterCounts["not-started"]})`}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-full z-10">
          <div
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            onClick={() => handleFilterChange("all")}
          >
            <span>All</span>
            <span className="ml-auto text-sm font-medium text-gray-500">{filterCounts.all}</span>
          </div>
          <div
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            onClick={() => handleFilterChange("draft")}
          >
            <span>Draft</span>
            <span className="ml-auto text-sm font-medium text-gray-500">{filterCounts.draft}</span>
          </div>
          <div
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            onClick={() => handleFilterChange("not-started")}
          >
            <span>Not Started</span>
            <span className="ml-auto text-sm font-medium text-gray-500">
              {filterCounts["not-started"]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
