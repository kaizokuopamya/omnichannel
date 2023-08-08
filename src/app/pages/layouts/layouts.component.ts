import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { filter, take } from 'rxjs';
import { Layout } from './layout.types';
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppConstants } from 'src/app/app.constant';
import { TranslateService } from 'src/app/services/translate.service';
import { HttpClient } from '@angular/common/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { AuthService } from '../auth/auth.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { LayoutsService } from './layouts.service';

declare var $: any;
declare var window: any;

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {
  layout: Layout = "classic";
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dataService: DataService,
    public commonMethod: CommonMethods,
    public storage: LocalStorageService,
    public constant: AppConstants,
    public translate: TranslateService,
    public httpClient: HttpClient,
    private idle: Idle,
    private _authService: AuthService,
    private http: HttpRestApiService,
    private translatePipe: TranslatePipe,
    private layoutsService: LayoutsService
  ) {
    // Hide it on the first NavigationEnd event
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1)
    )
      .subscribe(() => {
        this._hide();
      });
  }

  ngOnInit(): void {
    this._updateLayout();
    this._setUpdatedTheme();
    this._setLanguageDefault();
    this._watchIdleSession();
    if (this.constant.getPlatform() == "web") {
      var self = this
      window.onhashchange = function () {
      (self._router.url != '/dashboard') 
          self._logout()
      }
    }
    this._checkEvt();
    var self = this
  }

  private _updateLayout(): void {
    this._activatedRoute.data.subscribe(params => {
      const layoutFromQueryParam = (params['layout']);
      if (layoutFromQueryParam) {
        this.layout = layoutFromQueryParam;
      }
      //console.log(params); 
    }
    );
  }

  closePopups(popupName) {
    this.commonMethod.closePopup(popupName);
  }

  /**
 * Hide the splash screen
 */
  public _hide(): void {
    this._document.body.classList.add('omnichannel-splash-screen-hidden');
  }

  //language object will be received from local storage
  //in not available api will be called
  public _setLanguageDefault() {

    try {
      if (this.storage.hasKeyLocalStorage(this.constant.storage_languageJson)) {
        //if language is avilable then it will set the language
        if (this.storage.hasKeyLocalStorage(this.constant.storage_language)) {
          this.translate.use(this.storage.getLocalStorage(this.constant.storage_language, true));
        }
        else {
          this.translate.use(this.constant.defaultLanguageCode)
        };

      } else {
        this.httpClient.get("assets/i18n/language.json").subscribe(langData => {
          this.translate.useJsonFile(this.constant.defaultLanguageCode, langData);
        });
      }
    }
    catch (e) {
      console.log(e);
    }
    // this.informationLabel = this.translatePipe.transform('INFORMATION');

    //TODO: remove below line after testing
    // else {
    //   this.translate.getLanguageObject();
    // }
  }

  public _logout(showSessionTimedOut?) {
    this.commonMethod.closeAnyModal();
    let logoutReqParams = this.layoutsService.getLogoutParams();
    this.http.callBankingAPIService(logoutReqParams, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_LOGOUT).subscribe(data => {
      console.log("Logout Response => ");
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this._authService._authenticated = false; // handel page navigation after session timeout
        this.dataService.gotpage = "";
        this.dataService.profileDetails = null;
        this.dataService.headerType = 'preloginHeader';
        this.commonMethod.closeAnyModal();
        this.commonMethod.closeAllPopup();
        this.idle.stop();
        if (showSessionTimedOut) {
          if (this.constant.getPlatform() == "web") {
            this._router.navigateByUrl('/temporaryserviceout')
            this.dataService.timeoutHeader = "Timed out!"
            this.dataService.timeoutMsg = "You were idle for too long, please Login again"
          }
          else {
              this.dataService.information = this.translatePipe.transform('SESSION_TIMED_OUT');
              this.dataService.informationLabel = this.translatePipe.transform('INFORMATION');
              this.dataService.primaryBtnText = this.translatePipe.transform('OK');
              this.commonMethod.openPopup('div.popup-bottom.show-sessionTimedOut-info');
          }
          return;
        }
          if (this.constant.getPlatform() == "web") {
            this._router.navigate(['/login'], { replaceUrl: true });
          }
          else {
            this._router.navigate(['/loginMobile'], { replaceUrl: true });
          }
        }else{
          this._authService._authenticated = false; // handel page navigation after session timeout
          this.dataService.gotpage = "";
          this.dataService.profileDetails = null;
          this.commonMethod.closeAnyModal();
          this.commonMethod.closeAllPopup();
          this.idle.stop();
          this._router.navigateByUrl('/temporaryserviceout');
        }
    },(error)=>{
      console.log(error);
    });
  }

  public _watchIdleSession() {
    // sets an idle timeout of 180 seconds(3 min)
    this.idle.setIdle(120);//120 350
    // sets a timeout period of 5 seconds. after 60 seconds of inactivity, the user will be considered timed out.
    // this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => {
      //this.idleState = 'No longer idle.';
      console.log('No longer idle');

      ($("#modal-idle") as any).modal('hide');
      ($("#logoutModal") as any).modal('hide');

      this._logout(true);

    });

    this.idle.onIdleStart.subscribe(() => {
      // this.idle.clearInterrupts();
      this.commonMethod.closeAllPopup();
      this.commonMethod.closeSideNavUPI();
      console.log("Calling Logout API from watchIdleSession...");
      if (this.storage.getSessionStorage(this.constant.val_sessionKey)) {
        this._logout(true);
      }
      else {
        this.idle.stop();
        if (this.constant.getPlatform() == "web") {
          this._router.navigate(['/login'], { replaceUrl: true });
        }
        else {
          if (this.storage.hasKeyLocalStorage(this.constant.storage_omniRegisteredUser)) {
            this._router.navigate(['/loginMobile'], { replaceUrl: true });
          }
          else {
            this._router.navigate(['/LandingPage'], { replaceUrl: true });
          }
        }
      }
      console.log("You\'ve gone idle!");
    });
  }

  public _checkEvt() {
    var evTypep = window.performance.getEntriesByType("navigation")[0].type;
    if (evTypep == 'reload' && this.constant.getPlatform() == 'web') {
      if (this.storage.hasKeySessionStorage(this.constant.val_sessionKey)) {
        this._router.navigateByUrl('/temporaryserviceout')
      }
      //  window.location.replace("http://www.stackoverflow.com");
      this.dataService.timeoutHeader = "SESSION_EXPIRED"
      this.dataService.timeoutMsg = "YOU_ARE_NOT_ALLOWED_TO_FREFRESH"
    }
  }

   /**
   * Setting updated theme from the backend
   */
   _setUpdatedTheme() {
    this.dataService.setThemeObservable.subscribe((themeName: string) => {
      if (themeName) {
        $('html').attr('theme', themeName);
      } else {
        $('html').attr('theme', 'default');
      }
    });
    this.dataService.setThemebackgroundObservable.subscribe((themeName: string) => {
      if (themeName) {
        $('html').attr('layout', themeName);
      } else {
        $('html').attr('layout', 'default');
      }
    });
    this.dataService.setThemeSidenavObservable.subscribe((themeName: string) => {
      if (themeName) {
        $('html').attr('sidenavbg', themeName);
      } else {
        $('html').attr('sidenavbg', 'default');
      }
    });

  }
}
