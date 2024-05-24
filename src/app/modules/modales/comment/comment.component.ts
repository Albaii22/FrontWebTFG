import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublicationI } from '../../../interfaces/publications.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  imports: [FormsModule],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  commentContent: string = ''; // Initializing commentContent to store the comment text
  currentPublication: PublicationI; // Variable to store the current publication
  publicationUsername: string; // Variable to store the username of the publication owner
  publicationProfileImage: string; // Variable to store the profile image URL of the publication owner

  constructor(
    public dialogRef: MatDialogRef<CommentComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any // Injecting MAT_DIALOG_DATA for passing data to the dialog
  ) {
    // Initializing component properties with data passed to the dialog
    this.currentPublication = data.currentPublication;
    this.publicationUsername = data.publicationUsername;
    this.publicationProfileImage = data.publicationProfileImage;
  }

  onNoClick(): void {
    this.dialogRef.close(); // Closing the dialog without any action
  }

  createComment(): void {
    this.dialogRef.close(this.commentContent); // Closing the dialog and passing the comment content
  }

  getTimeSince(timestamp: string): string {
    // Function to calculate and return the time since a given timestamp
    const now = new Date();
    const publicationDate = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - publicationDate.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' años';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' días';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos';

    return Math.floor(seconds) + ' segundos';
  }
}
