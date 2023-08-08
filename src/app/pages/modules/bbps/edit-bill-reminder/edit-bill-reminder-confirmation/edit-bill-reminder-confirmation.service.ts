import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class EditBillReminderConfirmationService {

  constructor( private constant:AppConstants,
    private dataService:DataService,  
      private encryptDecryptService:EncryptDecryptService,
    private storage:LocalStorageService,) { }


    editBillReminderparam(values){
      console.log("values" , values)
    var inputData = { ...this.dataService.commonInputData(), ...{
      ["amount"]:values.updatedamt.trim().replace(/[^0-9]+/g, ''),
      ["dateOfPassing"]:values.updatedReminderDate,
      ["billerNickName"]:values.updatedNickName.toLowerCase(),
      ["ID"]: values.ID,
      ["remarks"]:"-",
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
