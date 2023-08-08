import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ThemeSettingsService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService : DataService
  ) { }

  getAllThemeParam() {
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId)
    }
  }

    console.log('getAllThemeParam', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
    // return inputData;
  }
  
  /**
   * request parameter for updating the themes
   */
  getThemeSettingsParam(obj) {
    var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_loginType]: this.constant.val_loginType,
      [this.constant.key_UserID]: this.localStorage.getLocalStorage(this.constant.storage_username),
      [this.constant.key_themeName]: obj.themeName,
      [this.constant.key_themeSideBarColor]: obj.themeSideBarColor,
      [this.constant.key_themeSideBackground]: obj.themeSideBackground,
      [this.constant.key_themeMenuOption]: obj.themeMenuOption,
      [this.constant.key_cifNumber]: this.dataService.userDetails.cifNumber
      }
    }
    console.log('getThemeSettingsParam', inputData);

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
    // return inputData;
  }

}