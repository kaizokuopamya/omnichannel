import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeSettingsRoutingModule } from './theme-settings-routing.module';
import { ThemeSettingsComponent } from './theme-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ThemeSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ThemeSettingsRoutingModule
  ],
  exports:[ThemeSettingsComponent]
})
export class ThemeSettingsModule { }
