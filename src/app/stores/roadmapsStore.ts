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
    totalFilterCounts = { all: 0, draft: 0, "not-started": 0, "in-progress" : 0, "completed" : 0, "near-due" : 0, "overdue" : 0}; // Consistent counts

    page: number = 1; // Current page
    pageSize: number = 6; // Number of items per page
    totalCount: number = 0; 

    filterCounts: { all: number; draft: number; "not-started": number;"in-progress": number; completed: number; "near-due": number; "overdue" : number } = {
        all: 0,
        draft: 0,
        "not-started": 0,
        "in-progress": 0,
        completed: 0,
        "near-due": 0,
        "overdue": 0

    };

    constructor() {
        makeAutoObservable(this);
    }

    private hasCompletedNode(nodes: any[]): boolean {
        return nodes.some((node) =>
            node.isCompleted || (node.children && this.hasCompletedNode(node.children))
        );
    }
 
    loadRoadmaps = async (
        searchTerm?: string, 
        filter: 'all' | 'draft' | 'not-started' | 'in-progress' | 'completed'| 'near-due' | 'overdue'  = 'all',
        page: number = 1,
        pageSize: number = 6
    ) => {
        this.loadingInitial = true;
        try {
            // Expecting the updated response structure from agent.Roadmaps.list
            const { totalCount, items, draftCount, notStartedCount, inProgressCount, completedCount,nearDueCount,overdueCount } = await agent.Roadmaps.list(searchTerm, filter, page, pageSize);
            const all = totalCount;

            runInAction(() => {
                this.roadmaps = items; // Set the paginated roadmaps
                this.totalCount = totalCount;
                if (this.filterCounts.all === 0) {
                    this.filterCounts.all = all; // Set the total count for all roadmaps only once
                    this.filterCounts.draft = draftCount;
                    this.filterCounts["not-started"] = notStartedCount;
                    this.filterCounts["in-progress"] = inProgressCount;
                    this.filterCounts.completed = completedCount;
                    this.filterCounts["near-due"] =nearDueCount;
                    this.filterCounts["overdue"] = overdueCount;
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

    setPage = (page: number) => {
        this.page = page;
    };

    setPageSize = (pageSize: number) => {
        this.pageSize = pageSize;
    };

    updateNode = async (roadmapData: Roadmap) => {
        try {
            // Send the request to the backend to create the roadmap
            const updatedRoadmap = await agent.Roadmaps.updatenode(roadmapData);
    
            // Process the response, e.g., add the new roadmap to the list
            runInAction(() => {
                const index = this.roadmaps.findIndex((roadmap) => roadmap.id === updatedRoadmap.id);
                if (index > -1) {
                    this.roadmaps[index] = updatedRoadmap;
                }

                // Update the selected roadmap if it matches the updated one
                if (this.selectedRoadmap?.id === updatedRoadmap.id) {
                    this.selectedRoadmap = updatedRoadmap;
                }
            });
        } catch (error) {
            console.error("Error creating roadmap:", error);
        }
    }; 
        
} 
