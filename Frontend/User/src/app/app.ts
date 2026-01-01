import { AfterViewInit, Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/loadingPage/header/header';
import { About } from './components/loadingPage/about/about';
import { Sections } from './components/loadingPage/sections/sections';
import { Contact } from './components/loadingPage/contact/contact';
import { Footer } from './components/loadingPage/footer/footer';
import { CommonModule, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthInterceptor } from './interceptors/auth.interceptor';
//translation 

// <-- IMPORT createChat
import { createChat } from '@n8n/chat';
import { ChatModule } from './components/chat/chat.module';
import { ChatLayoutComponent } from './components/chat-layout-component/chat-layout-component';
import { ChatSidebarComponent } from './components/chat-sidebar-component/chat-sidebar-component';
import { ChatWindowComponent } from './components/chat-window-component/chat-window-component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    HttpClientModule,
    Header, About, Sections, Contact, Footer,
    ChatLayoutComponent,
    ChatSidebarComponent,
    ChatWindowComponent,
    ReactiveFormsModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  protected readonly title = signal('Learn&Teach');
isRtl = false;

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) {
        this.viewportScroller.scrollToAnchor(tree.fragment);
      }
    });
  }

  // ngAfterViewInit(): void {

  //   createChat({
  //     webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
  //     mode: 'window',
  //     theme: 'light',
  //   });



  //   createChat({
  //     webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
  //     webhookConfig: {
  //       method: 'POST',
  //       headers: {}
  //     },
  //     target: '#n8n-chat',
  //     mode: 'window',
  //     chatInputKey: 'chatInput',
  //     chatSessionKey: 'sessionId',
  //     loadPreviousSession: true,
  //     metadata: {},
  //     showWelcomeScreen: false,
  //     defaultLanguage: 'en',
  //     initialMessages: [
  //       'Hi!👋',
  //       'Welcome in Learn&Teach Website 🏫. How can I assist you today?'
  //     ],
  //     i18n: {
  //       en: {
  //         title: '',
  //         subtitle: "",
  //         footer: '',
  //         getStarted: 'New Conversation',
  //         inputPlaceholder: 'Type your question..',
  //         closeButtonTooltip: ''
  //       },
  //     },
  //     enableStreaming: false,
  //   });

  //   createChat({
  //     webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
  //     mode: 'window', 
  //     theme: 'light',
  //   });



  //     createChat({
  //   	webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
  //   	webhookConfig: {
  //   		method: 'POST',
  //   		headers: {}
  //   	},
  //   	target: '#n8n-chat',
  //   	mode: 'window',
  //   	chatInputKey: 'chatInput',
  //   	chatSessionKey: 'sessionId',
  //   	loadPreviousSession: true,
  //   	metadata: {},
  //   	showWelcomeScreen: false,
  //   	defaultLanguage: 'en',
  //   	initialMessages: [
  //   		'Hi!👋',
  //   		'Welcome in Learn&Teach Website 🏫. How can I assist you today?'
  //   	],
  //   	i18n: {
  //   		en: {
  //   			title: '',
  //   			subtitle: "",
  //   			footer: '',
  //   			getStarted: 'New Conversation',
  //   			inputPlaceholder: 'Type your question..',
  //         closeButtonTooltip: ''
  //   		},
  //   	},
  //   	enableStreaming: false,
  //   });

  // }



  ngAfterViewInit(): void {
  const allowedPages = ['/DashboardComponent', '/myprofile','/user/:id','/diamonds','/premium','/sessions']; 

  const checkPageAndCreateChat = () => {
    const currentUrl = this.router.url.split('?')[0]; 
    const chatContainerExists = document.getElementById('n8n-chat');

    if (allowedPages.includes(currentUrl)) {
      if (!chatContainerExists) {
        const div = document.createElement('div');
        div.id = 'n8n-chat';
        document.body.appendChild(div);
      }

        createChat({
      webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
      mode: 'window',
      theme: 'light',
    });



    createChat({
      webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
      webhookConfig: {
        method: 'POST',
        headers: {}
      },
      target: '#n8n-chat',
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: true,
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: 'en',
      initialMessages: [
        'Hi!👋',
        'Welcome in Learn&Teach Website 🏫. How can I assist you today?'
      ],
      i18n: {
        en: {
          title: '',
          subtitle: "",
          footer: '',
          getStarted: 'New Conversation',
          inputPlaceholder: 'Type your question..',
          closeButtonTooltip: ''
        },
      },
      enableStreaming: false,
    });

    createChat({
      webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
      mode: 'window', 
      theme: 'light',
    });



      createChat({
    	webhookUrl: 'https://jupterkh.app.n8n.cloud/webhook/46516ede-982d-48b1-9f89-d74ed05b2e19/chat',
    	webhookConfig: {
    		method: 'POST',
    		headers: {}
    	},
    	target: '#n8n-chat',
    	mode: 'window',
    	chatInputKey: 'chatInput',
    	chatSessionKey: 'sessionId',
    	loadPreviousSession: true,
    	metadata: {},
    	showWelcomeScreen: false,
    	defaultLanguage: 'en',
    	initialMessages: [
    		'Hi!👋',
    		'Welcome in Learn&Teach Website 🏫. How can I assist you today?'
    	],
    	i18n: {
    		en: {
    			title: '',
    			subtitle: "",
    			footer: '',
    			getStarted: 'New Conversation',
    			inputPlaceholder: 'Type your question..',
          closeButtonTooltip: ''
    		},
    	},
    	enableStreaming: false,
    });


      // استدعاءات أخرى حسب الكود الحالي (حتى لو مكررة)
    } else {
      // الصفحة مش ضمن المسموح → نحذف الشات لو موجود
      if (chatContainerExists) chatContainerExists.remove();
    }
  };

  // نفذها عند init
  checkPageAndCreateChat();

  // نفذها عند أي تغير في الراوتر
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      checkPageAndCreateChat();
    });
}
}
