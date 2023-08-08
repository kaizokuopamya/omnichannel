import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../app.constant';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from 'src/app/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class SecurityUpdateService {

  constructor( private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService) { }




  getChannelLeadOtpParam(requestRRN?:any){
   
    var reqObj = {...this.dataService.commonInputData(), ...{
     [this.constant.key_deviceId]:this.localStorage.getLocalStorage("deviceId"),
     [this.constant.key_MobileNo]:this.localStorage.getLocalStorage(this.constant.storage_mobileNo),
     [this.constant.key_service_Type]: this.constant.val_REGISTRATION,
     [this.constant.key_requestRRN] : requestRRN ? requestRRN : '',
  }}
  console.log('getChannelLeadOtpParam',JSON.stringify(reqObj));
    return reqObj;
 
  }


  getProfileUpdatePasswordChangeParam(formData) {

    var reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_loginType]:this.constant.val_loginType,
      [this.constant.key_UserID]:this.localStorage.getLocalStorage(this.constant.Key_username),
      [this.constant.key_cifNumber]: this.dataService.userDetails.cifNumber,
      [this.constant.key_oldPassword]:this.encryptDecryptService.createMD5Value(formData.oldPassword),
      [this.constant.key_newPassword]:this.encryptDecryptService.createMD5Value(formData.newPassword),
    }}
    console.log('getProfileUpdatePasswordChangeParam',JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }

  getProfileUpdateChangeTPINParam(newtpin:any , oldTpin:any) {

    var reqObj = {...this.dataService.commonInputData(), ...{
     
      [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_OLDPIN]:this.encryptDecryptService.createMD5Value(oldTpin),
      [this.constant.key_NEWPIN]:this.encryptDecryptService.createMD5Value(newtpin),
      [this.constant.key_typeOfPin]:this.constant.val_TPIN,
 }}
    console.log('getProfileUpdateChangeTPINParam',JSON.stringify(reqObj));
    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
 }

 getProfileUpdateChangeMPINParam(newMpin:any , oldMpin:any) {
  console.log('newMpin:',newMpin);
  var reqObj = {...this.dataService.commonInputData(), ...{
    [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
    [this.constant.key_OLDPIN]:this.encryptDecryptService.createMD5Value(oldMpin),
    [this.constant.key_NEWPIN]:this.encryptDecryptService.createMD5Value(newMpin),
    [this.constant.key_typeOfPin]:this.constant.val_MPIN,
  }}
  console.log('getProfileUpdateChangeMPINParam',JSON.stringify(reqObj));
  let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
  return encryptData;
}
}
