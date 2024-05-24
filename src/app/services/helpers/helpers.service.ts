import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  private userId: number = 0; // Initialize userId
  private username: string = ''; // Initialize username
  private profileImage: string = ''; // Initialize profileImage

  constructor(private router: Router) { }

  // Method to set the userId
  setUserId(id: number): void {
    this.userId = id;
  }

  // Method to get the userId
  getUserId(): number {
    return this.userId;
  }

  // Method to navigate to a specified path
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Method to get the username
  getUsername(): string {
    return this.username;
  }

  // Method to get the profile image
  getProfileImage(): string {
    return this.profileImage;
  }

  // Method to set the profile image
  setProfileImage(image: string): void {
    this.profileImage = image;
  }
}
