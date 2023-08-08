import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class DeleteBillReminderConfirmationService {

  constructor(private constant:AppConstants,
    private dataService:DataService,  
      private encryptDecryptService:EncryptDecryptService,
    private storage:LocalStorageService) { }

    deleteBillReminderparam(values){
      console.log("values" , values)
    var inputData = { ...this.dataService.commonInputData(), ...{
      

      ["ID"]: values.ID,
      ["remarks"]:"-",
      ["UserID"]:  this.dataService.userDetails.customerId,
      ["cifNumber"]: this.dataService.userDetails.cifNumber
      
  }}
  console.log("addBillReminbder params =====>" + JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
}
}
