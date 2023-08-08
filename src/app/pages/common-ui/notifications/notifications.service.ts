import { Injectable } from '@angular/core';
import { AppConstants } from '../../../app.constant';
import { EncryptDecryptService } from '../../../services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from '../../../services/data.service';
import { CommonMethods } from '../../../services/common-methods';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  latitude: any;
  longitude: any;
  userLocationName: any;

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
  ) { }

  /**
   * Common function to set omni request for upi
   * @param upiRequestObj 
   */
  getOmniRequestObject(upiRequestObj) {
    var upiRequestObj = upiRequestObj;
    var inputData = {
      ...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_upiRequest]: JSON.stringify(upiRequestObj)
    }
  } 
    console.log('inputData => ', JSON.stringify(inputData));
    return this.getEncryptedOmniRequestObject(inputData);
  }

  /**
   * Common function to encrypt the data
   * @param inputData 
   */
  getEncryptedOmniRequestObject(inputData) {
    console.log('session Key : ', this.storage.getSessionStorage(this.constant.val_sessionKey))
    // let encryptData = this.encryptDecryptService.encryptText(this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey, JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    
    console.log('encryptDatagetOmniRequestObject => ', JSON.stringify(encryptData));
    return encryptData;
  }

  getNotificationParam() {
      var inputData = {
        ...this.dataService.commonInputData(), ...{
          [this.constant.key_deviceId]:this.storage.getLocalStorage(this.constant.storage_deviceId),
          [this.constant.key_otpCode]:"",
          [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        }
      } 
    
        console.log("getNotificationParam :", JSON.stringify(inputData));
        let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
        return encryptData;
      }
    
      getNotificationReadParam(id) {
        var inputData = {
          ...this.dataService.commonInputData(), ...{ 
            [this.constant.key_deviceId]:this.storage.getLocalStorage(this.constant.storage_deviceId),
            [this.constant.key_otpCode]:"",
            [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
            [this.constant.key_NotificationID]:id,
            [this.constant.key_Status]:'Y'
          }
        }
      
         console.log("getNotificationParam :", JSON.stringify(inputData));
         let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
        return encryptData;
        
}

}
