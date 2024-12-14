import { Milestone } from "./Milestone";

export interface CreateRoadmapData {
    roadmap: {
        name: string;
        userId: string;
        isPublished: boolean;
        milestones: Milestone[];
    };
}
