import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: object;
  authenticated: boolean = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if(localStorage.getItem('jwt')){
      this.authenticated = true;
    }
    this.api.getUserInfo(localStorage.getItem('jwt')).subscribe(info => this.account = info);
  }

}
