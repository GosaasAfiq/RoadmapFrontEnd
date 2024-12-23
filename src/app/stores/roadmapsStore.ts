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

    // Reset all filters to default state
    resetFilters = () => {
        this.page = 1;
        this.pageSize = 6;
        this.filterCounts = {
            all: 0,
            draft: 0,
            "not-started": 0,
            "in-progress": 0,
            completed: 0,
            "near-due": 0,
            overdue: 0,
        };
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
                this.loadingInitial = false;
            });
        } catch (error) {
            console.error("Failed to load roadmaps:", error);
            this.loadingInitial = false;
        }
    };
    
 
    loadRoadmap = async (id: string) => {
        this.loadingInitial = true;
        try {
            const roadmap = await agent.Roadmaps.details(id); // Assume `agent.Roadmaps.details` fetches the roadmap by ID
            runInAction(() => {
                this.selectedRoadmap = roadmap; // Set the fetched roadmap as selected
                this.loadingInitial = false;
            });
        } catch (error) {
            console.error("Failed to load the roadmap:", error);
            this.loadingInitial = false;
        }
    }; 

    createRoadmap = async (roadmapData: CreateRoadmapData) => {
        this.loadingInitial = true;
        try {
            // Send the request to the backend to create the roadmap
            const createdRoadmap = await agent.Roadmaps.create(roadmapData);
    
            // Process the response, e.g., add the new roadmap to the list
            runInAction(() => {
                this.roadmaps.push(createdRoadmap); // Add to roadmaps list
                this.selectedRoadmap = createdRoadmap; // Optionally set as selected
                this.loadingInitial = false;
            });
        } catch (error) {
            console.error("Error creating roadmap:", error);
            this.loadingInitial = false;
        }
    }; 

    setPage = (page: number) => {
        this.page = page;
    };

    setPageSize = (pageSize: number) => {
        this.pageSize = pageSize;
    };

    updateNode = async (roadmapData: Roadmap) => {
        this.loadingInitial = true;
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
                this.loadingInitial = false;
            });
        } catch (error) {
            console.error("Error creating roadmap:", error);
            this.loadingInitial = false;
        }
    }; 

    

    deleteRoadmap = async (data: { id: string, isDeleted: boolean }) => {
        try {
            // Perform a soft delete by marking the roadmap as deleted
            await agent.Roadmaps.deleteRoadmap(data);
    
            // Optionally, update the local state after soft deletion
            runInAction(() => {
                // Find the index of the roadmap to mark as deleted
                const index = this.roadmaps.findIndex((roadmap) => roadmap.id === data.id);
                
                if (index !== -1) {
                    // Update the roadmap in local state by marking it as deleted
                    this.roadmaps[index].isDeleted = data.isDeleted;  // Ensure you update the flag in the state
                }
    
                // Optionally update the selectedRoadmap if it's the same as the one deleted
                if (this.selectedRoadmap?.id === data.id) {
                    this.selectedRoadmap.isDeleted = data.isDeleted;
                }
            });
        } catch (error) {
            console.error("Error marking roadmap as deleted:", error);
            throw new Error("Failed to mark roadmap as deleted.");
        }
    };

    updateRoadmap = async (roadmapData: CreateRoadmapData) => {
        this.loadingInitial = true;
        try {
            const updatedRoadmap = await agent.Roadmaps.updateRoadmap(roadmapData);
            runInAction(() => {
                const index = this.roadmaps.findIndex((roadmap) => roadmap.id === updatedRoadmap.id);
                if (index > -1) {
                    this.roadmaps[index] = updatedRoadmap;
                }
                if (this.selectedRoadmap?.id === updatedRoadmap.id) {
                    this.selectedRoadmap = updatedRoadmap;
                }
            });
            this.loadingInitial = false;
        } catch (error) {
            console.error("Error updating roadmap:", error);
            this.loadingInitial = false;
        }
    };
    
    
    
    
        
} 
