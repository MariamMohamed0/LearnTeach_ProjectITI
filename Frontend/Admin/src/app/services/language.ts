import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private rtlSubject = new BehaviorSubject<boolean>(false);
  isRtl$ = this.rtlSubject.asObservable();

  toggleLanguage() {
    const newValue = !this.rtlSubject.value;
    this.rtlSubject.next(newValue);

    document.documentElement.dir = newValue ? 'rtl' : 'ltr';
    document.body.dir = newValue ? 'rtl' : 'ltr';
  }

  getCurrentDirection(): boolean {
    return this.rtlSubject.value;
  }
}
