import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { AppConstants } from 'src/app/app.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class ProfileImgService {

  constructor(
    public constant: AppConstants, 
    private storage: LocalStorageService,
    private encryptDecryptService: EncryptDecryptService, 
    private dataService : DataService) { }




  getProfileImageParam(emailId,userName,permanentAdd,profileImg?) {
      
    var base64Img = '';
    if(profileImg.split(",")[1] != null) base64Img = profileImg.split(",")[1];
    var reqObj
    reqObj = {...this.dataService.commonInputData(), ...{
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_mobileNumber]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_base64Image]: base64Img,

    }}

    console.log('getProfileUpdateParam',JSON.stringify(reqObj));
    // let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(reqObj));
    return encryptData;
  }
}
