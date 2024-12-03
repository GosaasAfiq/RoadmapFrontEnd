import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTable } from "@fortawesome/free-solid-svg-icons";

export default observer(function RoadmapDashboard() {
    const { roadmapStore } = useStore();
    const { loadRoadmaps, roadmaps } = roadmapStore;

    // Get the initial view from localStorage, default to 'table' 
    const initialView = localStorage.getItem('view') || 'list'; 
    const [isListView, setIsListView] = useState(initialView === 'table');

    // Load roadmaps when the component mounts
    useEffect(() => {
        loadRoadmaps();
    }, [loadRoadmaps]);

    // Handle view switch
    const handleViewSwitch = (view: 'list' | 'table') => {
        setIsListView(view === 'table');
        localStorage.setItem('view', view); // Save to localStorage
    };

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
                />
                {/* Filter Dropdown */}
                <div className="relative">
                    <button className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm w-52 focus:outline-none focus:ring focus:ring-blue-300">
                        Filter
                    </button>
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
                                    <td className="px-6 py-4 text-sm text-gray-600">Active</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                            Edit
                                        </button>
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
                                {/* Draft Button */}
                                <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 ">
                                    Draft
                                </button>
                                {/* Edit Button */}
                                <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
