import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app//services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';

@Injectable({
  providedIn: 'root'
})
export class resetTpinService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService : DataService,
    public common : CommonMethods
  ) { }


    getResetTpinAuthforDebitCard(debitCardNo,CardPIN,expiryDate,accNo)
      {
        var reqObj = {...this.dataService.commonInputData(), ...{
          [this.constant.key_RequestID]: this.common.genRandomDigit(9),
          [this.constant.key_debitCardNo]: debitCardNo,
          [this.constant.key_accountNo]: accNo,
          [this.constant.key_cardPin1]:CardPIN,
          [this.constant.key_expirtDate]: expiryDate,
        }}
        console.log("getForgotPassowrdAuthforDebitCard",reqObj);
        let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(reqObj));
        return encryptData;
    }



    getTokenExistsParam() {
      var reqObj = {...this.dataService.commonInputData(), ...{
   
        [this.constant.key_mobileNumber]:
          this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_actionType]: "TPIN",
      }};
  
      console.log(reqObj);
      console.log( this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey);
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey, JSON.stringify(reqObj));
      return encryptData;
    }

    getGenerateTokenParam() {
      var reqObj = {...this.dataService.commonInputData(), ...{
      
        [this.constant.key_mobileNumber]:
          this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_channelType]: this.dataService.getChannelType(),
        [this.constant.key_credentialType]: this.constant.val_bankToken,
        [this.constant.key_actionType] : 'TPIN',
        [this.constant.key_branchCode] : this.dataService.profiledateDetails[0].branchCode
      }};
  
      console.log(JSON.stringify(reqObj));
      console.log(this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey);
      let encryptData = this.encryptDecryptService.encryptText(this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey,JSON.stringify(reqObj) );
      return encryptData;
    }



    /**
   * request parameter to validate bank token
   */
  getValidateTokenParam(formdata) {
    var reqObj = {...this.dataService.commonInputData(), ...{
     
      [this.constant.key_mobileNumber]:
        this.storage.getLocalStorage(this.constant.storage_mobileNo),
      [this.constant.key_channelType]: this.dataService.getChannelType(),
      [this.constant.key_token]: formdata.bankToken,
      [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId)
    }};

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey,JSON.stringify(reqObj));
    return encryptData;
  }



}

