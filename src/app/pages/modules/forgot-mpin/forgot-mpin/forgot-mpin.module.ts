import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotMpinRoutingModule } from './forgot-mpin-routing.module';
import { ForgotMpinComponent } from './forgot-mpin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ForgotMpinComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ForgotMpinRoutingModule
  ]
})
export class ForgotMpinModule { }
