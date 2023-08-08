import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(
    private constant: AppConstants,
    private storage: LocalStorageService,
    private dataService: DataService,
    private encryptDecryptService: EncryptDecryptService,
    private common: CommonMethods) { }

  getAccountEnquiryParams(receiptObjs, branchcode) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: receiptObjs,
        [this.constant.key_branchCode]: branchcode,
      }
    }
    console.log(' getAccountEnquiryParam ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  benificiaryListParam() {
    var inputData = {};
    inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


}
