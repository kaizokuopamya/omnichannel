import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FooterModule } from '../../common-ui/footer/footer.module';
import { CommonOtpPopupModulePopup } from '../common-otpPopup/common-otp.module';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoginRoutingModule,
    CommonOtpPopupModulePopup,
    FooterModule
  ]
})
export class LoginModule { }
