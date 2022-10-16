import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filter, map, Observable } from 'rxjs';
import { Guest } from '../models/models';
import { WeddingService } from '../service/wedding.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;

  guests$: Observable<Guest[]>

  constructor(
    private fb: FormBuilder,
    weddingService: WeddingService,
  ) {
    this.rsvpForm = this.fb.group({
      guests: this.fb.array([]),
      notes: new FormControl<string>(''),
    });

    this.guests$ = weddingService.invitations$.pipe(
      filter((invitations) => invitations !== undefined),
      map((invitations) => invitations![0].guests)
    )
  }

  ngOnInit(): void {
    this.guests$.subscribe((guests) => {
      this.rsvpForm.controls["guests"] = this.fb.array(guests.map((guest) => this.fb.group({
        firstName: new FormControl<string>(guest.firstName),
        lastName: new FormControl<string>(guest.lastName),
        rsvp: new FormControl<boolean>(guest.rsvp),
      }))) 
    })
  }

  get rsvpFormGuests(): FormGroup[] {
    return (this.rsvpForm.controls['guests'] as FormArray).controls as FormGroup[];
  }
}
