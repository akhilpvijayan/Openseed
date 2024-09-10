import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterFormComponent } from './filter-form/filter-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  filter: any;
  isFilterPopUpOpen: boolean = false;

  constructor(private dialog: MatDialog){}

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
}
