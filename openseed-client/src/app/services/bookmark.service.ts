import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { environment } from '../environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor(private authService: AuthService) { }

  private getSafeId(id: string | number): string {
    return encodeURIComponent(id.toString());
  }

  private sanitizePayload(obj: any): any {
    const sanitized = { ...obj };
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    return sanitized;
  }

  async toggleBookmarkFirestore(issue: any): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      // Fallback to local storage
      let localBookmarks = this.getLocalBookmarks();
      const existsIndex = localBookmarks.findIndex((b: any) => b.id === issue.id);
      if (existsIndex > -1) {
        localBookmarks.splice(existsIndex, 1);
        localStorage.setItem('bookmarks', JSON.stringify(localBookmarks));
        return false;
      } else {
        localBookmarks.push(issue);
        localStorage.setItem('bookmarks', JSON.stringify(localBookmarks));
        return true;
      }
    }

    const docRef = doc(this.db, `users/${user.uid}/bookmarks`, this.getSafeId(issue.id));
    const docSnap = await getDoc(docRef);

    try {
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        return false; // Removed bookmark
      } else {
        const cleanIssue = this.sanitizePayload(issue);
        await setDoc(docRef, cleanIssue);
        return true; // Added bookmark
      }
    } catch (err) {
      console.error("Error toggling bookmark in Firestore:", err);
      return false;
    }
  }

  async isBookmarkedFirestore(issueId: number): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      const local = this.getLocalBookmarks();
      return local.some((b: any) => b.id === issueId);
    }

    const docRef = doc(this.db, `users/${user.uid}/bookmarks`, this.getSafeId(issueId));
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async getAllBookmarksFirestore(): Promise<any[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return this.getLocalBookmarks();
    }

    try {
      const bookmarksRef = collection(this.db, `users/${user.uid}/bookmarks`);
      const snapshot = await getDocs(bookmarksRef);
      const bookmarks: any[] = [];
      snapshot.forEach(doc => {
        bookmarks.push(doc.data());
      });
      return bookmarks;
    } catch (err) {
      console.error("Error fetching bookmarks", err);
      return this.getLocalBookmarks();
    }
  }

  private getLocalBookmarks(): any[] {
    const bm = localStorage.getItem('bookmarks');
    return bm ? JSON.parse(bm) : [];
  }
}