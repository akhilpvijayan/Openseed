import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueListComponent } from './issue-list.component';
import { GitHubService } from 'src/app/services/github.service';
import { of } from 'rxjs';

describe('IssueListComponent', () => {
  let component: IssueListComponent;
  let fixture: ComponentFixture<IssueListComponent>;
  let mockGithubApiService: any;

  beforeEach(() => {
    mockGithubApiService = jasmine.createSpyObj(['getGoodFirstIssues']);
    TestBed.configureTestingModule({
      declarations: [IssueListComponent],
      providers: [{ provide: GitHubService, useValue: mockGithubApiService }],
    });
    fixture = TestBed.createComponent(IssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display issues fetched from GithubApiService', () => {
    const dummyIssues = {
      data: {
        projects: {
          nodes: [
            {
              name: 'project1',
              issues: {
                nodes: [
                  {
                    title: 'Issue 1',
                    description: 'Description 1',
                    webUrl: 'http://github.com/project1/issue1',
                  },
                ],
              },
            },
          ],
        },
      },
    };

    // Make getGoodFirstIssues return an observable of the dummy response
    mockGithubApiService.fetchGitHubIssues.and.returnValue(of(dummyIssues));

    // Trigger ngOnInit to make the API call
    fixture.detectChanges();

    // Expect the issues to be rendered
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Issue 1');
    expect(compiled.querySelector('a').getAttribute('href')).toBe('http://github.com/project1/issue1');
  });

  it('should display no issues found message when there are no issues', () => {
    const emptyResponse = {
      data: {
        projects: {
          nodes: [],
        },
      },
    };

    // Return empty response for getGoodFirstIssues
    mockGithubApiService.getGoodFirstIssues.and.returnValue(of(emptyResponse));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('No good first issues found.');
  });
});
