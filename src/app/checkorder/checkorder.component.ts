import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ApiService } from '../api.service';
import { OrderInfoDialogComponent } from '../order-info-dialog/order-info-dialog.component';
import { Order, OrderInterface } from '../regorder/regorder.component';

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.css']
})
export class CheckorderComponent implements OnInit {

  noder: number;
  data: OrderInterface;
  notfound: boolean;
  editmode = false;
  editfieldform: FormGroup;
  admin = false;
  ordernumber = this.fb.control('', Validators.required);
  private notifier: NotifierService;
  @HostListener('document:mouseup', ['$event']) onMouseUpHandler(event: MouseEvent): void {
    // tslint:disable-next-line:no-string-literal
    if (event.target['className'] === 'blurfilter container-fluid'){
      this.editmode = null;
    }
  }
  constructor(private api: ApiService, private fb: FormBuilder, notifier: NotifierService, private dialog: MatDialog, private router: Router ) {
    this.notifier = notifier;
  }

  openDialog(): void {
    this.dialog.open(OrderInfoDialogComponent, {
      width: 'max-content',
      height: 'auto',
      data: this.data
    });
  }

  showNotifs(type: string, message: string): void{
    this.notifier.notify(type, message);
  }

  ngOnInit(): void {
  }
  clear(f?: KeyboardEvent): void{
    // if(f.key == "Escape"){
    //   this.data = null;
    // }
    this.ordernumber.setValue('');
    this.data = null;
  }
  editField(): void {
    if (this.checkAdminRights()){
      this.editmode = true;
    }
  }
  checkAdminRights(): boolean {
    if (localStorage.getItem('jwt') && localStorage.getItem('role') === 'Admin'){
      return true;
    }
    else{
      return false;
    }
  }
  searchOrder(): void {
    this.notfound = false;
    this.data = null;
    this.router.navigate(['/order', {id: this.ordernumber.value}]);
  }
  updateOrder(orderid: any): void {
    this.api.modifyOrder(orderid, this.editfieldform.value, localStorage.getItem('jwt')).subscribe((res: OrderInterface) => {
    this.editmode = false;
    this.data = this.editfieldform.value;
    this.showNotifs('success', `[CheckOrder] Comanda ${res.id} a fost modificata cu success`);
    }, err => this.showNotifs('error', `[CheckOrder] Comanda ${this.data.id} nu a putut fi modificata`));
  }
}
