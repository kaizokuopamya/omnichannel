import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendMoneyRoutingModule } from './send-money-routing.module';
import { SendMoneyComponent } from './send-money.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecentPayeeModule } from '../../beneficiary/recent-payee/recent-payee.module';


@NgModule({
  declarations: [
    SendMoneyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RecentPayeeModule,
    SendMoneyRoutingModule
  ]
})
export class SendMoneyModule { }
