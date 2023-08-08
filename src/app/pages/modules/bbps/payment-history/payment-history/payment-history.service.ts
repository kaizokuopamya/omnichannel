import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../app.constant';
import { EncryptDecryptService } from '../../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { DataService } from '../../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private storage: LocalStorageService) { }

  getTransactionHistoryParam(type , refNum , fromDate , toDate){

    var inputData:any = { ...this.dataService.commonInputDataBBPS(), ...{
     
      [this.constant.key_service_name]: this.constant.serviceName_RetrieveRecentTransactions,
      'customerId':this.dataService.customerID ,
    
      
    }}
    if( type == "transaction"){
      inputData.paymentid = refNum
    }else if(type == "duration"){
      inputData.from_txn_date_time = fromDate
      inputData.to_txn_date_time = toDate
    }else{
      
    }


    console.log("getbillerlist ==>" + JSON.stringify(inputData))
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
