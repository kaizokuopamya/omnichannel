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
export class AddModifyNomineeService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private datePipe: DatePipe
  ) { }

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
      [this.constant.Key_type]: this.dataService.nomineeType == 'MODIFY' ? 'CBSALLSTATES' : '' //Country code 1 is for india
    }
    console.log("getStateListParams ", JSON.stringify(inputData));
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
      [this.constant.Key_type]: this.dataService.nomineeType == 'MODIFY' ? 'CBSALLCITIES' : ''
    }

    console.log('city Params ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  getDropDownMasterParam(resType) {
    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsType,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_omni_refRecType]: resType
    }
    console.log("request", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData
  }

  getUpdateNomineeService(cifNumber, accountNo, formValue, minorFlag, dateOfBirth, state?, city?) {
    let updatedNomineeData;
    var mobileNo = this.storage.getLocalStorage(this.constant.storage_mobileNo)
    var guardianAddress = formValue.guardianAddress
    
    if (this.dataService.nomineeType == 'ADD') {
      updatedNomineeData = cifNumber + "|" + accountNo + "|" + formValue.nomineeName + "|" + formValue.nomineeRelationship + "|" + formValue.address1 + "|" + formValue.address2 + "|" + dateOfBirth + "|" + minorFlag + "|" + formValue.guardianName + "|" + guardianAddress + "|" + mobileNo + "|" + city + "|" + state + "|" + 'IN' + "|" + formValue.guardianRelationShip;
    } else {
      updatedNomineeData = cifNumber + "|" + accountNo + "|" + formValue.nomineeName + "|" + formValue.nomineeRelationship + "|" + formValue.address1 + "|" + formValue.address2 + "|" + dateOfBirth + "|" + minorFlag + "|" +
        formValue.guardianName + "|" + formValue.guardianAddress + "|" + mobileNo + "|" + formValue.city + "|" + formValue.state + "|" + 'IN' + "|" + formValue.guardianRelationShip;
    }

    var inputData = {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_addNomineeData]: updatedNomineeData,
    }
    console.log("Add Nomine Request ::", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData
  }


}

