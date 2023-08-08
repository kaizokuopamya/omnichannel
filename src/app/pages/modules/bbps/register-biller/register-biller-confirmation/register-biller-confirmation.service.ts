import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../../app.constant';
import { EncryptDecryptService } from '../../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { DataService } from '../../../../../services/data.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Injectable({
  providedIn: 'root'
})
export class RegisterBillerConfirmationService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    private storage: LocalStorageService,) { }



  registerNewBiller(requiredData, platform, formValue , billerId ){
    console.log("formValue : " + JSON.stringify(formValue))
    var imeinum = this.dataService.imei;
    var devicedetails
    if (this.constant.getPlatform() == "web") {
      devicedetails= {
        "init_channel": "InternetBanking",
        "ip": this.dataService.ipAddress,
        "mac": "11-AC-58-21-1B-AA"
      }
    }else{
      var imeinum = this.dataService.imei;
      devicedetails= {
       
        "init_channel": "MobileBanking",
        "ip": this.dataService.ipAddress,
        "imei": imeinum ?  imeinum : "452930183567388",
        "os": "Ios",
        "app": "AGENTAPP"
      }
    }
   var inputData = {...this.dataService.commonInputDataBBPS(), ...{
   
     [this.constant.key_service_name]:this.constant.serviceName_CreateBillerAccountWithoutAutopayService,
     'customerId': this.dataService.customerID,
     "short_name": formValue.shortName,
     "billerid": billerId,
     "authenticators" : requiredData,
     "firstName":this.dataService.profileName.split(' ')[0],
     "lastName": this.dataService.profileName.split(' ')[this.dataService.profileName.split(' ').length - 1],
     "mobile": this.storage.getLocalStorage(this.constant.storage_mobileNo),
     "email":  this.dataService.profileDetails[0].emailId.toLowerCase(),
     "init_channel":  platform,
     "deviceIp": this.dataService.ipAddress,
     "mac": "11-AC-58-21-1B-AA",
     "app": "AGENTAPP",
      "ip": this.dataService.ipAddress,
      "imei": imeinum ?  imeinum : "452930183567388",
      "os":  'iOS',
      "device": JSON.stringify(devicedetails),
     
   }}
   console.log("getbillerlist ==>" + JSON.stringify(inputData))
   console.log('this.storage.getSessionStorage(this.constant.val_sessionKey)' , this.storage.getSessionStorage(this.constant.val_sessionKey))
   let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
   return encryptData;
 }
}
