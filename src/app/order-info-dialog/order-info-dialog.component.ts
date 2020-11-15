import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { OrderInterface } from '../regorder/regorder.component';

@Component({
  selector: 'app-order-info-dialog',
  templateUrl: './order-info-dialog.component.html',
  styleUrls: ['./order-info-dialog.component.css']
})
export class OrderInfoDialogComponent implements OnInit {

  order: OrderInterface;
  notfound: boolean;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
     this.api.getOrder(Number(this.route.snapshot.paramMap.get('id'))).subscribe((order: OrderInterface) => {this.order = order; }, (err: any) => err.status === 404 ? this.notfound = true : this.notfound = false);
  }


}
