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

  tweetContent: string = ''; // Variable to store the tweet content

  constructor(
    public dialogRef: MatDialogRef<NewPostComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any // Injecting MAT_DIALOG_DATA for passing data to the dialog
  ) {
    this.tweetContent = data.tweetContent || ''; // Initializing tweetContent with data passed to the dialog, if available
  }

  onNoClick(): void {
    this.dialogRef.close(); // Closing the dialog without any action
  }

  createPublication(): void {
    this.dialogRef.close(this.tweetContent); // Closing the dialog and passing the tweet content
  }

}
