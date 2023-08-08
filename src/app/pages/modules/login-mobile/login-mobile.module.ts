import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginMobileRoutingModule } from './login-mobile-routing.module';
import { LoginMobileComponent } from './login-mobile.component';


@NgModule({
  declarations: [
    LoginMobileComponent
  ],
  imports: [
    CommonModule,
    LoginMobileRoutingModule
  ]
})
export class LoginMobileModule { }
