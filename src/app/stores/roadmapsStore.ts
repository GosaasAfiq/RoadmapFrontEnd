import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Roadmap } from "../models/roadmap";
import { CreateRoadmapData } from "../models/create/createRoadmap";

export default class RoadmapStore {
    roadmaps: Roadmap[] = [];
    allRoadmaps: Roadmap[] = []; // All roadmaps assigned to the user
    selectedRoadmap: Roadmap | null = null;
    loading = false;
    loadingInitial = false;
    totalFilterCounts = { all: 0, draft: 0, "not-started": 0, "in-progress" : 0, "completed" : 0}; // Consistent counts

    filterCounts: { all: number; draft: number; "not-started": number;"in-progress": number; completed: number;  } = {
        all: 0,
        draft: 0,
        "not-started": 0,
        "in-progress": 0,
        completed: 0,

    };

    constructor() {
        makeAutoObservable(this);
    }

    private hasCompletedNode(nodes: any[]): boolean {
        return nodes.some((node) =>
            node.isCompleted || (node.children && this.hasCompletedNode(node.children))
        );
    }
 
    loadRoadmaps = async (searchTerm?: string, filter: 'all' | 'draft' | 'not-started' | 'in-progress' | 'completed' = 'all') => {
        this.loadingInitial = true;
        try {
            const roadmaps = await agent.Roadmaps.list(searchTerm, filter); // Pass both parameters
            console.log(roadmaps[0]);
            
            runInAction(() => {
                this.roadmaps = roadmaps;
                if (!searchTerm && filter === "all") {
                    this.allRoadmaps = roadmaps; // Cache the complete list
                    this.updateFilterCounts(); // Update counts based on the full list
                }
            });
            this.loadingInitial = false;
        } catch (error) {
            console.error("Failed to load roadmaps:", error);
            this.loadingInitial = false;
        }
    };

    loadRoadmap = async (id: string) => {
        this.loading = true;
        try {
            const roadmap = await agent.Roadmaps.details(id); // Assume `agent.Roadmaps.details` fetches the roadmap by ID
            runInAction(() => {
                this.selectedRoadmap = roadmap; // Set the fetched roadmap as selected
            });
            this.loading = false;
        } catch (error) {
            console.error("Failed to load the roadmap:", error);
            this.loading = false;
        }
    };

    createRoadmap = async (roadmapData: CreateRoadmapData) => {
        try {
            // Send the request to the backend to create the roadmap
            const createdRoadmap = await agent.Roadmaps.create(roadmapData);
    
            // Process the response, e.g., add the new roadmap to the list
            runInAction(() => {
                this.roadmaps.push(createdRoadmap); // Add to roadmaps list
                this.selectedRoadmap = createdRoadmap; // Optionally set as selected
            });
        } catch (error) {
            console.error("Error creating roadmap:", error);
        }
    };
    
    
    

    resetFilterCounts = () => {
        this.filterCounts = {
            all: 0,
            draft: 0,
            "not-started": 0,
            "in-progress": 0,
            completed: 0,
        };
    };

    // Helper function to recursively check if any node or sub-node is completed
    

    updateFilterCounts = () => {
        this.filterCounts.all = this.allRoadmaps.length;
        this.filterCounts.draft = this.allRoadmaps.filter((r) => !r.isPublished).length;
        // "Not Started" filter: No completed nodes in any hierarchy
        this.filterCounts["not-started"] = this.allRoadmaps.filter((r) =>
            r.isPublished &&
            !r.isCompleted &&
            !this.hasCompletedNode(r.nodes) // Use recursive check for completed nodes
        ).length;

        // "In Progress" filter: At least one completed node in the hierarchy
        this.filterCounts["in-progress"] = this.allRoadmaps.filter((r) =>
            r.isPublished &&
            !r.isCompleted &&
            this.hasCompletedNode(r.nodes) // Use recursive check for completed nodes
        ).length;
        this.filterCounts.completed = this.allRoadmaps.filter((r) => r.isCompleted).length;
    };


    
    
    
} 
