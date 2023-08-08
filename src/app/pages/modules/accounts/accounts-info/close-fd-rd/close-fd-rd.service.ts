import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class CloseFdRdService {

  constructor(
    private constant: AppConstants,
    private dataService: DataService,
    private storage: LocalStorageService,
    private common: CommonMethods,
    private encryptDecryptService: EncryptDecryptService
  ) { }

  getCloseFDCall(selectedAccount) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNoOrg]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_tdClosureValidationdata]: this.storage.getLocalStorage(this.constant.storage_mobileNo) + '|' + this.dataService.userDetails.cifNumber + "|" + selectedAccount
      }
    }

    console.log('getCloseFDCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getCloseRDCall(selectedAccount) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNoOrg]: this.storage.getLocalStorage(this.constant.storage_mobileNo),

        [this.constant.key_rdClosureValidationData]: this.storage.getLocalStorage(this.constant.storage_mobileNo) + '|' + this.dataService.userDetails.cifNumber + "|" + selectedAccount
      }
    }

    console.log('getCloseRDCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
