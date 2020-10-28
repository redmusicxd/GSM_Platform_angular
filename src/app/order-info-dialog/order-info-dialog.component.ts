import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from '@apollo/client/core';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { OrderInterface } from '../regorder/regorder.component';

@Component({
  selector: 'app-order-info-dialog',
  templateUrl: './order-info-dialog.component.html',
  styleUrls: ['./order-info-dialog.component.css']
})
export class OrderInfoDialogComponent implements OnInit {

  relateds: OrderInterface[] = [];

  constructor(public dialogRef: MatDialogRef<OrderInfoDialogComponent>,@Inject(MAT_DIALOG_DATA) public dialogdata: Observable<OrderInterface[]>) { 
  }

  ngOnInit(): void {
    this.dialogdata.subscribe(a => this.relateds = a);
  }

}
