import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable } from 'rxjs';
import { Guest, Invitation } from '../models/models';
import { WeddingService } from '../service/wedding.service';
import { RsvpErrorComponent } from './rsvp-error/rsvp-error.component';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
})
export class RsvpComponent implements OnInit {
  rsvpForm: FormGroup;
  guests$: Observable<Guest[]>;
  rsvpSubmitLoading = new BehaviorSubject<boolean>(false);
  rsvpSubmitLoading$ = this.rsvpSubmitLoading.asObservable();

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService,
    private dialog: MatDialog,
  ) {
    this.rsvpForm = this.fb.group({
      guests: this.fb.array([]),
      notes: new FormControl<string>(''),
    });

    this.guests$ = weddingService.invitations$.pipe(
      filter((invitations) => invitations !== undefined),
      map((invitations) => invitations!.guests),
    );

    weddingService.invitations$.pipe(
      filter((invitations) => invitations !== undefined),
    ).subscribe((invitation) => {
      this.rsvpForm = this.fb.group({
        id: invitation!.id,
        userCode: invitation!.userCode,
        guests: this.fb.array(invitation!.guests.map((guest) =>this.fb.group({
              id: guest.id,
              firstName: new FormControl<string>(guest.firstName || '', Validators.required),
              lastName: new FormControl<string>(guest.lastName || '', Validators.required),
              rsvp: new FormControl<boolean>(guest.rsvp, Validators.required),
              rsvpCeremony: new FormControl<boolean>(guest.rsvpCeremony, Validators.required),
              rsvpReception: new FormControl<boolean>(guest.rsvpReception, Validators.required),
            })
          )
        ),
        notes: new FormControl<string>(invitation?.notes || ''),
      });
    });
  }

  ngOnInit(): void {
    this.rsvpFormGuests.forEach((guestForm) => {
      guestForm.controls["rsvp"].valueChanges.subscribe((rsvp: boolean) => {
        if (rsvp) {
          guestForm.controls["rsvpCeremony"].setValue(true);
          guestForm.controls["rsvpReception"].setValue(true);
        } else {
          guestForm.controls["rsvpCeremony"].setValue(false);
          guestForm.controls["rsvpReception"].setValue(false);
        }
        guestForm.controls["rsvpCeremony"].updateValueAndValidity();
        guestForm.controls["rsvpReception"].updateValueAndValidity();
      });

      combineLatest([
        guestForm.controls['rsvpCeremony'].valueChanges, 
        guestForm.controls['rsvpReception'].valueChanges
      ]).subscribe(([rsvpCeremony, rsvpReception]: [boolean, boolean]) => {
        if (guestForm.controls['rsvp'].value && !rsvpCeremony && !rsvpReception) {
          guestForm.controls['rsvp'].setErrors({ missingSubSelection: true });
        } else {
          guestForm.controls['rsvp'].setErrors(null);
        }
      });
    });
  }

  submitRsvp() {
    this.rsvpSubmitLoading.next(true);
    const invitationToUpdate: Invitation = this.rsvpForm.value;
    console.log(invitationToUpdate);
    this.weddingService.updateInvitationRsvps(invitationToUpdate).pipe(
      catchError((err) => {
        this.dialog.open(RsvpErrorComponent, {
          width: '400px',
        });
        this.rsvpSubmitLoading.next(false);
        throw err;
      })
    ).subscribe(() => {
        this.rsvpSubmitLoading.next(false);
    });
  }

  get rsvpFormGuests(): FormGroup[] {
    return (this.rsvpForm.controls['guests'] as FormArray).controls as FormGroup[];
  }
}
