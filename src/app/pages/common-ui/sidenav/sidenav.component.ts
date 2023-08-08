import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { SideNavData } from './sidenav.model';
import { CommonMethods } from 'src/app/services/common-methods';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {
  @ViewChild('globalNav') globalNav: ElementRef;
  mainMenuList:SideNavData | any =[];
  appVersion:String;
  isSelectedRoute:string = 'dashboard';
  custName: any;
    
  constructor(public router:Router,
    public dataService: DataService,
    public constant: AppConstants,
    private commonMethod:CommonMethods) { }

  ngOnInit(): void {
    this.mainMenuList = this.dataService.setSideMenu$;
    this.appVersion = this.constant.val_clientAppVersion;
    this.custName = this.dataService.userDetails?.customerName;
  }

  goToPage(routeName: string){
  if(routeName){
    this.dataService.getBreadcrumb('sidenav', this.router.url)
    this.isSelectedRoute = routeName;
    this.router.navigate(["/" + routeName])
  }
  }

  logout(globalNav){
    globalNav.classList.remove('nav-showing');
    this.commonMethod.openPopup('div.popup-bottom.logout-popup');
  }

}
