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

  LoginForm = {
    username: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router , private tokenService: TokenService) {}

  Login(form: LoginI): void {
    if (this.LoginForm.username !== '' || this.LoginForm.password !== '') {
      this.authService.Login(form).subscribe({
        next: (data) => {
          this.tokenService.setToken(data.token);
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Successful Login!',
            text: 'You have logged in successfully.',
          });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Invalid data',
            text: 'There was an error during the login process.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please fill out both username and password fields.',
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
