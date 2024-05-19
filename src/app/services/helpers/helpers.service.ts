import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private userId: number =0;

  constructor() { }

  setUserId(id: number){
    this.userId = id;
  }

  getUserId(){
    return this.userId;
  }
}
