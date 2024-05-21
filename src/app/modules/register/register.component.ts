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
import { UserService } from '../../services/user/user.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  Register(form: RegisterI): void {
    if (this.RegisterForm.username !== '' && this.RegisterForm.password !== '') {
      this.authService.Register(form).subscribe({
        next: (data) => {
          this.tokenService.setToken(data.token);
          const loginForm: LoginI = {
            username: form.username,
            password: form.password
          };
          this.authService.Login(loginForm).subscribe({
            next: (loginData) => {
              this.tokenService.setToken(loginData.token);
              Swal.fire({
                title: 'Welcome!',
                text: 'Please tell us more about yourself.',
                input: 'textarea',
                inputPlaceholder: 'Write something about yourself...',
                showCancelButton: false,
                confirmButtonText: 'Save',
                preConfirm: (aboutMe) => {
                  if (aboutMe.trim() === '') {
                    Swal.showValidationMessage('Please write something about yourself.');
                    return false;
                  }
                  return aboutMe;
                }
              }).then((result) => {
                if (result.isConfirmed && result.value) {
                  this.userService.getUsuarioIdByUsername(this.RegisterForm.username).subscribe({
                    next: (userIdData) => {
                      this.userService.updateAboutMe(userIdData, result.value).subscribe({
                        next: () => {
                          Swal.fire({
                            icon: 'success',
                            title: 'Thanks!!',
                            text: 'Flow to ur vers :)',	
                          });
                          this.router.navigate(['/home']);
                        },
                        error: (err) => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Update failed',
                            text: 'There was an error updating your About Me section.',
                          });
                        }
                      });
                    },
                    error: (err) => {
                      Swal.fire({
                        icon: 'error',
                        title: 'User ID not found',
                        text: 'There was an error retrieving your user ID.',
                      });
                    }
                  });
                }
              });
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
