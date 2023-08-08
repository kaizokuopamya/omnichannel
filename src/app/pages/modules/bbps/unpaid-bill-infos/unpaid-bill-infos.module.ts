import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../shared/shared.module';
import { UnpaidBillInfosRoutingModule } from './unpaid-bill-infos-routing.module';
import { UnpaidBillInfosComponent } from './unpaid-bill-infos.component';


@NgModule({
  declarations: [
    UnpaidBillInfosComponent
  ],
  imports: [
    CommonModule,
    UnpaidBillInfosRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UnpaidBillInfosModule { }
