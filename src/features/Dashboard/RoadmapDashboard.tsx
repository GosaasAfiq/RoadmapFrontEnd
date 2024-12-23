import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTable } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "../../app/layout/LoadingComponent";
import _ from "lodash"; // Import lodash for debounce
import Filter from "./Filter";
import ListView from "./ListView";
import TableView from "./TableView";
import SearchBar from "./SearchBar";


export default observer(function RoadmapDashboard() { 
    const { roadmapStore } = useStore();
    const { loadRoadmaps, roadmaps, loadingInitial, filterCounts, setPageSize, pageSize} = roadmapStore;

    // Get the initial view from localStorage, default to 'table' 
    const initialView = localStorage.getItem('view') || 'list'; 
    const [isListView, setIsListView] = useState(initialView === 'table');
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingSearchTerm, setPendingSearchTerm] = useState(""); // Tracks input changes
    const [filter, setFilter] = useState<"all" | "draft" | "not-started"| "in-progress" | "completed" | "near-due" | "overdue">("all");

    useEffect(() => {
        const debounceLoadRoadmaps = _.debounce(() => {
            roadmapStore.loadRoadmaps(searchTerm, filter, roadmapStore.page, pageSize);
        }, 500);
    
        debounceLoadRoadmaps();
    
        // Cleanup debounce on unmount
        return () => debounceLoadRoadmaps.cancel();
    }, [searchTerm, filter, pageSize, roadmapStore.page]);
    
    

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
                <SearchBar 
                    searchTerm={pendingSearchTerm} // Tracks input
                    setSearchTerm={setPendingSearchTerm} // Updates input state
                    onSearch={() => setSearchTerm(pendingSearchTerm)} // Confirms search term

                />

                {/* Filter Dropdown */}
                <Filter 
                    filter={filter} 
                    setFilter={setFilter} 
                    filterCounts={filterCounts} 
                    loadRoadmaps={loadRoadmaps} 
                    searchTerm={searchTerm}
                    pageSize={pageSize}   
                />


            </div>

            {/* Icons Section */}
            <div className="flex justify-between items-center mb-6">

                {/* Left Section: Total Roadmaps */}
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-300">
                    <span className="text-gray-800 font-medium text-base">
                        Total Roadmaps: <span className="text-blue-600">{roadmapStore.totalCount}</span>
                    </span>
                </div>

                {/* Right Section: Icons and Dropdown */}
                <div className="flex items-center space-x-4">

                <button
                    onClick={() => {
                        // Reset filters in the store
                        roadmapStore.resetFilters();
                        // Also reset the searchTerm and filter to default values
                        setSearchTerm('');  // Assuming you have a search term state
                        setFilter('all');   // Assuming you have a filter state
                        // Reload the roadmaps with default values
                        loadRoadmaps('', 'all', 1, 6);
                    }}
                    className="ml-4 p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                    Clear Filters
                </button>

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

                    {/* Dropdown */}
                    <select
                        id="paginationDropdown"
                        value={pageSize}
                        onChange={(e) => {
                            const newPageSize = parseInt(e.target.value, 10);
                            setPageSize(newPageSize); // Let useEffect trigger loadRoadmaps
                        }}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none w-full sm:w-auto"
                    >
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                </div>
            </div>


            {isListView ? <ListView roadmaps={roadmaps} /> : <TableView roadmaps={roadmaps} />}

            <div className="flex justify-between items-center mt-4">
                {/* Previous Button */}
                <button
                    disabled={roadmapStore.page === 1}
                    onClick={() => {
                        roadmapStore.setPage(roadmapStore.page - 1);
                        roadmapStore.loadRoadmaps();
                    }}
                    className={`px-4 py-2 rounded-lg shadow ${roadmapStore.page === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                
                {/* Page Number */}
                <span>Page {roadmapStore.page}</span>
                
                {/* Next Button */}
                {/* Next Button */}
                <button
                    disabled={
                        roadmapStore.page >= Math.ceil(roadmapStore.totalCount / roadmapStore.pageSize)
                    }
                    onClick={() => {
                        const nextPage = roadmapStore.page + 1;
                        roadmapStore.setPage(nextPage);
                        roadmapStore.loadRoadmaps(searchTerm, filter, nextPage, roadmapStore.pageSize);
                    }}
                    className={`px-4 py-2 rounded-lg shadow ${roadmapStore.page >= Math.ceil(roadmapStore.totalCount / roadmapStore.pageSize) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>

            </div>


        </div>
    );
});
