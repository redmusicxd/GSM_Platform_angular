import { Component, HostListener, OnInit } from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  busy: boolean = false;
  authenticated: boolean = false;
  user: string;
  loginCard: boolean = false;
  account: object;
  administrator: boolean = false;

  constructor(private api: ApiService, private router: Router, public dialog: MatDialog) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(localStorage.getItem('user') && localStorage.getItem('jwt')){
      this.authenticated = true;
      this.user = localStorage.getItem('user');
      this.api.getUserInfo(localStorage.getItem('jwt')).subscribe(info => this.account = info).add(()=> {
        if(this.account["role"]['name'] == "Admin"){
          this.administrator = true;
        }
      })
    }
  }

  onLogin(ev: boolean){
    this.authenticated = ev;
    this.busy = false;
    this.loginCard = false;
    this.user = localStorage.getItem('user');
    if(localStorage.getItem('role') == "admin"){
      this.administrator = true;
    }
  }

  hide(ev : AdminComponent){
    this.busy = true;
  }
  logout(){
    localStorage.clear();
    this.authenticated = false;
    this.busy = false;
    this.loginCard = false;
    this.administrator = false;
    this.router.navigate(['/']);
  }

}
