import React, { useEffect, useState } from 'react';
import { Roadmap } from "../../app/models/roadmap"; // Ensure correct path to the roadmap model
import { NavLink } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css"; 

interface TableViewProps {
  roadmaps: Roadmap[];
}

const TableView: React.FC<TableViewProps> = ({ roadmaps }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {roadmaps.map((roadmap) => (
      <div key={roadmap.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{roadmap.roadmapName}</h3>

        <ProgressBarWithAnimation value={roadmap.completionRate} />

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

const ProgressBarWithAnimation: React.FC<{ value: number }> = ({ value }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < value) {
          return prev + 1; // Increment value to animate progress
        }
        clearInterval(interval); // Stop the animation when the target value is reached
        return prev;
      });
    }, 20); // Adjust the speed by changing the interval duration

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [value]);

  return (
    <div className="flex justify-center mb-4">
      <div style={{ width: "120px", height: "120px" }}>
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={{
            path: {
              stroke: `#3b82f6`, // Green color for completed path
              strokeWidth: 8,
            },
            trail: {
              stroke: "#e6e6e6", // Light gray for the background path
              strokeWidth: 8,
            },
            text: {
              fill: "#333", // Text color
              fontSize: "16px",
              fontWeight: "bold",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TableView;
