import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    let queryString = 'is:open is:issue archived:false label:"good first issue"';

    //Filter by label
    if (params.label) {
      const labels = params.label.split(",").map(label => `"${label.trim()}"`);
      queryString += ` label:${labels.join(",")}`;
    }

    if (params.language) {
      const languages = params.language.split(' ')
      const languageQuery = languages.map(lang => `language:${lang}`).join(' ')
      queryString += ` ${languageQuery}`
    }

    if (params.hasPullRequests) {
      queryString += " linked:pr";
    } else {
      queryString += " -linked:pr";
    }

    // // Filter by creation date after a certain date
    if (params.createdAfter) {
      queryString += ` created:>=${params.createdAfter}`;
    }

    // // Filter by creation date before a certain date
    if (params.license && params.license !== 'all') {
      queryString += ` license:"${params.license}"`;
    }
    
    // // Filter by title
    if (params.title) {
      queryString += ` ${params.title} in:name`;
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
            repository_name: issue?.repository?.nameWithOwner,
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

  fetchIssuesByMoreFilters(params: FilterParams): Observable<{
    issues: Issue[]
    hasNextPage: boolean
    endCursor: string
  }> {
    
    const query = `query($queryString: String!, $cursor: String) {
        search(query: $queryString, type: REPOSITORY, first: 10, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            ... on Repository {
              nameWithOwner
              url
              stargazerCount
              forkCount
              licenseInfo{
                name   
              }
              primaryLanguage {
                name
              }
              issues(labels: ["good first issue"], states: OPEN, first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
                nodes {
                  title
                  url
                  createdAt
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
                }
              }
            }
          }
        }
      }`
  
    let queryString = 'is:public archived:false'
    if (params.language) {
      const languages = params.language.split(' ')
      const languageQuery = languages.map(lang => `language:${lang}`).join(' ')
      queryString += ` ${languageQuery}`
    }

    if (params.license && params.license !== 'all') {
      queryString += ` license:"${params.license}"`;
    }
  
    if (params.category && params.category !== 'all') {
      queryString += ` topic:${params.category}`;
    }

    if(params.repository){
      queryString += ` repo:${params.repository}`
    }

    if(params.owner){
      queryString += ` user:${params.owner}`
    }

    if (params.title) {
      queryString += ` ${params.title} in:name`;
    }

    if (params.maxStars) {
      queryString += ` stars:<${params.maxStars}`;
    }

    const variables = {
      queryString,
      cursor: params.cursor,
    }

    this.minStars = params.minStars ?? 0;
    this.maxStars= params.maxStars ?? 100000;
    this.minForks = params.minForks ?? 0;
    this.maxForks = params.maxForks ?? 100000;
  
    return this.http.post<any>(this.backendUrl, { query, variables })
    .pipe(
      map(response => {
        const repositories = response.data.search.nodes;
        const filteredRepositories = repositories.filter((repo: any) => {
          const hasLicense = Boolean(repo.licenseInfo);
          const stars = repo.stargazerCount;
          const forks = repo.forkCount;
          let isValidRepo = stars >= this.minStars && forks >= this.minForks && hasLicense;
          return isValidRepo;
        });
  
        const issues = filteredRepositories.flatMap((repo: any) =>
          repo.issues.nodes.map((issue: any) => {
            const issueDetails = {
              id: issue.url,
              title: issue.title,
              html_url: issue.url,
              created_at: issue.createdAt,
              repository_url: repo.url,
              repository_name: repo.nameWithOwner,
              license: repo.licenseInfo?.name || null,
              stars_count: repo.stargazerCount,
              fork_count: repo.forkCount,
              language: repo.primaryLanguage?.name || null,
              is_assigned: issue.assignees.totalCount > 0,
              labels: issue.labels.nodes.map((label: any) => label.name),
              comments_count: issue.comments.totalCount,
              has_pull_requests: issue.timelineItems?.totalCount > 0 || false,
              pr_status: issue.timelineItems?.totalCount > 0 ? issue.timelineItems.nodes[0]?.source?.state || null : null,
              status: issue.timelineItems?.nodes[0]?.source?.state || null,
              owner_name: repo.nameWithOwner.split('/')[0] ?? null,
            };
            return issueDetails;
          })
          .filter((issue: any) => {
            const issueDate = new Date(issue.created_at);
            const startDate = params.createdAfter ? new Date(params.createdAfter) : null;
            
            // Date filtering logic
            let isDateInRange = true;
            if (startDate) {
              isDateInRange = issueDate >= startDate;
            }

            let isTitleMatch = true;
            if (params.title) {
              const titleLowerCase = issue.title.toLowerCase();
              const searchTitle = params.title.toLowerCase();
              isTitleMatch = titleLowerCase.includes(searchTitle);
            }

            return isDateInRange && isTitleMatch;
          })          
        );
  
        return {
          issues,
          hasNextPage: response.data.search.pageInfo.hasNextPage,
          endCursor: response.data.search.pageInfo.endCursor,
        };
      }),
      catchError(error => {
        console.error("Error fetching GitHub issues:", error);
        return throwError(error);
      })
    );
      
}
}
