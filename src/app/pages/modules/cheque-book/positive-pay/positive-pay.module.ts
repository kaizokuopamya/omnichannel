import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositivePayRoutingModule } from './positive-pay-routing.module';
import { PositivePayComponent } from './positive-pay.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PositivePayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PositivePayRoutingModule
  ]
})
export class PositivePayModule { }
