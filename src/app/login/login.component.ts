import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  username: string;
  password: string;
  hide: boolean = true;
  ok: boolean = true;
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  }, Validators.required);
  private loginsub: Subscription;

  constructor(private api: ApiService, private fb: FormBuilder, private router: Router) { }

  login(){
    this.loginsub = this.api.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(res => {
      // console.log(res);
      localStorage.setItem("jwt",res['jwt']);
      localStorage.setItem("user",res['user']['username']);
      localStorage.setItem("role",res['user']['role']['name']);
      this.router.navigate(['/']);
      this.ok = true;
    }, err => this.ok = false)
  }

  ngOnInit(): void {
    if(localStorage.getItem('user') && localStorage.getItem('jwt')){
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.loginsub){
      this.loginsub.unsubscribe();
    }
  }

}
