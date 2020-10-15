import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  hide: boolean = true;
  ok: boolean = true;
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  }, Validators.required);

  constructor(private api: ApiService, private fb: FormBuilder, private router: Router) { }

  login(){
    this.api.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(res => {
      // console.log(res);
      localStorage.setItem("jwt",res['jwt']);
      localStorage.setItem("user",res['user']['username']);
      localStorage.setItem("role",res['user']['role']['name']);
      this.router.navigate(['/']);
      this.ok = true;
    }, err => this.ok = false)
  }

  ngOnInit(): void {
  }

}
