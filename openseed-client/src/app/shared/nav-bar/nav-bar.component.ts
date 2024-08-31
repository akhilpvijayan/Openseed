import { DarkModeService } from './../../services/dark-mode.service';
import { Component, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  isDarkMode = this.darkModeService.isDarkModeEnabled();

  constructor(private renderer: Renderer2,
    private darkModeService: DarkModeService){}

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
}
