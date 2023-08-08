import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyLoanRoutingModule } from './my-loan-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-owl-carousel-o';
/*****modified by USER PSB1*****/
import { NgxPaginationModule } from 'ngx-pagination';
import { MyLoanComponent } from './my-loan.component';
// import { DataTablesModule } from "angular-datatables";
/*****modified by USER PSB1 ENDS*****/


@NgModule({
  declarations: [
    MyLoanComponent
  ],
  imports: [
    CommonModule,
    MyLoanRoutingModule,
    SharedModule,
    CarouselModule,    
    NgxPaginationModule, //Added by User PSB1
    // DataTablesModule //Added by User PSB1
  ]
})
export class MyLoanModule { }
