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
    const [sortBy, setSortBy] = useState<'name' | 'namedesc' | 'createdAt' |'createdAtdesc' | 'updatedAt'| 'updatedAtdesc'>('createdAt');


    useEffect(() => {
        roadmapStore.setPage(1);
        roadmapStore.loadingInitial = true;
        roadmapStore.roadmaps = [];  // Clear the roadmaps state

        const debounceLoadRoadmaps = _.debounce(() => {
            roadmapStore.loadRoadmaps(searchTerm, filter, roadmapStore.page, pageSize, sortBy);
        }, 500);
    
        debounceLoadRoadmaps();
    
        // Cleanup debounce on unmount
        return () => debounceLoadRoadmaps.cancel();
    }, [searchTerm, filter, pageSize,sortBy]);
    
    

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

                {/* Total Roadmaps Section */}
                <div className="flex justify-between items-center mb-6">

                    {/* Sort By Dropdown */}
                    <div className="flex items-center">
                        <label htmlFor="sortBy" className="mr-2 text-gray-800 font-medium">Sort By:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => {
                                const newSortBy = e.target.value as 'name' | 'namedesc' | 'createdAt' | 'createdAtdesc' | 'updatedAt' | 'updatedAtdesc';
                                setSortBy(newSortBy);
                                roadmapStore.loadRoadmaps(searchTerm, filter, roadmapStore.page, pageSize, newSortBy);
                            }}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="createdAt">Default</option>
                            <option value="createdAtdesc">Created At (oldest)</option>
                            <option value="name">Name (asc)</option>
                            <option value="namedesc">Name (desc)</option>
                            <option value="updatedAt">Updated At (latest)</option>
                            <option value="updatedAtdesc">Updated At (oldest)</option>
                        </select>
                    </div>

                    
                    <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-300 ml-4">
                        <span className="text-gray-800 font-medium text-base">
                            Total Roadmaps: <span className="text-blue-600">{roadmapStore.totalCount}</span>
                        </span>
                    </div>

                </div>




                {/* Right Section: Icons and Dropdown */}
                <div className="flex items-center space-x-4">

                <button
                    onClick={() => {
                        roadmapStore.resetFilters();
                        setSearchTerm(''); 
                        setFilter('all');   
                        setSortBy('createdAt');
                        loadRoadmaps('', 'all', 1, 6, 'createdAt');
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
                        const previousPage = roadmapStore.page - 1; // Define the previous page
                        roadmapStore.setPage(previousPage); // Update the page to the previous page
                        roadmapStore.loadRoadmaps(searchTerm, filter, previousPage, pageSize, sortBy); // Load roadmaps for the previous page
                    }}
                    className={`px-4 py-2 rounded-lg shadow ${roadmapStore.page === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>

                
                {/* Page Number */}
                <span>Page {roadmapStore.page}</span>
                
                {/* Next Button */}
                <button
                    disabled={
                        roadmapStore.page >= Math.ceil(roadmapStore.totalCount / roadmapStore.pageSize)
                    }
                    onClick={() => {
                        const nextPage = roadmapStore.page + 1;
                        roadmapStore.setPage(nextPage);
                        roadmapStore.loadRoadmaps(searchTerm, filter, nextPage, roadmapStore.pageSize,sortBy);
                    }}
                    className={`px-4 py-2 rounded-lg shadow ${roadmapStore.page >= Math.ceil(roadmapStore.totalCount / roadmapStore.pageSize) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>

            </div>


        </div>
    );
});
