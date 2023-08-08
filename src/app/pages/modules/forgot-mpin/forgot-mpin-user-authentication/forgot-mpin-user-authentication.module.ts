import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotMpinUserAuthenticationRoutingModule } from './forgot-mpin-user-authentication-routing.module';
import { ForgotMpinUserAuthenticationComponent } from './forgot-mpin-user-authentication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ForgotMpinUserAuthenticationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ForgotMpinUserAuthenticationRoutingModule,
  ]
})
export class ForgotMpinUserAuthenticationModule { }
