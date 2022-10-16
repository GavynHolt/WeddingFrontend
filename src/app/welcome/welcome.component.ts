import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { LoginErrorComponent } from '../login-error/login-error.component';
import { WeddingService } from '../service/wedding.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  loginForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private weddingService: WeddingService,
  ) { 

    this.loginForm = this.fb.group({
      userCode: new FormControl<string>('', Validators.required),
    })
  }

  ngOnInit(): void {

  }

  login(): void {
    const userCode: string = this.loginForm.controls["userCode"].value as string;

    this.weddingService
      .getInvitationByUserCode(userCode)
      .pipe(
        catchError((err) => {
          this.dialog.open(LoginErrorComponent, {
            width: '400px',
          });
          throw err;
        })
      )
      .subscribe(() => {
        this.router.navigate(['rsvp']);
      });
  }
}
