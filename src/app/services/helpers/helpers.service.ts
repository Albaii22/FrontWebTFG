import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private userId: string ="";

  constructor() { }

  setUserId(id: string){
    this.userId = id;
  }

  getUserId(){
    return this.userId;
  }
}
