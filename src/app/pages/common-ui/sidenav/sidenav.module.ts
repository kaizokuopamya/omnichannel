import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports     : [
    SidenavComponent
  ]
})
export class SidenavModule { }
