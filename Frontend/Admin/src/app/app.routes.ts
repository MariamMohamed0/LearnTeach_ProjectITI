import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Loading page components
import { Header } from './components/loadingPage/header/header';
import { About } from './components/loadingPage/about/about';
import { Sections } from './components/loadingPage/sections/sections';
import { Contact } from './components/loadingPage/contact/contact';
import { Sidebar } from './components/shared/sidebar/sidebar';
import { Home } from './components/loadingPage/home/home';

// Admin components
import { CategoryComponent } from './components/admin/category-component/category-component';
import { ProjectComponent } from './components/admin/project-component/project-component';
import { SocialMediaComponent } from './components/admin/social-media-component/social-media-component';
import { MaterialComponent } from './components/admin/material-component/material-component';
import { SkillComponent } from './components/admin/skill-component/skill-component';

import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { ForgetPassword } from './components/forget-password/forget-password';
import { DashboardComponent } from './components/admin/dashboard-component/dashboard-component';

import { AuthGuard } from './guards/auth.guard';

import { PostsComponent } from './components/admin/posts/posts';
import { CommentsComponent } from './components/admin/comments/comments';
import { PostViewComponent } from './components/admin/post-view/post-view';
import { PostLikesComponent } from './components/admin/likes/likes';

import { DiamondPopupComponent } from './components/admin/diamond-popup-component/diamond-popup-component';
import { DiamondDashboardComponent } from './components/admin/diamond-dashboard-component/diamond-dashboard-component';
import { DiamondOffersComponent } from './components/admin/diamond-offers-component/diamond-offers-component';
import { EditDiamondComponent } from './components/admin/edit-diamond-component/edit-diamond-component';
import { CreateNewDiamondPackageComponent } from './components/admin/create-new-diamond-package-component/create-new-diamond-package-component';

import { PremiumDashboardComponent } from './components/admin/premium-statistics-dashboard-component/premium-statistics-dashboard-component';
import { PremiumOffersComponent } from './components/admin/premium-offers-component/premium-offers-component';
import { PremiumOffersEditComponent } from './components/admin/premium-offers-edit-component/premium-offers-edit-component';
import { PremiumAddOfferComponent } from './components/admin/premium-add-offer-component/premium-add-offer-component';

// Sara branch
import { AdminReportsComponent } from './components/admin-reports/admin-reports';
import { AdminCertificatesComponent } from './components/certificates/certificates';
import { Details } from './components/NationalId/details/details';
import { PendingList } from './components/NationalId/pending-list/pending-list';
import { GenerateOtp } from './components/generate-otp/generate-otp';
import { YouProfileComponent } from './components/user/you-profile-component/you-profile-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'forget', component: ForgetPassword },

  // Loading page
  { path: 'home', component: Home },
  { path: 'header', component: Header },
  { path: 'about', component: About },
  { path: 'section', component: Sections },
  { path: 'contact', component: Contact },

  // Admin
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
  { path: 'comments', component: CommentsComponent, canActivate: [AuthGuard] },
  { path: 'likes', component: PostLikesComponent, canActivate: [AuthGuard] },
  { path: 'materials', component: MaterialComponent, canActivate: [AuthGuard] },
  { path: 'diamonds', component: DiamondDashboardComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'skill', component: SkillComponent, canActivate: [AuthGuard] },
  { path: 'social-media', component: SocialMediaComponent, canActivate: [AuthGuard] },

  // Posts (admin)
  { path: 'admin/posts', component: PostsComponent, canActivate: [AuthGuard] },
  { path: 'admin/comment', component: CommentsComponent, canActivate: [AuthGuard] },
  { path: 'admin/posts/:postId/comments', component: PostViewComponent, canActivate: [AuthGuard] },
  { path: 'admin/posts/:postId/likes', component: PostLikesComponent, canActivate: [AuthGuard] },

  // Diamonds
  { path: 'diamonds-popup', component: DiamondPopupComponent, canActivate: [AuthGuard] },
  { path: 'admin/diamonds', component: DiamondDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/diamonds-offers', component: DiamondOffersComponent, canActivate: [AuthGuard] },
  { path: 'admin/diamonds/edit/:id', component: EditDiamondComponent, canActivate: [AuthGuard] },
  { path: 'admin/diamond-offers/create', component: CreateNewDiamondPackageComponent, canActivate: [AuthGuard] },

  // Premium
  { path: 'admin/premium-statistics', component: PremiumDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/premium-offers', component: PremiumOffersComponent, canActivate: [AuthGuard] },
  { path: 'admin/premium-offers/edit/:id', component: PremiumOffersEditComponent, canActivate: [AuthGuard] },
  { path: 'admin/premium-offers/create', component: PremiumAddOfferComponent, canActivate: [AuthGuard] },

  // Sara Branch
  { path: 'certificates', component: AdminCertificatesComponent, canActivate: [AuthGuard] },
  { path: 'admin-reports', component: AdminReportsComponent, canActivate: [AuthGuard] },

{
  path: 'you-profile/:id',
  component: YouProfileComponent
},

  // NationalId


  //Maysoon 
  { path: 'generate-otp', component: GenerateOtp },

  //NationalId

  {
    path: 'admin', children: [
      {
        path: 'national-id', children: [
          { path: '', component: PendingList },
          { path: ':id', component: Details }
        ]
      }
    ]
  },

  // fallback
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'disabled',
    anchorScrolling: 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
