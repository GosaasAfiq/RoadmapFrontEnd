import { Section } from "./Section";

export interface Milestone {
    id:string;
    name: string;
    parentId: string;
    startDate: string;
    endDate: string;
    createAt: string;
    description: string;
    sections: Section[];
}