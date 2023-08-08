import { NgModule } from '@angular/core';
import { TemporarilyPageComponent } from './temporarily-page.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemporarilyPageRoutingModule } from './temporarily-page-routing.module';


@NgModule({
  declarations: [TemporarilyPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    TemporarilyPageRoutingModule
  ]
})
export class TemporarilyPageModule { }
