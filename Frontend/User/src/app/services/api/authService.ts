
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable,tap } from 'rxjs';
// import { environment } from '../../../environments/environment';
// <<<<<<< HEAD
// import { LoginDTO, RegisterDTO, ResetPasswordDTO, UserProfileDTO } from '../../models/auth';
// import { CurrentUser } from '../../models/current-user';
// import { jwtDecode } from 'jwt-decode';
// =======
// import { LoginDTO, RegisterDTO, UserProfileDTO, ResetPasswordCodeDTO, ForgetPasswordDTO, VerifyCodeDTO } from '../../models/auth';
// >>>>>>> main


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/Authentication`;

//   constructor(private http: HttpClient) { }


//   registerAdmin(dto: RegisterDTO): Observable<any> {
//     return this.http.post(`${this.apiUrl}/RegisterAdmin`, dto);
//   }

//   login(dto: LoginDTO): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Login`, dto);
//   }


//   login2FA(email: string, otp: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Login2FA`, { email, otp });
//   }

//   getProfile(): Observable<UserProfileDTO> {
//     const token = this.getAccessToken();
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get<UserProfileDTO>(`${this.apiUrl}/Profile`, { headers });
//   }


//   saveTokens(accessToken: string, refreshToken: string) {
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//   }

//   logout(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//   }

//   getAccessToken(): string | null {
//     return localStorage.getItem('accessToken');
//   }

//   getRefreshToken(): string | null {
//     return localStorage.getItem('refreshToken');
//   }

//   registerUser(dto: RegisterDTO): Observable<any> {
//     return this.http.post(`${this.apiUrl}/RegisterUser`, dto);
//   }
//   loginuser(dto: { Email: string; Password: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Login`, dto, {
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }


//   saveCurrentUser(user: { userId: number, fullName: string, email: string, role: string, profilePic?: string }) {
//     localStorage.setItem('currentUser', JSON.stringify(user));
//   }

//   get currentUser() {
//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     const payload = JSON.parse(atob(token.split(".")[1]));

//     return {
//       userId: payload.ProfileId,
//       email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
//       name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
//     };
//   }


// <<<<<<< HEAD
// saveTokens(accessToken: string, refreshToken: string) {
// localStorage.setItem('accessToken', accessToken);
// localStorage.setItem('refreshToken', refreshToken);
// }

// logout(): void {
// localStorage.removeItem('accessToken');
// localStorage.removeItem('refreshToken');
// }

// getAccessToken(): string | null {
// return localStorage.getItem('accessToken');
// }

// getRefreshToken(): string | null {
// return localStorage.getItem('refreshToken');
// }

// registerUser(dto: RegisterDTO): Observable<any> {
//   return this.http.post(`${this.apiUrl}/RegisterUser`, dto);
// }
// loginuser(dto: { Email: string; Password: string }): Observable<any> {
//   return this.http.post(`${this.apiUrl}/Login`, dto, {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }




// saveCurrentUser(user: { userId: number, fullName: string, email: string, role: string, profilePic?: string }) {
//   localStorage.setItem('currentUser', JSON.stringify(user));
// }

// get currentUser() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   const payload = JSON.parse(atob(token.split(".")[1]));

//   return {
//     userId: payload.ProfileId,   
//     email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
//     name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
//   };

// }
// public getUserId(): number | null {
//   const user = this.currentUser;
//   return user ? user.userId : null;
// }
// =======

//   //////////////   forget password    ///////////////////////

//   forgetPassword(dto: ForgetPasswordDTO): Observable<any> {
//     return this.http.post(`${this.apiUrl}/ForgetPassword`, dto);
//   }

//   verifyCode(dto: { email: string, code: string }): Observable<string> {
//     return this.http.post(this.apiUrl + '/VerifyCode', dto, { responseType: 'text' });
//   }

//   resetPassword(dto: { email: string; password: string; confirmPassword: string }) {
//     return this.http.post(`${this.apiUrl}/ResetPassword`, dto, {
//       responseType: 'text'  // <--- هنا مهم
//     });
//   }



//   //////////////   forget password    ///////////////////////
// >>>>>>> main


// //Maysoon
//  getCurrentUser2(): CurrentUser | null {
//      //const token = this.getAccessToken();
//     const token = localStorage.getItem("token");
//     if (!token) return null;

//     const decoded: any = jwtDecode(token);

//     const roles: ('Student' | 'Teacher')[] = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

//     return {
//       userId: Number(decoded.ProfileId),
//       role: roles.length > 0 ? roles[0] : 'Student',
//       fname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
//       lname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
//     };
//   }

//   getCurrentUserId(): number | null {
//     const user = this.getCurrentUser2();
//     return user ? user.userId : null;
//   }
//   getCurrentUserRole(): ('Teacher' | 'Student') | null {
//     const user = this.getCurrentUser2();
//     return user ? user.role : null;
//   }

//   getCurrentUserRoles(): ('Teacher' | 'Student')[] {
//     const token = this.getAccessToken();
//     if (!token) return [];

//     const decoded: any = jwtDecode(token);
//     return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
//   }


// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  LoginDTO,
  RegisterDTO,
  UserProfileDTO,
  // ResetPasswordDTO,
  ResetPasswordCodeDTO,
  ForgetPasswordDTO,
  VerifyCodeDTO
} from '../../models/auth';

import { CurrentUser } from '../../models/current-user';
import { jwtDecode } from 'jwt-decode';
import { Skill } from '../../models/skillStart';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Authentication`;

  constructor(private http: HttpClient) { }
    decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  ////////////// REGISTER + LOGIN //////////////

  registerAdmin(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegisterAdmin`, dto);
  }

  registerUser(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegisterUser`, dto);
  }

  login(dto: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, dto);
  }

  loginuser(dto: { Email: string; Password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, dto, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  login2FA(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login2FA`, { email, otp });
  }

  ////////////// PROFILE //////////////

  getProfile(): Observable<UserProfileDTO> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserProfileDTO>(`${this.apiUrl}/Profile`, { headers });
  }

  ////////////// TOKENS //////////////

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }


 getAccessToken(): string | null {
  return localStorage.getItem('token');
}


  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  ////////////// CURRENT USER //////////////

  saveCurrentUser(user: { userId: number; fullName: string; email: string; role: string; profilePic?: string }) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  get currentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      userId: payload.ProfileId,
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    };
  }

  public getUserId(): number | null {
    const user = this.currentUser;
    return user ? user.userId : null;
  }
// authService.ts
getUserSkills(userId: number) {
  return this.http.get<Skill[]>(`${environment.apiUrl}/Skill/user/${userId}`);

}

  ////////////// FORGET PASSWORD //////////////

  forgetPassword(dto: ForgetPasswordDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/ForgetPassword`, dto);
  }

  verifyCode(dto: { email: string, code: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/VerifyCode`, dto, { responseType: 'text' });
  }

  resetPassword(dto: { email: string; password: string; confirmPassword: string }) {
    return this.http.post(`${this.apiUrl}/ResetPassword`, dto, { responseType: 'text' });
  }

  ////////////// CURRENT USER (Maysoon) //////////////

getCurrentUser2(): CurrentUser | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded: any = jwtDecode(token);

  const roles: ('Student' | 'Teacher')[] =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];

  return {
    userId: Number(decoded.ProfileId),
    role: roles.length > 0 ? roles[0] : 'Student',
    fname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    lname: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  };
}


  getCurrentUserId(): number | null {
    const user = this.getCurrentUser2();
    return user ? user.userId : null;
  }

  getCurrentUserRole(): ('Teacher' | 'Student') | null {
    const user = this.getCurrentUser2();
    return user ? user.role : null;
  }

  getCurrentUserRoles(): ('Teacher' | 'Student')[] {
    const token = this.getAccessToken();
    if (!token) return [];

    const decoded: any = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
  }


  //Maysoon 
  generateOtp(email: string) {
  return this.http.post(`${this.apiUrl}/GenerateRegistrationOTP/${email}`, {});
}

getProfileId(): number {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  return profile.userId;
}
logout(): void {
  localStorage.removeItem('token');          // ✅ المهم
  localStorage.removeItem('refreshToken');  // ✅
  localStorage.removeItem('currentUser');   // ✅
  localStorage.removeItem('profile');       // ✅
}

}
