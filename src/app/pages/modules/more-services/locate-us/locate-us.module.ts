import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocateUsComponent } from './locate-us.component';
import {LocateUsRoutingModule} from './locate-us-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LocateUsComponent],
  imports: [
    CommonModule,
    LocateUsRoutingModule,
    FormsModule,
    SharedModule ,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class LocateUsModule { }
