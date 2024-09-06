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
  
    // Destructure the filter object with default values
    const {
      language,
      minStars = 0,    // Default minimum stars to 0 if not provided
      maxStars = Infinity, // Default maximum stars to Infinity if not provided
      framework,
      label,
      category,
      createdBefore,
      createdAfter,
      minForks = 0,    // Default minimum forks to 0 if not provided
      maxForks = Infinity, // Default maximum forks to Infinity if not provided
      title,
      repository
    } = filter;
  
    return parsedBookmarks.filter((bookmark: any) => {
      // Apply the filters to each bookmark
      return (
        (language ? bookmark.language === language : true) &&
        (bookmark.stars >= minStars) &&
        (bookmark.stars <= maxStars) &&
        (bookmark.forks >= minForks) &&
        (bookmark.forks <= maxForks) &&
        (framework ? bookmark.framework === framework : true) &&
        (label ? bookmark.labels.includes(label) : true) &&
        (category ? bookmark.category === category : true) &&
        (createdBefore ? new Date(bookmark.createdAt) <= createdBefore : true) &&
        (createdAfter ? new Date(bookmark.createdAt) >= createdAfter : true) &&
        (title ? bookmark.title.includes(title) : true) 
        // (repository ? bookmark.repository === repository : true)
      );
    });
  }
  

  // Clear all bookmarks (optional)
  clearBookmarks() {
    localStorage.removeItem(this.localStorageKey);
  }
}