import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Roadmap } from "../models/roadmap";

export default class RoadmapStore {
    roadmaps: Roadmap[] = [];
    selectedRoadmap: Roadmap | null = null;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }
 
    loadRoadmaps = async () => {
        this.loadingInitial = true;
        try {
            const roadmaps = await agent.Roadmaps.list();
            runInAction(() => {
                this.roadmaps = roadmaps;
            });
            this.loadingInitial = false;
        } catch (error) {
            console.error("Failed to load roadmaps:", error);
            this.loadingInitial = false;
        }
    };
}
