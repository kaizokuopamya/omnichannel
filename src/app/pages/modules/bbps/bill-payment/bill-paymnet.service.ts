import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../app.constant';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { DataService } from '../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { VirtualTimeScheduler } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BillPaymnetService {

  constructor( private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private storage: LocalStorageService,) { }

   
    
    fetchbill(location , type) {
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:this.constant.serviceName_RetrieveBillService2,
        
      }}
      
      console.log("getbillerlist ==>" + JSON.stringify(inputData))
      console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

    getServiceAlert(){
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
     
        [this.constant.key_service_name]: this.constant.serviceName_BillerAlertsService,
        'customerId':this.dataService.customerID ,
        "MobileNo": this.storage.getLocalStorage(this.constant.storage_mobileNo),
        
      }}
      console.log("getAllServiceAlert Request ==>" + JSON.stringify(inputData))
       let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }


    getBillDetails(consumerNum , billerId, serviceName){
      var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
        [this.constant.key_service_name]:serviceName,
        [this.constant.key_biller_customerid]:consumerNum,
        [this.constant.key_billerid] :billerId,
        
      }}
      console.log("getbillerlist ==>" + JSON.stringify(inputData))
      console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
    }

  }