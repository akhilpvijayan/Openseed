import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { categories } from 'src/app/interface/categories';
import { programmingLanguages } from 'src/app/interface/languages';
import { licenses } from 'src/app/interface/licenses';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {
  filterForm!: FormGroup;
  isDarkMode = this.darkModeService.isDarkModeEnabled();
  searchQuery = '';
  issues: any;
  categories = categories;
  licenses = licenses;
  languages = programmingLanguages.filter(l => l.value !== 'all');
  defaultValues = this.setDefaultValues();

  selectedLanguages: string[] = [];
  expandedSections: boolean[] = [true, true, true];

  @Output() filters = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder,
    private darkModeService: DarkModeService,
    private bookMarkService: BookmarkService) {
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnInit(): void {
    this.setDefaultValues();
    this.initForm();

    const initialLang = this.filterForm.get('language')?.value;
    if (initialLang && initialLang !== 'all') {
      this.selectedLanguages = initialLang.split(' ');
    } else {
      this.selectedLanguages = [];
    }

    this.filterForm.get('isOnlyBookmarks')?.valueChanges.subscribe((isOnlyBookmarks) => {
      this.toggleCategoryField(isOnlyBookmarks);
    });
  }

  initForm() {
    this.filterForm = this.formBuilder.group({
      language: [this.defaultValues.language],
      owner: [this.defaultValues.owner],
      label: [this.defaultValues.label],
      category: [this.defaultValues.category],
      title: [this.defaultValues.title],
      repository: [this.defaultValues.repository],
      minStars: [this.defaultValues.minStars],
      maxStars: [this.defaultValues.maxStars],
      license: [this.defaultValues.license],
      createdAfter: [this.defaultValues.createdAfter],
      minForks: [this.defaultValues.minForks],
      maxForks: [this.defaultValues.maxForks],
      isOnlyBookmarks: [this.defaultValues.isOnlyBookmarks]
    });
    this.toggleCategoryField(this.filterForm.value.isOnlyBookmarks);
  }

  setDefaultValues(): any {
    const storedFilter = localStorage.getItem('filterFormValues');
    if (storedFilter) {
      try {
        return JSON.parse(storedFilter);
      } catch (e) {
        console.error("Error parsing filter values", e);
      }
    }
    return {
      language: 'all',
      owner: '',
      label: '',
      category: 'all',
      title: '',
      repository: '',
      minStars: 0,
      maxStars: 10000,
      license: 'all',
      createdAfter: null,
      minForks: 0,
      maxForks: 10000,
      isOnlyBookmarks: false
    };
  }

  searchIssues() {
    const formValue = this.filterForm.value;
    localStorage.setItem('filterFormValues', JSON.stringify(formValue));
    this.filters.emit(formValue);
  }

  resetFormToDefault(): void {
    localStorage.removeItem('filterFormValues');
    this.filterForm.reset(this.setDefaultValues());
    this.selectedLanguages = [];
  }

  toggleLanguage(langValue: string): void {
    const index = this.selectedLanguages.indexOf(langValue);
    if (index === -1) {
      this.selectedLanguages.push(langValue);
    } else {
      this.selectedLanguages.splice(index, 1);
    }

    if (this.selectedLanguages.length === 0) {
      this.filterForm.patchValue({ language: 'all' });
    } else {
      this.filterForm.patchValue({ language: this.selectedLanguages.join(' ') });
    }
  }

  isLanguageSelected(langValue: string): boolean {
    return this.selectedLanguages.includes(langValue);
  }

  toggleCategoryField(isOnlyBookmarks: boolean): void {
    const categoryControl = this.filterForm.get('category');

    if (isOnlyBookmarks) {
      categoryControl?.disable();
    } else {
      categoryControl?.enable();
    }
  }

  toggleSection(index: number): void {
    this.expandedSections[index] = !this.expandedSections[index];
  }
}
