import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

@Injectable({
  providedIn: 'root' // Declaring that this service should be provided at the root level.
})
export class AuthGuard implements CanActivate { // Defining a class called AuthGuard which implements CanActivate interface.

  constructor(private tokenService: TokenService, private router: Router) { } // Constructor for the AuthGuard class which injects TokenService and Router.

  canActivate(): boolean { // Implementing the canActivate method required by CanActivate interface.
    const token = this.tokenService.getToken(); // Getting the token using TokenService.
    if (token) { // Checking if a token exists.
      return true; // Allowing access if token exists.
    } else { // If token doesn't exist.
      this.router.navigate(['/login']); // Redirecting to the login page.
      return false; // Preventing access since no token is present.
    }
  }
}

