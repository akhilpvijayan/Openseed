import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'open-seed';

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'es', 'fr', 'de', 'it', 'hi', 'ml']);
    translate.setDefaultLang('en');

    // Check local storage for saved language or use browser default
    const browserLang = translate.getBrowserLang();
    const savedLang = localStorage.getItem('appLanguage');

    if (savedLang && translate.getLangs().includes(savedLang)) {
      translate.use(savedLang);
    } else {
      translate.use(browserLang && translate.getLangs().includes(browserLang) ? browserLang : 'en');
    }
  }
}
