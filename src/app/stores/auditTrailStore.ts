// src/stores/auditTrailStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { AuditTrail } from "../models/audittrail";

export default class AuditTrailStore {
    auditTrails: AuditTrail[] = [];
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadAuditTrails = async () => {
        console.log("Inside loadAuditTrails function"); 
        this.loadingInitial = true;
        try {
            const auditTrails = await agent.AuditTrails.list(); // Fetch the audit trails using the API agent
            runInAction(() => {
                this.auditTrails = auditTrails;
            });
            this.loadingInitial = false;
        } catch (error) {
            console.error("Failed to load audit trails:", error);
            this.loadingInitial = false;
        }
    };
}
