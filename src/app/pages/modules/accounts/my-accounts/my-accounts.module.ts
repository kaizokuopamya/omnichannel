import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountsRoutingModule } from './my-accounts-routing.module';
import { MyAccountsComponent } from './my-accounts.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    MyAccountsComponent
  ],
  imports: [
    CommonModule,
    MyAccountsRoutingModule,
    SharedModule,
    CarouselModule,
    NgxPaginationModule,
  ]
})
export class MyAccountsModule { }
