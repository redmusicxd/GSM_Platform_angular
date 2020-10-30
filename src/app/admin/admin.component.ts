import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { OrderdialogComponent } from '../orderdialog/orderdialog.component'
import { OrderInfoDialogComponent } from '../order-info-dialog/order-info-dialog.component'
import { NotifierService } from 'angular-notifier';
import { Subject, Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Order, OrderInterface } from "../regorder/regorder.component"
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit,OnDestroy {

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.editElement != null){
      this.editElement = null;
    }
  }

  @HostListener('document:mouseup', ['$event']) onMouseUpHandler(event: MouseEvent) {
		if(event.target['className'] === "blurfilter container-fluid"){
			this.editElement = null;
		}
  }

  authenticated: boolean = false;
  editElement: number = null;
  @ViewChild('cardid') matCardID: ElementRef;
  orderRegister: OrderInterface = new Order();
  private notifier: NotifierService;
  orders: OrderInterface[];
  orders$: Subject<OrderInterface[]> = new Subject<OrderInterface[]>();
	private getorders: Subscription;
	editfieldform: FormGroup;

  constructor(private api: ApiService, public dialog: MatDialog, notifier: NotifierService, private socket: Socket, private router: Router, private fb: FormBuilder) { 
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
      this.socket = new Socket({ url: '/', options: {query: {token: localStorage.getItem('jwt')}}});
      this.authenticated = true;
        this.getorders = this.api.getOrders(localStorage.getItem('jwt')).subscribe((allorders : OrderInterface[]) => {this.orders$.next(allorders.filter((val)=>{return val.order_status != "gata"})); this.orders = allorders.filter((val)=>{return val.order_status != "gata"})});
        // this.orders$.subscribe({
				// 	next: v => console.log(v)
				// })
        this.socket.on('order_updated',data => {
          this.showNotification("success", `[AdminC] Comanda ${data.id} a fost actualizata!`)
          this.orders$.next(this.orders.map(arr => 
            data['id'] === arr.id ? data : arr
          ));
        })    
        this.socket.on('order_created',data => {
          this.orders.push(data);
          this.orders$.next(this.orders.sort((a,b) => 0 - (a.id > b.id ? 1 : -1)));
          this.showNotification("success", "[AdminC] Comanda noua!")
        })
        this.socket.on('order_deleted', (data: OrderInterface) => {
          this.orders.forEach((element, index, array) => {
            if(element.id === data.id){
              this.orders.splice(index, 1);
              this.orders$.next(this.orders);
              this.showNotification("success", `[AdminC] Comanda ${data.id} a fost stearsa!`)
            }
          });
        })
    }
    else{
      this.router.navigate(['/']);
    }

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.orders$.unsubscribe();
    this.getorders.unsubscribe();
  }

  openDialog(order: OrderInterface): void {
    this.dialog.open(OrderdialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: order
    });
    
    // dialogRef.afterClosed().subscribe((result: OrderInterface) => {
    //   // console.log(result);
    //   if(result){
    //     this.orders$ = new Observable<OrderInterface[]>(obs => obs.next(this.orders.map(arr => 
    //       result['id'] === arr.id ? result : arr
    //     )))
    //   }
    // });
  }  
  openAddDialog(): void {
    this.dialog.open(OrderdialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: new Order
    });
  
  }   
  openInfoDialog(phone: number, id: number): void {
    this.dialog.open(OrderInfoDialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: this.api.searchRelatedOrders(phone,id,localStorage.getItem('jwt'))
    });
  
  }

  updateOrder(orderid: any){
    this.api.modifyOrder(orderid,this.editfieldform.value,localStorage.getItem('jwt')).subscribe(res => {
    this.editElement = null;
    })
  }
  deleteOrder(order: number){
    this.api.deleteOrder(order,localStorage.getItem('jwt')).subscribe(del => {
      // console.log(del);
      
      // if(del['id'] === order){
      //   this.showNotification("success", "[AdminC] Comanda a fost stearsa cu success!")
      // }
    }, err => this.showNotification("error", "[AdminC] Ceva nu a mers bine!"));
  }
  editField(orderid: number){
    if(orderid){
      this.editElement = orderid;
      this.orders.forEach(order => {
        if(order.id == orderid){
					this.editfieldform = this.fb.group(order, Validators.required);
        }
      })
    }
	}

}
