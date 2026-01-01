import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  private lang$ = new BehaviorSubject<string>('en');
  public currentLang$ = this.lang$.asObservable();

  private allTranslations: Record<string, Record<string, string>> = {};
  private translations: Record<string, string> = {};

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('lang') || 'en';

    // تحميل كل اللغات مرة واحدة عند init
    const languages = ['en', 'ar']; // ضيف أي لغة تانية هنا
    languages.forEach(lang => {
      this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`).subscribe({
        next: (res) => {
          this.allTranslations[lang] = res || {};
          // لو دي اللغة الحالية، حدث translations فورًا
          if (lang === saved) {
            this.translations = this.allTranslations[lang];
          }
        },
        error: (err) => console.error(`Failed to load ${lang} translations`, err)
      });
    });

    this.setLanguage(saved, false);
  }

  setLanguage(lang: string, save: boolean = true) {
    if (lang === this.lang$.value) return;


    this.translations = this.allTranslations[lang] || {};

    this.lang$.next(lang);
    if (save) localStorage.setItem('lang', lang);


    // document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  }

  translate(key: string): string {
    return this.translations[key] ?? key;
  }

  getCurrentLanguage(): string {
    return this.lang$.value;
  }
}
