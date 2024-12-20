import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import SubSection from "./SubSection";

interface SubSection {
    id:string;
    name: string;
    startDate: string;
    endDate: string;
    createAt:string;
    description: string;
}

interface Section {
    id:string;
    name: string;
    startDate: string;
    endDate: string; 
    createAt:string;
    description: string;
    subSections: SubSection[];
} 

interface Props {
    section: Section;
    sectionIndex: number;
    milestoneIndex: number;
    handleSectionChange: (
        milestoneIndex: number,
        sectionIndex: number,
        field: keyof Section,
        value: string | SubSection[]
    ) => void;
    deleteSection: (milestoneIndex: number, sectionIndex: number) => void;
    calculateSectionConstraints: () => { minStartDate: string; maxEndDate: string };

}

export default function Section({
    section,
    sectionIndex,
    milestoneIndex,
    calculateSectionConstraints,
    handleSectionChange,
    deleteSection,
}: Props) {
    const [isSubSectionsCollapsed, setIsSubSectionsCollapsed] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [tempDescription, setTempDescription] = useState(section.description);

    const { minStartDate, maxEndDate } = calculateSectionConstraints();


    useEffect(() => {
        setTempDescription(section.description);
    }, [section.description]);


    // Toggle the subsections collapse state
    const toggleSubSectionsCollapse = () => {
        setIsSubSectionsCollapsed(!isSubSectionsCollapsed);
    };

    // Function to open the description modal
    const openDescriptionModal = () => setIsDescriptionModalOpen(true);

    // Function to close the description modal
    const closeDescriptionModal = () => {
        setTempDescription(section.description); // Reset to original if closed without saving
        setIsDescriptionModalOpen(false);
    };

    // Handle changes in description
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempDescription(e.target.value);
    };

    // Save the description after editing
    const saveDescription = () => {
        handleSectionChange(milestoneIndex, sectionIndex, "description", tempDescription);
        setIsDescriptionModalOpen(false);
    };

    // Function to add a new subsection
    const addSubSection = () => {
        const updatedSubSections = [
            ...section.subSections, 
            { id:"",name: "", startDate: "", endDate: "",createAt:"", description: "" },
        ];
        handleSectionChange(
            milestoneIndex,
            sectionIndex,
            "subSections",
            updatedSubSections
        );
    };
    

    // Function to handle changes in a subsection
    const handleSubSectionChange = (
        subSectionIndex: number,
        field: keyof SubSection,
        value: string
    ) => {
        const updatedSubSections = [...section.subSections];
        updatedSubSections[subSectionIndex][field] = value;

        const updatedStartDate = getUpdatedStartDate(updatedSubSections);
        const updatedEndDate = getUpdatedEndDate(updatedSubSections);

        handleSectionChange(
            milestoneIndex,
            sectionIndex,
            "subSections",
            updatedSubSections
        );
 
        handleSectionChange(milestoneIndex, sectionIndex, "startDate", updatedStartDate);
        handleSectionChange(milestoneIndex, sectionIndex, "endDate", updatedEndDate);
    };

    // Helper function to get the latest end date from all subsections
    const getMinStartDate = (subSectionIndex: number): string => {
        if (subSectionIndex === 0) return ""; // No limit for the first subsection
        const prevSubSection = section.subSections[subSectionIndex - 1];
        return prevSubSection.endDate ? prevSubSection.endDate : ""; // Ensure startDate is after the previous endDate
    };

    // Helper function to get the latest end date from all subsections   
    const getMaxEndDate = (subSectionIndex: number): string => {
        if (subSectionIndex === section.subSections.length - 1) return ""; // No limit for the last subsection
        const nextSubSection = section.subSections[subSectionIndex + 1];
        return nextSubSection.startDate ? nextSubSection.startDate : ""; // Ensure endDate is before the next startDate
    };
    
    // Helper function to get the latest end date from all subsections
    const getUpdatedStartDate = (subSections: SubSection[]): string => {
        const startDates = subSections.map((subSection) => subSection.startDate);
        return startDates.reduce((earliestDate, currentDate) => {
            return currentDate < earliestDate ? currentDate : earliestDate;
        }, startDates[0]);
    };
    
    // Helper function to get the latest end date from all subsections
    const getUpdatedEndDate = (subSections: SubSection[]): string => {
        const endDates = subSections.map((subSection) => subSection.endDate);
        return endDates.reduce((latestDate, currentDate) => {
            return currentDate > latestDate ? currentDate : latestDate;
        }, endDates[0]);
    };

    // Function to delete a subsection
    const deleteSubSection = (subSectionIndex: number) => {
        const updatedSubSections = section.subSections.filter(
            (_, i) => i !== subSectionIndex
        );
        setTempDescription("");
        handleSectionChange(
            milestoneIndex,
            sectionIndex,
            "subSections",
            updatedSubSections
        );
    };

    return (
        <div
            key={sectionIndex}
            className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4"
        >
            <div className="flex items-center gap-x-4">
                {/* Collapsible Icon for subsections */}
                {section.subSections.length > 0 && (
                    <button
                        type="button"  
                        onClick={toggleSubSectionsCollapse}
                        aria-label={isSubSectionsCollapsed ? "Expand subsections" : "Collapse subsections"}
                        className="text-blue-500"
                    >
                        <FontAwesomeIcon
                            icon={isSubSectionsCollapsed ? faCaretDown : faCaretUp}
                            className="text-xl"
                        />
                    </button>
                )}

                {/* Section Name */}
                <div className="flex-1">
                    <input
                        type="text"
                        id={`sectionName-${milestoneIndex}-${sectionIndex}`}
                        value={section.name}
                        placeholder="Enter section name"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        onChange={(e) =>
                            handleSectionChange(
                                milestoneIndex,
                                sectionIndex,
                                "name",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Start Date */}
                <div className="w-1/6">
                    <label
                        htmlFor={`sectionStartDate-${milestoneIndex}-${sectionIndex}`}
                        className="block text-sm font-medium text-gray-700"
                    >
                        Start Date
                    </label>
                    <input
                        type="date"
                        id={`sectionStartDate-${milestoneIndex}-${sectionIndex}`}
                        value={section.startDate}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        disabled={section.subSections.length > 0} // Disable if subsections exist
                        min={minStartDate} // Apply minimum constraint
                        max={maxEndDate} // Apply maximum constraint

                        onChange={(e) =>
                            handleSectionChange(
                                milestoneIndex,
                                sectionIndex,
                                "startDate",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* End Date */}
                <div className="w-1/6">
                    <label
                        htmlFor={`sectionEndDate-${milestoneIndex}-${sectionIndex}`}
                        className="block text-sm font-medium text-gray-700"
                    >
                        End Date
                    </label>
                    <input
                        type="date"
                        id={`sectionEndDate-${milestoneIndex}-${sectionIndex}`}
                        value={section.endDate}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        disabled={section.subSections.length > 0} // Disable if subsections exist
                        min={section.startDate || minStartDate} // Ensure end date is after or equal to start date
                        max={maxEndDate} // Apply maximum constraint
                        onChange={(e) =>
                            handleSectionChange(
                                milestoneIndex,
                                sectionIndex,
                                "endDate",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Description Button */}
                <button
                    type="button"  
                    onClick={openDescriptionModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                >
                    Description
                </button>

                {/* Delete Section Button */}
                <button
                    type="button"  
                    onClick={() => deleteSection(milestoneIndex, sectionIndex)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                >
                    Delete
                </button>

                {/* Add SubSection Button */}
                <button
                    type="button"  
                    onClick={addSubSection}
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                >
                    + SubSection
                </button>
            </div>

            {/* SubSections (Only visible if not collapsed) */}
            {!isSubSectionsCollapsed && section.subSections.length > 0 && (
                <div className="mt-4">
                    {section.subSections.map((subSection, subSectionIndex) => (
                        <SubSection
                            key={subSectionIndex}
                            subSection={subSection}
                            subSectionIndex={subSectionIndex}
                            minStartDate={getMinStartDate(subSectionIndex)}  // Call the function here
                            maxEndDate={getMaxEndDate(subSectionIndex)}   
                            handleSubSectionChange={handleSubSectionChange}
                            deleteSubSection={deleteSubSection}
                        />
                    ))}
                </div>
            )}

            {/* Description Modal */}
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
                            <button
                                type="button"  
                                onClick={closeDescriptionModal}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600"
                            >
                                Close
                            </button>
                            <button
                                type="button"  
                                onClick={saveDescription}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
