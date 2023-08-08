import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../app.constant';
import { EncryptDecryptService } from '../../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { DataService } from '../../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';
@Injectable({
  providedIn: 'root'
})
export class RegisterNewBillerService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private storage: LocalStorageService,) { }

    



 

  registerNewBiller(requiredData, platform, formValue ){
   
    var imeinum = this.dataService.imei;
    var inputData = { ...this.dataService.commonInputDataBBPS(), ...{
      [this.constant.key_service_name]:this.constant.serviceName_CreateBillerAccountWithoutAutopayService,
      'customerId': this.dataService.customerID,
      "short_name": formValue.shortName,
      "billerid": formValue.boardname,
      "authenticators" : requiredData,
      "firstName":this.dataService.userDetails?.customerName.split(' ')[0],
      "lastName": this.dataService.userDetails?.customerName.split(' ')[this.dataService.userDetails?.customerName.split(' ').length - 1],
      "mobile": this.storage.getLocalStorage(this.constant.storage_mobileNo),
      "email":  this.dataService.profileDetails[0].emailId.toLowerCase(),
      "init_channel":  platform,
      "deviceIp": this.dataService.ipAddress,
      "mac": "11-AC-58-21-1B-AA",
      // "ip": this.dataService.ipAddress,
      // "imei": imeinum ?  imeinum : "452930183567388",
      // "os": this.constant.getPlatform(),
      
    }}
    console.log("getbillerlist ==>" + JSON.stringify(inputData))
    console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

}
