import { DarkModeService } from 'src/app/services/dark-mode.service';
import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { GitHubService } from 'src/app/services/github.service';
import { FilterParams } from 'src/app/interface/filter-params';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit{
  private _filter: any;

  @Input()
  set filter(value: any) {
    this._filter = value;
    this.issues = [];
    this.isInitialLoad = true;
    this.isLoading = false;
    this.hasNextPage = true;
    this.setFilterValues();
  }

  get filter(): any {
    return this._filter;
  }

  searchQuery = '';
  isDarkMode = localStorage.getItem('darkMode') === 'true';
  issues: any[] = [];
  isLoading: boolean = false;
  isLoadMore: boolean = false;
  isInitialLoad: boolean = true;
  hasNextPage: boolean = true;
  endCursor: string | null = null;
  params: any;
  constructor(private githubService: GitHubService,
    private darkModeService: DarkModeService,
    private bookmarkService: BookmarkService) {
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

    if(!this.isInitialLoad){
      this.isLoadMore = true;
    }

    this.githubService.fetchGitHubIssues(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.issues.length > 0 ? data.hasNextPage : false;
        this.params.cursor = this.endCursor = data.endCursor;
        if(this.issues.length < 20 && this.hasNextPage){
          this.isLoading = false;
          this.loadIssues();
        }
        this.isLoading = false;
        this.isInitialLoad = false;
        this.isLoadMore = false;
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

  setFilterValues(){
    this.params = {
      ...this.params,
      ...this.filter
    };    
    if(this.params.isOnlyBookmarks){
      this.loadBookmarks();
    }
    else{
      this.loadIssues();
    }
  }

  @HostListener('scroll', ['$event.target'])
  onContainerScroll(container: any) {
    const pos = container.scrollTop + container.offsetHeight;
    const max = container.scrollHeight;
  
    if (pos > max - 100) {
      this.loadIssues();
    }
  }

  toggleBookmark(issue: any) {
    if (this.isBookmarked(issue)) {
      this.bookmarkService.removeBookmark(issue);
    } else {
      this.bookmarkService.addBookmark(issue);
    }
  }
  
  isBookmarked(issue: any): boolean {
    return this.bookmarkService.isBookmarked(issue);
  }

  loadBookmarks() {
    this.issues = this.bookmarkService.getBookmarks(this.params);
  }
}