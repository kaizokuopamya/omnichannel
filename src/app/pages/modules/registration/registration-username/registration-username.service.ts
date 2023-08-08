import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationUsernameService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService,
  ) {}

  getUpdateLoginDetailsParam(formData) {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_UserID]: formData.username.toLowerCase(),
        [this.constant.key_password]: this.encryptDecryptService.createMD5Value(formData.password),
        [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
        [this.constant.key_reqType]: 'registration'
      }
    }
    console.log('getUpdateLoginDetailsParam', JSON.stringify(inputData));
    let key = this.localStorage.getLocalStorage('mobileNo') + this.constant.mapEncryptKey;
    console.log("key ", key);

    let encryptData = this.encryptDecryptService.encryptText(key, JSON.stringify(inputData));
    return encryptData;
  }
  /**
   * request parameter for login update
   */
  getCheckAvaiablityParam(username) {
    var inputData = {...this.dataService.commonInputData(), ... {
        [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_UserID]: username.toLowerCase()
      }
    }
    console.log('getCheckAvaiablityParam', JSON.stringify(inputData));
    let key = this.localStorage.getLocalStorage('mobileNo') + this.constant.mapEncryptKey;
    console.log("key ", key);

    let encryptData = this.encryptDecryptService.encryptText(key, JSON.stringify(inputData));
    return encryptData;
  }
}
