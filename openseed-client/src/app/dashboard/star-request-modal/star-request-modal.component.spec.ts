import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRequestModalComponent } from './star-request-modal.component';

describe('StarRequestModalComponent', () => {
  let component: StarRequestModalComponent;
  let fixture: ComponentFixture<StarRequestModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarRequestModalComponent]
    });
    fixture = TestBed.createComponent(StarRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
