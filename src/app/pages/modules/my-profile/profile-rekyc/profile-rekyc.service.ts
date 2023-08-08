import { Injectable } from '@angular/core';
import { AppConstants } from '../../../../app.constant';
import { EncryptDecryptService } from '../../../../services/encrypt-decrypt.service';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileRekycService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService
  ) { }


  /**
  * request parameter for 
  */
  getUpdateReKycParam(username,cif,remark,value) {
    var inputData = {
      

      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsTypeTcs,
      [this.constant.key_mobPlatform] : "",
      [this.constant.key_mobileAppVersion]:this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]:this.constant.val_clientAppVersion,
      [this.constant.key_latitude]:this.dataService.latitude,
      [this.constant.key_longitude]:this.dataService.longitude,
      [this.constant.key_UserID]:username,
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage(this.constant.storage_deviceId),
      [this.constant.key_methodName]:"RECORDCUSTREKYCSTATUS",
      [this.constant.key_omni_value]: value,
      [this.constant.key_omni_cif]:cif,
      [this.constant.key_remarks]:remark
    }

    let encryptData = this.encryptDecryptService.encryptText(this.localStorage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    console.log('getUpdateReKycParam',JSON.stringify(inputData));
    
    return encryptData;
    
    }
}
