import { Injectable, Injector, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, from, Subject } from 'rxjs';
import { map, catchError, tap, timeout } from 'rxjs/operators';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { pageLoaderService } from './pageloader.service';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { forkJoin } from 'rxjs';
import { AppConstants } from '../app.constant';
import { LocalStorageService } from './local-storage.service';
import { IRequest, IStatus } from '../interface/app-interface';
import { CommonMethods } from './common-methods';
import { TranslatePipe } from '../pipes/translate.pipe';
import { AuthService } from '../pages/auth/auth.service';

declare var showToastMessage: any;
declare var networkinterface: any;
declare var $: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpRestApiService {
  contactSync = false;
  notificationSync = false;
  showErrorPopup = false;
  showTimoutErrorPopup = true;
  STATUS: IStatus;
  constructor(
    private http: HttpClient,
    private encryptDecryptService: EncryptDecryptService,
    private constants: AppConstants,
    private storage: LocalStorageService,
    private loader: pageLoaderService,
    private router: Router,
    public dataService: DataService,
    private ngZone: NgZone,
    private injector: Injector,
    private commonMethod: CommonMethods,
    private _authService: AuthService,
  ) { this.STATUS = this.constants.Status}

  /**
   * This function is invoked whenever api call is made
   * @param endpoint
   * @param request
   */
 
   /**
   * This function is invoked whenever api call is made
   * @param endpoint
   * @param request
   */
  apiCall(endpoint: string, request: any): Promise<any> {
   this.loader.showLoader();

    console.log(JSON.stringify(request));
    /**** request Param ***/
    var timeOut =  30000 ;
    var url = this.constants.publicURL.serviceURL;
    console.log('SERVICE URL => ', url);
    return this.http.post(`${url}${endpoint}`, JSON.stringify(request), httpOptions).pipe(
      timeout(timeOut),
      catchError(this.handleError<any>(endpoint))
    ).toPromise()
      .then((response) => {
        return new Promise((resolve, reject) => {
            resolve(response);
        });
      });
  }

  /**
   * This is the main function which is invoked for api call's
   * @param request
   * @param deviceId
   * @param endpoint  
   */
  callBankingAPIService(request, deviceId, endpoint, extraParams?: any): Observable<any> {
    console.log('extra params: ', extraParams);
    let connectionStatus = navigator.onLine ? 'online' : 'offline';
    this.contactSync = extraParams?.contactSync;
    this.notificationSync = extraParams?.notificationSync ? extraParams.notificationSync : false;
    this.showErrorPopup = extraParams?.hasOwnProperty('showErrorPopup') ? extraParams.showErrorPopup : false;
    this.showTimoutErrorPopup = extraParams?.hasOwnProperty('showTimoutErrorPopup') ? extraParams.showTimoutErrorPopup : true;
    console.log('extra params: ', this.showErrorPopup);
    //if(endpoint == this.constants.serviceName_GetPaymentAddressListDetails) deviceId = 9;
    var self = this;
    var subject = new Subject<any>();
    const requestObj: IRequest = <IRequest>{
      sourceIp: this.dataService.ipAddress,
      prefered_Language: this.storage.hasKeyLocalStorage(this.constants.storage_language) ? this.storage.getLocalStorage(this.constants.storage_language) : this.constants.val_default_lang,
      entityId: this.constants.getEntityId(),
      deviceId: deviceId,
      map: request
      // map: this.encryptDecryptService.decryptText(this.constants.languageKey, request)
    };
    console.log('HTTPSERVICE => requestObj==== ', JSON.stringify(requestObj));
    if (connectionStatus == 'online') {
      if (this.dataService.isCordovaAvailable) {
        if (this.dataService.platform.toLowerCase() == this.constants.val_android) {
          networkinterface.getHttpProxyInformation(this.constants.publicURL.serviceURL, (onSuccess) => {
            console.log("On NetworkInterface Success", onSuccess);
            this.apiCall(endpoint, requestObj).then((response) => {
              this.loader.hideLoader();
              console.log('response', JSON.stringify(response));
              if (response != undefined) {
                var decryptKey = "";

                switch (response.secType) {
                  case "M":
                    decryptKey = self.constants.staticKey;
                    break;

                  case "S":
                    decryptKey = self.storage.getLocalStorage(self.constants.storage_mobileNo) + self.constants.mapEncryptKey;
                    break;

                  case "D":
                    decryptKey = self.storage.getSessionStorage(self.constants.val_sessionKey);
                    // decryptKey = "19816465728282";
                    break;

                  default:
                    decryptKey = "";
                    break;
                }

                var decryptedData = decryptKey == "" ? response : self.encryptDecryptService.decryptText(decryptKey, self.commonMethod.removeLineBreaksFromBase64(response.data));
                if (decryptKey != "") {
                  var responseData = JSON.parse(decryptedData);
                  for (var key in responseData) {
                    response[key] = responseData[key];
                  }
                }
                
                delete response['data'];
                console.log(endpoint + " response--->" + JSON.stringify(response));
                if (response.hasOwnProperty('responseParameter')) {
                  this.ngZone.run(() => {
                    if (response.responseParameter.hasOwnProperty('opstatus')) {
                        if (response.responseParameter.opstatus == "01" && this.showErrorPopup) {
                          if (this.contactSync) {
                            this.dataService.isContactsSyncEnabled = false;
                            this.storage.setLocalStorage('isContactSynced', "N")
                            this.dataService.mobileContacts = this.dataService.mobileContactsClone;
                          }
                          if (response.responseParameter.hasOwnProperty("Result") && response.responseParameter.Result && response.responseParameter.Result != "" && response.responseParameter.Result != null) {
                              this.ngZone.run(() => {
                                this.dataService.information = response.responseParameter.Result;
                                this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                                this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                                this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                              })
                          }
                          else {
                            // this.dataService.information = 'There is some difficulty in processing the request. Please try again later.';
                            this.ngZone.run(() => {
                              this.dataService.information = this.injector.get(TranslatePipe).transform('PLEASE_TRY_AGAIN_LATER');
                              this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                              this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                              this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                            })


                          }
                        }
                        else if (response.responseParameter.opstatus == "02" && this.showErrorPopup) {
                            this.dataService.information = response.responseParameter.Result;
                            this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                            this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                            this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                        }
                        else if ((response.responseParameter.opstatus == "03" || response.responseParameter.opstatus == "04" || response.responseParameter.opstatus == "05") && this.showErrorPopup) {
                          this.ngZone.run(() => {
                            if (this.contactSync) {
                              this.dataService.isContactsSyncEnabled = false;
                              this.storage.setLocalStorage('isContactSynced', "N")
                              this.dataService.mobileContacts = this.dataService.mobileContactsClone;
                            }
                            this.dataService.information = response.responseParameter.Result;
                            this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                            this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                            this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                          })
                        }
                        else if (response.responseParameter.opstatus == "19" && this.showErrorPopup) {
                          this.dataService.information = response.responseParameter.Result;
                          this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                          this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                          this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                        }
                      if (response.responseParameter.opstatus == self.constants.InvalidSessionCode) {
                        this._authService._authenticated = false;
                        showToastMessage(response.responseParameter.Result);
                        console.log("this.router.url", this.router.url);
                        if (this.constants.getPlatform() == "web") {
                          this.dataService.timeoutHeader = "Timed out!"
                          this.dataService.timeoutMsg = "You were idle for too long, please Login again";
                          self.router.navigateByUrl('/temporaryserviceout');

                        }
                      }
                    }
                  })
                }
                if (response) {
                  subject.next(response);
                  subject.complete();
                } else {
                  subject.complete();
                  // subject.unsubscribe();
                }
              }
              self.loader.hideLoader();
            }, (error) => {
              if (this.contactSync) {
                this.dataService.isContactsSyncEnabled = false;
                this.storage.setLocalStorage('isContactSynced', "N")
                this.dataService.mobileContacts = this.dataService.mobileContactsClone;
              }
              subject.next({ responseParameter: { opstatus: "01" } });
            });
          }, (onError) => {
            this.dataService.errorMsg = this.injector.get(TranslatePipe).transform('TECHNICAL_ISSUE');
            this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('ERROR');
            this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
            this.commonMethod.openPopup('div.popup-bottom.proxy-ip-error');
          });
        } else {
          console.log("unknown platform...");
        }
      } else {
        var _decryptKey: any = "";
        this.apiCall(endpoint, requestObj).then((response) => {
          this.loader.hideLoader();
          console.log('response', JSON.stringify(response));
          console.log(response.secType);
          if (response != undefined) {


            switch (response.secType) {
              case "M":
                _decryptKey = self.constants.staticKey;
                break;

              case "S":
                _decryptKey = self.storage.getLocalStorage(this.constants.storage_mobileNo) + self.constants.mapEncryptKey;
                // decryptKey = 8668557192+self.constants.mapEncryptKey;
                break;

              case "D":
                //console.log(self.storage.getSessionStorage(self.constants.val_sessionKey));
                _decryptKey = self.storage.getSessionStorage(self.constants.val_sessionKey);
                // decryptKey = "19816465728282";
                break;

              default:
                _decryptKey = "";
                break;
            }

            _decryptKey == "" && response.secType == "D" ? self.storage.getSessionStorage(self.constants.val_sessionKey) : _decryptKey;
            //console.log("decryptKey ====>"+_decryptKey);
            var decryptedData = _decryptKey == "" ? response : self.encryptDecryptService.decryptText(_decryptKey, self.commonMethod.removeLineBreaksFromBase64(response.data));
            console.log("decryptedData ====>", decryptedData);
            if (_decryptKey != "") {
              var responseData = JSON.parse(decryptedData);
              for (var key in responseData) {
                response[key] = responseData[key];
              }
            }
            delete response['data'];
            console.log(endpoint + " response--->" + JSON.stringify(response));
            if (response.hasOwnProperty('responseParameter')) {
              this.ngZone.run(() => {
                if (response.responseParameter.hasOwnProperty('opstatus')) {
                    if (response.responseParameter.opstatus == "01" && this.showErrorPopup) {
                      if (this.contactSync) {
                        this.dataService.isContactsSyncEnabled = false;
                        this.storage.setLocalStorage('isContactSynced', "N")
                        this.dataService.mobileContacts = this.dataService.mobileContactsClone;
                      }
                      if (response.responseParameter.hasOwnProperty("Result") && response.responseParameter.Result && response.responseParameter.Result != "" && response.responseParameter.Result != null) {
                          this.ngZone.run(() => {
                            this.dataService.information = response.responseParameter.Result;
                            this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                            this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                            this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                          })
                      }
                      // Handling for OTP back page in OMNI and redirect to previous url
                    } else if (response.responseParameter.opstatus == "02" && this.showErrorPopup) {
                        this.dataService.information = response.responseParameter.Result;
                        this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                        this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                    }
                    else if ((response.responseParameter.opstatus == "03" || response.responseParameter.opstatus == "04" || response.responseParameter.opstatus == "05") && this.showErrorPopup) {
                      this.ngZone.run(() => {
                        if (this.contactSync) {
                          this.dataService.isContactsSyncEnabled = false;
                          this.storage.setLocalStorage('isContactSynced', "N")
                          this.dataService.mobileContacts = this.dataService.mobileContactsClone;
                        }
                        this.dataService.information = response.responseParameter.Result;
                        this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
                        this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
                        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
                      })
                    }
                  
                  if (response.responseParameter.opstatus == self.constants.InvalidSessionCode) {
                    showToastMessage(response.responseParameter.Result);
                    console.log("this.router.url", this.router.url);
                    this._authService._authenticated = false;
                    if (this.constants.getPlatform() == "web") {
                      this.dataService.timeoutHeader = "Timed out!"
                      this.dataService.timeoutMsg = "You were idle for too long, please Login again"
                      self.router.navigateByUrl('/temporaryserviceout');
                    }else {
                      self.router.navigateByUrl('/loginMobile');
                    }
                  }
                }
              })
            }
            if (response) {
              subject.next(response);
              subject.complete();
            } else {
              subject.complete();
              // subject.unsubscribe();
            }
          }
          
        }, (error) => {
          if (this.contactSync) {
            this.dataService.isContactsSyncEnabled = false;
            this.storage.setLocalStorage('isContactSynced', "N")
            this.dataService.mobileContacts = this.dataService.mobileContactsClone;
          }
          subject.next({ responseParameter: { opstatus: "01" } });
        
        });
      }
    } else {
      if (this.contactSync) {
        this.dataService.isContactsSyncEnabled = false;
        this.storage.setLocalStorage('isContactSynced', "N")
        this.dataService.mobileContacts = this.dataService.mobileContactsClone;
      }
      subject.unsubscribe();
      this.ngZone.run(() => {
        this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
        this.dataService.informationDetails = this.injector.get(TranslatePipe).transform('NO_INTERNET_CONNECTION');
        this.commonMethod.openPopup('div.popup-bottom.network-info')
      });
    }
    return subject.asObservable();
  }




  /**
   * For handling http error this function is invoked
   * @param operation
   * @param result
   */
  private handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {
      this.loader.hideLoader();
      if (this.contactSync && this.dataService.isContactsSyncEnabled) {
        this.dataService.isContactsSyncEnabled = false;
        this.dataService.mobileContacts = this.dataService.mobileContactsClone;
        this.storage.setLocalStorage('isContactSynced', "N");
      }
      // TODO: send the error to remote logging infrastructure
      console.error('Error in http-rest-api ===> ', error); // log to console instead
      this.ngZone.run(() => {
        // this.dataService.information = 'There is some difficulty in processing the request. Please try again later.';
        $('#sendsmsModal').modal('hide');
        if(this.showTimoutErrorPopup){
          this.dataService.information = this.injector.get(TranslatePipe).transform('PLEASE_TRY_AGAIN_LATER');
          this.dataService.informationLabel = this.injector.get(TranslatePipe).transform('INFORMATION');
          this.dataService.primaryBtnText = this.injector.get(TranslatePipe).transform('OK');
          this.commonMethod.openPopup('div.popup-bottom.show-common-info');
        }
      })

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      switch (error.status) {
        case this.STATUS.ERR_CODE_SERVER_UNAVAILABLE:
          console.log(this.constants.SERVICE_UNAVAILABLE_MSG);
          break;
        case this.STATUS.ERR_CODE_TIMEOUT:
          // showToastMessage(this.constants.SERVICE_TIMEOUT_MSG);
          console.log(this.constants.SERVICE_TIMEOUT_MSG);
          break;
        //don't add toast msg from here
        case this.STATUS.ERR_CODE_SERVER_ERROR:
          // showToastMessage(this.constants.SERVICE_SERVER_ERROR_MSG);
          console.log(this.constants.SERVICE_SERVER_ERROR_MSG);
          break;
        case this.STATUS.ERR_CODE_BAD_REQUEST:
          console.log(this.constants.SERVICE_BAD_REQ_MSG);
          break;
        case this.STATUS.ERR_CODE_UNAUTHORIZED:
          console.log(this.constants.SERVICE_UNAUTHORIZED_MSG);
          break;
        case this.STATUS.ERR_CODE_NOT_FOUND:
          console.log(this.constants.SERVICE_NOT_FOUND_MSG);
          break;
        case this.STATUS.ERR_CODE_METHOD_NOT_ALLOWED:
          console.log(this.constants.SERVICE_METHOD_NOT_ALLOWED_MSG);
          break;
        case this.STATUS.ERR_CODE_UNKNOWN:
          console.log(this.constants.SERVICE_METHOD_UNKNOWN_ERR_MSG);
          // console.log(this.plugin.checkConnection());
          break;

        default:
          break;
      }
      return of(result as T);
    };
  }

  public getIPAddress() {
    return this.http.get("https://jsonip.com");
  }

}
