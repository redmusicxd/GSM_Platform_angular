import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  busy: boolean;
  authenticated: boolean;
  user: string;
  administrator: boolean;
  sideopen: boolean;
  i: number;
  private notifier: NotifierService;

  constructor(private router: Router, public dialog: MatDialog, notifier: NotifierService, private route: ActivatedRoute) {
    this.notifier = notifier;
  }
  public showNotification(type: string, message: string): void{
    this.notifier.notify(type, message);
  }
  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    if (localStorage.getItem('user') && localStorage.getItem('jwt')){
      this.authenticated = true;
      this.user = localStorage.getItem('user');
      if (localStorage.getItem('role') === 'Admin'){
        this.administrator = true;
      }
    }
  }

  onLogin(): void{
    if (localStorage.getItem('jwt') && localStorage.getItem('user')){
      this.authenticated = true;
      this.user = localStorage.getItem('user');
    }
    this.busy = false;
    if (localStorage.getItem('role') === 'Admin'){
      this.administrator = true;
      this.showNotification('info', 'Autentificat ca administrator');
    }
  }

  routeOn(ev: any): void{
    // console.log(ev);

    this.busy = true;
  }
  routeOff(ev: any): void{
    // console.log(ev);

    this.busy = false;
    if (ev.route.component.name === 'LoginComponent'){
      this.onLogin();
    }
  }
  logout(): void{
    localStorage.clear();
    this.user = null;
    this.authenticated = false;
    this.busy = false;
    this.administrator = false;
    this.router.navigate(['/']);
  }

}
