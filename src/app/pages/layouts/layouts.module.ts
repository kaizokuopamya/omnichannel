import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { LayoutsComponent } from './layouts.component';
import { ClassicModule } from './classic/classic.module';
import { EmptyModule } from './empty/empty.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LayoutsComponent,
  ],
  imports: [
    CommonModule,
    ClassicModule,
    EmptyModule,
    LayoutsRoutingModule,
    SharedModule
  ],
  exports: [
    LayoutsComponent,
    ClassicModule,
    EmptyModule
  ]
})
export class LayoutsModule { }
