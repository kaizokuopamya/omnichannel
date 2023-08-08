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
export class PositivePayService {

  constructor( 
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage:LocalStorageService,
    public dataService : DataService,
    public common:CommonMethods,
    public datepipe:DatePipe){}

  getPositivePayParam(formData)
  {
    var inputData = {};
    var datePipe = this.datepipe.transform(formData.datepicker1, 'dd-MMM-yyyy');
    var san = formData.selectAccount.substr(formData.selectAccount.length - 6)
    inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_cheque_Number]: formData.chequeNumber,
      [this.constant.key_amount]:((formData.amount).trim().replace(/[^.0-9]+/g, '')),
      [this.constant.key_positivePayData]:  this.dataService.userDetails.customerID+"|"+formData.selectAccount+"|"+formData.chequeNumber+"|"+datePipe+"|"+((formData.amount).trim().replace(/[^.0-9]+/g, ''))+"|"+formData.transactionCode+"|PSB|"+formData.micr +"|"+formData.payeeName+"|"+san
    }}
    console.log('getPositiveBayParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getSingleChequeInquiryParam(accountNo,chequeNumber){
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_accountNo]: accountNo,
        [this.constant.key_cheque_Number]: chequeNumber,
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
