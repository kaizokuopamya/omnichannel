import { Component, OnInit } from '@angular/core';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { ThemeSettingsService } from './theme-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
declare var showToastMessage: any;
declare var $ :any;

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  selectedTheme: string = 'default';
  selectedSideBarColor: string = 'blue';
  selectedBg: string = 'bg1';
  selectedMenuOption: string = 'vertical';
  darkcheck: boolean = false
  showHeader: boolean = false;
  titleName: any = "THEME_SETTING"
  themeList: any;
  constructor(
    private http: HttpRestApiService,
    public commonMethods: CommonMethods,
    private themeSettingService: ThemeSettingsService,
    private router: Router,
    private storage: LocalStorageService,
    private constant: AppConstants,
    public dataService: DataService) { }

  ngOnInit(): void {
    this.initialization();
    //this.getAllTheme()
  }

  initialization() {
    this.getUpdatedTheme();


  }
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
  /**
   * get Selected theme
   * @param value
   */
  themechanger(value) {
    this.selectedTheme = value;
  }

  setSideBarColor(color) {
    this.selectedSideBarColor = color;
  }

  setBackground(bg) {
    this.selectedBg = bg;
  }
  /**
   * Update theme for the customer
   */
  updateTheme() {
    let obj = { themeName: this.selectedTheme, themeSideBarColor: this.selectedSideBarColor, themeSideBackground: this.selectedBg, themeMenuOption: this.selectedMenuOption }
    var param = this.themeSettingService.getThemeSettingsParam(obj);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_UPDATECUSTOMERTHEME).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        // alert(this.selectedTheme)
        $('aside.notification-panel.sticky-panel').removeClass('notp-showing')
        this.commonMethods.openPopup('.confirmPopup')

      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    })
  }

  getAllTheme() {
    var param = this.themeSettingService.getAllThemeParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_THEMESLIST).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        // alert(this.selectedTheme)
        this.themeList = data.set.records
        console.log("this.themeList " + JSON.stringify(this.themeList))
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    })
  }
 
  ondarkModeChange() {
    this.darkcheck = !this.darkcheck

    if (this.darkcheck) {
      this.selectedTheme = "dark"
      this.dataService.themeName = this.selectedTheme;
      this.dataService.setTheme(this.selectedTheme);

    } else {
      // this.dataService.themeName
      this.selectedTheme = this.dataService.loginThemeName;
      this.dataService.themeName = this.selectedTheme;
      this.dataService.setTheme(this.selectedTheme);
    }

  }
  ThemeChange(themename, type) {
    if (type == "theme") {
      this.darkcheck = false;
      this.selectedTheme = themename
      this.dataService.themeName = this.selectedTheme;
      this.dataService.setTheme(this.selectedTheme);
    } else if (type == "background") {
      this.selectedBg = themename
      this.dataService.themeBackground = this.selectedBg;
      this.dataService.setThemebackground(this.selectedBg);
    } else if (type == "sideNav") {
      this.selectedSideBarColor = themename
      this.dataService.themeSidenav = this.selectedSideBarColor;
      this.dataService.setThemeSidenav(this.selectedSideBarColor);
    }
  }
  /**
 * function to called on unsuccessfull responce
 * @subActionId
 * @resp
 */
  errorCallBack(subActionId, resp) {
    if (resp.opstatus == "02" || resp.opstatus == "01") {
      showToastMessage(resp.Result, "error");
    }
  }

  /**
   * Get update theme and setting selected values
   */
  getUpdatedTheme() {

    this.selectedTheme = this.dataService.themeName;
    this.selectedSideBarColor = this.dataService.themeSidenav;
    this.selectedBg = this.dataService.themeBackground;

    if (this.dataService.themeName == 'dark') {
      this.darkcheck = true
    }
    else {
      this.darkcheck = false
    }
  }
}

