// comment.component.ts
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
  commentContent: string = '';
  currentPublication: PublicationI;
  publicationUsername: string;

  constructor(
    public dialogRef: MatDialogRef<CommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPublication = data.currentPublication;
    this.publicationUsername = data.publicationUsername;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createComment(): void {
    this.dialogRef.close(this.commentContent);
  }

  getTimeSince(timestamp: string): string {
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
