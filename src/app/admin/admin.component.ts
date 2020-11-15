import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { OrderdialogComponent } from '../orderdialog/orderdialog.component';
import { OrderRelatedDialogComponent } from '../orders-related-dialog/order-related-dialog.component';
import { NotifierService } from 'angular-notifier';
import { Subject, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Order, OrderInterface } from '../regorder/regorder.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  private notifier: NotifierService;
  todaysale = 0;
  yesterdaysale = 0;
  offdash: boolean;

  constructor(private api: ApiService, public dialog: MatDialog, notifier: NotifierService, private socket: Socket, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.notifier = notifier;
  }
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
  ngOnInit(): void {
    this.api.getOrders(localStorage.getItem('jwt'), `order_status=predat&finished=${new Date().toISOString()}`).subscribe((sale: OrderInterface[]) => {
      sale.forEach(order => {
        this.todaysale += order.paid;
      });
    });
    this.api.getOrders(localStorage.getItem('jwt'), `order_status=predat&finished=${new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString()}`).subscribe((sale: OrderInterface[]) => {
      sale.forEach(order => {
        this.yesterdaysale += order.paid;
      });
    });
    this.socket.on('order_updated', (data: OrderInterface) => {
      this.showNotification('success', `[Dashboard] Comanda ${data.id} a fost actualizata!`);
      if (data.order_status === 'predat' && new Date(data.finished.toString()) === new Date()){
        this.todaysale += data.paid;
      }
    });

  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
  openAddDialog(): void {
    this.dialog.open(OrderdialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: new Order()
    });
  }
  routeOn(ev: any): void{
    this.offdash = true;
  }
  routeOff(ev: any): void{
    this.offdash = false;
    this.todaysale = 0;
    this.yesterdaysale = 0;
    this.api.getOrders(localStorage.getItem('jwt'), `order_status=predat&finished=${new Date().toISOString()}`).subscribe((sale: OrderInterface[]) => {
      sale.forEach(order => {
        this.todaysale += order.paid;
      });
    });
    this.api.getOrders(localStorage.getItem('jwt'), `order_status=predat&finished=${new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString()}`).subscribe((sale: OrderInterface[]) => {
      sale.forEach(order => {
        this.yesterdaysale += order.paid;
      });
    });
    console.log(this.todaysale);

  }
}
