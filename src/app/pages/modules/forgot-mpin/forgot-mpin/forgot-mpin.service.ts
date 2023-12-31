import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotMpinService {

  constructor(private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService) { }

    getProfileUpdateChangeMPINParam(formData)
    {

      var inputData =
      {...this.dataService.commonInputData(),...{
        [this.constant.key_deviceId]:this.localStorage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_OLDPIN]:this.encryptDecryptService.createMD5Value(formData.oldPassword),
        [this.constant.key_NEWPIN]:this.encryptDecryptService.createMD5Value(formData.newpassword),
        [this.constant.key_typeOfPin]:this.constant.val_MPIN,
        }
  }
      console.log('getProfileUpdateChangeMPINParam',JSON.stringify(inputData));
      let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
      return encryptData;
  }
}

