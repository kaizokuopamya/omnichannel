import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
@Injectable({
  providedIn: 'root'
})
export class AddBillReminderConfirmationService {

  constructor(  private constant:AppConstants,
    private dataService:DataService,  
      private encryptDecryptService:EncryptDecryptService,
    private storage:LocalStorageService,
    private commonMethod: CommonMethods) { }



  addBillReminderparam(values){
    var amt 

    if(values.billertype != "BILLER" && amt != ''){
      amt = values.billDetails.amt.trim().replace(/[^0-9]+/g, '')
    }else{
      amt = '0.00'
    }
    var inputData = { ...this.dataService.commonInputData(), ...{
     
      ["amount"]:this.commonMethod.validateEmpty(amt)?"0.00":amt,
      ["dateOfPassing"]:values.billDetails.billerMonth,
      ["typeofreq"]:"Prepaid",
      ["BILLER_CATEGORY"]:values.billDetails.billerCategory,
      ["billerName"]:values.billDetails.boardname,
      ["consumerNumber"]:values.authArray[0].value,
      ["consumerDetails"]:JSON.stringify(values),
      ["billerNickName"]:values.billDetails.nickName.toLowerCase(),
      ["remarks"]:"TEST TRY",
      ["TransactionId"]:"-",
      ["UserID"]:  this.dataService.userDetails.customerId,
      ["cifNumber"]: this.dataService.userDetails.cifNumber
      // "ip": this.dataService.ipAddress,
      // "imei": imeinum ?  imeinum : "452930183567388",
      // "os": this.constant.getPlatform(),
      
  }}
  console.log("addBillReminbder params =====>" + JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
}
}
