import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ApiService } from '../api.service';
import { Order, OrderInterface } from "../regorder/regorder.component"

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.css']
})
export class CheckorderComponent implements OnInit {

  noder: number;
  data: OrderInterface;
  notfound: boolean;
  editmode: boolean = false;
  editfieldform: FormGroup;
  admin: boolean = false;
  ordernumber = this.fb.control('',Validators.required)
  private notifier: NotifierService;
  @HostListener('document:mouseup', ['$event']) onMouseUpHandler(event: MouseEvent) {
		if(event.target['className'] === "blurfilter container-fluid"){
			this.editmode = null;
		}
  }
  constructor(private api: ApiService, private fb: FormBuilder, notifier: NotifierService) {
    this.notifier = notifier;
  }

  showNotifs(type:string, message: string){
    this.notifier.notify(type, message);
  }

  ngOnInit(): void {
  }
  clear(f?: KeyboardEvent){
    // if(f.key == "Escape"){
    //   this.data = null;
    // }
    this.ordernumber.setValue('');
    this.data = null;
  }
  editField(){
    if(this.checkAdminRights()){
      this.editmode = true;
    }
  }
  checkAdminRights(): boolean {
    if(localStorage.getItem('jwt') && localStorage.getItem('role') === "Admin"){
      return true;
    }
    else{
      return false;
    }
  }
  searchOrder() {
    this.notfound = false;
    this.data = null;
    this.api.getOrder(this.ordernumber.value).subscribe((order: OrderInterface) => {this.data = order; this.editfieldform = this.fb.group(this.data)}, (err : any) => err.status == 404 ? this.notfound = true : this.notfound = false
    );
  }
  updateOrder(orderid: any){
    this.api.modifyOrder(orderid,this.editfieldform.value,localStorage.getItem('jwt')).subscribe((res: OrderInterface) => {
    this.editmode = false;
    this.data = this.editfieldform.value;
    this.showNotifs("success",`[CheckOrder] Comanda ${res.id} a fost modificata cu success`)
    }, err => this.showNotifs("error",`[CheckOrder] Comanda ${this.data.id} nu a putut fi modificata`))
  }
}
