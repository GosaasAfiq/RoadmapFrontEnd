import { Section } from "./Section";

export interface Milestone {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    sections: Section[];
}