import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  username: string;
  aboutMe: string;
  profileImageUrl: string;

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.username = data.username;
    this.aboutMe = data.aboutMe;
    this.profileImageUrl = data.profileImageUrl || '../../assets/img/profile.png';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveProfile(): void {
    this.dialogRef.close({ username: this.username, aboutMe: this.aboutMe });
  }
}
