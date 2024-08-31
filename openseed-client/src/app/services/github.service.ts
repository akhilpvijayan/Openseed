import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterParams } from '../interface/filter-params';
import { Issue } from '../interface/issue';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  constructor(private http: HttpClient) {}

  async fetchGitHubIssues(params: FilterParams): Promise<{ issues: Issue[], hasNextPage: boolean, endCursor: string }> {
    const query = `
      query($queryString: String!, $cursor: String) {
        search(query: $queryString, type: ISSUE, first: 20, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ... on Issue {
              title
              url
              createdAt
              repository {
                nameWithOwner
                url
                stargazerCount
                licenseInfo {
                  name
                }
                forkCount
                primaryLanguage {
                  name
                }
              }
              assignees(first: 1) {
                totalCount
              }
              labels(first: 10) {
                nodes {
                  name
                }
              }
              comments {
                totalCount
              }
              timelineItems(first: 1, itemTypes: [CROSS_REFERENCED_EVENT]) {
                totalCount
                nodes {
                  ... on CrossReferencedEvent {
                    source {
                      ... on PullRequest {
                        state
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    let queryString = 'is:open is:issue label:"good first issue" archived:false';
    if (params.language) {
      const languages = params.language.split(" ");
      const languageQuery = languages.map(lang => `language:${lang}`).join(" ");
      queryString += ` ${languageQuery}`;
    }

    if (params.isAssigned) {
      queryString += " assigned:*";
    } else {
      queryString += " no:assignee";
    }
    if (params.hasPullRequests) {
      queryString += " linked:pr";
    } else {
      queryString += " -linked:pr";
    }
    if (params.searchQuery) {
      queryString += ` ${params.searchQuery} in:title,body`;
    }
    queryString += " sort:created-desc";

    const variables = {
      queryString,
      cursor: params.cursor,
    };

    try {
      const response = await this.http.post<any>(
        '/api/github-fetch', // Call the serverless function
        {
          query,
          variables
        }
      ).toPromise();

      const issues: Issue[] = response?.data?.search.nodes
        .filter((issue: any) => {
          const hasLicense = Boolean(issue.repository.licenseInfo);
          const stars = issue.repository.stargazerCount;
          const forks = issue.repository.forkCount;
          const minStars = params.minStars ?? 0; // Default to 0 stars if not provided
          const maxStars = params.maxStars ?? Number.MAX_SAFE_INTEGER; // Default to a very high number
          const minForks = params.minForks ?? 0; 
          return stars >= minStars && stars <= maxStars && forks >= minForks && hasLicense;
        })
        .map((issue: any) => ({
          id: issue?.url,
          title: issue?.title,
          html_url: issue?.url,
          created_at: issue?.createdAt,
          repository_url: issue?.repository?.url,
          repository_name: issue?.repository?.nameWithOwner?.split('/')[1] ?? null,
          license: issue?.repository?.licenseInfo,
          stars_count: issue?.repository?.stargazerCount,
          fork_count: issue?.repository?.forkCount,
          language: issue?.repository?.primaryLanguage?.name || null,
          is_assigned: issue?.assignees?.totalCount > 0,
          labels: issue?.labels?.nodes.map((label: any) => label?.name),
          comments_count: issue?.comments?.totalCount,
          has_pull_requests: issue?.timelineItems?.totalCount > 0,
          pr_status: issue?.timelineItems?.totalCount > 0 ? issue?.timelineItems?.nodes[0]?.source?.state || null : null,
          status: issue?.timelineItems?.nodes[0]?.source?.state,
          owner_name: issue?.repository?.nameWithOwner?.split('/')[0] ?? null,
        }));

      const filteredIssues = issues.filter(issue => {
        if (!params.hasPullRequests) {
          return !issue.has_pull_requests;
        } else {
          return issue.has_pull_requests &&
            (issue.pr_status === 'OPEN' ||
             issue.pr_status === 'DRAFT' ||
             issue.pr_status === 'CLOSED' ||
             issue.pr_status === null);
        }
      });

      const sortedIssues = filteredIssues.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        issues: sortedIssues,
        hasNextPage: response.data.search.pageInfo.hasNextPage,
        endCursor: response.data.search.pageInfo.endCursor,
      };
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
      throw error;
    }
  }
}
