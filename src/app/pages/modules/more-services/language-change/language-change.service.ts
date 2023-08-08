import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageChangeService {

  constructor(
    private constant: AppConstants,
    public dataService: DataService,
    private encryptDecryptService: EncryptDecryptService,


  ) { }
  
  getLangObjectParam() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
      }
    }

    console.log("getLangObjectParam ", JSON.stringify(inputData));
    //console.log("====>"+this.encryptDecryptService.decryptText(this.constant.staticKey, this.value));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }

  getLangDataObjectParam(selectLangValue) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.deviceID,
        [this.constant.key_prefered_Language]: selectLangValue,
      }

    }
    console.log("getLangDataObjectParam ", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}
