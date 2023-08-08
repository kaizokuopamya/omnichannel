import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class OpenFdRdService {

  constructor(
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private dataService: DataService,
    private commonMethod: CommonMethods,
    public datePipe: DatePipe,
  ) { }

  setTDAccountOpening(selAccDtl, formDtl, accountType, month, nomination, finalFDArr, nomineeDetails, isAddress, day?, convertedMonthsDays?) {
    var autocls = '';
    var autorenewalflag = '';
    var minorFlag = '';
    var maturityInstructionFlag = '';
    var updatedDate = '';
    var amt = formDtl.amount.trim().replace(/[^0-9]+/g, '');
    var finalAmt = amt.slice(0, -2);
    console.log('finalAmt: ', finalAmt);
    console.log('selected month: ', formDtl.datepicker1.getMonth());

    if (nomination) {
      updatedDate = nomineeDetails.nomineeDob;
    }
    else {
      updatedDate = (formDtl.datepicker1.getDate() < 10 ? '0' + formDtl.datepicker1.getDate() : formDtl.datepicker1.getDate()) + '-' + (formDtl.datepicker1.getMonth() < 9 ? '0' + (formDtl.datepicker1.getMonth() + 1) : formDtl.datepicker1.getMonth() + 1) + '-' + formDtl.datepicker1.getFullYear();
    }

    let date = updatedDate.split("-")[0];
    let monthh = updatedDate.split("-")[1];
    let year = updatedDate.split("-")[2];
    var ageDiff = parseInt("" + moment().diff(year + "-" + monthh + "-" + date, 'years', true))

    if (ageDiff >= 18) {
      minorFlag = 'N';
    }
    else {
      minorFlag = 'Y';
    }

    //basis on final Scheme resposnse
    autocls = finalFDArr.AUTO_CLOSURE_FLAG;
    maturityInstructionFlag = finalFDArr.AUTO_RENEWAL_FLAG;
    if (autocls == 'Y') {
      autocls = 'Y';
      autorenewalflag = 'N';
      maturityInstructionFlag = '';
    }
    else {
      autocls = 'N';
      autorenewalflag = 'Y';
    }

    let a, b;
    if (!isAddress) {
      a = formDtl.custstate != '' ? JSON.parse(formDtl.custstate) : '';
      b = formDtl.state != '' ? JSON.parse(formDtl.state) : '';
    }
    if (isAddress) {
      a = { code: this.dataService.profileDetails[0].permenantStateCode ? this.dataService.profileDetails[0].permenantStateCode : this.dataService.profileDetails[0].stateCode }
      b = formDtl.state != '' ? JSON.parse(formDtl.state) : '';
      this.dataService.custProfileStateCityObj.cityId = this.dataService.profileDetails[0].permenantCityCode ? this.dataService.profileDetails[0].permenantCityCode : this.dataService.profileDetails[0].cityCode
      this.dataService.custProfileStateCityObj.stateId = a.code
    }

    if (Number(day) > 999) {
      day = Math.abs(convertedMonthsDays.days);
      month = Math.abs(convertedMonthsDays.months);
    }
    var randomRegNumber = 'ON' + new Date().getTime();
    var tdAccountOpeningData = "";
    tdAccountOpeningData = formDtl.debitAccount + "|" + accountType + "|" + finalFDArr.CBS_SCHEME_CODE + "|" + month + "|" + day + "|" + finalAmt + "|" + selAccDtl.ModeOfOperation + "|"
      + autocls + "|" + autorenewalflag + "|Y|" + formDtl.nomineeName + "|" + randomRegNumber + "|" + formDtl.maturityInstruction2
      + "|" + formDtl.custaddress1 + "|" + (isAddress ? this.dataService.custProfileStateCityObj.cityId ? this.dataService.custProfileStateCityObj.cityId : formDtl.custcity : formDtl.custcity) + "|" + formDtl.custaddress2 + "|" + (isAddress ? this.dataService.custProfileStateCityObj.stateId : +a.code) + "|" + formDtl.custpincode + "|IN|" + updatedDate + "|" + minorFlag
      + "|" + (formDtl.guardianName == null ? '' : formDtl.guardianName) + "|" + (formDtl.address1 == null ? '' : formDtl.address1) + "|" + (formDtl.address2 == null ? '' : formDtl.address2) + "|" + (formDtl.city == null ? '' : formDtl.city) + "|" + (formDtl.state == '' ? '' : +b.code) + "|" + (minorFlag == 'Y' ? 'IN' : '') + "|" + (formDtl.pincode == null ? '' : formDtl.pincode) + "|" + (minorFlag == 'Y' ? formDtl.guardianType : '') + "|" + maturityInstructionFlag + "|";

    console.log(tdAccountOpeningData);
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_tdAccountOpeningData]: tdAccountOpeningData
      }
    }
    console.log('setTDAccountOpening : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  setRDAccountOpening(selAccDtl, formDtl, accountType, month, recurringNomination, rdDetailsArr, autoClosureFlag, nomineeDetails, isAddress, day?) {
    var autorenewalflag = rdDetailsArr.AUTO_RENEWAL_FLAG ? rdDetailsArr.AUTO_RENEWAL_FLAG : '';
    var minorFlag = '';
    var updatedDate = '';
    var amt = formDtl.amount.trim().replace(/[^0-9]+/g, '');
    var finalAmt = amt.slice(0, -2);
    console.log('finalAmt: ', finalAmt);
    this.dataService.standingInstructionFlag = rdDetailsArr.CBS_STANDING_INSTRUCTIONS ? rdDetailsArr.CBS_STANDING_INSTRUCTIONS : '';

    var tenuremonths = (Number(month) + ((day == '0' || day == '' || day == undefined || day == null) ? 0 : Number(day) / 30)).toFixed(2);
    console.log('tenuremonths: ', tenuremonths);

    if (recurringNomination) {
      updatedDate = nomineeDetails.nomineeDob
    }
    else {
      updatedDate = (formDtl.datepicker1.getDate() < 10 ? '0' + formDtl.datepicker1.getDate() : formDtl.datepicker1.getDate()) + '-' + (formDtl.datepicker1.getMonth() < 9 ? '0' + (formDtl.datepicker1.getMonth() + 1) : formDtl.datepicker1.getMonth() + 1) + '-' + formDtl.datepicker1.getFullYear();
    }

    let date = updatedDate.split("-")[0];
    let monthh = updatedDate.split("-")[1];
    let year = updatedDate.split("-")[2];
    var ageDiff = parseInt("" + moment().diff(year + "-" + monthh + "-" + date, 'years', true));

    if (day == '' || day == undefined) day = '0';

    if (ageDiff >= 18) {
      minorFlag = 'N';
    }
    else {
      minorFlag = 'Y';
    }
    console.log('formDtl:', formDtl);
    var randomRegNumber = 'ON' + new Date().getTime();
    var tdAccountOpeningData = "";
    let a, b;


    if (!isAddress) {
      a = formDtl.custstate != '' ? JSON.parse(formDtl.custstate) : '';
      b = formDtl.state != '' ? JSON.parse(formDtl.state) : '';
    }
    if (isAddress) {
      a = { code: this.dataService.profileDetails[0].permenantStateCode ? this.dataService.profileDetails[0].permenantStateCode : this.dataService.profileDetails[0].stateCode }
      b = formDtl.state != '' ? JSON.parse(formDtl.state) : '';
      this.dataService.custProfileStateCityObj.cityId = this.dataService.profileDetails[0].permenantCityCode ? this.dataService.profileDetails[0].permenantCityCode : this.dataService.profileDetails[0].cityCode
      this.dataService.custProfileStateCityObj.stateId = a.code
    }

    tdAccountOpeningData = formDtl.debitAccount + "|" + accountType + "|" + rdDetailsArr.CBS_SCHEME_CODE + "|" + month + "|" + day + "|" + finalAmt + "|" + selAccDtl.ModeOfOperation + "|"
      + (autoClosureFlag ? 'Y' : 'N') + "|" + autorenewalflag + "|Y|" + formDtl.nomineeName + "|" + randomRegNumber + "|" + formDtl.maturityInstruction2
      + "|" + formDtl.custaddress1 + "|" + (isAddress ? this.dataService.custProfileStateCityObj.cityId ? this.dataService.custProfileStateCityObj.cityId : formDtl.custcity : formDtl.custcity) + "|" + formDtl.custaddress2 + "|" + (isAddress ? this.dataService.custProfileStateCityObj.stateId : (a.code ? a.code : '')) + "|" + formDtl.custpincode + "|IN|" + updatedDate + "|" + minorFlag
      + "|" + (formDtl.guardianName == null ? '' : formDtl.guardianName) + "|" + (formDtl.address1 == null ? '' : formDtl.address1) + "|" + (formDtl.address2 == null ? '' : formDtl.address2) + "|" + (formDtl.city == null ? '' : formDtl.city) + "|" + (formDtl.state == null ? '' : (b.code ? b.code : '')) + "|" + (minorFlag == 'Y' ? 'IN' : '') + "|" + (formDtl.pincode == null ? '' : formDtl.pincode) + "|" + (minorFlag == 'Y' ? formDtl.guardianType : '') + "|" + '' + "|";

    console.log(tdAccountOpeningData);

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_tdAccountOpeningData]: tdAccountOpeningData
      }
    }
    console.log('setRDAccountOpening : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  setTDClosureValidation(formDtl) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
    console.log('setTDClosureValidation : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  setRDClosureValidation(formDtl) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
      }
    }
    console.log('setRDClosureValidation : ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  /**
 * Get statelist request
 */
  getStateListParams() {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_CountryCode]: "1",
        [this.constant.Key_type]: "CBSALLSTATES" //Country code 1 is for india
      }
    }
    console.log("getStateListParams :", JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  /**
   * Get CityList by stateId
   * @param stateId
   */
  getCityListParams(stateId) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_StateId]: stateId,
        [this.constant.key_type]: "CBSALLCITIES"
      }
    }

    console.log('getCityListParams ', JSON.stringify(inputData));

    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData;
  }

  getInterestRatesCall(formData, formName, selAccDtl, tenureType?) {
    console.log(formData);
    if (formName == 'fixedForm') {
      if (tenureType == 'days') {
        var inputData = {
          ...this.dataService.commonInputData(), ...{
            [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
            [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
            [this.constant.key_typeOfRequest]: formData.chooseDepositScheme.toUpperCase(), //ominiUSERType
            [this.constant.key_year]: "00",
            [this.constant.key_month]: "00",
            [this.constant.key_noofdays]: formData.dayField,
            [this.constant.key_userType]: formData.depositorType.toUpperCase(),
            [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, '').slice(0, -2),
            [this.constant.key_currency]: selAccDtl.currency
          }
        }
      } else if (tenureType == 'months') {
        var inputData = {
          ...this.dataService.commonInputData(), ...{
            [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
            [this.constant.key_typeOfRequest]: formData.chooseDepositScheme, //ominiUSERType
            [this.constant.key_year]: "00",
            [this.constant.key_month]: formData.monthField,
            [this.constant.key_noofdays]: "00",
            [this.constant.key_userType]: formData.depositorType,
            [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, '').slice(0, -2),
            [this.constant.key_currency]: selAccDtl.currency
          }
        }
      } else if (tenureType == 'yearMonthDays') {
        var inputData = {
          ...this.dataService.commonInputData(), ...{
            [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
            [this.constant.key_typeOfRequest]: formData.chooseDepositScheme.toUpperCase(), //ominiUSERType
            [this.constant.key_year]: formData.year,
            [this.constant.key_month]: formData.month,
            [this.constant.key_noofdays]: formData.day,
            [this.constant.key_userType]: formData.depositorType.toUpperCase(),
            [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, '').slice(0, -2),
            [this.constant.key_currency]: selAccDtl.currency
          }
        }
      }
    }
    else {
      var inputData = {
        ...this.dataService.commonInputData(), ...{
          [this.constant.key_deviceId]: this.constant.deviceID,
          [this.constant.key_MobileNo_Org]: this.storage.getLocalStorage(this.constant.storage_mobileNo),
          [this.constant.key_typeOfRequest]: formData.chooseDepositScheme.toUpperCase(), //ominiUSERType
          [this.constant.key_year]: formData.year,
          [this.constant.key_month]: formData.month,
          [this.constant.key_noofdays]: "00",
          [this.constant.key_userType]: formData.depositorType.toUpperCase(),
          [this.constant.key_amount]: formData.amount.trim().replace(/[^0-9]+/g, '').slice(0, -2),
          [this.constant.key_currency]: selAccDtl.currency
        }
      }
    }

    console.log('getInterestRatesCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    return encryptData;
  }

  getFDAccountFetchDetailsCall(FDRDType, formData, tenureMonths, tenureDays?) {
    console.log('FDRDType', FDRDType);
    console.log('formData: ', formData);
    console.log('Tenure months: ', tenureMonths);
    console.log('Tenure Days: ', tenureDays);

    var tenuremonths = (Number(tenureMonths) + (tenureDays == '0' ? 0 : Number(tenureDays) / 30)).toFixed(2);
    console.log('final tenure months: ', tenuremonths);
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_productFetchDetailsData]: FDRDType + "|" + this.dataService.userDetails.cifNumber + "|" + formData.debitAccount + "|" + formData.chooseDepositScheme + "|INR|" + '' + "|" + tenuremonths + "|" + formData.interestPayout + "|"
      }
    }

    console.log('getFDAccountFetchDetailsCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getRDAccountFetchDetailsCall(FDRDType, formData, tenureMonths, tenureDays?) {
    var tenuredays = tenureDays == undefined || tenureDays == '0' ? '' : tenureDays;
    var tenuremonths = tenureMonths == '0' ? '' : tenureMonths;
    console.log('FDRDType', FDRDType);
    console.log('formData: ', formData);
    console.log('Tenure months: ', tenureMonths);
    console.log('Tenure Days: ', tenureDays);

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_productFetchDetailsData]: FDRDType + "|" + this.dataService.userDetails.cifNumber + "|" + formData.debitAccount + "|" + 'G' + "|INR|" + '' + "|" + tenuremonths + "|" + 'C' + "|"
      }
    }

    console.log('getRDAccountFetchDetailsCall : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getInquiryNomineeValidations(selectedAccount) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_inquiryNomineeData]: this.dataService.userDetails.cifNumber + "|" + selectedAccount
      }
    }

    console.log('getInquiryNomineeValidations : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }

  getFDRDDetailsParam(custDetails, selAccDtl, depositType) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_productType]: depositType,
        [this.constant.key_cifNumber]: this.dataService.userDetails.cifNumber,
        [this.constant.key_accountNo]: selAccDtl.accountNo,
        [this.constant.key_modeOfOperation]: selAccDtl.ModeOfOperation,
        [this.constant.key_schemeType]: selAccDtl.accountType,    //In selected accountType actual schemeType
        [this.constant.key_upi_accountType]: selAccDtl.SchemeCode, //In selected SchemeCode actual accountType
        [this.constant.key_CONSTITUTION]: custDetails.constute,
        [this.constant.key_currency]: selAccDtl.currency,  //Account level currency
        [this.constant.key_deviceId]: this.storage.getLocalStorage(this.constant.storage_deviceId),
        [this.constant.key_MobileNo]: this.storage.getLocalStorage(this.constant.storage_mobileNo)
      }
    }
    console.log("getFDRDDetailsParam : ", inputData);
    console.log('getFDRDDetailsParam : ', JSON.stringify(inputData));
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(inputData));
    return encryptData;
  }


  getSchemeDetails(type) {

    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_cbsType]: this.constant.val_cbsType,
        ['productFetchDetailsData']: type + "|" + this.dataService.userDetails.cifNumber + "|"
      }
    }
    console.log("getSchemeDetails : ", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData


  }

  getDropDownMasterParam(resType) {
    var inputData = {
      ...this.dataService.commonInputData(), ...{
        [this.constant.key_cbsType]: this.constant.val_cbsType,
        [this.constant.key_omni_refRecType]: resType
      }
    }
    console.log("getDropDownMasterParam : ", inputData);
    let encryptData = this.encryptDecryptService.encryptText(this.constant.staticKey, JSON.stringify(inputData));
    //return inputData;
    return encryptData
  }


}



