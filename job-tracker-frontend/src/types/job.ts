export interface Job {
    id: number;
    company: string;
    title: string;
    status: string;
    appliedDate: string;
    notes: string;
}
export interface JobFormData {
    company: string;
    title: string;
    status: string;
    appliedDate: string;
    notes: string;
}