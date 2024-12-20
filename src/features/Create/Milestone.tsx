import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import Section from "./Section";
import { SubSection } from "../../app/models/create/SubSection";

interface Section {
    id:string;
    name: string;
    parentId: string;
    startDate: string;
    endDate: string;
    createAt:string;
    description: string;
    subSections: SubSection[];
}

interface Milestone {
    id:string;
    name: string;
    parentId: string;
    startDate: string;
    endDate: string;
    createAt:string;
    sections: Section[];
    description: string;
}

interface Props {
    milestone: Milestone;
    milestoneIndex: number;
    handleMilestoneChange: (
        milestoneIndex: number,
        field: keyof Omit<Milestone, "sections">,
        value: string
    ) => void;
    deleteMilestone: (milestoneIndex: number) => void;
    addSection: (milestoneIndex: number) => void;
    handleSectionChange: (
        milestoneIndex: number,
        sectionIndex: number,
        field: keyof Section,
        value: string | SubSection[]
    ) => void;
    deleteSection: (milestoneIndex: number, sectionIndex: number) => void;
    calculateSectionConstraints: (sectionIndex: number) => { minStartDate: string; maxEndDate: string };
    calculateMilestoneConstraints: { minStartDate: string; maxEndDate: string };
    isPublished: boolean;

}

export default function Milestone({
    milestone,
    milestoneIndex,
    calculateSectionConstraints,
    calculateMilestoneConstraints,
    handleMilestoneChange,
    deleteMilestone,
    addSection,
    handleSectionChange,
    deleteSection,
    isPublished,
}: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [tempDescription, setTempDescription] = useState(milestone.description);

    useEffect(() => {
        setTempDescription(milestone.description); 
    }, [milestone.description]);  

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
 
    const openDescriptionModal = () => setIsDescriptionModalOpen(true);
    const closeDescriptionModal = () => {
        setTempDescription(milestone.description); // Reset to original if closed without saving
        setIsDescriptionModalOpen(false);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempDescription(e.target.value); // Update temporary description
    };

    const saveDescription = () => {
        handleMilestoneChange(milestoneIndex, "description", tempDescription);
        setIsDescriptionModalOpen(false);
    };

    const handleDeleteMilestone = () => {
        deleteMilestone(milestoneIndex); 
    };

    return (
        <div key={milestoneIndex} className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
            <div className="flex items-center gap-x-4">
                <button type="button" onClick={toggleCollapse} aria-label={isCollapsed ? "Expand sections" : "Collapse sections"} className="text-blue-500">
                    <FontAwesomeIcon icon={isCollapsed ? faCaretDown : faCaretUp} className="text-xl" />
                </button>

                <div className="flex-1">  
                    <input
                        type="text"
                        id={`milestoneName-${milestoneIndex}`}
                        value={milestone.name}
                        placeholder="Enter milestone name"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => handleMilestoneChange(milestoneIndex, "name", e.target.value)}
                        required
                        disabled={isPublished}  
                    />
                </div>

                <div className="w-1/6">
                    <label htmlFor={`startDate-${milestoneIndex}`} className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id={`startDate-${milestoneIndex}`}
                        value={milestone.startDate}
                        min={calculateMilestoneConstraints.minStartDate} // Set dynamic minimum start date
                        max={milestone.endDate || calculateMilestoneConstraints.maxEndDate} // Set maximum as current milestone end date or dynamic max
                        disabled={milestone.sections.length > 0} // Disable if sections exist
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) =>
                            handleMilestoneChange(milestoneIndex, "startDate", e.target.value)
                        }
                    />
                </div>

                <div className="w-1/6">
                    <label htmlFor={`endDate-${milestoneIndex}`} className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        id={`endDate-${milestoneIndex}`}
                        value={milestone.endDate}
                        min={milestone.startDate || calculateMilestoneConstraints.minStartDate} // Ensure end date is after or equal to start date
                        max={calculateMilestoneConstraints.maxEndDate} // Set dynamic maximum end date
                        disabled={milestone.sections.length > 0} // Disable if sections exist
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) =>
                            handleMilestoneChange(milestoneIndex, "endDate", e.target.value)
                        }
                    />
                </div> 
                {!isPublished && (
                <>
                    <button type="button" onClick={openDescriptionModal} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">Description</button>
                    <button type="button" onClick={handleDeleteMilestone} className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600">Delete</button>
                    <button type="button" onClick={() => addSection(milestoneIndex)} className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">+ Section</button>
                </>
                )}
            </div>
 
            {!isCollapsed && (
                <div className="mt-4">
                    {milestone.sections.map((section, sectionIndex) => (
                        <Section
                            key={sectionIndex}
                            section={section}
                            sectionIndex={sectionIndex}
                            milestoneIndex={milestoneIndex}
                            handleSectionChange={handleSectionChange}
                            deleteSection={deleteSection}
                            calculateSectionConstraints={() => calculateSectionConstraints(sectionIndex)} // Pass as a callback
                            isPublished={isPublished}
                            />
                    ))}
                </div>
            )}

            {isDescriptionModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
                        <h2 className="text-xl font-semibold mb-4">Edit Description</h2>
                        <textarea
                            value={tempDescription}
                            onChange={handleDescriptionChange}
                            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows={6}
                            placeholder="Enter description here"
                        />
                        <div className="mt-4 flex justify-end gap-4">
                            <button type="button" onClick={closeDescriptionModal} className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600">Close</button>
                            <button type="button" onClick={saveDescription} className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
