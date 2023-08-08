import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordSetPasswordComponent } from './forgot-password-set-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordSetPasswordRoutingModule } from '../forgot-password-set-password/forgot-password-set-password-routing.module';


@NgModule({
  declarations: [ForgotPasswordSetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ForgotPasswordSetPasswordRoutingModule
  ]
})
export class ForgotPasswordSetPasswordModule { }
