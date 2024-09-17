import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-star-request-modal',
  templateUrl: './star-request-modal.component.html',
  styleUrls: ['./star-request-modal.component.scss']
})
export class StarRequestModalComponent {

  constructor(private dialogRef: MatDialogRef<StarRequestModalComponent>){}

  onStarClick(): void {
    localStorage.setItem('starGiven', 'true'); // Add a flag to localStorage
    this.closeDialog();
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
}
