import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSearchBbpsRoutingModule } from './contact-search-bbps-routing.module';
import { ContactSearchBbpsComponent } from './contact-search-bbps.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContactSearchBbpsComponent
  ],
  imports: [
    CommonModule,
    ContactSearchBbpsRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class ContactSearchBbpsModule { }
