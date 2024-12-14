import React from 'react';
import { Roadmap } from "../../app/models/roadmap"; // Ensure correct path to the roadmap model
import { NavLink } from 'react-router-dom';

interface TableViewProps {
  roadmaps: Roadmap[];
}

const TableView: React.FC<TableViewProps> = ({ roadmaps }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {roadmaps.map((roadmap) => (
      <div key={roadmap.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{roadmap.roadmapName}</h3>
        <div className="mt-4 flex justify-between">
          {roadmap.isPublished ? (
            <>
              <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 opacity-0 pointer-events-none">Draft</button>
              <NavLink
                to={`/roadmaps/${roadmap.id}`} // Navigate to Detail page
                className="border border-green-500 text-green-500 rounded-md px-4 py-1 hover:bg-green-500 hover:text-white transition"
              >
                View
              </NavLink>
            </>
          ) : (
            <>
              <button className="border border-blue-500 text-blue-500 rounded-md px-4 py-1">Draft</button>
              <NavLink 
                to={`/roadmaps/${roadmap.id}`} // Navigate to Detail page
                className="border border-blue-500 text-blue-500 rounded-md px-4 py-1 hover:bg-blue-500 hover:text-white transition"
              >
                  Edit
              </NavLink>
            </>
          )} 
        </div>
      </div>
    ))}
  </div>
);

export default TableView;
