export interface Node {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
    startDate: string | null; // Allow null for drafts or unset dates
    endDate: string | null;
    children?: Node[]; // Recursive structure for nested nodes
}
