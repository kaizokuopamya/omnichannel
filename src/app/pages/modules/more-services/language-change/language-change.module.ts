import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageChangeRoutingModule } from './language-change-routing.module';
import { LanguageChangeComponent } from './language-change.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/pages/common-ui/header/header.module';
import { FooterModule } from 'src/app/pages/common-ui/footer/footer.module';


@NgModule({
  declarations: [LanguageChangeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HeaderModule,
    FooterModule,
    LanguageChangeRoutingModule

  ]
})
export class LanguageChangeModule { }
