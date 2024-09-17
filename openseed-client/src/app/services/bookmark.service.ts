import { Injectable } from '@angular/core';
import { FilterParams } from '../interface/filter-params';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private localStorageKey = 'openseed-bookmarkedIssues';
  private localtorageFilterKey = 'filterFormValues';

  constructor() { }

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
    return parsedBookmarks.filter((bookmark: any) => {

      const hasFilters =
        (filter.language && filter.language !== "") ||
        (filter.minStars && filter.minStars !== null) ||
        (filter.maxStars && filter.maxStars !== null) ||
        (filter.minForks && filter.minForks !== null) ||
        (filter.maxForks && filter.maxForks !== null) ||
        (filter.owner && filter.owner !== "") ||
        (filter.label && filter.label !== "") ||
        (filter.category && filter.category !== "") ||
        (filter.createdAfter && filter.createdAfter !== null && filter.createdAfter !== "") ||
        (filter.title && filter.title !== "") ||
        (filter.repository && filter.repository !== "");

      // If no filters are provided, return the bookmark as is
      if (!hasFilters) {
        return true;
      }

      // Check if the language filter is provided and matches
      if (filter.language !== undefined && filter.language !== "") {
        const filterLanguage = filter.language
          .split(',')
          .map((language: string) => language.trim().toLowerCase());

        let bookmarkLanguages = bookmark.language;
        bookmarkLanguages = bookmarkLanguages.split(',')
          .map((language: string) => language.trim().toLowerCase());

        const hasMatchingLanguage = filterLanguage.some((language: string) =>
          bookmarkLanguages.includes(language)
        );

        if (!hasMatchingLanguage) {
          return false;
        }
      }

      // Check if the minimum stars filter is provided and matches
      if (filter.minStars !== null) {
        if (bookmark.stars_count < filter.minStars) {
          return false;
        }
      }

      // Check if the maximum stars filter is provided and matches
      if (filter.maxStars !== null) {
        if (bookmark.stars_count > filter.maxStars) {
          return false;
        }
      }

      // Check if the minimum forks filter is provided and matches
      if (filter.minForks !== null) {
        if (bookmark.fork_count < filter.minForks) {
          return false;
        }
      }

      // Check if the maximum forks filter is provided and matches
      if (filter.maxForks !== null) {
        if (bookmark.fork_count > filter.maxForks) {
          return false;
        }
      }

      // Check if the owner filter is provided and matches
      if (filter.owner !== "") {
        if (bookmark.owner_name.toLowerCase() !== filter.owner.toLowerCase()) {
          return false;
        }
      }

      // Check if the label filter is provided and matches
      if (filter.label !== "") {
        const filterLabels = filter.label
          .split(',')
          .map((label: any) => label.trim().toLowerCase());
        const hasMatchingLabel = filterLabels.some((label: any) =>
          bookmark.labels.map((l: any) => l.toLowerCase()).includes(label)
        );
        if (!hasMatchingLabel) {
          return false;
        }
      }

      // Check if the category filter is provided and matches
      // if (filter.category !== "") {
      //   if (bookmark.category.toLowerCase() !== filter.category.toLowerCase()) {
      //     return false;
      //   }
      // }

      // Check if the license filter is provided and matches
      if (filter.license !== null) {
        if (bookmark.license.name === filter.license) {
          return false;
        }
      }

      // Check if the createdAfter filter is provided and matches
      if (filter.createdAfter !== null && filter.createdAfter !== "") {
        if (new Date(bookmark.created_at) < new Date(filter.createdAfter)) {
          return false;
        }
      }

      // Check if the title filter is provided and matches
      if (filter.title !== "") {
        if (!bookmark.title.toLowerCase().includes(filter.title.toLowerCase())) {
          return false;
        }
      }

      // Check if the repository filter is provided and matches
      if (filter.repository !== "") {
        if (bookmark.repository_name.toLowerCase() !== filter.repository.toLowerCase()) {
          return false;
        }
      }

      // If all conditions are met, return true
      return true;
    });
  }


  // Clear all bookmarks (optional)
  clearBookmarks() {
    localStorage.removeItem(this.localStorageKey);
  }

  getFilterBookmarks() {
    const bookmarks = localStorage.getItem(this.localtorageFilterKey);
    if(bookmarks){
      return JSON.parse(bookmarks)
    }
    return false;
  }
}