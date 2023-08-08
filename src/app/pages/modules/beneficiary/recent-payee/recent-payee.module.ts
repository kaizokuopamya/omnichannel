import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecentPayeeRoutingModule } from './recent-payee-routing.module';
import { RecentPayeeComponent } from './recent-payee.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RecentPayeeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecentPayeeRoutingModule
  ],
  exports: [RecentPayeeComponent]
})
export class RecentPayeeModule { }
