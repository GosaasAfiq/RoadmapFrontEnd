import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function AuditTrail() {
    const { auditTrailStore } = useStore();
    const { loadAuditTrails, loadingInitial, auditTrails } = auditTrailStore;

    useEffect(() => {
        console.log("Loading audit trails...");
        loadAuditTrails(); // Load audit trails when the component mounts
    }, [auditTrailStore]);

    useEffect(() => {
        console.log("Audit Trails:", auditTrails);
    }, [auditTrails]);

    if (loadingInitial) return <LoadingComponent content="Loading..." />

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Audit Trail</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8 items-end">
                {/* Search bar */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-3 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Filter by User */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">Filter by User</label>
                    <select className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none">
                        <option value="">Select User</option>
                        {/* Add user options dynamically if needed */}
                    </select>
                </div>

                {/* Filter by Start Date */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">Start Date</label>
                    <input
                        type="date"
                        className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Filter by End Date */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">End Date</label>
                    <input
                        type="date"
                        className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Apply Button */}
                <div className="ml-auto">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 w-full sm:w-auto">
                        Apply
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full table-auto">
                    <thead className="bg-blue-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="w-1/3 px-6 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                            <th className="w-1/3 px-6 py-3 text-left text-sm font-semibold text-gray-600">Date/Time</th>
                            <th className="w-1/3 px-6 py-3 text-left text-sm font-semibold text-gray-600">Activity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {auditTrails.map((auditTrail) => (
                            <tr key={auditTrail.id}>
                                <td className="px-6 py-4 text-gray-700">{auditTrail.user.username}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    {new Date(auditTrail.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-gray-700">{auditTrail.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
