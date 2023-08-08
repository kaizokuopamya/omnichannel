import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationValidateRegDetailsService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private localStorage: LocalStorageService,
    private dataService: DataService
  ) {}



  getTokenExistsParam() {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_deviceId]: this.localStorage.getLocalStorage("deviceId"),
        [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
        [this.constant.key_customerID]: this.dataService.regFeildData.custId
      }
    };

    console.log(inputData);
    console.log(
      this.localStorage.getLocalStorage('mobileNo') +
        this.constant.mapEncryptKey
    );
    let encryptData = this.encryptDecryptService.encryptText(
      this.localStorage.getLocalStorage('mobileNo') +
        this.constant.mapEncryptKey,
      JSON.stringify(inputData)
    );
    return encryptData;
  }


  getValidateDebitCardParam(formdata)
  {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_debitCardNo]: '' + formdata.cardNumber1 + '' + formdata.cardNumber2 + '' + formdata.cardNumber3 + '' + formdata.cardNumber4,
        [this.constant.key_accountNo]: this.dataService.regFeildData.accNo,
        [this.constant.key_cardPin1]: '' + formdata.cvvPin1 + '' + formdata.cvvPin2 + '' + formdata.cvvPin3 + '' + formdata.cvvPin4,
        [this.constant.key_expirtDate]: '' + formdata.expDate3 + '' + formdata.expDate4 + '' + formdata.expDate1 + '' + formdata.expDate2,
      }
    }

    console.log("getForgotPassowrdAuthforDebitCard",inputData);
    let encryptData = this.encryptDecryptService.encryptText( this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
}
getValidateTokenParam(formdata,requestRRN) {
  var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_channelType]: this.dataService.getChannelType(),
      [this.constant.key_token]: formdata.bankToken,
      [this.constant.key_deviceId]: this.localStorage.getLocalStorage('deviceId'),
      [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
      [this.constant.key_branchCode]: this.dataService.regBranchCode,
      [this.constant.key_requestRRN]: requestRRN ? requestRRN : '',
    }
  };

  console.log(inputData);
  console.log(
    this.localStorage.getLocalStorage('mobileNo') +
      this.constant.mapEncryptKey
  );
  let encryptData = this.encryptDecryptService.encryptText(
    this.localStorage.getLocalStorage('mobileNo') +
      this.constant.mapEncryptKey,
    JSON.stringify(inputData)
  );
  return encryptData;
}

getValidateCredentailParam(formdata) {
  var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_channelType]: this.dataService.getChannelType(),
      [this.constant.key_UserID]: formdata.username,
      [this.constant.key_password]: formdata.password,
      [this.constant.key_corporateId]: formdata.username,
      [this.constant.Key_customerId]: formdata.username,
      [this.constant.key_loginType]: this.constant.val_PROFILE,
      [this.constant.key_credentialType]: this.constant.val_legacySystem,
    }
  };

  let encryptData = this.encryptDecryptService.encryptText( this.constant.staticKey,
    JSON.stringify(inputData)
  );
  return encryptData;
}

getGenerateTokenParam() {
  var inputData = {...this.dataService.commonInputData(), ...{
      [this.constant.key_mobileNumber]: this.localStorage.getLocalStorage('mobileNo'),
      [this.constant.key_channelType]: this.dataService.getChannelType(),
      [this.constant.key_credentialType]: this.constant.val_bankToken,
      [this.constant.key_cifNumber]: this.dataService.regFeildData.custId,
      [this.constant.key_actionType]: 'REGISTRATION',
      [this.constant.key_branchCode]: this.dataService.regBranchCode
    }
  };

  console.log(inputData);
  console.log(
    this.localStorage.getLocalStorage('mobileNo') +
      this.constant.mapEncryptKey
  );
  let encryptData = this.encryptDecryptService.encryptText(
    this.localStorage.getLocalStorage('mobileNo') +
      this.constant.mapEncryptKey,
    JSON.stringify(inputData)
  );
  return encryptData;
}




  
}
