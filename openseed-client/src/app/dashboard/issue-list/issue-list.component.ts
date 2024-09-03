import { DarkModeService } from 'src/app/services/dark-mode.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { GitHubService } from 'src/app/services/github.service';
import { FilterParams } from 'src/app/interface/filter-params';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit{
  searchQuery = '';
  isDarkMode = localStorage.getItem('darkMode') === 'true';
  issues: any[] = [];
  isLoading: boolean = false;
  hasNextPage: boolean = true;
  endCursor: string | null = null;
  params: FilterParams = {
    language: 'C#',
    isAssigned: false,
    hasPullRequests: true,
    minStars: 10,
    maxStars: 1000,
    minForks: 0,
    cursor: '',
    category: 'web development',
  };
  constructor(private githubService: GitHubService,
    private darkModeService: DarkModeService) {
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
   }

   ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues() {
    if (this.isLoading || !this.hasNextPage) {
      return;
    }
    this.isLoading = true;

    this.githubService.fetchGitHubIssues(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.hasNextPage;
        this.params.cursor = this.endCursor = data.endCursor;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching issues:', error);
        this.isLoading = false;
      }
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight;
    if (pos > max - 100) {
      // Near the bottom of the page
      this.loadIssues();
    }
  }

  buildQuery(): string {
    // Example: Customize this to build the query string based on user input
    return `is:open+language:javascript+stars:>100+created:>2023-01-01+label:bug+fork:false`;
  }

  @HostListener('scroll', ['$event.target'])
  onContainerScroll(container: any) {
    const pos = container.scrollTop + container.offsetHeight;
    const max = container.scrollHeight;
  
    if (pos > max - 100) {
      this.loadIssues();
    }
  }
  
}