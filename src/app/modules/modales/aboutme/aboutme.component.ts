import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user/user.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './aboutme.component.html',
  styleUrl: './aboutme.component.css'
})
export class AboutmeComponent {
  aboutMe: string = ''; // Initializing aboutMe variable to store the about me content

  constructor(
    public dialogRef: MatDialogRef<AboutmeComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any, // Injecting MAT_DIALOG_DATA for passing data to the dialog
    private userService: UserService // Injecting UserService for user-related operations
  ) {}

  onSave(): void {
    // Checking if the aboutMe field is not empty
    if (this.aboutMe.trim() !== '') {
      // Retrieving user ID by username
      this.userService.getUsuarioIdByUsername(this.data.username).subscribe({
        next: (userIdData) => {
          // Updating about me section for the user
          this.userService.updateAboutMe(userIdData, this.aboutMe).subscribe({
            next: () => {
              // Showing success message after successful update
              Swal.fire({
                icon: 'success',
                title: 'Thanks!!',
                text: 'Flow to ur vers :)',	
              }).then(() => {
                this.dialogRef.close(true); // Closing the dialog after successful update
              });
            },
            error: (err) => {
              // Showing error message if update fails
              Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: 'There was an error updating your About Me section.',
              });
            }
          });
        },
        error: (err) => {
          // Showing error message if user ID retrieval fails
          Swal.fire({
            icon: 'error',
            title: 'User ID not found',
            text: 'There was an error retrieving your user ID.',
          });
        }
      });
    } else {
      // Showing error message if aboutMe field is empty
      Swal.fire({
        icon: 'error',
        title: 'Empty field',
        text: 'Please write something about yourself.',
      });
    }
  }
}
