import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OrderInterface } from '../regorder/regorder.component';

@Component({
  selector: 'app-order-related-dialog',
  templateUrl: './order-related-dialog.component.html',
  styleUrls: ['./order-related-dialog.component.css']
})
export class OrderRelatedDialogComponent implements OnInit {

  relateds: OrderInterface[] = [];

  constructor(public dialogRef: MatDialogRef<OrderRelatedDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogdata: Observable<OrderInterface[]>) {
  }

  ngOnInit(): void {
    this.dialogdata.subscribe(a => this.relateds = a);
  }

}
