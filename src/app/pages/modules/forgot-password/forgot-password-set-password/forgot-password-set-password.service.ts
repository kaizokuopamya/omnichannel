import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordSetPasswordService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService,
    
  ) { }

  getSetForgoatPassword(formdata) {
    var inputData = {
      ...this.dataService.commonInputData(),...{
      [this.constant.key_deviceId]:this.constant.deviceID,
      [this.constant.key_channelType]:this.constant.val_channelValueIB,
      [this.constant.key_UserID]: this.dataService.forgotPassUsername.toLowerCase(),
      [this.constant.key_password]:this.encryptDecryptService.createMD5Value(formdata.setPassword),
      [this.constant.key_crmReferenceNumber]:this.dataService.crmReferenceNumber,
      [this.constant.key_customerID]:this.dataService.userDetails.cifNumber,
      [this.constant.key_cifNumber]:this.dataService.userDetails.cifNumber,
      [this.constant.key_reqType]:'forgot'
   }
    }
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
   return encryptData;
  }
}

