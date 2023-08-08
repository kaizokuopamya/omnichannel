import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SendMoneyService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage:LocalStorageService,
    public dataService : DataService,
    public common: CommonMethods,
    public datepipe : DatePipe
  ) { }

  getFrequencyParam(type)
  {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_configType]: type
      }
    }
    console.log('getFrequencyParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getAccountBalanceParam(selectAccount)
  {
    console.log(selectAccount)
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.constant.deviceID,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_branchCode]: "0181",
        [this.constant.key_accountNo]: selectAccount,
      }
    }
    console.log("Get Balance params =====>" + JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  benificiaryListParam() {
    var inputData = {};
    inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getFundTransferParam(formData,benificiaryDtl,fromAccount,type ,payeeAccountNo , soleID,limitName?){
    console.log("<===========  getOwnFundTransferParam  ===============>");
    var _userAccountDtl = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == fromAccount);
    console.log(formData,benificiaryDtl,_userAccountDtl);
    console.log("formData.remark" + formData.remark)

    var transactType = type;
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_customerID]: benificiaryDtl?.ID,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_debitBranchCode]: type == 'self' ? '0000' : soleID,
        [this.constant.key_accountNo]: fromAccount,
        [this.constant.key_creditBranchCode]: '0000',
        [this.constant.key_toAccount]: payeeAccountNo,
        [this.constant.key_donationId]: '12',
        [this.constant.key_TransactionType]: transactType,
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_remarks]: formData?.remark ? formData.remark : ".",
        [this.constant.key_TransactionDate]: this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy hh:mm:ss'),
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: type == "self" ? this.dataService.userDetails?.customerName : benificiaryDtl?.benefName,
        [this.constant.key_limitName]: limitName
      }
    }

    if(transactType == "NEFT" || transactType == "RTGS" ){
      //sender dtl
      inputData[this.constant.key_branch_name] = _userAccountDtl[0]?.branch_name;
      inputData[this.constant.key_bankName] = this.constant.val_bank_name;
      inputData[this.constant.key_sender_ifsc_code] = _userAccountDtl[0]?.ifscCode;
      //reciver dtl
      inputData[this.constant.key_benefName] = benificiaryDtl.benefName;
      inputData[this.constant.key_benficiaryBankName] = benificiaryDtl.beneficiary_bank_name;
      inputData[this.constant.key_benificiaryNickName] = benificiaryDtl.branch_name;
      inputData[this.constant.key_ifsc_code] = benificiaryDtl.ifsc_code;
    }

  console.log("get FundTransfer Param " + transactType + JSON.stringify(inputData));

  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }

  getIFSCFundTransferParam(formData, benificiaryDtl, accountDetail , payeeAccountNo , remark , from?,limitName?) {
    console.log('From account details: ', accountDetail);
    console.log('To account details: ', benificiaryDtl);
    console.log(formData , benificiaryDtl , accountDetail);

    var ifsc;
    var benefAccNo;

    if(from == 'fromFav'){
      ifsc = benificiaryDtl.ifscCode
      benefAccNo = benificiaryDtl.accountNo
    }else{
      ifsc = benificiaryDtl.ifsc_code
      benefAccNo = benificiaryDtl.beneficiary_account_no
    }

    var slicedRemark = '';
    if(remark!="" && remark!=undefined)
    {
      if(remark.length >= 10){
        slicedRemark = remark.slice(0,10);
      }else{
        slicedRemark = remark;
      }
    }
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: ifsc,
        [this.constant.key_remarks]: slicedRemark ? slicedRemark : "-",
        [this.constant.key_txnAmt]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_payerName]: "-",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: accountDetail,
        [this.constant.key_payeeIfsc]: ifsc,
        [this.constant.key_accountNo]: accountDetail,
        [this.constant.key_payeeAccount]: benefAccNo,
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''), //need to ask
        [this.constant.key_senderName]: this.dataService.userDetails?.customerName,
        [this.constant.key_receiverName]: benificiaryDtl?.benefName,
        [this.constant.key_TransactionType]: "IMPS",
        [this.constant.key_limitName]: limitName
      }
    }
    this.dataService.setOmniChannelReqParam(this.constant.key_omni_mmidTransfer, JSON.stringify(inputData));//set omni channel req
    console.log('getMMIDFundTransferParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  schedulePaymentListParam(formData,benificiaryDtl,fromAccount,type ,payeeAccountNo,toDate,soleId){

    var date = new Date();
    console.log("<===========  getOwnFundTransferParam  ===============>");
    var _userAccountDtl = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == fromAccount);
    console.log(formData,benificiaryDtl,_userAccountDtl);
    var transactType = type;

    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_customerID]: benificiaryDtl?.ID,
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_debitBranchCode]: soleId,
        [this.constant.key_accountNo]: fromAccount,
        [this.constant.key_creditBranchCode]: '0000',
        [this.constant.key_toAccount]: payeeAccountNo,
        [this.constant.key_donationId]: '12',
        [this.constant.key_TransactionType]: transactType,
        [this.constant.key_standingInstructionType]: 'TRANSFERTRANSACTION', // RTGS , NEFT
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_paymentStartDate]: this.datepipe.transform(formData.datepicker1, 'dd-MM-yyyy'),
        [this.constant.key_paymentEndDate]: this.datepipe.transform(toDate, 'dd-MM-yyyy'),
        [this.constant.key_numOfInstallment]: formData?.installmentNumber ? formData.installmentNumber : '1',
        [this.constant.key_paymentFrequency]: formData?.frequencyType ? formData.frequencyType : '1',
        [this.constant.key_paymentFreqType]: formData?.paymentType ? formData.paymentType : '',
        [this.constant.key_remarks]: formData?.remark ? formData.remark : ".",
        [this.constant.key_referenceNumber]: this.common.genRandomDigit(9),
        [this.constant.key_year]: date.getFullYear(),
        [this.constant.key_month]: date.getMonth(),
        [this.constant.key_date]: date.getDate(),
        [this.constant.key_TransactionDate]: this.datepipe.transform(new Date().toISOString(), 'dd-MM-yyyy')
      }
    }

    if(transactType == "NEFT" || transactType == "RTGS" ){
      //sender dtl
      inputData[this.constant.key_branch_name] = _userAccountDtl[0].branch_name;
      inputData[this.constant.key_bankName] = this.constant.val_bank_name;
      inputData[this.constant.key_sender_ifsc_code] = _userAccountDtl[0].ifscCode;
      //reciver dtl
      inputData[this.constant.key_benefName] = benificiaryDtl.benefName;
      inputData[this.constant.key_benficiaryBankName] = benificiaryDtl.beneficiary_bank_name;
      inputData[this.constant.key_benificiaryNickName] = benificiaryDtl.branch_name;
      inputData[this.constant.key_ifsc_code] = benificiaryDtl.ifsc_code;
    }

  console.log(inputData);

  let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
  return encryptData;
  }

  getMMIDFundTransferParam(formData, benificiaryDtl, accountDetail , payeeAccountNo,limitName?) {
    var inputData = {...this.dataService.commonInputData(), ...{
        [this.constant.key_ifsc_code]: "-",
        [this.constant.key_remarks]: formData?.mmidRemark ? formData.mmidRemark : '-',
        [this.constant.key_txnAmt]: formData.amount.trim().replace(/[^0-9]+/g, ''),
        [this.constant.key_payerName]: "-",
        [this.constant.key_payerMobile]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
        [this.constant.key_payerAccount]: accountDetail,
        [this.constant.key_payeeIfsc]: benificiaryDtl.ifsc_code,
        [this.constant.key_accountNo]: accountDetail,
        [this.constant.key_payeeAccount]: benificiaryDtl.beneficiary_account_no,
        [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, ''), //need to ask
        [this.constant.key_payeeMMID]: benificiaryDtl.MMID,
        [this.constant.key_payeeName]: benificiaryDtl.beneficiary_nick_name,
        [this.constant.key_payeeMobile]: benificiaryDtl.beneficiaryMobileNo,
        [this.constant.key_payerMMID]: "",
        [this.constant.key_limitName]: limitName
      }
    }
    // this.dataService.setOmniChannelReqParam(this.constant.key_omni_mmidTransfer, JSON.stringify(inputData));//set omni channel req
    console.log('getMMIDFundTransferParam', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }



}
