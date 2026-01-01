
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDTO, RegisterDTO, ResetPasswordDTO, UserProfileDTO } from '../../models/auth';


@Injectable({
providedIn: 'root'
})
export class AuthService {
private apiUrl = `${environment.apiUrl}/Authentication`;

constructor(private http: HttpClient) {}


registerAdmin(dto: RegisterDTO): Observable<any> {
return this.http.post(`${this.apiUrl}/RegisterAdmin`, dto);
}

login(dto: LoginDTO): Observable<any> {
return this.http.post(`${this.apiUrl}/Login`, dto);
}


login2FA(email: string, otp: string): Observable<any> {
return this.http.post(`${this.apiUrl}/Login2FA`, { email, otp });
}

getProfile(): Observable<UserProfileDTO> {
const token = this.getAccessToken();
const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
return this.http.get<UserProfileDTO>(`${this.apiUrl}/Profile`, { headers });
}


resetPassword(dto: ResetPasswordDTO): Observable<any> {
return this.http.post(`${this.apiUrl}/ResetPassword`, dto);
}
forgetPassword(email: string) {

  return this.http.post(`${this.apiUrl}/ForgetPassword?email=${email}`, {});
}











saveTokens(accessToken: string, refreshToken: string) {
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
}

logout(): void {
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
}

getAccessToken(): string | null {
return localStorage.getItem('accessToken');
}

getRefreshToken(): string | null {
return localStorage.getItem('refreshToken');
}


//Maysoon 
  generateOtp(email: string) {
  return this.http.post(`${this.apiUrl}/GenerateRegistrationOTP/${email}`, {});
}

}
