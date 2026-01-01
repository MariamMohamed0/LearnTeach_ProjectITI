import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/api/authService';


@Injectable({
providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private authService: AuthService, private router: Router) {}

canActivate(): boolean {
const token = this.authService.getAccessToken();


if (!token) {

  this.router.navigate(['/login']);
  return false;
}


return true;


}
}
