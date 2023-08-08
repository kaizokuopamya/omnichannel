import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecentPayeeService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage:LocalStorageService,
    public dataService : DataService,
    public common: CommonMethods
    ) { }

  getFavouritePayee(){
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
  console.log("get manage requrest=====>"+JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }
  getFrequentTransacParam(mpin?: any) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData()}

    if (mpin) {
      inputData[this.constant.key_loginType] = this.constant.val_loginTypeMPIN;
      inputData[this.constant.key_MobileNo] = this.storage.getLocalStorage(this.constant.storage_mobileNo);
      inputData[this.constant.key_MPIN] = this.encryptDecryptService.createMD5Value(this.dataService.mpin);
    } else {
      inputData[this.constant.key_loginType] = this.constant.val_loginType;
      inputData[this.constant.key_UserID] =  this.storage.getLocalStorage(this.constant.storage_username);
    }
    console.log("get recent trans requrest=====>"+JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage("sessionKey"), JSON.stringify(inputData));
    return encryptData;
  }
}
