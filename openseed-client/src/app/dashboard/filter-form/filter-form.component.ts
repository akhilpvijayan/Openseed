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
  savedFilterValues = localStorage.getItem('filterFormValues');
  defaultValues = this.savedFilterValues ? JSON.parse(this.savedFilterValues) : {
      language: '',
      owner: '',
      label: '',
      category: '',
      title: '',
      repository: '',
      minStars: 0,
      maxStars: 10000,
      createdBefore: null,
      createdAfter: null,
      minForks: 0,
      maxForks: 10000,
      isOnlyBookmarks: false
    };
  availableLanguages = [
    { name: 'C#' },
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'Python' },
    { name: 'Java' },
    { name: 'Ruby' }
  ];
  
  selectedLanguages: any[] = [];

  @Output() filters = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    private darkModeService: DarkModeService){
      this.darkModeService.darkMode$.subscribe((isDarkMode) => {
        this.isDarkMode = isDarkMode;
      });
    }

  ngOnInit(): void {
    this.initForm();
    this.searchIssues();
  }

  initForm(){
    this.filterForm = this.formBuilder.group({
      language: [this.defaultValues.language],
      owner: [this.defaultValues.owner],
      label: [this.defaultValues.label],
      category: [this.defaultValues.category],
      title: [this.defaultValues.title],
      repository: [this.defaultValues.repository],
      minStars: [this.defaultValues.minStars],
      maxStars: [this.defaultValues.maxStars],
      createdBefore: [this.defaultValues.createdBefore],
      createdAfter: [this.defaultValues.createdAfter],
      minForks: [this.defaultValues.minForks],
      maxForks: [this.defaultValues.maxForks],
      isOnlyBookmarks: [this.defaultValues.isOnlyBookmarks]
    });
  }

  searchIssues() {
    const formValue = this.filterForm.value;
    localStorage.setItem('filterFormValues', JSON.stringify(formValue));
    this.filters.emit(formValue);
  }

  resetFormToDefault(): void {
    localStorage.removeItem('filterFormValues');
    this.filterForm.reset(this.defaultValues);
  }
}
