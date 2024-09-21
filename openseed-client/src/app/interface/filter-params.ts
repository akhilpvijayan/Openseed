export interface FilterParams {
    language?: string;
    isAssigned?: boolean;
    hasPullRequests?: boolean;
    searchQuery?: string;
    minStars: number;
    maxStars: number;
    cursor?: string | null;
    owner?: string;
    label?: string;
    category?: string;
    license?: string;
    createdAfter?: Date;
    minForks: number;
    maxForks: number;
    title?: string;
    repository?: string;
    isOnlyBookmarks?: boolean;
}
