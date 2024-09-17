import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { Subscription, timer } from 'rxjs';
import { StarRequestModalComponent } from './star-request-modal/star-request-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy{
  filter: any;
  isFilterPopUpOpen: boolean = false;
  showPopup: boolean = false;
  private timeSpentSubscription: Subscription = new Subscription(); 

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
    this.checkIfStarred();
  }

  checkIfStarred(): void {
    const hasStarred = localStorage.getItem('starGiven');
    if (!hasStarred) {
      setTimeout(() => {
        this.dialog.open(StarRequestModalComponent,{
          width:'auto',
          height:'auto',
          hasBackdrop: true,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
        });
      }, 120000);
    }
  }

  receiveFilter($event: any) {
    this.filter = $event;
    this.closeFilter();
  }

  openFilter(){
    this.isFilterPopUpOpen = true;
  }

  closeFilter() {
    this.isFilterPopUpOpen = false;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  onStarClick(): void {
    localStorage.setItem('starGiven', 'true'); // Add a flag to localStorage
    this.closePopup();
  }

  ngOnDestroy(): void {
    if (this.timeSpentSubscription) {
      this.timeSpentSubscription.unsubscribe();
    }
  }
}
