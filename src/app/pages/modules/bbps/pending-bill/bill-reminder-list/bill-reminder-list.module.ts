import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination'
import { BillReminderListRoutingModule } from './bill-reminder-list-routing.module';
import { BillReminderListComponent } from './bill-reminder-list.component';
import { SharedModule } from './../../../../../shared/shared.module';

@NgModule({
  declarations: [
    BillReminderListComponent
  ],
  imports: [
    CommonModule,NgxPaginationModule,
    BillReminderListRoutingModule,SharedModule
  ]
})
export class BillReminderListModule { }
