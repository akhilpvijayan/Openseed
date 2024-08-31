export interface Issue {
    id: string;
    title: string;
    html_url: string;
    created_at: string;
    repository_url: string;
    repository_name: string;
    license: any;
    stars_count: number;
    fork_count: number;
    language: string | null;
    is_assigned: boolean;
    labels: string[];
    comments_count: number;
    has_pull_requests: boolean;
    pr_status: string | null;
    status: string;
    owner_name: string;
}
