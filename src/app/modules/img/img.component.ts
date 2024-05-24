import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user/user.service';
import { NgIf } from '@angular/common';
import { userI } from '../../interfaces/user.interface';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-img',
  standalone: true,
  imports: [NgIf],
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.css']
})
export class ImgComponent implements OnInit {
  selectedFile: File | null = null;
  userId: number | null = null;
  profileImageUrl: SafeUrl | null = null;
  user: userI | null = null;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private tokenService: TokenService 
  ) {}

  ngOnInit(): void {
    const username = this.userService.getUsernameFromToken();
    if (username) {
      this.userService.getUsuarioIdByUsername(username).subscribe(response => {
        this.userId = response;
        if (this.userId !== null) {
          this.loadUserDetails(this.userId);
        }
      });
    }

  }

  loadUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;
      if (user.profileImageUrl) {
        this.profileImageUrl = this.sanitizeImageUrl(user.profileImageUrl);
        console.log('xssss:', user.profileImageUrl);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.userId !== null) {
      this.userService.uploadProfileImage(this.userId, this.selectedFile).subscribe(response => {
        this.profileImageUrl = this.sanitizeImageUrl(response.profileImageUrl);
        console.log('Image uploaded successfully', response);
        console.log('Profile Image URL:', response.profileImageUrl);
      }, error => {
        console.error('Error uploading image', error);
      });
    }
  }
  
  sanitizeImageUrl(url: string): SafeUrl {
    const fullUrl = `http://localhost:8082/${decodeURIComponent(url)}`;
    console.log('Sanitized Image URL:', fullUrl);
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
}

}
