import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptyRoutingModule } from './empty-routing.module';
import { EmptyComponent } from './empty.component';
import { HeaderModule } from '../../common-ui/header/header.module';
import { FooterModule } from '../../common-ui/footer/footer.module';


@NgModule({
  declarations: [
    EmptyComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    EmptyRoutingModule
  ],
  exports: [
    EmptyComponent
  ]
})
export class EmptyModule { }
