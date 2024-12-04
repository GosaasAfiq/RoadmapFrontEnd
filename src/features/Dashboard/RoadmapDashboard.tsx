import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTable } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "../../app/layout/LoadingComponent";
import _ from "lodash"; // Import lodash for debounce


export default observer(function RoadmapDashboard() { 
    const { roadmapStore } = useStore();
    const { loadRoadmaps, roadmaps, loadingInitial, filterCounts} = roadmapStore;

    // Get the initial view from localStorage, default to 'table' 
    const initialView = localStorage.getItem('view') || 'list'; 
    const [isListView, setIsListView] = useState(initialView === 'table');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<"all" | "draft" | "not-started">("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown


    const handleSearch = _.debounce(() => {
        roadmapStore.loadRoadmaps(searchTerm, filter);
    }, 500);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false); // Close dropdown
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            handleSearch.cancel();  // Cleanup debounce on unmount
        };
    }, []);

    // Load roadmaps when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await loadRoadmaps(); // Load all roadmaps initially
        };
        fetchData();
    }, [loadRoadmaps]);

    const handleFilterChange = (newFilter: "all" | "draft" | "not-started") => {
        setFilter(newFilter); // Update the filter state
        loadRoadmaps(searchTerm, newFilter); // Trigger loadRoadmaps with the correct filter
    };
    

    // Handle view switch
    const handleViewSwitch = (view: 'list' | 'table') => {
        setIsListView(view === 'table');
        localStorage.setItem('view', view); // Save to localStorage
    };

    if (loadingInitial) return <LoadingComponent content="Loading..." />

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                {/* Search Bar */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search"
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
                />

                {/* Filter Dropdown */}
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
                <span className="ml-auto text-sm font-medium text-gray-500">
                    {filterCounts.all}
                </span>
            </div>
            <div
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                onClick={() => handleFilterChange("draft")}
            >
                <span>Draft</span>
                <span className="ml-auto text-sm font-medium text-gray-500">
                    {filterCounts.draft}
                </span>
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


            </div>

            {/* Icons Section */}
            <div className="flex justify-end items-center space-x-4 mb-6">
                {/* List Icon */}
                <div 
                    onClick={() => handleViewSwitch('list')} 
                    className={`flex items-center justify-center w-10 h-10 ${!isListView ? 'bg-gray-300' : 'hover:bg-gray-300'} transition cursor-pointer`}
                >
                    <FontAwesomeIcon icon={faTable} className="text-gray-800 text-xl" />
                </div>

                {/* Table Icon */}
                <div 
                    onClick={() => handleViewSwitch('table')} 
                    className={`flex items-center justify-center w-10 h-10 ${isListView ? 'bg-gray-300' : 'hover:bg-gray-300'} transition cursor-pointer`}
                >
                    <FontAwesomeIcon icon={faList} className="text-gray-800 text-xl" />
                </div>
            </div>

            {/* Conditional Rendering of Roadmaps */}
            {isListView ? (
                // List View (Table)
                <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr className="border-b">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Roadmap Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Progress</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Start Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">End Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {roadmaps.map((roadmap) => (
                                <tr key={roadmap.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{roadmap.roadmapName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">In Progress</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">01/01/2024</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">12/31/2024</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {roadmap.isPublished ? (
                                            "Published"
                                        ) : (
                                            "Draft"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {roadmap.isPublished ? (
                                            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                                                View
                                            </button>
                                        ) : (
                                            <>
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap) => (
                        <div
                            key={roadmap.id}
                            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {roadmap.roadmapName}
                            </h3>
                            <div className="mt-4 flex justify-between">
                                {roadmap.isPublished ? (
                                    // Publish
                                    <>
                                    <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 opacity-0 pointer-events-none">
                                        Draft
                                    </button>
                                    <button className="border border-green-500 text-green-500 rounded-md px-4 py-1 hover:bg-green-500 hover:text-white transition">
                                        View
                                    </button>
                                    </>
                                ) : (
                                    // Draft
                                    <>
                                        <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1">
                                            Draft
                                        </button>

                                        <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition">
                                            Edit
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
