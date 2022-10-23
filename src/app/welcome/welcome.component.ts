import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, Observable, of } from 'rxjs';
import { LoginErrorComponent } from '../login-error/login-error.component';
import { WeddingService } from '../service/wedding.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  loginForm: FormGroup
  loginLoading = new BehaviorSubject<boolean>(false);
  loginLoading$: Observable<boolean> = this.loginLoading.asObservable();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private weddingService: WeddingService,
  ) { 
    weddingService.clearStorage();

    this.loginForm = this.fb.group({
      userCode: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit(): void {

  }

  login(): void {
    const userCode: string = (this.loginForm.controls["userCode"].value as string).toLowerCase();
    this.loginLoading.next(true);

    this.weddingService
      .getInvitationByUserCode(userCode)
      .pipe(
        catchError((err) => {
          this.loginLoading.next(false);
          throw err;
        })
      )
      .subscribe(() => {
        this.loginLoading.next(false);
        this.router.navigate(['rsvp']);
      });
  }
}
