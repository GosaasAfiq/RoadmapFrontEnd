import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Roadmap } from "../models/roadmap";

export default class RoadmapStore {
    roadmaps: Roadmap[] = [];
    allRoadmaps: Roadmap[] = []; // All roadmaps assigned to the user
    selectedRoadmap: Roadmap | null = null;
    loading = false;
    loadingInitial = false;
    totalFilterCounts = { all: 0, draft: 0, "not-started": 0 }; // Consistent counts

    filterCounts: { all: number; draft: number; "not-started": number } = {
        all: 0,
        draft: 0,
        "not-started": 0
    };

    constructor() {
        makeAutoObservable(this);
    }
 
    loadRoadmaps = async (searchTerm?: string, filter: 'all' | 'draft' | 'not-started' = 'all') => {
        this.loadingInitial = true;
        try {
            const roadmaps = await agent.Roadmaps.list(searchTerm, filter); // Pass both parameters
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
    

    resetFilterCounts = () => {
        this.filterCounts = { all: 0, draft: 0, "not-started": 0 };
    };

    updateFilterCounts = () => {
        // Calculate counts based on the full roadmap list
        this.filterCounts.all = this.allRoadmaps.length;
        this.filterCounts.draft = this.allRoadmaps.filter((r) => !r.isPublished).length;
        this.filterCounts["not-started"] = this.allRoadmaps.filter((r) => r.isPublished).length;
    };
    
}
