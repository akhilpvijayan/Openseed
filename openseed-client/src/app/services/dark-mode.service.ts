import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    this.darkModeSubject.next(true);
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  }

  disableDarkMode() {
    this.darkModeSubject.next(false);
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }

  toggleDarkMode() {
    if (this.darkModeSubject.value) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  isDarkModeEnabled(): boolean {
    return this.darkModeSubject.value;
  }
}
