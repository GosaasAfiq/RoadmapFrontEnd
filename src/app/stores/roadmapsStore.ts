import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Roadmap } from "../models/roadmap";

export default class RoadmapStore {
    roadmaps: Roadmap[] = [];
    selectedRoadmap: Roadmap | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    loadRoadmaps = async () => {
        try {
            const roadmaps = await agent.Roadmaps.list();
            runInAction(() => {
                this.roadmaps = roadmaps;
            });
        } catch (error) {
            console.error("Failed to load roadmaps:", error);
        }
    };
}
