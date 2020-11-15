import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { CheckorderComponent } from './checkorder/checkorder.component';
import { AdminComponent } from './admin/admin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegorderComponent } from './regorder/regorder.component';
import { OrderdialogComponent } from './orderdialog/orderdialog.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { OrderRelatedDialogComponent } from './orders-related-dialog/order-related-dialog.component';
import { OrderInfoDialogComponent } from './order-info-dialog/order-info-dialog.component';
import { OrdersListComponent } from './orders-list/orders-list.component';


const config: SocketIoConfig = { url: '/' };

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    CheckorderComponent,
    AdminComponent,
    RegorderComponent,
    OrderdialogComponent,
    OrderRelatedDialogComponent,
    OrderInfoDialogComponent,
    OrdersListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NotifierModule.withConfig(customNotifierOptions),
    SocketIoModule.forRoot(config),
    AngularMaterialModule
  ],
  providers: [
    { provide: LoginComponent}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
