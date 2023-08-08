import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private dataService: DataService
   
  ) { }

  getForgotPassowrd(formData)
  {
    var inputData = {...this.dataService.commonInputData(),...{
     [this.constant.Key_username]:formData.username.toLowerCase(),
     [this.constant.key_accountNo] : formData.accNo ,
     [this.constant.key_cifNumber] : formData.custId
    }
  }
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
   return encryptData;
  }

}


