import { User } from "./user";
import { Node } from "./node";

export interface Roadmap {
    id: string;
    userId: string;
    roadmapName: string;
    isPublished: boolean;
    isCompleted: boolean;
    isDeleted?: boolean; // Optional if not always used
    createdAt: string;
    updatedAt: string;
    startDate: string; // New field for the start date
    endDate: string;
    completionRate: number; 
    user?: User; // Replaced 'any' with User type from user.ts
    nodes: Node[]; // Import and use the Node type from node.ts
}
