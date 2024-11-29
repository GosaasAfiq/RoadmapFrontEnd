import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";

export default observer(function RoadmapDashboard() {
    const { roadmapStore } = useStore();
    const { loadRoadmaps, roadmaps } = roadmapStore;

    // Load roadmaps when the component mounts
    useEffect(() => {
        loadRoadmaps();
    }, [loadRoadmaps]);

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
                {/* Icon 1 */}
                <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-300 transition">
                    <img className="w-10 h-10" src="/img/list.png" alt="User" />
                </div>
                {/* Icon 2 */}
                <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-300 transition">
                    <img className="w-10 h-10" src="/img/table.png" alt="User" />
                </div>
            </div>

            {/* Roadmaps Grid */}
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
        </div>
    );
});
