export interface FilterParams {
    language?: string;
    isAssigned?: boolean;
    hasPullRequests?: boolean;
    searchQuery?: string;
    minStars?: number;
    maxStars?: number;
    cursor?: string;
    framework?: string;
    label?: string;
    category?: string;
    status?: string;
    createdBefore?: Date;
    createdAfter?: Date;
    minForks?: number;
    maxForks?: number;
    title?: string;
    body?: string;
    project?: string;
}
