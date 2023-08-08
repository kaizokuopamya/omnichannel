import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationRoutingModule } from './donation-routing.module';
import { DonationComponent } from './donation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DonationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DonationRoutingModule,
  ]
})
export class DonationModule { }
