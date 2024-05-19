import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userI } from '../../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient , private tokenService: TokenService) { }

  getUsuarioIdByUsername(username: string | null): Observable<any> {
    const url = `${this.apiUrl}/username/${username}/id`;
    return this.http.get<any>(url);
  }

  getUserById(id: number): Observable<userI> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<userI>(url);
  }

  uploadProfileImage(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}/${id}/uploadProfileImage`;
    return this.http.post<any>(url, formData);
  }

  getDataFromToken(): userI | null {
    const tokenString = this.tokenService.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      console.log(token);
      return token;
    }
    return null;
  }

  getUsernameFromToken(): string | null {
    const tokenString = this.tokenService.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      return token.username;
    }
    return null;
  }

}
