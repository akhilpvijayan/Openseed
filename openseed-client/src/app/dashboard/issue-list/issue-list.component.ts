import { DarkModeService } from 'src/app/services/dark-mode.service';
import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GitHubService } from 'src/app/services/github.service';
import { FilterParams } from 'src/app/interface/filter-params';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit {
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

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  showScrollToTopButton: boolean = false;
  searchQuery = '';
  isDarkMode = localStorage.getItem('darkMode') === 'true';
  issues: any[] = [];
  isLoading: boolean = false;
  isLoadMore: boolean = false;
  isInitialLoad: boolean = true;
  hasNextPage: boolean = true;
  endCursor: string | null = null;
  params: any;
  isEmptyBookmarks: boolean = false;
  constructor(private githubService: GitHubService,
    private darkModeService: DarkModeService,
    private bookmarkService: BookmarkService) {
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.setFilterValues();
  }

  loadIssues() {
    if (this.isLoading || !this.hasNextPage || this.params.isOnlyBookmarks) {
      return;
    }
    this.isEmptyBookmarks = false;
    this.isLoading = true;

    if (!this.isInitialLoad) {
      this.isLoadMore = true;
    }

    if ((this.params.category && this.params.category != 'all') || this.params.repository || this.params.owner) {
      this.fetchIssuesByMoreFilters();
    }
    else {
      this.fetchIssues();
    }
  }

  fetchIssues() {
    this.githubService.fetchGitHubIssues(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.hasNextPage;
        this.endCursor = data.endCursor;
        this.params.cursor = this.endCursor; // Save explicitly
        if (this.issues.length < 20 && this.hasNextPage) {
          this.isLoadMore = this.issues.length > 0 ? true : false;
          this.isInitialLoad = this.issues.length > 0 ? false : true;
          this.fetchIssues();
        }
        else {
          this.isLoading = false; // Always disable loading at end
          this.isInitialLoad = false;
          this.isLoadMore = false;
        }
      },
      error => {
        console.error('Error fetching issues:', error);
        this.isLoading = false;
      }
    );
  }

  fetchIssuesByMoreFilters() {
    this.githubService.fetchIssuesByMoreFilters(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.hasNextPage;
        this.endCursor = data.endCursor;
        this.params.cursor = this.endCursor; // Save explicitly
        if (this.issues.length < 20 && this.hasNextPage) {
          this.isLoadMore = this.issues.length > 0 ? true : false;
          this.isInitialLoad = this.issues.length > 0 ? false : true;
          this.fetchIssuesByMoreFilters();
        }
        else {
          this.isLoading = false; // Always disable loading at end
          this.isInitialLoad = false;
          this.isLoadMore = false;
        }
      },
      error => {
        console.error('Error fetching issues:', error);
        this.isLoading = false;
      }
    );
  }

  async setFilterValues() {
    const bookMarkFilter = localStorage.getItem('filterBookmarks'); // Assuming old filter was locally stored
    let parsedBookMarkFilter = null;
    if (bookMarkFilter) {
      parsedBookMarkFilter = JSON.parse(bookMarkFilter);
    }

    if (parsedBookMarkFilter) {
      this.params = {
        ...this.params,
        ...parsedBookMarkFilter
      };
    } else {
      this.params = {
        ...this.params,
        ...this.filter
      };
    }
    this.params.cursor = null;
    if (this.params.isOnlyBookmarks) {
      await this.loadBookmarks();
    } else {
      this.loadIssues();
    }
  }

  private scrollListener: any;

  ngAfterViewInit() {
    const container = document.querySelector('.content-area');
    if (container) {
      this.scrollListener = this.onContainerScroll.bind(this);
      container.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy() {
    const container = document.querySelector('.content-area');
    if (container && this.scrollListener) {
      container.removeEventListener('scroll', this.scrollListener);
    }
  }

  onContainerScroll(event?: Event): void {
    const container = event ? event.target as HTMLElement : this.scrollContainer.nativeElement;
    const pos = container.scrollTop + container.clientHeight;
    const max = container.scrollHeight;
    this.showScrollToTopButton = container.scrollTop > 500;

    if (pos >= max - 200) {
      this.loadIssues();
    }
  }

  scrollToTop(): void {
    const container = document.querySelector('.content-area') || this.scrollContainer.nativeElement;
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Set to store resolved boolean states for the UI to prevent constant async checking
  bookmarkedIssues: Set<number> = new Set();

  async toggleBookmark(issue: any) {
    const added = await this.bookmarkService.toggleBookmarkFirestore(issue);
    if (added) {
      this.bookmarkedIssues.add(issue.id);
    } else {
      this.bookmarkedIssues.delete(issue.id);
    }
  }

  isBookmarked(issue: any): boolean {
    // Synchronously check against our local set for UI updates
    return this.bookmarkedIssues.has(issue.id);
  }

  async loadBookmarks() {
    this.isLoading = true;
    try {
      const bookmarks = await this.bookmarkService.getAllBookmarksFirestore();
      this.issues = bookmarks;
      // Populate the local set to show filled stars
      bookmarks.forEach(b => this.bookmarkedIssues.add(b.id));

      if (this.issues.length === 0) {
        this.isEmptyBookmarks = true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }
}