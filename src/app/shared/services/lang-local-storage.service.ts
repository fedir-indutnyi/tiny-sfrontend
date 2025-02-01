import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LangLocalStorageService {
  myLanguage:string

  constructor(private translateService: TranslateService) {
  };

  startLanguage(): void {
    if (localStorage.getItem('noAuthLang')) {
      const langObj: { noAuthLang: string } = JSON.parse(localStorage.getItem('noAuthLang') || '');
      this.translateService.use(langObj.noAuthLang);
      this.myLanguage = langObj.noAuthLang
    } else if (navigator.language.substring(0, 2).includes('uk')) {
      this.translateService.use('uk')
      this.myLanguage = 'uk'
    } else if (navigator.language.substring(0, 2).includes('pl')) {
      this.translateService.use('pl')
      this.myLanguage = 'pl'
    }
  };

  setLanguage(noAuthLang: string): void {
    localStorage.setItem('noAuthLang', JSON.stringify({noAuthLang}));
    this.translateService.use(noAuthLang);
  };

  getLanguageCode(): string {
    return this.myLanguage
  };
}
