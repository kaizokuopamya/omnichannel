import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopChequeRoutingModule } from './stop-cheque-routing.module';
import { StopChequeComponent } from './stop-cheque.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StopChequeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StopChequeRoutingModule
  ]
})
export class StopChequeModule { }
