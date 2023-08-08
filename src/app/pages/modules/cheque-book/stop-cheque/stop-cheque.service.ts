import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StopChequeService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    public dataService: DataService,
    public common:CommonMethods
  ) { }

  getSingleChequeInquiryParam(formData , screen) {
    var inputData = {};

    var chqNumber;
    if(screen == "fromStop"){
      chqNumber = formData.frmChequeNumber
    }else{
      chqNumber = formData.chequeNumber
    }

    console.log("chqNumber" + chqNumber);
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formData.account,
        [this.constant.key_cheque_Number]: chqNumber,
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBulkChequeInquiryParam(formData) {
    var inputData = {};
    var noOfLeaves = +formData.toChequeNumber - +formData.fromChequeNumber + 1
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_bulkChequeInquiryData]: formData.account + "|" + parseInt(formData.fromChequeNumber) + "|" + noOfLeaves,
        [this.constant.key_accountNo]: formData.account,
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getReasonChequeParam() {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_productType]: this.constant.val_StopCheque
      }
    }

    console.log('stop cheque reason list', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getSingleStopChequeParam(formData) {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_accountNo]: formData.account,
        [this.constant.key_cheque_Number]: formData.chequeNumber
      }
    }

    console.log('stop cheques param', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getBulkStopChequeParam(formData) {
    var inputData = {};
    var noOfLeaves = +formData.toChequeNumber - +formData.frmChequeNumber  + 1;
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: formData.account,
        [this.constant.key_cheque_Number]: formData.frmChequeNumber,
        [this.constant.key_noOfLeaves]: noOfLeaves,
        [this.constant.key_reasonCode]: formData.reason,
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

}
