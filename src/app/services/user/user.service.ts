import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsuarioIdByUsername(username: string): Observable<number> {
    const url = `${this.apiUrl}/username/${username}/id`;
    return this.http.get<number>(url);
  }
}
