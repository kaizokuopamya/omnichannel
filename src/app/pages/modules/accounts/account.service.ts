import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private datepipe: DatePipe

  ) { }

  /**
* request parameter for balance enquiry
*/
  getMyAccountList(cifNo) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_omniDashData]: cifNo,
      }
    }
    console.log(' getMyAccountParam : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getMyLoansMiniStatement(accNo){
    var fromDate = this.datepipe.transform(new Date().toISOString(), "dd-MM-yyyy");
    var d = new Date();
    d.setMonth(d.getMonth() - 12);
    var toDate = this.datepipe.transform(d.toISOString(), "dd-MM-yyyy");
    var loanMiniStatementData = accNo + "|" + toDate + "|" + fromDate;

    var inputData = {
      ...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_latitude]: this.dataService.latitude,
      [this.constant.key_longitude]: this.dataService.longitude,
      [this.constant.key_accountNo]: accNo,
      [this.constant.key_loanMiniStatementData] : loanMiniStatementData,
      //[this.constant.key_loanMiniStatementData] : '13291400000103|24-09-2017|24-09-2018'
    }
  }
    console.log('getMyLoansMiniStatement : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  depositeAccountEquirey(accNo) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_subCode]: "01",//for enquiry
      [this.constant.key_accountNo]: accNo,
      [this.constant.key_MobileNo_Org] : this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }
    console.log(' depositeAccountEquirey : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

}
