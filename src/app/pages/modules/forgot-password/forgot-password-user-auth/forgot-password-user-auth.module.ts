import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ForgotPasswordUserAuthRoutingModule} from './forgot-password-user-auth-routing.module'
import { ForgotPasswordUserAuthComponent } from './forgot-password-user-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ForgotPasswordUserAuthComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ForgotPasswordUserAuthRoutingModule,
  ]
})
export class ForgotPasswordUserAuthModule { }
