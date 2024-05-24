import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  username: string; // Variable to store the username
  aboutMe: string; // Variable to store the about me information

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any, // Injecting MAT_DIALOG_DATA for passing data to the dialog
    private userService: UserService, // Injecting UserService for user-related functionality
    private tokenService: TokenService // Injecting TokenService for token-related functionality
  ) {
    // Initializing component properties with data passed to the dialog
    this.username = data.username;
    this.aboutMe = data.aboutMe;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(); // Closing the dialog without any action
  }

  saveProfile(): void {
    // Closing the dialog and passing the updated username and about me information
    this.dialogRef.close({ username: this.username, aboutMe: this.aboutMe });
  }
}
