import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComplaintDetailsRoutingModule } from './complaint-details-routing.module';
import { ComplaintDetailsComponent } from './complaint-details.component';


@NgModule({
  declarations: [ComplaintDetailsComponent],
  imports: [
    CommonModule,SharedModule,
    ComplaintDetailsRoutingModule
  ]
})
export class ComplaintDetailsModule { }
