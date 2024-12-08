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
            // Fetch all audit trails without any filters initially
            const auditTrails = await agent.AuditTrails.list(
                "",  // No search term initially
                "",  // No user filter initially
                this.startDate,
                this.endDate
            );
    
            // Extract all unique users from the fetched audit trails
            const allUsers = [...new Set(auditTrails.map((auditTrail) => auditTrail.user.username))];
    
            // Apply filters locally
            const filteredAuditTrails = auditTrails.filter((auditTrail) => {
                const matchesSearchTerm =
                    this.searchTerm
                        ? auditTrail.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          auditTrail.user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
                        : true;
    
                const matchesUserFilter = this.userFilter
                    ? auditTrail.user.username === this.userFilter
                    : true;
    
                const matchesStartDate = this.startDate ? new Date(auditTrail.timestamp) >= this.startDate : true;
                const matchesEndDate = this.endDate
                    ? new Date(auditTrail.timestamp) <= new Date(this.endDate.getTime() + 86400000)
                    : true;
    
                return matchesSearchTerm && matchesUserFilter && matchesStartDate && matchesEndDate;
            });
    
            runInAction(() => {
                this.auditTrails = filteredAuditTrails;
                this.allUsers = allUsers; // Set all users independently of the filtered data
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
