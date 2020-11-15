import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { OrderInfoDialogComponent } from './order-info-dialog/order-info-dialog.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

const routes: Routes = [
  {
    path: 'panel',
    component: AdminComponent,
    children: [
      {
        path: 'orders',
        component: OrdersListComponent
      }
    ]
    },
  {path: 'login', component: LoginComponent},
  {path: 'order', component: OrderInfoDialogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
