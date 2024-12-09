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

    page: number = 1; // Current page
    pageSize: number = 6; // Number of items per page
    totalCount: number = 0; 

    constructor() {
        makeAutoObservable(this);
    }
    
    loadAllUsers = async () => {
        try {
            const users = await agent.Users.list();
            runInAction(() => {
                this.allUsers = users.map(user => user.username); // Map to only usernames
            });
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };
    
    

    loadAuditTrails = async () => {
        this.loadingInitial = true;
        try {
            // Fetch audit trails with pagination and filters
            const result = await agent.AuditTrails.list(
                this.searchTerm,
                this.userFilter,
                this.startDate,
                this.endDate,
                this.page,
                this.pageSize
            );

            runInAction(() => {
                // Update the store with backend data
                this.auditTrails = result.items; // Set current page items
                this.totalCount = result.totalCount; // Set total count from backend
            });

            // Optionally, load all unique users from the first fetch
            if (this.allUsers.length === 0) {
                const allUsers = [...new Set(result.items.map(item => item.user.username))];
                runInAction(() => {
                    this.allUsers = allUsers;
                });
            }
        } catch (error) {
            console.error("Failed to load audit trails:", error);
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };
    
    
      
    resetFilters = () => {
        this.searchTerm = '';
        this.userFilter = '';
        this.startDate = undefined;
        this.endDate = undefined;
        this.page = 1; // Current page
        this.pageSize= 6; // Number of items per page
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

    setPage = (page: number) => {
        this.page = page;
    };

    setPageSize = (pageSize: number) => {
        this.pageSize = pageSize;
    };
}
