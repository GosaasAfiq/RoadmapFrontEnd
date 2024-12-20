import { SubSection } from "./SubSection";

export interface Section {
    id:string;
    name: string;
    startDate: string;
    endDate: string;
    createAt: string;
    description: string;
    subSections: SubSection[];
}