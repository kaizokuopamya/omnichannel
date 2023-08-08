import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods
  ) { }

    //TODO:need to add current location
    getParamForLogin(formData) {
      var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo]: formData.mobNumber == undefined ? "" : formData.mobNumber,
        [this.constant.key_UserID]: formData.username == undefined ? "" : formData.username.toLowerCase(),
        [this.constant.key_password]: formData.password == undefined ? "" : this.encryptDecryptService.createMD5Value(formData.password),
        [this.constant.key_loginType]: this.constant.val_loginType
      }}
      console.log("login call ====>",JSON.stringify(inputData));
  
      let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
      return encryptData;

    }

    getProfileDetailsParam() {
      var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_omni_cif]:this.dataService.userDetails.cifNumber,
        [this.constant.key_UserID]: this.dataService.LoginForm.username == undefined ? "" : this.dataService.LoginForm.username.toLowerCase(),
      }}
  
      console.log("getProfileDetailsParam", JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    getCustomizeMenuParam(){
      var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo]: this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId)
      }}

      console.log("getCustomizeMenuParam", JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }
}
