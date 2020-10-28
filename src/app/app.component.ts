import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  busy: boolean = false;
  authenticated: boolean = false;
  user: string;
  administrator: boolean = false;
  private notifier: NotifierService;

  constructor(private router: Router, public dialog: MatDialog, notifier : NotifierService) {
    this.notifier = notifier;
  }
  public showNotification(type: string, message: string): void{
    this.notifier.notify(type, message);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(localStorage.getItem('user') && localStorage.getItem('jwt')){
      this.authenticated = true;
      this.user = localStorage.getItem('user');
      if(localStorage.getItem("role") == "Admin"){
        this.administrator = true;
      }
    }
  }

  onLogin(){
    this.authenticated = true;
    this.busy = false;
    this.user = localStorage.getItem('user');
    if(localStorage.getItem('role') == "Admin"){
      this.administrator = true;
      this.showNotification('info', 'Autentificat ca administrator')
    }
  }

  hide(){
    this.busy = true;
  }  
  unhide(ev: object){
    this.busy = false;
    console.log(ev);
    if(localStorage.getItem('jwt')){
      this.onLogin();
    }
  }
  logout(){
    localStorage.clear();
    this.authenticated = false;
    this.busy = false;
    this.administrator = false;
    this.router.navigate(['/']);
  }

}
