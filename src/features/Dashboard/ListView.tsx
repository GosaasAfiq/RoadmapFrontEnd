import React from 'react';
import { Roadmap } from "../../app/models/roadmap"; // Ensure correct path to the roadmap model

interface ListViewProps {
  roadmaps: Roadmap[];
}

const ListView: React.FC<ListViewProps> = ({ roadmaps }) => (
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
            <td className="px-6 py-4 text-sm text-gray-600">{roadmap.completionRate}</td>
            <td className="px-6 py-4 text-sm text-gray-600">01/01/2024</td>
            <td className="px-6 py-4 text-sm text-gray-600">12/31/2024</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {roadmap.isPublished ? 'Published' : 'Draft'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {roadmap.isPublished ? (
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">View</button>
              ) : (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ListView;
