import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotUsernameRoutingModule } from './forgot-username-routing.module';
import { ForgotUsernameComponent } from './forgot-username.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ForgotUsernameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ForgotUsernameRoutingModule,
   ]
})
export class ForgotUsernameModule { }
