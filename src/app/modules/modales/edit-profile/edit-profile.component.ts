import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/token/token.service';
import { userI } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  username: string;
  aboutMe: string;
  profileImageUrl: SafeUrl | string;
  selectedFile: File | null = null;
  userId: number | null = null;
  user: userI | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.username = data.username;
    this.aboutMe = data.aboutMe;
    this.profileImageUrl = data.profileImageUrl || '../../assets/img/profile.png';
  }

  ngOnInit(): void {
    const username = this.userService.getUsernameFromToken();
    if (username) {
      this.userService.getUsuarioIdByUsername(username).subscribe((response: number) => {
        this.userId = response;
        if (this.userId !== null) {
          this.loadUserDetails(this.userId);
        }
      });
    }
  }

  loadUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe((user: userI) => {
      this.user = user;
      if (user.profileImageUrl) {
        this.profileImageUrl = this.sanitizeImageUrl(user.profileImageUrl);
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
      this.userService.uploadProfileImage(this.userId, this.selectedFile).subscribe((response: { profileImageUrl: string }) => {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveProfile(): void {
    this.dialogRef.close({ username: this.username, aboutMe: this.aboutMe });
  }
}
