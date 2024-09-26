import { TranslateService } from '@ngx-translate/core';
import { DarkModeService } from './../../services/dark-mode.service';
import { Component, Renderer2, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  dropdownOpen = false;
  isDarkMode = this.darkModeService.isDarkModeEnabled();
  languages = [
    { code: 'en', label: 'English', flag: 'assets/united-states.png' }, 
    { code: 'es', label: 'Spanish', flag: 'assets/spain.png' }, 
    { code: 'fr', label: 'French', flag: 'assets/france.png' },
    { code: 'de', label: 'German', flag: 'assets/germany.png' }, 
    { code: 'it', label: 'Italian', flag: 'assets/italy.png' }, 
    { code: 'hi', label: 'Hindi', flag: 'assets/india.png' }, 
  ];
  selectedLanguage = this.languages[0];

  constructor(private renderer: Renderer2,
    private darkModeService: DarkModeService,
    private translate: TranslateService){
      this.translate.setDefaultLang('en');
    }

  ngOnInit(): void {
    if(this.isDarkMode){
      const body = document.body;
      this.renderer.addClass(body, 'dark-mode');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.toggleDarkMode();
  }

  switchLanguage(language: any, event: Event) {
    if(language?.code){
      event.stopPropagation();
      this.selectedLanguage = language;
      this.translate.use(this.selectedLanguage.code);
      this.closeDropdown();
    }
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

    this.dropdownOpen = false; // Close dropdown if clicking outside
  }

  openGithub() {
    window.open('https://github.com/akhilpvijayan/openseed', '_blank');
  }  
}
