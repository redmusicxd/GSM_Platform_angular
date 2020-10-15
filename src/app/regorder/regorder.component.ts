import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, Validators } from '@angular/forms';

export interface OrderInterface {
  id?: number,
  phone_number: number,
  issue_description: string,
  technician_observations: string,
  order_status: string,
  imei: number,
  serial_number: string,
  product: string,
  cost: number
}

@Component({
  selector: 'app-regorder',
  templateUrl: './regorder.component.html',
  styleUrls: ['./regorder.component.css']
})
export class RegorderComponent implements OnInit {
  RegOrderForm = this.fb.group(new Order(), Validators.required);
  authenticated: boolean = false;
  @Output() admin = new EventEmitter<boolean>(); 
  private notifier: NotifierService;
  orderRegister: OrderInterface = new Order();
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

  ngOnInit(): void {
    if(localStorage.getItem('jwt')){
      this.authenticated = true;
    }
  }

  registerOrder(){
    this.api.registerOrder(localStorage.getItem('jwt'),this.RegOrderForm.value).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[RegOrder] Comanda ${res.id} s-a inregistrat cu success!`)
    }, err => {
      this.showNotification("error", "[RegOrder] Ceva nu a mers bine!")
    })
  }

}

export class Order implements OrderInterface {
  phone_number : number = null;
  issue_description: string = null;
  technician_observations : string = null;
  order_status : string = "in_asteptare";
  product : string = null;
  cost: number = null;
  imei: number = null;
  serial_number : string = null;
  constructor () {
  }
}
