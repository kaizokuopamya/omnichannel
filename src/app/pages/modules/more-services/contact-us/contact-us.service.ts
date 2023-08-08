import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  
  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService:DataService,
    private commonMethod: CommonMethods
  ) { }

  callbackParam(value){
    var inputData = {...this.dataService.commonInputData(), ...{
        "MobileNo": value.mobNumber,
        "language": value.language,
        "callbacktime": value.timeSlot,
      }
    }
    console.log('callback Request pamas ====>' + JSON.stringify(inputData))
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    console.log('callback Request encryptData ====>' + JSON.stringify(encryptData))
    return encryptData;
  }

  getcontactUsParam() {
    var inputData = {...this.dataService.commonInputData(), ...{
      }
    }

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}
