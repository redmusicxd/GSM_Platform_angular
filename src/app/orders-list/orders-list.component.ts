import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { ApiService } from '../api.service';
import { OrderdialogComponent } from '../orderdialog/orderdialog.component';
import { OrderRelatedDialogComponent } from '../orders-related-dialog/order-related-dialog.component';
import { Order, OrderInterface } from '../regorder/regorder.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})

export class OrdersListComponent implements OnInit, OnDestroy {
  public markedas: string;
  public editElement: OrderInterface[] = [];
  public authenticated: boolean;
  private notifier: NotifierService;
  public editfieldform: FormGroup;
  public orders$: Subject<OrderInterface[]> = new Subject<OrderInterface[]>();
  public orders: OrderInterface[];

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (this.editElement != null){
      this.editElement = [];
    }
  }

  @HostListener('document:mouseup', ['$event']) onMouseUpHandler(event: MouseEvent): void {
    // tslint:disable-next-line:no-string-literal
    if (event.target['className'] === 'blurfilter container-fluid'){
      this.editElement = [];
    }
  }
  constructor(private socket: Socket, private api: ApiService, notifier: NotifierService, private router: Router, private fb: FormBuilder, private dialog: MatDialog) {
    this.notifier = notifier;
  }
  public showNotification(type: string, message: string): void{
    this.notifier.notify(type, message);
  }

  ngOnInit(): void {
    if (localStorage.getItem('jwt')){
      this.socket = new Socket({ url: '/', options: {query: {token: localStorage.getItem('jwt')}}});
      this.authenticated = true;
      this.api.getOrders(localStorage.getItem('jwt'), '_sort=id:DESC&order_status_ne=predat').toPromise().then((allorders: OrderInterface[]) => {this.orders$.next(allorders); this.orders = allorders; });
        // this.orders$.subscribe({
        // 	next: v => console.log(v)
        // })
      this.socket.on('order_updated', data => {
          this.showNotification('success', `[Orders] Comanda ${data.id} a fost actualizata!`);
          this.orders$.next(this.orders.map(arr =>
            data.id === arr.id ? data : arr
          ));
        });
      this.socket.on('order_created', data => {
          this.orders.push(data);
          this.orders$.next(this.orders.sort((a, b) => 0 - (a.id > b.id ? 1 : -1)));
          this.showNotification('success', '[Orders] Comanda noua!');
        });
      this.socket.on('order_deleted', (data: OrderInterface) => {
          this.orders.forEach((element, index) => {
            if (element.id === data.id){
              this.orders.splice(index, 1);
              this.orders$.next(this.orders);
              this.showNotification('success', `[Orders] Comanda ${data.id} a fost stearsa!`);
            }
          });
        });
    }
    else{
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.orders$.unsubscribe();
  }
  updateOrder(orderid: number, order: OrderInterface): void {
    this.api.modifyOrder(orderid, this.editfieldform.value, localStorage.getItem('jwt')).toPromise().then(res => {
    this.editElement = null;
    });
  }
  deleteOrder(order: number): void{
    this.api.deleteOrder(order, localStorage.getItem('jwt')).toPromise().then(del => {
      // console.log(del);

      // if(del['id'] === order){
      //   this.showNotification("success", "[AdminC] Comanda a fost stearsa cu success!")
      // }
    }, err => this.showNotification('error', '[AdminC] Ceva nu a mers bine!'));
  }
  openDialog(order: OrderInterface): void {
    const dialogref = this.dialog.open(OrderdialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: order
    });
    dialogref.afterClosed().toPromise().then((after: OrderInterface) => {
      if (after.order_status === 'predat'){
        this.showNotification('info', '[Orders] Order finished, removing from list in 5 seconds.');
        setTimeout(() => {
          this.orders.forEach((element, index, array) => {
          if (element.id === after.id){
            array.splice(index, 1);
            this.orders$.next(array);
            this.showNotification('success', `[Orders] Order ${after.id} has been removed from list!`);
          }
        }); }, 5000);
      }
    });
  }
  openAddDialog(): void {
    this.dialog.open(OrderdialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: new Order()
    });

  }
  openInfoDialog(phone: number, id: number): void {
    this.dialog.open(OrderRelatedDialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: this.api.searchRelatedOrders(phone, id, localStorage.getItem('jwt'))
    });

  }
  markOrders(): void{
    this.editElement.forEach(or => {
      or.order_status = this.markedas;
      this.api.modifyOrder(or.id, or, localStorage.getItem('jwt')).toPromise().then(
        res => {},
        err => {this.showNotification('error', '[Orders] Comenzile nu au putut fi modificate'); });
    });
    this.editElement = [];
  }
  editField(order: OrderInterface): void{
      if (this.editElement.find(ele => ele.id === order.id)){
        this.editElement.splice(this.editElement.findIndex(ele => ele.id === order.id));
      }
      else{
        this.editElement.push(order);
      }
      // this.orders.forEach(order => {
      //   if(order.id == orderid){
      //     this.editfieldform = this.fb.group(order, Validators.required);
      //     this.editfieldform.get('order_status').valueChanges.subscribe(value => {if(value == 'gata') {this.editfieldform.get('finished').setValue(new Date())}})
      //   }
      // })
  }

}
