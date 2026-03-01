import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from './../../services/dark-mode.service';
import { Component, Renderer2, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  dropdownOpen = false;
  isDarkMode = this.darkModeService.isDarkModeEnabled();
  user: User | null = null;
  private userSub: Subscription = new Subscription();
  searchQuery: string = '';

  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ml', label: 'Malayalam' }
  ];
  currentLanguage: string;

  constructor(
    private renderer: Renderer2,
    private darkModeService: DarkModeService,
    public translate: TranslateService,
    public authService: AuthService
  ) {
    this.currentLanguage = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
    });
  }

  changeLanguage(langCode: string): void {
    this.translate.use(langCode);
    localStorage.setItem('appLanguage', langCode);
  }

  ngOnInit(): void {
    if (this.isDarkMode) {
      const body = document.body;
      this.renderer.addClass(body, 'dark-mode');
    }

    this.userSub = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async login() {
    try {
      await this.authService.loginWithGoogle();
    } catch (e) {
      console.error("Login failed", e);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.toggleDarkMode();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.dropdownOpen) return;
    this.dropdownOpen = false;
  }
}
