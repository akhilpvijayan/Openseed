import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit{
  filterForm!: FormGroup;
  isDarkMode = this.darkModeService.isDarkModeEnabled();
  searchQuery = '';
  issues: any;
  @Output() filters = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    private darkModeService: DarkModeService){
      this.darkModeService.darkMode$.subscribe((isDarkMode) => {
        this.isDarkMode = isDarkMode;
      });
    }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.filterForm = this.formBuilder.group({
      language: [''],
      framework: [''],
      status: [''],
      label: [''],
      category: [''],
      title: [''],
      body: [''],
      project: [''],
      minStars: [0],
      maxStars: [10000],
      createdBefore: [''],
      createdAfter: [''],
      minForks: [0],
      maxForks: [10000]
    });
  }

  searchIssues() {
    this.filters.emit(this.filterForm.value);
  }
}
