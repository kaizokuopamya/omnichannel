import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePayeeRoutingModule } from './manage-payee-routing.module';
import { ManagePayeeComponent } from './manage-payee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManagePayeeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    ManagePayeeRoutingModule
  ]
})
export class ManagePayeeModule { }
