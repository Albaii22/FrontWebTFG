import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {

  tweetContent: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tweetContent = data.tweetContent || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createPublication(): void {
    this.dialogRef.close(this.tweetContent);
  }

}
