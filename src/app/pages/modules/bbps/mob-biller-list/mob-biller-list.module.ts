import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobBillerListRoutingModule } from './mob-biller-list-routing.module';
import { MobBillerListComponent } from './mob-biller-list.component';


@NgModule({
  declarations: [
    MobBillerListComponent
  ],
  imports: [
    CommonModule,
    MobBillerListRoutingModule
  ]
})
export class MobBillerListModule { }
