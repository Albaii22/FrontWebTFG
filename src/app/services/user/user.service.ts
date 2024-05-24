import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userI } from '../../interfaces/user.interface';
import { TokenService } from '../token/token.service';
import { jwtDecode } from 'jwt-decode';
import { userUpdateI } from '../../interfaces/userUpdate.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // Get user ID by username
  getUsuarioIdByUsername(username: string | null): Observable<any> {
    const url = `${this.apiUrl}/username/${username}/id`;
    return this.http.get<any>(url);
  }

  // Get user by ID
  getUserById(id: number): Observable<userI> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<userI>(url);
  }

  // Upload profile image for a user
  uploadProfileImage(id: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}/${id}/uploadProfileImage`;
    return this.http.post<any>(url, formData);
  }

  // Get user data from token
  getDataFromToken(): userI | null {
    const tokenString = this.tokenService.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      console.log(token);
      return token;
    }
    return null;
  }

  // Get username from token
  getUsernameFromToken(): string | null {
    const tokenString = this.tokenService.getToken();
    if (tokenString) {
      const token: userI = jwtDecode(tokenString);
      return token.username;
    }
    return null;
  }

  // Update about me section for a user
  updateAboutMe(userId: number, aboutMe: string): Observable<userI> {
    const url = `${this.apiUrl}/${userId}/aboutMe`;
    return this.http.put<userI>(url, { aboutMe });
  }

  // Update user information
  updateUsuario(id: number, user: userUpdateI): Observable<userI> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<userI>(url, user);
  }

  // Get all users
  getAllUsers(): Observable<userI[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<userI[]>(url);
  }

}
