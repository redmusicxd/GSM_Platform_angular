import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { NotifierService } from 'angular-notifier';
import { Order } from '../regorder/regorder.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  private notifier: NotifierService;
  hide: boolean = true;
  @Output() success = new EventEmitter<boolean>();
  ok: boolean = true;
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  }, Validators.required);

  constructor(private api: ApiService, notifier: NotifierService, private fb: FormBuilder) {
    this.notifier = notifier;
  }
  /**
	 * Show a notification
	 *
	 * @param {string} type    Notification type
	 * @param {string} message Notification message
	*/
	public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}

  login(){
    this.api.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(res => {
      // console.log(res);
      localStorage.setItem("jwt",res['jwt']);
      localStorage.setItem("user",res['user']['username']);
      if(res['user']['role']['name'] == "Admin"){
        localStorage.setItem('role', "admin");
        this.showNotification('info', "Logat ca si administrator.")
      }
      setTimeout(()=> { this.success.emit(true);}, 1000)
    }, err => this.ok = false)
  }

  submit(ev: KeyboardEvent){
    if(ev.key == "Enter"){
      this.login();
    }
  }

  ngOnInit(): void {
  }

}
