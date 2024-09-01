import { DarkModeService } from 'src/app/services/dark-mode.service';
import { Component, OnInit } from '@angular/core';
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
    this.searchIssues();
  }

  searchIssues() {
    this.githubService.fetchGitHubIssues(this.params).subscribe(
      (response: any) => {
        this.issues = response.issues;
        console.log(this.issues);
      },
      (error: any) => {
        console.error("Error loading issues", error);
      }
    );
  }
  

  buildQuery(): string {
    // Example: Customize this to build the query string based on user input
    return `is:open+language:javascript+stars:>100+created:>2023-01-01+label:bug+fork:false`;
  }
}