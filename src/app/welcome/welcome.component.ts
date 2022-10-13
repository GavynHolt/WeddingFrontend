import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  loginForm: FormGroup

  constructor(private fb: FormBuilder) { 

    this.loginForm = fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {

  }

  login() {

  }

}
