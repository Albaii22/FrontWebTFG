import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userI } from '../../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient) { }

  getUsuarioIdByUsername(username: string | null): Observable<any> {
    const url = `${this.apiUrl}/username/${username}/id`;
    return this.http.get<any>(url);
  }

  getDataFromToken(): userI | null {
    const tokenString = this.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      console.log(token);
      return token;
    }
    return null;
  }

  getUsernameFromToken(): string | null {
    const tokenString = this.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      return token.username;
    }
    return null;
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authToken');
    } else {
      console.warn('localStorage is not available.');
      return null;
    }
  }
}
