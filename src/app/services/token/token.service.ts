import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'authToken';

  constructor() { }

  // Retrieve the token from sessionStorage
  getToken(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.tokenKey);
    } else {
      console.warn('sessionStorage is not available.');
      return null;
    }
  }

  // Set the token in sessionStorage
  setToken(token: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.tokenKey, token);
    } else {
      console.warn('sessionStorage is not available.');
    }
  }

  // Remove the token from sessionStorage
  removeToken(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
    } else {
      console.warn('sessionStorage is not available.');
    }
  }
}
