import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';


@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[BreadcrumbComponent],
  providers:[TranslatePipe]
})
export class BreadcrumbModule { }
