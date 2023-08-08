import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelinkAccountRoutingModule } from './delink-account-routing.module';
import { DelinkAccountComponent } from './delink-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DelinkAccountComponent
  ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      DelinkAccountRoutingModule,
  ]
})
export class DelinkAccountModule { }
