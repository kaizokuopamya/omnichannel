import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationTpinService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService
  ) { }

  getTPINUpdateParam(formData) {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_TPIN]: this.encryptDecryptService.createMD5Value(formData),
        [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
        [this.constant.key_ServiceType]: ""
      }
    }
    console.log('getTPINUpdateParam', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getLocalStorage('mobileNo') + this.constant.mapEncryptKey, JSON.stringify(inputData));
    return encryptData;
  }

  /**
   * request parameter for registration update
   */
  getUpdateRegistrationDetailsParam() {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
        [this.constant.key_statusID]: "3"
      }
    }
    console.log('getUpdateRegistrationDetailsParam', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getLocalStorage('mobileNo') + this.constant.mapEncryptKey, JSON.stringify(inputData));
    return encryptData;
    // return inputData;
  }
}
