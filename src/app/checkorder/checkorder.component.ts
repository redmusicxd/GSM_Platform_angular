import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order, OrderInterface } from "../regorder/regorder.component"

@Component({
  selector: 'app-checkorder',
  templateUrl: './checkorder.component.html',
  styleUrls: ['./checkorder.component.css']
})
export class CheckorderComponent implements OnInit {

  noder: string;
  data: OrderInterface;
  notfound: boolean;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }
  submit(f: KeyboardEvent){
    if(f.key == "Enter"){
      this.searchOrder(this.noder);
    }
    if(f.key == "Escape"){
      this.data = new Order();
    }
  }
  searchOrder(ordern: string) {
    this.notfound = false;
    this.data = null;
    this.api.getOrder(ordern).subscribe((order: OrderInterface) => this.data = order, (err : any) => err.status == 404 ? this.notfound = true : this.notfound = false
    );
  }
}
