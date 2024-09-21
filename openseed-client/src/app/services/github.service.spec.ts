import { TestBed } from '@angular/core/testing';

import { GitHubService } from './github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FilterParams } from '../interface/filter-params';

describe('GithubService', () => {
  let service: GitHubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GitHubService]
    });

    service = TestBed.inject(GitHubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch GitHub issues with the correct GraphQL query and return parsed data', () => {
    const mockResponse = {
      data: {
        search: {
          pageInfo: {
            hasNextPage: true,
            endCursor: 'endcursor123'
          },
          nodes: [
            {
              title: 'Issue 1',
              url: 'http://github.com/repo1/issue1',
              createdAt: '2024-09-01T00:00:00Z',
              repository: {
                nameWithOwner: 'repo1',
                url: 'http://github.com/repo1',
                stargazerCount: 100,
                forkCount: 20,
                licenseInfo: { name: 'MIT' },
                primaryLanguage: { name: 'JavaScript' }
              },
              assignees: { totalCount: 1 },
              labels: {
                nodes: [{ name: 'bug' }, { name: 'good first issue' }]
              },
              comments: { totalCount: 10 },
              timelineItems: {
                totalCount: 1,
                nodes: [
                  {
                    source: { state: 'OPEN' }
                  }
                ]
              }
            }
          ]
        }
      }
    };

    const params: FilterParams = {
      label: 'good first issue',
      language: 'JavaScript',
      hasPullRequests: true,
      createdAfter: new Date(2024-0o1-0o1),
      license: 'MIT',
      title: 'Issue 1',
      cursor: null,
      minStars: 50,
      maxStars: 200,
      minForks: 10,
      maxForks: 30
    };

    service.fetchGitHubIssues(params).subscribe(result => {
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].title).toBe('Issue 1');
      expect(result.hasNextPage).toBe(true);
      expect(result.endCursor).toBe('endcursor123');
    });

    const req = httpMock.expectOne(service['backendUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.query).toContain('query($queryString: String!, $cursor: String)');
    req.flush(mockResponse); // Simulate the HTTP response
  });

  it('should filter issues by stars and forks', () => {
    const mockResponse = {
      data: {
        search: {
          pageInfo: {
            hasNextPage: false,
            endCursor: 'cursorXYZ'
          },
          nodes: [
            {
              title: 'Issue 1',
              url: 'http://github.com/repo1/issue1',
              createdAt: '2024-09-01T00:00:00Z',
              repository: {
                nameWithOwner: 'repo1',
                url: 'http://github.com/repo1',
                stargazerCount: 150,
                forkCount: 15,
                licenseInfo: { name: 'MIT' },
                primaryLanguage: { name: 'JavaScript' }
              },
              assignees: { totalCount: 0 },
              labels: {
                nodes: [{ name: 'bug' }, { name: 'good first issue' }]
              },
              comments: { totalCount: 2 },
              timelineItems: {
                totalCount: 0,
                nodes: []
              }
            }
          ]
        }
      }
    };

    const params: FilterParams = {
      label: 'good first issue',
      language: 'JavaScript',
      hasPullRequests: false,
      minStars: 100,
      maxStars: 200,
      minForks: 10,
      maxForks: 30
    };

    service.fetchGitHubIssues(params).subscribe(result => {
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].stars_count).toBe(150);
      expect(result.issues[0].fork_count).toBe(15);
    });

    const req = httpMock.expectOne(service['backendUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle errors gracefully', () => {
    const params: FilterParams = {
      label: 'good first issue', language: '', hasPullRequests: true,
      minStars: 0,
      maxStars: 10000,
      minForks: 0,
      maxForks: 10000
    };

    service.fetchGitHubIssues(params).subscribe(
      () => fail('Expected an error, not issues'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Error fetching GitHub issues');
      }
    );

    const req = httpMock.expectOne(service['backendUrl']);
    expect(req.request.method).toBe('POST');

    req.flush('Error fetching GitHub issues', { status: 500, statusText: 'Server Error' });
  });
});