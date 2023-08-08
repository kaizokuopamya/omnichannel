import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../app.constant';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { DataService } from '../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
@Injectable({
  providedIn: 'root'
})
export class RechargeBillpayService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private storage: LocalStorageService,) { 
    

  }

  

  getBillDetails(){
    var inputData = { ...this.dataService.commonInputDataBBPS(), ...{  
      [this.constant.key_service_name]: this.constant.serviceName_RetrieveOneViewService,
      'customerId':this.dataService.customerID ,  
    }}
    console.log("getbillerlist ==>" + JSON.stringify(inputData))
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }



  getComplainDetails(fromdate , todate){
    var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
     
      [this.constant.key_service_name]: this.constant.serviceName_RetrieveComplaintService,
      "mobile":  this.storage.getLocalStorage(this.constant.storage_mobileNo),
      'customerId':this.dataService.customerID , 
      "from_complaint_date" :  fromdate,
      "to_complaint_date" : todate, 
    }}
    console.log("getcomplainlist ==>" + JSON.stringify(inputData))
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }



  getTransactionHistoryParam(){
    var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
      [this.constant.key_service_name]: this.constant.serviceName_RetrieveRecentTransactions,
      'customerId':  this.dataService.customerID ,
    }}
    console.log("getTransactionHistoryParam ==>" + JSON.stringify(inputData))
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }



  getServiceProviderName(value){
    var inputData = {...this.dataService.commonInputDataBBPS(), ...{
      [this.constant.key_service_name]: this.constant.serviceName_SearchBillerListService,
      "billerName" :  value    
    }}
    console.log("getServiceProviderName  ==>" + JSON.stringify(inputData))
     let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getLogoDetials(idList){
    var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
      [this.constant.key_service_name]:this.constant.serviceName_GetBillersByIdsService,
      'billerIds':idList,
    }}
    console.log("getbillerlist ==>" + JSON.stringify(inputData))
    console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }
}
