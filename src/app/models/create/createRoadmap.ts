import { Milestone } from "./Milestone";

export interface CreateRoadmapData {
    roadmap: {
        id?:string;
        name: string;
        userId: string;
        isPublished: boolean;
        createdAt?: string;
        milestones: Milestone[];
    };
}
