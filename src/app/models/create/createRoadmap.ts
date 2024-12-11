import { Milestone } from "./Milestone";

export interface CreateRoadmapData {
    roadmap: {
        name: string;
        userId: string;
        milestones: Milestone[];
    };
}
