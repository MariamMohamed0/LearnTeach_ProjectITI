import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/loadingPage/header/header';
import { About } from './components/loadingPage/about/about';
import { Sections } from './components/loadingPage/sections/sections';
import { Contact } from './components/loadingPage/contact/contact';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Footer } from './components/loadingPage/footer/footer';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthInterceptor } from './interceptors/auth.interceptor';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule, HttpClientModule, Header, About, Sections, Contact, Footer],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Learn&Teach');
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) {
        this.viewportScroller.scrollToAnchor(tree.fragment);
      }
    });

  }

}
