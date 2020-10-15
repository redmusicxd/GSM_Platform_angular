import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule, MatDialogClose} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select"
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { CheckorderComponent } from './checkorder/checkorder.component';
import { AdminComponent } from './admin/admin.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RegorderComponent } from './regorder/regorder.component';
import { OrderdialogComponent } from './orderdialog/orderdialog.component';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: '/', options: {query: {token: localStorage.getItem('jwt')}} };

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
    OrderdialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatChipsModule,
    FormsModule, 
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatRippleModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatSelectModule,
    NotifierModule.withConfig(customNotifierOptions),
    SocketIoModule.forRoot(config)
  ],
  exports: [
    MatDialogClose,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: LoginComponent}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }