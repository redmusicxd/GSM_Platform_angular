import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  private notifier: NotifierService;
  constructor(private api: ApiService, private fb: FormBuilder, notifier: NotifierService) {
    this.notifier = notifier;
  }

  showNotifs(type:string, message: string){
    this.notifier.notify(type, message);
  }

  ngOnInit(): void {
    if(localStorage.getItem('jwt') && localStorage.getItem('role') === "Admin"){
      this.admin = true;
    }
  }
  submit(f: KeyboardEvent){
    if(f.key == "Enter"){
      this.searchOrder(this.noder);
    }
    if(f.key == "Escape"){
      this.data = new Order();
    }
  }
  editField(){
    this.editmode = true;
  }
  searchOrder(ordern: number) {
    this.notfound = false;
    this.data = null;
    this.api.getOrder(ordern).subscribe((order: OrderInterface) => {this.data = order; this.editfieldform = this.fb.group(this.data)}, (err : any) => err.status == 404 ? this.notfound = true : this.notfound = false
    );
  }
  updateOrder(orderid: any){
    this.api.modifyOrder(orderid,this.editfieldform.value,localStorage.getItem('jwt')).subscribe((res: OrderInterface) => {
    this.editmode = false;
    this.data = this.editfieldform.value;
    this.showNotifs("success",`[CheckOrder] Comanda ${res.id} a fost modificata cu success`)
    }, err => this.showNotifs("error",`[CheckOrder] Comanda ${this.noder} nu a putut fi modificata`))
  }
}
