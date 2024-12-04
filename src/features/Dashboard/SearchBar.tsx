// src/features/roadmaps/SearchBar.tsx
import React from "react";
import _ from "lodash"; // Import lodash for debounce

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch }) => {
    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search"
            className="border border-gray-300 rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
        />
    );
};

export default SearchBar;
