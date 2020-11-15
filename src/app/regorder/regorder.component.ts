import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface OrderInterface {
  id?: number;
  phone_number: number;
  issue_description: string;
  finished: Date;
  technician_observations: string;
  order_status: string;
  imei: number;
  serial_number: string;
  product: string;
  cost: number;
  paid: number;
}

@Component({
  selector: 'app-regorder',
  templateUrl: './regorder.component.html',
  styleUrls: ['./regorder.component.css']
})
export class RegorderComponent implements OnInit, OnDestroy {
  RegOrderForm = this.fb.group(new Order(), Validators.required);
  authenticated = false;
  @Output() admin = new EventEmitter<boolean>();
  private notifier: NotifierService;
  orderRegister: OrderInterface = new Order();
  private ordersub: Subscription;
  constructor(private api: ApiService, notifier: NotifierService, private fb: FormBuilder) {
    this.notifier = notifier;
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  ngOnInit(): void {
    if (localStorage.getItem('jwt')){
      this.authenticated = true;
    }
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.ordersub){
      this.ordersub.unsubscribe();
    }
  }

  registerOrder(): void {
    this.ordersub = this.api.registerOrder(localStorage.getItem('jwt'), this.RegOrderForm.value).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[RegOrder] Comanda ${res.id} s-a inregistrat cu success!`);
    }, err => {
      this.showNotification('error', '[RegOrder] Ceva nu a mers bine!');
    });
  }

}

export class Order implements OrderInterface {
  phone_number: number = null;
  issue_description: string = null;
  technician_observations: string = null;
  order_status = 'in_asteptare';
  product: string = null;
  finished: Date;
  cost: number = null;
  imei: number = null;
  serial_number: string = null;
  paid: number = null;
  constructor() {
  }
}
