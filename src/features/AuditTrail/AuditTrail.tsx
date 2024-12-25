import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useLocation } from "react-router-dom";

export default observer(function AuditTrail() {
    const { auditTrailStore } = useStore();
    const { loadAuditTrails, loadingInitial, auditTrails, allUsers, resetFilters  } = auditTrailStore;
    const location = useLocation();

    // State for input values (before applying filters)
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [tempUserFilter, setTempUserFilter] = useState('');
    const [tempStartDate, setTempStartDate] = useState<Date | undefined>(undefined);
    const [tempEndDate, setTempEndDate] = useState<Date | undefined>(undefined);


    useEffect(() => {
        loadAuditTrails(); // Load audit trails when filters change
    }, [auditTrailStore.searchTerm, auditTrailStore.userFilter, auditTrailStore.startDate, auditTrailStore.endDate]);

    useEffect(() => {
        return () => {
            resetFilters();  // Call resetFilters to clear all filters
        };
    }, [location]);

    useEffect(() => {
        auditTrailStore.loadAllUsers(); // Fetch all users for the dropdown
    }, [auditTrailStore]);

    const handleClearFilters = () => {
        // Reset local state (temporary filters)
        setTempSearchTerm('');
        setTempUserFilter('');
        setTempStartDate(undefined);
        setTempEndDate(undefined);
        
        // Call resetFilters in the store
        auditTrailStore.resetFilters();
    };
    


    if (loadingInitial) return <LoadingComponent content="Loading..." />;

    const handleApplyFilters = () => {
    auditTrailStore.setSearchTerm(tempSearchTerm);
    auditTrailStore.setUserFilter(tempUserFilter);
    auditTrailStore.setStartDate(tempStartDate);
    auditTrailStore.setEndDate(tempEndDate);
};

    // Filter audit trails based on the applied filters
    const filteredAuditTrails = auditTrails.filter((auditTrail) => {
        const matchesSearchTerm =
            auditTrailStore.searchTerm
                ? auditTrail.action.toLowerCase().includes(auditTrailStore.searchTerm.toLowerCase()) ||
                  auditTrail.user.username.toLowerCase().includes(auditTrailStore.searchTerm.toLowerCase())
                : true;
        const matchesUserFilter = auditTrailStore.userFilter ? auditTrail.user.username === auditTrailStore.userFilter : true;
        const matchesStartDate = auditTrailStore.startDate ? new Date(auditTrail.timestamp) >= auditTrailStore.startDate : true;
        const matchesEndDate =
            auditTrailStore.endDate
                ? new Date(auditTrail.timestamp) <= new Date(auditTrailStore.endDate.getTime() + 86400000)
                : true;

        return matchesSearchTerm && matchesUserFilter && matchesStartDate && matchesEndDate;
    });

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
                        value={tempSearchTerm}
                        onChange={(e) => setTempSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleApplyFilters(); // Apply filters on Enter
                            }
                        }}
                        className="p-3 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Filter by User */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">Filter by User</label>
                    <select
                        value={tempUserFilter}
                        onChange={(e) => setTempUserFilter(e.target.value)}
                        className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">Select User</option>
                        {allUsers.length > 0 &&
                            allUsers.map((username) => (
                                <option key={username} value={username}>
                                    {username}
                                </option>
                            ))}
                    </select>
                </div>


                {/* Filter by Start Date */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={tempStartDate?.toISOString().slice(0, 10) || ''}
                        onChange={(e) => setTempStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                        className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Filter by End Date */}
                <div className="flex flex-col w-full sm:w-auto">
                    <label className="text-sm text-gray-600 mb-1">End Date</label>
                    <input
                        type="date"
                        value={tempEndDate?.toISOString().slice(0, 10) || ''}
                        onChange={(e) => setTempEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                        className="p-3 w-full sm:w-48 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Apply Button */}
                <div className="ml-auto flex items-center space-x-4">
                    <button
                        onClick={handleClearFilters}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 w-full sm:w-auto"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={handleApplyFilters}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 w-full sm:w-auto"
                    >
                        Apply
                    </button> 

                     {/* Pagination Dropdown */}
                    <div>
                    <select
                        id="paginationDropdown"
                        value={auditTrailStore.pageSize}
                        onChange={(e) => {
                            auditTrailStore.setPageSize(parseInt(e.target.value, 10));
                            auditTrailStore.loadAuditTrails(); // Reload data on page size change
                        }}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none w-full sm:w-auto"
                    >
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                    </div>
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
                        {filteredAuditTrails.length > 0 ? (
                            filteredAuditTrails.map((auditTrail) => (
                                <tr key={auditTrail.id}>
                                    <td className="px-6 py-4 text-gray-700">{auditTrail.user.username}</td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {new Date(auditTrail.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{auditTrail.action}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                    No audit trails match the filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex justify-between items-center mt-4">
    {/* Previous Button */}
    <button
        disabled={auditTrailStore.page === 1}
        onClick={() => {
            auditTrailStore.setPage(auditTrailStore.page - 1);
            auditTrailStore.loadAuditTrails();
        }}
        className={`px-4 py-2 rounded-lg shadow ${auditTrailStore.page === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
    >
        Previous
    </button>
    
    {/* Page Number */}
    <span>Page {auditTrailStore.page}</span>
    
    {/* Next Button */}
    <button
        disabled={
            // Disable if on the last page of filtered data
            auditTrailStore.page >= Math.ceil(auditTrailStore.totalCount / auditTrailStore.pageSize)
        }
        onClick={() => {
            auditTrailStore.setPage(auditTrailStore.page + 1);
            auditTrailStore.loadAuditTrails();
        }}
        className={`px-4 py-2 rounded-lg shadow ${auditTrailStore.page >= Math.ceil(auditTrailStore.totalCount / auditTrailStore.pageSize) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
    >
        Next
    </button>
</div>





        </div>
    );
});