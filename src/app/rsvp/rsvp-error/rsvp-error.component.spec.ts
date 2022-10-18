import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpErrorComponent } from './rsvp-error.component';

describe('RsvpErrorComponent', () => {
  let component: RsvpErrorComponent;
  let fixture: ComponentFixture<RsvpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RsvpErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RsvpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
