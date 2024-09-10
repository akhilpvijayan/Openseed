export interface FilterParams {
    language?: string;
    isAssigned?: boolean;
    hasPullRequests?: boolean;
    searchQuery?: string;
    minStars: number;
    maxStars: number;
    cursor?: string;
    owner?: string;
    label?: string;
    category?: string;
    createdBefore?: Date;
    createdAfter?: Date;
    minForks: number;
    maxForks: number;
    title?: string;
    repository?: string;
    isOnlyBookmarks?: boolean;
}
