import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { BehaviorSubject, catchError, combineLatest, delay, filter, map, mergeMap, Observable, tap, withLatestFrom } from 'rxjs';
import { Guest, Invitation } from '../models/models';
import { WeddingService } from '../service/wedding.service';
import { RsvpErrorComponent } from './rsvp-error/rsvp-error.component';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
})
export class RsvpComponent {
  rsvpForm: FormGroup;
  invitation$: Observable<Invitation | undefined>;
  invitationLoading = new BehaviorSubject<boolean>(false);
  invitationLoading$: Observable<boolean> = this.invitationLoading.asObservable();
  guests$: Observable<Guest[]>;
  rsvpSubmitLoading = new BehaviorSubject<boolean>(false);
  rsvpSubmitLoading$: Observable<boolean> = this.rsvpSubmitLoading.asObservable();
  rsvpAlreadySubmitted$: Observable<boolean>;
  editRsvp = new BehaviorSubject<boolean>(false);
  editRsvp$ = this.editRsvp.asObservable();

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService,
    private dialog: MatDialog
  ) {
    this.rsvpForm = this.fb.group({
      guests: this.fb.array([]),
      email: new FormControl<string>('', Validators.email),
      notes: new FormControl<string>(''),
    });

    this.invitation$ = weddingService.invitation$;

    this.invitation$.pipe(
      withLatestFrom(this.weddingService.userCode$),
      filter(([invitation]) => !invitation),
      mergeMap(([, userCode]) => {
        this.invitationLoading.next(true);
        return this.weddingService.getInvitationByUserCode(userCode).pipe(
          tap(() => {
            this.invitationLoading.next(false);
          })
        );
        })
    ).subscribe();

    this.guests$ = weddingService.invitation$.pipe(
      filter((invitations) => invitations !== undefined),
      map((invitations) => invitations!.guests)
    );

    weddingService.invitation$
      .pipe(filter((invitations) => invitations !== undefined))
      .subscribe((invitation) => {
        this.rsvpForm = this.fb.group({
          id: invitation!.id,
          userCode: invitation!.userCode,
          guests: this.fb.array(
            invitation!.guests.map((guest) =>
              this.fb.group({
                id: guest.id,
                firstName: new FormControl<string>(
                  guest.firstName || '',
                  Validators.required
                ),
                lastName: new FormControl<string>(
                  guest.lastName || '',
                  Validators.required
                ),
                rsvp: new FormControl<boolean>(guest.rsvp, Validators.required),
                rsvpCeremony: new FormControl<boolean>(
                  { value: guest.rsvpCeremony, disabled: !guest.rsvp },
                  Validators.required
                ),
                rsvpReception: new FormControl<boolean>(
                  { value: guest.rsvpReception, disabled: !guest.rsvp },
                  Validators.required
                ),
              })
            )
          ),
          email: new FormControl<string>(invitation?.email || '', { validators: Validators.email, updateOn: 'blur' }),
          notes: new FormControl<string>(invitation?.notes || ''),
        });
      });

    this.rsvpAlreadySubmitted$ = weddingService.invitation$.pipe(
      map((invitation) => !!invitation?.lastModified)
    )
  }

  changeRsvpSelection(event: MatRadioChange, index: number) {
    const guestForm = this.rsvpFormGuestsArray.at(index) as FormGroup;

    if (event.value) {
      guestForm.controls['rsvpCeremony'].enable();
      guestForm.controls['rsvpReception'].enable();
      guestForm.controls['rsvpCeremony'].setValue(true);
      guestForm.controls['rsvpReception'].setValue(true);
    } else {
      guestForm.controls['rsvpCeremony'].setValue(false);
      guestForm.controls['rsvpReception'].setValue(false);
      guestForm.controls['rsvpCeremony'].disable();
      guestForm.controls['rsvpReception'].disable();
    }

    guestForm.controls['rsvpCeremony'].updateValueAndValidity();
    guestForm.controls['rsvpReception'].updateValueAndValidity();
  }

  validateRsvpSubselection(index: number) {
    const guestForm = this.rsvpFormGuestsArray.at(index) as FormGroup;

    if (
      guestForm.controls['rsvp'].value &&
      !guestForm.controls['rsvpCeremony'].value &&
      !guestForm.controls['rsvpReception'].value
    ) {
      guestForm.controls['rsvp'].setErrors({
        missingSubSelection: true,
      });
    } else {
      guestForm.controls['rsvp'].setErrors(null);
    }

    guestForm.controls['rsvpCeremony'].updateValueAndValidity();
    guestForm.controls['rsvpReception'].updateValueAndValidity();
  }

  submitRsvp(): void {
    this.rsvpSubmitLoading.next(true);
    const invitationToUpdate: Invitation = this.rsvpForm.value;
    this.weddingService
      .updateInvitationRsvps(invitationToUpdate)
      .pipe(
        catchError((err) => {
          this.dialog.open(RsvpErrorComponent, {
            width: '400px',
          });
          this.rsvpSubmitLoading.next(false);
          throw err;
        })
      )
      .subscribe(() => {
        this.rsvpSubmitLoading.next(false);
        this.editRsvp.next(false);
      });
  }

  toggleEditRsvp(): void {
    this.editRsvp.next(true);
  } 

  get rsvpFormGuests(): FormGroup[] {
    return (this.rsvpForm.controls['guests'] as FormArray)
      .controls as FormGroup[];
  }

  get rsvpFormGuestsArray(): FormArray {
    return this.rsvpForm.controls["guests"] as FormArray;
  }
}
