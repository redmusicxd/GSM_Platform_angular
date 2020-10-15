import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Order, OrderInterface } from "../regorder/regorder.component"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-orderdialog',
  templateUrl: './orderdialog.component.html',
  styleUrls: ['./orderdialog.component.css']
})
export class OrderdialogComponent implements OnInit {
  orderDialogForm: FormGroup = this.fb.group(this.dialogdata, Validators.required);
  private notifier: NotifierService;
  neworder: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogdata: OrderInterface, private api: ApiService,public dialogRef: MatDialogRef<OrderdialogComponent>, notifier: NotifierService, private fb: FormBuilder) { 
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
  
  closeDialog() {
    this.dialogRef.close(this.orderDialogForm.value);
  }

  ngOnInit(): void {
    if(this.dialogdata.id){
      // this.api.getOrder(this.dialogdata.id).subscribe((order: OrderInterface) => this.orderinfo = order)
      this.neworder = false;
    }
    else{
      this.neworder = true;
    }
  }

  modifyOrder(){
    this.api.modifyOrder(this.dialogdata.id,this.orderDialogForm.value, localStorage.getItem('jwt')).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[OrderDialog] Comanda ${res.id} a fost modificata cu success!`);
      this.closeDialog()
    }, err => this.showNotification('error', "[OrderDialog] Comanda nu a putut fi modificata!"));
  }
  addOrder(){
    this.api.registerOrder(localStorage.getItem('jwt'), this.orderDialogForm.value).subscribe((res: OrderInterface) => {
      this.showNotification('success', `[OrderDialog] Comanda ${res.id} a fost inregistrata!`);
      this.closeDialog();
    }, err => this.showNotification('error', "[OrderDialog] Ceva nu a mers bine cu inregistrarea"))
  }

}
