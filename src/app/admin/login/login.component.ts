import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WeddingService } from 'src/app/service/wedding.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    const username: string = (this.loginForm.controls['username'].value as String).toLowerCase().trim();
    const password: string = this.loginForm.controls['password'].value;
    this.weddingService.adminLogin(username, password).subscribe(() => {
      this.router.navigate(['admin']);
    });
  }
}
