import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstantPayRoutingModule } from './instant-pay-routing.module';
import { InstantPayComponent } from './instant-pay.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InstantPayComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InstantPayRoutingModule
  ]
})
export class InstantPayModule { }
