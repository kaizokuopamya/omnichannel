import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class BillReminderListService {

  constructor( private constant:AppConstants,
    private dataService:DataService,  
      private encryptDecryptService:EncryptDecryptService,
    private storage:LocalStorageService,) { }


  addBillReminderparam(){
    var imeinum = this.dataService.imei;
    var inputData = {  ...this.dataService.commonInputData(), ...{
      ["cifNumber"]: this.dataService.userDetails.cifNumber

      
  }}
  console.log("getBillReminbder params =====>" + JSON.stringify(inputData));
  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
}
}
