import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<LoginErrorComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  goHome(): void {
    this.dialogRef.close();
    this.router.navigate(['./'])
  }

}
