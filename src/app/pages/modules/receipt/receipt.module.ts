import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './receipt.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReceiptComponent
  ],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    SharedModule
  ]
})
export class ReceiptModule { }
