import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditonsComponent } from './terms-conditions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TermsConditonsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [TermsConditonsComponent]
})
export class TermsConditionsModule { }
