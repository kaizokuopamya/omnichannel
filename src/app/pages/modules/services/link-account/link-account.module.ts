import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkAccountRoutingModule } from './link-account-routing.module';
import { LinkAccountComponent } from './link-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LinkAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LinkAccountRoutingModule
  ]
})
export class LinkAccountModule { }
