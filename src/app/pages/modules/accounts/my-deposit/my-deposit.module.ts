import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyDepositRoutingModule } from './my-deposit-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDepositComponent } from './my-deposit.component';


@NgModule({
  declarations: [
    MyDepositComponent
  ],
  imports: [
    CommonModule,
    MyDepositRoutingModule,
    SharedModule,
    CarouselModule,
    NgxPaginationModule,
  ] 
})
export class MyDepositModule { }
