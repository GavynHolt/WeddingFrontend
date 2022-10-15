import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rsvpForm = this.fb.group({
      notes: new FormControl<string>(''),
    });
  }

  ngOnInit(): void {}
}
