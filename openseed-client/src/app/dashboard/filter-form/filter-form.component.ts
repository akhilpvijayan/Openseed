import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { GitHubService } from 'src/app/services/github.service';

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

  constructor(private formBuilder: FormBuilder,
    private githubService: GitHubService,
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
      lable: [''],
      category: [''],
      minForks: [0],
      minStars: [0],
      maxStars: [1000000],
      createdBefore: [''],
      createdAfter: [''],
      fork: [''],
      title: [''],
      body: [''],
      project: [''],
    });
  }

  searchIssues() {

  }
}
