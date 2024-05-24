import { Component } from '@angular/core';
import { RegisterI } from '../../interfaces/register.interface';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { LoginI } from '../../interfaces/login.interface';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AboutmeComponent } from '../modales/aboutme/aboutme.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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
    private userService: UserService,
    private dialog: MatDialog // Inyecta MatDialog para abrir el modal
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
              this.openRegisterModal(); 
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

  openRegisterModal(): void {
    const dialogRef = this.dialog.open(AboutmeComponent, {
      width: '400px',
      data: { username: this.RegisterForm.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/home']);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
