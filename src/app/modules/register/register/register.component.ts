import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  RegisterForm= {
    username: '',
    email: '',
    password: ''
  }

  constructor() {}

  Register(form: any): void {
    if (this.RegisterForm.username !== '' || this.RegisterForm.email !== '' || this.RegisterForm.password !== '') {
      console.log(this.RegisterForm);
    } else {
      console.log('No data on username and password');
    }
  }

}
