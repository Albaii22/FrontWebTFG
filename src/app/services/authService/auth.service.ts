import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginI } from '../../interfaces/login.interface';
import { Observable } from 'rxjs';
import { RegisterI } from '../../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAuth = 'http://localhost:8082/auth'

  constructor(private http: HttpClient) {}

  Login(form: LoginI): Observable<any>{
    return this.http.post<any>(`${this.urlAuth}/login` , form)
  }

  Register(form: RegisterI): Observable<any>{
    return this.http.post<any>(`${this.urlAuth}/register` , form)
  }

}
