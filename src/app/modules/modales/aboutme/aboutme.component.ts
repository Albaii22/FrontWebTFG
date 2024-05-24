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
  aboutMe: string = '';

  constructor(
    public dialogRef: MatDialogRef<AboutmeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  onSave(): void {
    if (this.aboutMe.trim() !== '') {
      this.userService.getUsuarioIdByUsername(this.data.username).subscribe({
        next: (userIdData) => {
          this.userService.updateAboutMe(userIdData, this.aboutMe).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Thanks!!',
                text: 'Flow to ur vers :)',	
              }).then(() => {
                this.dialogRef.close(true);
              });
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: 'There was an error updating your About Me section.',
              });
            }
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'User ID not found',
            text: 'There was an error retrieving your user ID.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Empty field',
        text: 'Please write something about yourself.',
      });
    }
  }
}
