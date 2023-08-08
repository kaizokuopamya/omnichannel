import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotUsernameService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private datepipe: DatePipe,
    private dataService :DataService
  ) { }

  getForgotUserName(formData) {

    var datePipe = this.datepipe.transform(formData.dob, 'dd-MM-yyyy')

    var inputData = {...this.dataService.commonInputData(),...{
      [this.constant.Key_customerId]:formData.customerID.toLowerCase(),
      [this.constant.key_UserID]:formData.mobile,
      [this.constant.key_MobileNo]:formData.mobile,
      [this.constant.key_dateOfBirth]: datePipe,
    }
  }
    console.log(JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }
}



