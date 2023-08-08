import { Injectable } from '@angular/core';

import { DatePipe } from '@angular/common';
import { AppConstants } from 'src/app/app.constant';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Injectable({
  providedIn: 'root'
})
export class ViewNomineeDetailsService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod : CommonMethods
  ) { }


  getNomineeData(selectedAccountNo, cifNumber){
    var inquiryNomineeData = cifNumber + "|" + selectedAccountNo
    var inputData = {
    [this.constant.key_entityId]: this.constant.getEntityId(),
    [this.constant.key_cbsType]: this.constant.val_cbsTypeTcs,
    [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
    [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
    [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
    [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9),
    [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
    [this.constant.key_referenceNumber] : this.commonMethod.genRandomDigit(9),
    [this.constant.key_inquiryNomineeData] :  inquiryNomineeData,
 
  }
  console.log(' Nominee Data :: =>  ', JSON.stringify(inputData));
  console.log(this.storage.getSessionStorage(this.constant.val_sessionKey));

  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
 }


     /**
   * Get statelist request
   */
     getStateListParams() {
      var inputData = {
        [this.constant.key_entityId]: this.constant.getEntityId(),
        [this.constant.key_cbsType]: this.constant.val_cbsType,
        [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
        [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
        [this.constant.key_latitude]: this.dataService.latitude,
        [this.constant.key_longitude]: this.dataService.longitude,
        [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
        [this.constant.key_CountryCode]: "1",
        [this.constant.Key_type]: 'CBSALLSTATES' //Country code 1 is for india
      }
      console.log("getStateListParams ",JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
      //return inputData;
      return encryptData;

    }

    getCityListParams(stateId) {
      var inputData = {
        [this.constant.key_entityId]: this.constant.getEntityId(),
        [this.constant.key_cbsType]: this.constant.val_cbsType,
        [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
        [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
        [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
        [this.constant.key_latitude]: this.dataService.latitude,
        [this.constant.key_longitude]: this.dataService.longitude,
        [this.constant.key_StateId]: stateId,
        [this.constant.Key_type]: 'CBSALLCITIES'
      }
  
      console.log('city Params ', JSON.stringify(inputData));
  
      let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
      //return inputData;
      return encryptData;
    }

}
