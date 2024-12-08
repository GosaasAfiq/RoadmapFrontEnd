// src/stores/auditTrailStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { AuditTrail } from "../models/audittrail";

export default class AuditTrailStore {
    auditTrails: AuditTrail[] = [];
    loading = false;
    loadingInitial = false;

    allUsers: string[] = [];
    searchTerm: string = '';
    userFilter: string = '';
    startDate: Date | undefined = undefined;
    endDate: Date | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    loadAuditTrails = async () => {
        this.loadingInitial = true;
        try {
            const allAuditTrails = await agent.AuditTrails.list(); // Fetch all audit trails to get the complete user list
            const filteredAuditTrails = await agent.AuditTrails.list(
                this.searchTerm,
                this.userFilter,
                this.startDate,
                this.endDate
            );
    
            runInAction(() => {
                this.allUsers = [...new Set(allAuditTrails.map((auditTrail) => auditTrail.user.username))];
                this.auditTrails = filteredAuditTrails;
            });
        } catch (error) {
            console.error("Failed to load audit trails:", error);
        } finally {
            this.loadingInitial = false;
        }
    };
    

    setSearchTerm = (term: string) => {
        this.searchTerm = term;
    };

    setUserFilter = (user: string) => {
        this.userFilter = user;
    };

    setStartDate = (date: Date | undefined) => {
        this.startDate = date;
    };

    setEndDate = (date: Date | undefined) => {
        this.endDate = date;
    };
}
