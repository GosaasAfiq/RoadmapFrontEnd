import { toast } from "react-toastify";

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

interface Milestone {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    sections: Section[];
}

export const validateRoadmap = (
    isPublished: boolean,
    roadmapName: string,
    milestones: Milestone[]
): boolean => {
    if (isPublished) {
        if (!roadmapName.trim()) {
            toast.error("Roadmap name is required.");
            return false;
        }

        if (milestones.length === 0) {
            toast.error("At least one milestone is required.");
            return false;
        }

        let hasSection = false;

        for (const [milestoneIndex, milestone] of milestones.entries()) {
            if (
                !milestone.name.trim() ||
                !milestone.startDate.trim() ||
                !milestone.endDate.trim() ||
                !milestone.description.trim()
            ) {
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

            if (milestone.sections.length > 0) {
                hasSection = true;

                for (const [sectionIndex, section] of milestone.sections.entries()) {
                    if (
                        !section.name.trim() ||
                        !section.startDate.trim() ||
                        !section.endDate.trim() ||
                        !section.description.trim()
                    ) {
                        toast.error(`All details for section ${sectionIndex + 1} in milestone ${milestoneIndex + 1} must be filled.`);
                        return false;
                    }

                    for (const [subSectionIndex, subSection] of section.subSections.entries()) {
                        if (
                            !subSection.name.trim() ||
                            !subSection.startDate.trim() ||
                            !subSection.endDate.trim() ||
                            !subSection.description.trim()
                        ) {
                            toast.error(
                                `All details for subsection ${subSectionIndex + 1} in section ${sectionIndex + 1} of milestone ${milestoneIndex + 1} must be filled.`
                            );
                            return false;
                        }
                    }
                }
            }
        }

        if (!hasSection) {
            toast.error("At least one section must be added to any milestone.");
            return false;
        }
    } else {
        if (!roadmapName.trim()) {
            toast.error("Roadmap name is required.");
            return false;
        }

        for (const [milestoneIndex, milestone] of milestones.entries()) {
            if (!milestone.name.trim()) {
                toast.error(`Milestone ${milestoneIndex + 1} name is required.`);
                return false;
            }

            if (milestone.sections.length > 0) {
                for (const [sectionIndex, section] of milestone.sections.entries()) {
                    if (!section.name.trim()) {
                        toast.error(`Section ${sectionIndex + 1} name is required.`);
                        return false;
                    }

                    for (const [subSectionIndex, subSection] of section.subSections.entries()) {
                        if (!subSection.name.trim()) {
                            toast.error(`Subsection ${subSectionIndex + 1} name is required.`);
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
};
