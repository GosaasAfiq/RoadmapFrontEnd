import { SubSection } from "./SubSection";

export interface Section {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    subSections: SubSection[];
}