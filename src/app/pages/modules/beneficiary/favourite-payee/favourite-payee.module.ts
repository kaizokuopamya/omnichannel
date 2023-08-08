import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavouritePayeeRoutingModule } from './favourite-payee-routing.module';
import { FavouritePayeeComponent } from './favourite-payee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FavouritePayeeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    FavouritePayeeRoutingModule
  ]
})
export class FavouritePayeeModule { }
