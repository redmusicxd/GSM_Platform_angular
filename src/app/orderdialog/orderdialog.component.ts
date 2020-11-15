import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Order, OrderInterface } from '../regorder/regorder.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orderdialog',
  templateUrl: './orderdialog.component.html',
  styleUrls: ['./orderdialog.component.css']
})
export class OrderdialogComponent implements OnInit, OnDestroy {
  orderDialogForm: FormGroup = this.fb.group(this.dialogdata, Validators.required);
  private notifier: NotifierService;
  neworder = false;
  private ordergsub: Subscription;
  private ordermsub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogdata: OrderInterface, private api: ApiService, public dialogRef: MatDialogRef<OrderdialogComponent>, notifier: NotifierService, private fb: FormBuilder) {
    this.notifier = notifier;
  }
  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
  closeDialog(): void {
    this.dialogRef.close(this.orderDialogForm.value);
  }

  ngOnInit(): void {
    this.orderDialogForm.get('order_status').valueChanges.subscribe(obs => {
      if (obs === 'predat'){
        this.orderDialogForm.get('finished').setValue(new Date());
      }
    });
    if (this.dialogdata.id){
      // this.api.getOrder(this.dialogdata.id).subscribe((order: OrderInterface) => this.orderinfo = order)
      this.neworder = false;
    }
    else{
      this.neworder = true;
    }
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.ordergsub){
      this.ordergsub.unsubscribe();
    }
    if (this.ordermsub){
      this.ordermsub.unsubscribe();
    }
  }

  modifyOrder(): void{
    this.ordermsub = this.api.modifyOrder(this.dialogdata.id, this.orderDialogForm.value, localStorage.getItem('jwt')).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[OrderDialog] Comanda ${res.id} a fost modificata cu success!`);
      this.closeDialog();
    }, err => this.showNotification('error', '[OrderDialog] Comanda nu a putut fi modificata!'));
  }
  addOrder(): void{
    this.ordergsub = this.api.registerOrder(localStorage.getItem('jwt'), this.orderDialogForm.value).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[OrderDialog] Comanda ${res.id} a fost inregistrata!`);
      this.closeDialog();
    }, err => this.showNotification('error', '[OrderDialog] Ceva nu a mers bine cu inregistrarea'));
  }

}
