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
    const { loadRoadmaps, roadmaps, loadingInitial, filterCounts} = roadmapStore;

    // Get the initial view from localStorage, default to 'table' 
    const initialView = localStorage.getItem('view') || 'list'; 
    const [isListView, setIsListView] = useState(initialView === 'table');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<"all" | "draft" | "not-started">("all");

    const handleSearch = _.debounce(() => {
        roadmapStore.loadRoadmaps(searchTerm, filter);
    }, 500);

    useEffect(() => {
        return () => {
            handleSearch.cancel();  // Cleanup debounce on unmount
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await loadRoadmaps(); // Load all roadmaps initially
        };
        fetchData();
    }, [loadRoadmaps]);
    

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
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch}
                />

                {/* Filter Dropdown */}
                <Filter 
                    filter={filter} 
                    setFilter={setFilter} 
                    filterCounts={filterCounts} 
                    loadRoadmaps={loadRoadmaps} 
                    searchTerm={searchTerm} 
                />


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

                <div>
                    <select
                        id="paginationDropdown"
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none w-full sm:w-auto"
                    >
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                </div>
            </div>

            {isListView ? <ListView roadmaps={roadmaps} /> : <TableView roadmaps={roadmaps} />}
        </div>
    );
});
