import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WeddingService } from 'src/app/service/wedding.service';

@Component({
  selector: 'app-add-invitation',
  templateUrl: './add-invitation.component.html',
  styleUrls: ['./add-invitation.component.scss'],
})
export class AddInvitationComponent {
  invitationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInvitationComponent>,
    private weddingService: WeddingService
  ) {
    this.invitationForm = this.fb.group({
      userCode: new FormControl('', Validators.required),
      guests: this.fb.array([], Validators.required),
    });
  }

  removeGuestForm(i: number): void {
    (this.invitationForm.controls['guests'] as FormArray).removeAt(i);
  }

  addGuest(): void {
    const newGuestForm: FormGroup = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    });

    (this.invitationForm.controls['guests'] as FormArray).push(newGuestForm);
  }

  submitInvitation(): void {
    console.log(this.invitationForm.value);

    this.weddingService.addInvitation(this.invitationForm.value).subscribe();
    this.dialogRef.close();
  }

  get guestsFormArray(): FormGroup[] {
    return (this.invitationForm.controls['guests'] as FormArray)
      .controls as FormGroup[];
  }
}
