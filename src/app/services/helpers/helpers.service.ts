import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private userId: number =0;
  private username: string = '';

  constructor(private router: Router) { }

  setUserId(id: number){
    this.userId = id;
  }

  getUserId(){
    return this.userId;
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  getUsername(){
    return this.username;
  }
}


