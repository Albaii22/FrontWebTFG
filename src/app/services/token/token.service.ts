import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'authToken';

  constructor() { }

  getToken(): string | null | any {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
