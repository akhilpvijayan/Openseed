import { Injectable } from '@angular/core';
import { FilterParams } from '../interface/filter-params';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private localStorageKey = 'openseed-bookmarkedIssues';

  constructor() {}

  // Add a bookmark to localStorage
  addBookmark(item: any) {
    const bookmarks = this.getBookmarks();
    bookmarks.push(item);
    localStorage.setItem(this.localStorageKey, JSON.stringify(bookmarks));
  }

  // Remove a bookmark from localStorage
  removeBookmark(item: any) {
    let bookmarks = this.getBookmarks();
    bookmarks = bookmarks.filter((bookmark) => bookmark.id !== item.id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(bookmarks));
  }

  // Check if an item is bookmarked
  isBookmarked(item: any): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((bookmark) => bookmark.id === item.id);
  }

  // Fetch all bookmarks from localStorage
  getBookmarks(filter: any = {}): any[] {
    const bookmarks = localStorage.getItem(this.localStorageKey);
    const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];

    if(filter.minStars != null){
      return parsedBookmarks.filter((bookmark: any) => {
        // Apply the filters to each bookmark
        return (
          (filter.language !== undefined && filter.language !== "" ? bookmark.language === filter.language : true) &&
          (filter.minStars ? bookmark.stars_count >= filter.minStars : true) &&
          (filter.maxStars ? bookmark.stars_count <= filter.maxStars : true) &&
          (filter.minForks ? bookmark.fork_count >= filter.minForks : true) &&
          (filter.maxForks ? bookmark.fork_count <= filter.maxForks : true) &&
          (filter.framework !== "" ? bookmark.framework === filter.framework : true) &&
          (filter.label !== "" ? bookmark.labels.includes(filter.label) : true) &&
          (filter.category !== "" ? bookmark.category === filter.category : true) &&
          (filter.createdBefore !== "" ? new Date(bookmark.created_at) <= filter.createdBefore : true) &&
          (filter.createdAfter !== "" ? new Date(bookmark.created_at) >= filter.createdAfter : true) &&
          (filter.title !== "" ? bookmark.title.includes(filter.title) : true) &&
          (filter.repository ? bookmark.repository_name === filter.repository : true)
        );
      });
    }
    else{
      return parsedBookmarks;
    }
  }
  

  // Clear all bookmarks (optional)
  clearBookmarks() {
    localStorage.removeItem(this.localStorageKey);
  }
}