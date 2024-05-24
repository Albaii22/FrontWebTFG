import { Component } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { HelpersService } from '../../services/helpers/helpers.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {//Normal navbar component

  constructor(private tokenService: TokenService,
    private helperService: HelpersService
  ) { }

  //Log out function
  Logout(){
    this.tokenService.removeToken();
    this.helperService.navigateTo('/login');
  }

}
