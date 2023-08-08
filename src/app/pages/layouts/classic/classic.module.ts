import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassicRoutingModule } from './classic-routing.module';
import { ClassicComponent } from './classic.component';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { HeaderModule } from '../../common-ui/header/header.module';
import { FooterModule } from '../../common-ui/footer/footer.module';
import { NotificationsModule } from '../../common-ui/notifications/notifications.module';
import { SidenavModule } from '../../common-ui/sidenav/sidenav.module';
import { ThemeSettingsModule } from '../../common-ui/theme-settings/theme-settings.module';


@NgModule({
  declarations: [
    ClassicComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    NotificationsModule,
    SidenavModule,
    ThemeSettingsModule,
    ClassicRoutingModule
  ],
  exports     : [
    ClassicComponent
  ]
})
export class ClassicModule { }
