import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsDetailedStatementRoutingModule } from './accounts-detailed-statement-routing.module';
import { AccountsDetailedStatementComponent } from './accounts-detailed-statement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
// import { DataTablesModule } from "angular-datatables";





@NgModule({
  declarations: [
    AccountsDetailedStatementComponent
  ],
  imports: [
    CommonModule,
    AccountsDetailedStatementRoutingModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    // DataTablesModule
  ]
})
export class AccountsDetailedStatementModule { }
