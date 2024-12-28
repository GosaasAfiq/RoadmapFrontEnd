import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { store, useStore } from "../../app/stores/store";
import { toast } from "react-toastify";
import { Section } from "../../app/models/create/Section";
import { SubSection } from "../../app/models/create/SubSection";
import Milestone from "./Milestone";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface Milestone {
    id:string;
    name: string;
    startDate: string;
    endDate: string;
    createAt: string;
    description: string;
    parentId: string;
    sections: Section[]; 
}


export default observer(function CreateRoadmap() {
    // State to hold the list of milestones
    const [roadmapName, setRoadmapName] = useState("");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [action, setAction] = useState<string | null>(null);
    const { userStore,roadmapStore } = useStore();  // Accessing the userStore from the global store
    const {loadingInitial,createRoadmap,loadRoadmap} = roadmapStore;
    const navigate = useNavigate();
    const userId = userStore.user?.id; 
    const location = useLocation(); // Use useLocation to track the current path



    const {id} = useParams();
    let createdAt ="";
    let roadmapId = "";
    let isPublished = false;

    const [isDataModified, setIsDataModified] = useState(false); 

    const [comingBackFromPreview, setComingBackFromPreview] = useState(false);

    useEffect(() => {
        if (location.state?.isDataModified !== undefined) {
            setIsDataModified(location.state.isDataModified);  // Update local state when coming back from Preview
            setComingBackFromPreview(true); // Flag that we are coming back from preview
        }
    }, [location.state]);



    useEffect(() => {
        if (comingBackFromPreview) {
            // Skip loading the roadmap if we're coming back from preview
            setComingBackFromPreview(false); // Reset the flag
            return;
        }
        
        if (location.state?.roadmap) {
            // Populate state with roadmap data passed back from Preview
            const { name, milestones } = location.state.roadmap;
            setRoadmapName(name || "");
            setMilestones(milestones || []);
        } 
        else {
            // Reset state for creating a new roadmap
            setRoadmapName("");
            setMilestones([]);
        }
    }, [id, loadRoadmap, location.state, comingBackFromPreview]);
    


    // Function to add a new milestone row
    const addMilestone = () => {
        setMilestones([
            ...milestones,
            { id:"",name: "",parentId: "", startDate: "", endDate: "", createAt: "", description: "", sections: [] }, // Add description here
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

    const calculateMilestoneConstraints = (milestoneIndex: number) => {
        const previousMilestone = milestones[milestoneIndex - 1];
        const nextMilestone = milestones[milestoneIndex + 1];
    
        return {
            minStartDate: previousMilestone ? previousMilestone.endDate : "",
            maxEndDate: nextMilestone ? nextMilestone.startDate : "",
        };
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
            id:"",
            name: "",
            startDate: "",
            parentId:"",
            endDate: "",
            createAt: "",
            description: "",
            subSections: [] // Initialize subSections as an empty array
        });
        setMilestones(updatedMilestones);
    };
    
    const calculateMilestoneDates = (milestoneIndex: number) => {
        const milestone = milestones[milestoneIndex];
    
        if (milestone.sections.length === 0) {
            return { startDate: "", endDate: "" };
        }
    
        // Find the earliest startDate and latest endDate
        const sortedSectionsByStart = milestone.sections.sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        const sortedSectionsByEnd = milestone.sections.sort(
            (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
    
        // Return the updated start and end dates for the milestone
        return {
            startDate: sortedSectionsByStart[0].startDate,
            endDate: sortedSectionsByEnd[sortedSectionsByEnd.length - 1].endDate,
        };
    };

    const calculateSectionConstraints = (milestoneIndex: number, sectionIndex: number) => {
        const milestone = milestones[milestoneIndex];
        const sections = milestone.sections;
    
        // Get the previous and next sections
        const prevSection = sections[sectionIndex - 1];
        const nextSection = sections[sectionIndex + 1];
    
        return {
            minStartDate: prevSection?.endDate || "",
            maxEndDate: nextSection?.startDate || "",
        };
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

        if (field === "startDate" || field === "endDate") {
            const { startDate, endDate } = calculateMilestoneDates(milestoneIndex);
            handleMilestoneChange(milestoneIndex, "startDate", startDate);
            handleMilestoneChange(milestoneIndex, "endDate", endDate);
        }
    
        setMilestones(updatedMilestones);
    };

    // Function to delete a section from a milestone
    const deleteSection = (milestoneIndex: number, sectionIndex: number) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[milestoneIndex].sections = updatedMilestones[milestoneIndex].sections.filter((_, i) => i !== sectionIndex);
        setMilestones(updatedMilestones);
    };

    const validateRoadmap = (): boolean => {
        // Check if the roadmap name is filled
        if (!roadmapName.trim()) {
            toast.error("Roadmap name is required.");
            return false;
        }
    
        // Check if there is at least one milestone
        if (milestones.length === 0) {
            toast.error("At least one milestone is required.");
            return false;
        }
    
        let hasSection = false; // To track if at least one section is filled in any milestone
    
        // Validate each milestone
        for (const [milestoneIndex, milestone] of milestones.entries()) {
            // Validate the milestone itself (all fields must be filled)
            if (!milestone.name.trim() || !milestone.startDate.trim() || !milestone.endDate.trim() || !milestone.description.trim()) {
                toast.error(`All details for milestone ${milestoneIndex + 1} must be filled.`);
                return false;
            }

            if (milestoneIndex > 0) {
                const previousMilestone = milestones[milestoneIndex - 1];
                if (new Date(milestone.startDate) < new Date(previousMilestone.endDate)) {
                    toast.error(
                        `The start date of milestone ${milestoneIndex + 1} cannot be earlier than the end date of milestone ${milestoneIndex}.`
                    );
                    return false;
                }
            }
    
            // If the milestone has sections, check if at least one section is filled
            if (milestone.sections.length > 0) {
                hasSection = true; // Mark that we have at least one section
                // Validate sections
                for (const [sectionIndex, section] of milestone.sections.entries()) {
                    if (!section.name.trim() || !section.startDate.trim() || !section.endDate.trim() || !section.description.trim()) {
                        toast.error(`All details for section ${sectionIndex + 1} in milestone ${milestoneIndex + 1} must be filled.`);
                        return false;
                    }
    
                    // Validate subsections if they exist
                    for (const [subSectionIndex, subSection] of section.subSections.entries()) {
                        if (!subSection.name.trim() || !subSection.startDate.trim() || !subSection.endDate.trim() || !subSection.description.trim()) {
                            toast.error(`All details for subsection ${subSectionIndex + 1} in section ${sectionIndex + 1} of milestone ${milestoneIndex + 1} must be filled.`);
                            return false;
                        }
                    }
                }
            }
        }
    
        // Now check if there is at least one section across all milestones
        if (!hasSection) {
            toast.error("At least one section must be added to any milestone.");
            return false;
        }
    
        return true; // Validation passed
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        if (!roadmapName.trim()) {
            toast.error("Roadmap name is required.");
            return; 
        }
        
        const isPublished = action === "publish"; // Check if the clicked button was "publish"

        if (isPublished && !validateRoadmap()) {
            // If validation fails, stop the submission
            return;
        }

        
            if (!userId) {
                toast.error("User ID is required to create a roadmap.");
                return;
            }

            const dataToSend = {
                roadmap: { // Wrap the data under "roadmap"
                    id:roadmapId,
                    name: roadmapName,
                    userId: userId,
                    isPublished: isPublished, //false
                    createdAt: createdAt,
                    milestones: milestones,
                },
            }; 
            
            try {
                if (isPublished) {                        
                    await createRoadmap(dataToSend!);

                    toast.success( "Roadmap Created!");

                    const auditTrailData = {
                        userId: userId,  
                        action: "Created a roadmap"
                    };

                    // await store.auditTrailStore.create(auditTrailData);
                    navigate("/roadmaps");
                } else {                        
                    await createRoadmap(dataToSend!);

                    toast.success( "Draft Created!");

                    const auditTrailData = {
                        userId: userId,  
                        action: "Created a draft"
                    };

                    // await store.auditTrailStore.create(auditTrailData);
                    navigate("/roadmaps");
                } 
            } catch (error: any) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message || "An error occurred while creating the roadmap.");
                } else {
                    toast.error("An error occurred while creating the roadmap.");
                }
            }
        
    };
  

    if (loadingInitial) return <LoadingComponent content="Loading..." />


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 p-8">Create Roadmap</h1>

            {/* Outer Box (Full Screen) */}
            <div className="flex-grow bg-white p-8 rounded-lg shadow-lg mx-8 relative">
                <form onSubmit={handleSubmit}>
                    {/* Roadmap Name Input and Buttons */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Roadmap Name Input */}
                        <div className="w-2/3">
                            <input
                                type="text"
                                id="roadmapName"
                                value={roadmapName}
                                onChange={(e) => {
                                    setRoadmapName(e.target.value);
                                }}
                                placeholder="Enter roadmap name"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={isPublished}  
                                maxLength={40}
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                                <button 
                                type="button"  
                                className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                                onClick={() => {
                                    const dataToPreview = {
                                        roadmap: {
                                            id: roadmapId,
                                            name: roadmapName,
                                            userId: userId,
                                            isPublished: false, // Preview doesn't publish
                                            createdAt: createdAt,
                                            milestones: milestones,
                                        },
                                        isDataModified,
                                    };
                                                        
                                    navigate("/preview", { state: dataToPreview});

                                }}
                                >
                                    Preview
                                </button>
                                <button type="button"  
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
                                calculateSectionConstraints={(sectionIndex) =>
                                    calculateSectionConstraints(milestoneIndex, sectionIndex)
                                }
                                calculateMilestoneConstraints={calculateMilestoneConstraints(milestoneIndex)} // Pass the constraints
                                handleSectionChange={handleSectionChange}
                                deleteSection={deleteSection}
                                isPublished={isPublished}
                            />
                        ))}
                    </div>

                    {/* Action Buttons (Cancel, Save, Publish) */}
                    <div className="flex justify-end gap-4">
                        {!isPublished && (
                        <>
                            <NavLink to="/roadmaps">
                                <button type="button"  className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600">
                                    Cancel
                                </button>
                            </NavLink>
                            <button
                                type="submit" // Change to type "submit" to trigger form submission
                                onClick={() => setAction("save")}
                                className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow hover:bg-yellow-600">
                                    Save
                            </button>
                            <button 
                                type="submit"
                                onClick={() => setAction("publish")}
                                className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600">
                                    Publish
                            </button>
                        </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
});
