import { SubSection } from "./SubSection";

export interface Section {
    id:string;
    name: string;
    parentId: string;
    startDate: string;
    endDate: string;
    createAt: string;
    description: string;
    subSections: SubSection[];
}