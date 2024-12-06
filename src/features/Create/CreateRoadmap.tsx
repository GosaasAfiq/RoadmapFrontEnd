import { observer } from "mobx-react-lite";
import { useState } from "react";
import Milestone from "./Milestone";

interface SubSection {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
}

// Define interfaces for Milestone and Section
interface Section {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    subSections: SubSection[];
}

interface Milestone {
    name: string;
    startDate: string;
    endDate: string;
    sections: Section[];
    description: string;
}

export default observer(function CreateRoadmap() {
    // State to hold the list of milestones
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    // Function to add a new milestone row
    const addMilestone = () => {
        setMilestones([
            ...milestones,
            { name: "", startDate: "", endDate: "", description: "", sections: [] }, // Add description here
        ]);
    };
    

    // Function to handle input changes for milestone fields
    const handleMilestoneChange = (
        index: number,
        field: keyof Omit<Milestone, "sections">, // Only "name", "startDate", or "endDate"
        value: string
    ) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index][field] = value; // Safe because "sections" is excluded
        setMilestones(updatedMilestones);
    };

    // Function to delete a milestone row
    const deleteMilestone = (index: number) => {
        const updatedMilestones = milestones.filter((_, i) => i !== index);
        setMilestones(updatedMilestones);
    };

    // Function to add a new section to a milestone
    const addSection = (milestoneIndex: number) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[milestoneIndex].sections.push({
            name: "",
            startDate: "",
            endDate: "",
            description: "",
            subSections: [] // Initialize subSections as an empty array
        });
        setMilestones(updatedMilestones);
    };
    

    // Function to handle input changes for section fields
    const handleSectionChange = (
        milestoneIndex: number,
        sectionIndex: number,
        field: keyof Section, // "name", "startDate", "endDate", "description", or "subSections"
        value: string | SubSection[] // Accept both string and SubSection[]
    ) => {
        const updatedMilestones = [...milestones];
    
        if (field === "subSections") {
            // For subSections, assign the array directly
            updatedMilestones[milestoneIndex].sections[sectionIndex][field] = value as SubSection[];
        } else {
            // For the other fields, assign the string value
            updatedMilestones[milestoneIndex].sections[sectionIndex][field] = value as string;
        }
    
        setMilestones(updatedMilestones);
    };
    

    // Function to delete a section from a milestone
    const deleteSection = (milestoneIndex: number, sectionIndex: number) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[milestoneIndex].sections = updatedMilestones[milestoneIndex].sections.filter((_, i) => i !== sectionIndex);
        setMilestones(updatedMilestones);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 p-8">Create Roadmap</h1>

            {/* Outer Box (Full Screen) */}
            <div className="flex-grow bg-white p-8 rounded-lg shadow-lg mx-8 relative">
                {/* Roadmap Name Input and Buttons */}
                <div className="flex justify-between items-center mb-6">
                    {/* Roadmap Name Input */}
                    <div className="w-2/3">
                        <input
                            type="text"
                            id="roadmapName"
                            placeholder="Enter roadmap name"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600">
                            Preview
                        </button>
                        <button
                            onClick={addMilestone}
                            className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600"
                        >
                            + Milestone
                        </button>
                    </div>
                </div>

                {/* Inner Box */}
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-300 h-full mb-6">
                    {/* Milestone Details */}
                    {milestones.map((milestone, milestoneIndex) => (
                        <Milestone
                            key={milestoneIndex}
                            milestone={milestone}
                            milestoneIndex={milestoneIndex}
                            handleMilestoneChange={handleMilestoneChange}
                            deleteMilestone={deleteMilestone}
                            addSection={addSection}
                            handleSectionChange={handleSectionChange}
                            deleteSection={deleteSection}
                        />
                    ))}
                </div>

                {/* Action Buttons (Cancel, Save, Publish) */}
                <div className="flex justify-end gap-4">
                    <button className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600">
                        Cancel
                    </button>
                    <button className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow hover:bg-yellow-600">
                        Save
                    </button>
                    <button className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600">
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
});
