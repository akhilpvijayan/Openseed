import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilterParams } from '../interface/filter-params';
import { Issue } from '../interface/issue';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private backendUrl = environment.server;
  minStars = 0;
  maxStars= 0;
  minForks = 0;
  maxForks = 0;

  constructor(private http: HttpClient) { }

  fetchGitHubIssues(params: FilterParams): Observable<{ issues: Issue[], hasNextPage: boolean, endCursor: string }> {
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
      const languageQuery = languages.map((lang: any) => `language:${lang}`).join(" ");
      queryString += ` ${languageQuery}`;
    }

    if (params.hasPullRequests) {
      queryString += " linked:pr";
    } else {
      queryString += " -linked:pr";
    }

    // Filter by framework
    if (params.framework) {
      const frameworks = params.framework.split(" ");
      const frameworkQuery = frameworks.map(framework => `framework:${framework}`).join(" ");
      queryString += ` ${frameworkQuery}`;
    }

    //Filter by label
    if (params.label) {
      const labels = params.label.split(" ");
      const labelQuery = labels.map(label => `label:"${label}"`).join(" ");
      queryString += ` ${labelQuery}`;
    }

    // // Filter by category
    if (params.category && params.category !== "all") {
      switch (params.category) {
        case "web-dev":
          queryString += " topic:web"
          break
        case "mobile-dev":
          queryString += " topic:mobile"
          break
        case "data-science":
          queryString += " topic:data-science"
          break
        case "machine-learning":
          queryString += " topic:machine-learning"
          break
        case "devops":
          queryString += " topic:devops"
          break
        case "cybersecurity":
          queryString += " topic:security"
          break
        case "documentation":
          queryString += " topic:documentation"
          break
      }
    }

    // // Filter by status (e.g., open, closed)
    // if (params.status) {
    //   queryString += ` is:${params.status}`;
    // }

    // // Filter by creation date before a certain date
    // if (params.createdBefore) {
    //   queryString += ` created:<${params.createdBefore}`;
    // }

    // // Filter by creation date after a certain date
    // if (params.createdAfter) {
    //   queryString += ` created:>${params.createdAfter}`;
    // }
    
    // // Filter by title
    if (params.title) {
      queryString += ` ${params.title} in:title`;
    }

    queryString += " sort:created-desc"; // Sorting

    const variables = {
      queryString,
      cursor: params.cursor,
    };

    this.minStars = params.minStars ?? 0;
    this.maxStars= params.maxStars ?? 100000;
    this.minForks = params.minForks ?? 0;
    this.maxForks = params.maxForks ?? 100000;

    return this.http.post<any>(this.backendUrl, { query, variables })
      .pipe(
        map(response => ({
          issues: response.data.search.nodes
          .filter((issue: any) => {
            const hasLicense = Boolean(issue.repository.licenseInfo);
            const stars = issue.repository.stargazerCount;
            const forks = issue.repository.forkCount;
            return stars >= this.minStars && stars <= this.maxStars && forks >= this.minForks && forks <= this.maxForks && hasLicense;
          }).
          map((issue: any) => ({
            id: issue.url,
            title: issue.title,
            html_url: issue.url,
            created_at: issue.createdAt,
            repository_url: issue.repository.url,
            repository_name: issue.repository.nameWithOwner,
            license: issue.repository.licenseInfo,
            stars_count: issue.repository.stargazerCount,
            fork_count: issue.repository.forkCount,
            language: issue.repository.primaryLanguage?.name || null,
            is_assigned: issue.assignees.totalCount > 0,
            labels: issue.labels.nodes.map((label: any) => label.name),
            comments_count: issue.comments.totalCount,
            has_pull_requests: issue.timelineItems.totalCount > 0,
            pr_status: issue.timelineItems.totalCount > 0 ? issue.timelineItems.nodes[0]?.source?.state || null : null,
            status: issue?.timelineItems?.nodes[0]?.source?.state,
            owner_name: issue?.repository?.nameWithOwner?.split('/')[0] ?? null,
          })),
          hasNextPage: response.data.search.pageInfo.hasNextPage,
          endCursor: response.data.search.pageInfo.endCursor,
        })),
        catchError(error => {
          console.error("Error fetching GitHub issues:", error);
          return throwError(error);
        })
      );
  }
}
