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

    if(!this.isInitialLoad){
      this.isLoadMore = true;
    }

    if((this.params.category && this.params.category !='all') || this.params.repository ||  this.params.owner){
      this.fetchIssuesByMoreFilters();
    }
    else{
      this.fetchIssues();
    }
  }

  fetchIssues(){
    this.githubService.fetchGitHubIssues(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.hasNextPage;
        this.params.cursor = this.endCursor = data.endCursor;
        if(this.issues.length < 20 && this.hasNextPage){
          this.isLoadMore = this.issues.length > 0 ? true : false;
          this.isInitialLoad = this.issues.length > 0 ? false : true;
          this.fetchIssues();
        }
        else{
          this.isLoading = this.issues.length > 0 ? false : true;
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

  fetchIssuesByMoreFilters(){
    this.githubService.fetchIssuesByMoreFilters(this.params).subscribe(
      data => {
        this.issues = this.issues.concat(data.issues);
        this.hasNextPage = data.hasNextPage;
        this.params.cursor = this.endCursor = data.endCursor;
        if(this.issues.length < 20 && this.hasNextPage){
          this.isLoadMore = this.issues.length > 0 ? true : false;
          this.isInitialLoad = this.issues.length > 0 ? false : true;
          this.fetchIssuesByMoreFilters();
        }
        else{
          this.isLoading = this.issues.length > 0 ? false : true;
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

  setFilterValues(){
    const bookMarkFilter = this.bookmarkService.getFilterBookmarks();
    if(bookMarkFilter){
      this.params = {
        ...this.params,
        ...bookMarkFilter
      }; 
    }
    else{
      this.params = {
        ...this.params,
        ...this.filter
      }; 
    }
    this.params.cursor = null;   
    if(this.params.isOnlyBookmarks){
      this.loadBookmarks();
    }
    else{
      this.loadIssues();
    }
  }

  onContainerScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const pos = container.scrollTop + container.clientHeight;
    const max = container.scrollHeight;
    this.showScrollToTopButton = container.scrollTop > 500;

    if (pos > max - 100) {
      this.loadIssues();
    }
  }

  scrollToTop(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({ top: 0, behavior: 'smooth' });
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
    if(this.issues.length === 0){
      this.isEmptyBookmarks = true;
    }
  }
}