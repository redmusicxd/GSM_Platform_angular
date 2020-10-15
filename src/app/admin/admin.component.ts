import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { OrderdialogComponent } from '../orderdialog/orderdialog.component'
import { NotifierService } from 'angular-notifier';
import { Observable, of, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Order, OrderInterface } from "../regorder/regorder.component"
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.editElement != null){
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

  constructor(private api: ApiService, public dialog: MatDialog, notifier: NotifierService, private socket: Socket, private router: Router) { 
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
        this.api.getOrders(localStorage.getItem('jwt')).subscribe((allorders : OrderInterface[]) => {this.orders$.next(allorders); this.orders = allorders;});
        this.orders$.subscribe(a => console.log(a));
        
        this.socket.on('order_updated',data => {
          this.showNotification("success", `[AdminC] Comanda ${data.id} a fost actualizata!`)
          this.orders$.next(this.orders.map(arr => 
            data['id'] === arr.id ? data : arr
          ));
        })    
        this.socket.on('order_created',data => {
          this.orders.push(data);
          this.orders$.next(this.orders);
          this.showNotification("success", "[AdminC] Comanda nou aparuta!")
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
    // setInterval(()=>{this.api.getOrders(localStorage.getItem('jwt')).subscribe((data: Order[]) => {
    //   if(JSON.stringify(data) !== JSON.stringify(this.orders)){
    //     this.orders = data;
    //     this.orders$ = new Observable<Order[]>(sub => sub.next(data))
    //   }
    // })}, 5000)

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
  updateOrder(orderid: any){
    this.api.modifyOrder(orderid,this.orderRegister,localStorage.getItem('jwt')).subscribe(res => {
    this.editElement = null;
    })
  }
  deleteOrder(order: string){
    this.api.deleteOrder(order,localStorage.getItem('jwt')).subscribe(del => {
      // if(del['id'] === order){
      //   this.showNotification("success", "[AdminC] Comanda a fost stearsa cu success!")
      // }
    }, err => this.showNotification("error", "Ceva nu a mers bine!"));
  }
  editField(id: number){
    // console.log(id);
    this.editElement = id;
    this.orders.forEach(order => {
      if(order.id == id){
        this.orderRegister = order;
      }
    })
  }

}
