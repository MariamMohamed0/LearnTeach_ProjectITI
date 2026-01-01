import { Routes } from '@angular/router';

// Loading page components
import { Header } from './components/loadingPage/header/header';
import { About } from './components/loadingPage/about/about';
import { Sections } from './components/loadingPage/sections/sections';
import { Contact } from './components/loadingPage/contact/contact';
import { Home } from './components/loadingPage/home/home';

// Shared components
import { Sidebar } from './components/shared/sidebar/sidebar';
import { HomeNavbar } from './components/shared/home-navbar/home-navbar';

// Auth
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password-component/forgot-password-component';
import { VerifyCodeComponent } from './components/verify-code-component/verify-code-component';
import { ResetPasswordComponent } from './components/reset-password-component/reset-password-component';
import { ResetSuccessComponent } from './components/reset-success-component/reset-success-component';

// User components
import { HomeComponent } from './components/user/home-component/home-component';
import { MyProfileComponent } from './components/user/my-profile-component/my-profile-component';
import { YouProfileComponent } from './components/user/you-profile-component/you-profile-component';
import { ChosseYourPath } from './components/user/chosse-your-path/chosse-your-path';
import { SettingsComponent } from './components/user/settings-component/settings-component';
import { SkillComponent } from './components/user/skill-component/skill-component';
import { SessionList } from './components/user/session-list/session-list';
import { SessionCreate } from './components/user/session-create/session-create';
import { SessionEdit } from './components/user/session-edit/session-edit';
import { UserSessionFeedback } from './components/user/user-session-feedback/user-session-feedback';
import { NationalIdComponent } from './components/user/national-id/national-id';
import { CertificatesComponent } from './components/user-certificates/user-certificates';
import { UserReportsComponent } from './components/user-reports/user-reports';
import { DashboardComponent } from './components/user/student-dashboard/student-dashboard';
import { PostsListComponent } from './components/user/posts-list/posts-list';
import { PostDetailComponent } from './components/user/post-detail/post-detail';
import { NotificationComponent } from './components/user/notification-component/notification-component';
import { GenerateOtp } from './components/generate-otp/generate-otp';

// Diamond & Premium
import { DiamondsComponent } from './components/diamonds-component/diamonds-component';
import { PaymentFormComponent } from './components/diamond/payment-form-component/payment-form-component';
import { PremiumComponent } from './components/premium-component/premium-component';
import { PremiumPaymentFormComponent } from './components/package/package-payment-form-component/package-payment-form-component';

// Chat
import { ChatLayoutComponent } from './components/chat-layout-component/chat-layout-component';
import { ChatUser } from './components/user/chat-user/chat-user';
import { UserChatWindowComponent } from './components/user-chat-window-component/user-chat-window-component';
import { UserChatLayoutComponent } from './components/user/user-chat-layout-component/user-chat-layout-component';
import { UserChatSidebarComponent } from './components/user/user-chat-sidebar-component/user-chat-sidebar-component';
import { UserChatPlaceholderComponent } from './components/user/user-chat-placeholder-component/user-chat-placeholder-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'header', component: Header },
  { path: 'about', component: About },
  { path: 'section', component: Sections },
  { path: 'contact', component: Contact },
  { path: 'homeNavbar', component: HomeNavbar },

  // User Home
  { path: 'home-user', component: HomeComponent, canActivate: [AuthGuard] },

  // Profiles
  { path: 'myprofile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'chosseyoupath', component: ChosseYourPath, canActivate: [AuthGuard] },
  { path: 'DashboardComponent', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: YouProfileComponent, canActivate: [AuthGuard] },

  // Posts
  { path: 'posts', component: PostsListComponent },
  { path: 'posts/:postId', component: PostDetailComponent },

  // Settings
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

  // Skills
  { path: 'skillstart', component: SkillComponent },

  // Auth
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'forget-password', component: ForgotPasswordComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },

  // Sessions
  { path: 'sessions', component: SessionList, canActivate: [AuthGuard] },
  { path: 'sessions/create', component: SessionCreate, canActivate: [AuthGuard] },
  { path: 'sessions/edit/:id', component: SessionEdit, canActivate: [AuthGuard] },
  { path: 'session-feedback/:sessionId', component: UserSessionFeedback, canActivate: [AuthGuard] },
  { path: 'national-id', component: NationalIdComponent },
  { path: 'generate-otp', component: GenerateOtp },



  { path: 'notifications', component: NotificationComponent },



  // national id
  { path: 'national-id', component: NationalIdComponent },

  // Notifications
  { path: 'notifications', component: NotificationComponent },

  // Reports & Certificates
  { path: 'user-reports', component: UserReportsComponent, canActivate: [AuthGuard] },
  { path: 'user-certificates', component: CertificatesComponent, canActivate: [AuthGuard] },

  // Diamonds & Premium
  { path: 'diamonds', component: DiamondsComponent, canActivate: [AuthGuard] },
  { path: 'payment/form', component: PaymentFormComponent, canActivate: [AuthGuard] },
  { path: 'premium', component: PremiumComponent, canActivate: [AuthGuard] },
  { path: 'premium/payment', component: PremiumPaymentFormComponent, canActivate: [AuthGuard] },

  // Chat
  // { path: 'chat', component: ChatLayoutComponent },
//{ path: 'chat/:chatId', component: ChatLayoutComponent },

//  {
//     path: 'chat/:chatId',
//     component: UserChatWindowComponent
//   },
// {
//   path: 'chat/:chatId',
//   component: UserChatLayoutComponent
// },
// {
//   path: 'chat',
//   component: UserChatLayoutComponent,
//   children: [
//     { path: ':chatId', component: UserChatWindowComponent }
//   ]
// },
{
  path: 'chat',
  component: UserChatLayoutComponent, 
  canActivate: [AuthGuard],
  children: [
    { path: '', component: UserChatPlaceholderComponent }, 
    { path: ':chatId', component: UserChatWindowComponent } 
  ]
},
  // Wildcard
  { path: '**', redirectTo: 'home' }
];
