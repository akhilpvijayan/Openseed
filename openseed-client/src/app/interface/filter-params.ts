export interface FilterParams {
    language?: string;
    isAssigned?: boolean;
    hasPullRequests?: boolean;
    searchQuery?: string;
    minStars?: number;
    maxStars?: number;
    minForks?: number;
    cursor?: string;
}
