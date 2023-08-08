import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotMpinMobRoutingModule } from './forgot-mpin-mob-routing.module';
import { ForgotMpinMobComponent } from './forgot-mpin-mob.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ForgotMpinMobComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ForgotMpinMobRoutingModule,
  ]
})
export class ForgotMpinMobModule { }
