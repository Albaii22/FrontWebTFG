import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LoginI } from '../../interfaces/login.interface';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  LoginForm = { // Initializing LoginForm object for storing username and password
    username: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router , private tokenService: TokenService) {}

  Login(form: LoginI): void {
    // Checking if username and password are not empty
    if (this.LoginForm.username !== '' || this.LoginForm.password !== '') {
      // Calling AuthService Login method to authenticate user
      this.authService.Login(form).subscribe({
        next: (data) => {
          // Setting token after successful login
          this.tokenService.setToken(data.token);
          console.log(data);
          // Showing success message
          Swal.fire({
            icon: 'success',
            title: 'Successful Login!',
            text: 'You have logged in successfully.',
          });
          // Navigating to home page after successful login
          this.router.navigate(['/home']);
        },
        error: (err) => {
          // Showing error message if login fails
          Swal.fire({
            icon: 'error',
            title: 'Invalid data',
            text: 'There was an error during the login process.',
          });
        }
      });
    } else {
      // Showing warning message if username or password is empty
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please fill out both username and password fields.',
      });
    }
  }

  goToRegister() {
    // Navigating to the registration page
    this.router.navigate(['/register']);
  }

}
