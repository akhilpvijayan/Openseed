import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderSkeletonComponent } from './loader-skeleton.component';

describe('LoaderSkeletonComponent', () => {
  let component: LoaderSkeletonComponent;
  let fixture: ComponentFixture<LoaderSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderSkeletonComponent]
    });
    fixture = TestBed.createComponent(LoaderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
