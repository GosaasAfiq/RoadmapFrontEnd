import { useState, useEffect } from "react";

interface SubSection {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface SubSectionProps {
    subSection: SubSection;
    subSectionIndex: number;
    handleSubSectionChange: (
        subSectionIndex: number,
        field: keyof SubSection,
        value: string
    ) => void;
    deleteSubSection: (subSectionIndex: number) => void;
}

export default function SubSection({
    subSection,
    subSectionIndex,
    handleSubSectionChange,
    deleteSubSection,
}: SubSectionProps) {
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [tempDescription, setTempDescription] = useState(subSection.description);

    useEffect(() => {
        setTempDescription(subSection.description);
    }, [subSection.description]);

    // Open the description modal
    const openDescriptionModal = () => setIsDescriptionModalOpen(true);

    // Close the description modal and reset to the original description
    const closeDescriptionModal = () => {
        setTempDescription(subSection.description);
        setIsDescriptionModalOpen(false);
    };

    // Handle changes in the description input
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempDescription(e.target.value);
    };

    // Save the edited description
    const saveDescription = () => {
        handleSubSectionChange(subSectionIndex, "description", tempDescription);
        setIsDescriptionModalOpen(false);
    };

    return (
        <div className="flex items-center gap-x-4 mt-4">
            {/* Subsection Name */}
            <div className="flex-1">
                <input
                    type="text"
                    value={subSection.name}
                    placeholder="Enter subsection name"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                        handleSubSectionChange(subSectionIndex, "name", e.target.value)
                    }
                />
            </div>

            {/* Start Date */}
            <div className="w-1/6">
                <input
                    type="date"
                    value={subSection.startDate}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                        handleSubSectionChange(subSectionIndex, "startDate", e.target.value)
                    }
                />
            </div>

            {/* End Date */}
            <div className="w-1/6">
                <input
                    type="date"
                    value={subSection.endDate}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) =>
                        handleSubSectionChange(subSectionIndex, "endDate", e.target.value)
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

            {/* Delete SubSection Button */}
            <button
                onClick={() => deleteSubSection(subSectionIndex)}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
            >
                Delete
            </button>

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
