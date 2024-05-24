import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginI } from '../../interfaces/login.interface'; // Import login interface
import { Observable } from 'rxjs';
import { RegisterI } from '../../interfaces/register.interface'; // Import register interface

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAuth = 'http://localhost:8082/auth'; // URL for authentication API

  constructor(private http: HttpClient) {}

  // Method to send login request
  Login(form: LoginI): Observable<any>{
    return this.http.post<any>(`${this.urlAuth}/login` , form); // Send POST request to login endpoint
  }

  // Method to send register request
  Register(form: RegisterI): Observable<any>{
    return this.http.post<any>(`${this.urlAuth}/register` , form); // Send POST request to register endpoint
  }

}
