import { Component } from '@angular/core';
import { RegisterI } from '../../interfaces/register.interface';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LoginI } from '../../interfaces/login.interface';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  RegisterForm = {
    username: '',
    email: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router , private tokenService: TokenService) {}

  Register(form: RegisterI): void {
    if (this.RegisterForm.username !== '' && this.RegisterForm.password !== '') {
      this.authService.Register(form).subscribe({
        next: (data) => {
          this.tokenService.setToken(data.token);
          Swal.fire({
            icon: 'success',
            title: 'Successful register!',
            text: 'You have registered successfully.',
          });
          const loginForm: LoginI = {
            username: form.username,
            password: form.password
          };
          this.authService.Login(loginForm).subscribe({
            next: (loginData) => {
              Swal.fire({
                icon: 'success',
                title: 'Auto Login Successful!',
                text: 'You have logged in successfully.',
              });
              this.router.navigate(['/home']);
            },
            error: (loginErr) => {
              Swal.fire({
                icon: 'error',
                title: 'Auto Login Failed',
                text: 'There was an error during the auto login process.',
              });
            }
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Invalid data',
            text: 'There was an error during the registration process.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please fill out all required fields.',
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
