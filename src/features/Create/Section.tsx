import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import SubSection from "./SubSection";

interface SubSection {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Section {
    name: string;
    startDate: string;
    endDate: string;
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
}

export default function Section({
    section,
    sectionIndex,
    milestoneIndex,
    handleSectionChange,
    deleteSection,
}: Props) {
    const [isSubSectionsCollapsed, setIsSubSectionsCollapsed] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [tempDescription, setTempDescription] = useState(section.description);

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
            { name: "", startDate: "", endDate: "", description: "" },
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
        handleSectionChange(
            milestoneIndex,
            sectionIndex,
            "subSections",
            updatedSubSections
        );
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
                    onClick={openDescriptionModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                >
                    Description
                </button>

                {/* Delete Section Button */}
                <button
                    onClick={() => deleteSection(milestoneIndex, sectionIndex)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                >
                    Delete
                </button>

                {/* Add SubSection Button */}
                <button
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
                                onClick={closeDescriptionModal}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600"
                            >
                                Close
                            </button>
                            <button
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
