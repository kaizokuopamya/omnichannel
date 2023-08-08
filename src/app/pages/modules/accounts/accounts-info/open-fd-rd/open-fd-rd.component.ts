import { APP_INITIALIZER, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { InstantPayService } from '../../../fund-transfer/instant-pay/instant-pay.service';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import { OpenFdRdService } from './open-fd-rd.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { AccountType } from '../../../../../enum/app-enum';
import { DAYSARRAYOBJ, DropDownMaster, FORMTYPES, MONTHSARRAYOBJ, RDMONTHSARRAYOBJ, YEARSARRAYOBJ } from './open-fd-rd.model';

@Component({
  selector: 'app-open-fd-rd',
  templateUrl: './open-fd-rd.component.html',
  styleUrls: ['./open-fd-rd.component.scss']
})
export class OpenFdRdComponent implements OnInit {

  constructor(
    private router: Router,
    public DataService: DataService,
    private openFdRdService: OpenFdRdService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private instantPayService: InstantPayService,
    private storage: LocalStorageService,
    private customCurrencyPipe: CustomCurrencyPipe,
    private formValidation: FormValidationService,
    private datePipe: DatePipe,
    private commonMethod: CommonMethods,
    private location: Location
  ) { }


  openDepositTabSelection: any = 'fixed';
  selectedTabDetails: any = "fixed";
  tenureType = 'days';
  platform: string = 'web';

  month = 0
  days = 0
  day = 0
  recurringMonth = 0;

  fixedMaturity: boolean = false;
  recurringMaturity: boolean = false;
  nomination: boolean = false;
  recurringNomination: boolean = false;
  isAddress: boolean = false;
  recurringIsAddress: boolean = false;
  invalidAmount: any = false;
  exceedMaxAmt: boolean = false;
  exceedMinAmt: boolean = false;
  exceedMinAmtRenewal: boolean = false;
  exceedMaxAmtRenewal: boolean = false;
  isValidTenure: boolean = false;
  autoClosureFlag: boolean = true;
  isYearExceeds: boolean = false;
  isRDYearExceeds: boolean = false;
  isMaturityCalculated: boolean = false;
  taxSaverFlag: boolean = false;
  minOneYearFlag: boolean = false;
  minFifteenDaysFlag: boolean = false;
  fixedRenewalAmtFlag: boolean = false;
  multipleof: boolean = false;
  taxminAmt: boolean = false;
  limitExceedValidation: boolean = false;
  minorFlag: boolean = false;
  recurringMinorFlag: boolean = false;

  tenureMonths: any = "";
  tenureDays: any = "";
  minTenureDays: any = "";
  maxTenureDays: any = "";
  minTenureMonths: any = "";
  maxTenureMonths: any = "";
  accBalance: any = "";
  nomineeDetails: any = "";
  schemeCode: any = "";
  depositorTypeName: any = "";
  nomineeAge: any = "";


  customerProfileDetails: any;
  isStaffFlag: any;
  custDetails: any;
  staffName: any;
  selAccDtl: any;
  todayDate: any;
  maturityValue: any;
  totalInterest: any;
  custBirthDate: any;
  rateOfInterest: any;
  isSeniorCitizenFlag: any;
  maturityDate: any;
  rdSchemeType: any;
  minRenewalFixed: any;
  maxRenewalFixed: any;
  isTermsAndCondition: any;
  recurringisTermsAndCondition: any;
  nominationType: any;
  nomineeAddress: any;
  modeOfOperationName: any;


  maturityPayout: any = [];
  maturityInstructions: any = [];
  convertedMonthsDays: any = [];
  stateList = [];
  cityList = [];
  guardianCityList = [];
  stateNomineeList = [];
  gardianTypeList = [];
  nomineeRelationshipList = [];
  finalFDArr: any = [];
  finalLastFDArr: any = [];
  minDayfinalFDArr: any = [];
  maxMonthfinalFDArr: any = [];
  fdrdMainArr: any = [];
  depositorSchemeTypeArr: any = [];
  selectedDepositTypeArr: any = [];
  accountList = [];
  rdDetailsArr: any = [];

  currentDate: any = moment().toDate();

  fixedForm: FormGroup;
  recurringForm: FormGroup;

  //model
  yearsArray: any = YEARSARRAYOBJ
  monthsArray: any = MONTHSARRAYOBJ
  RDMonthsArray: any = RDMONTHSARRAYOBJ
  daysArray: any = DAYSARRAYOBJ
  formtypes: any = FORMTYPES




  ngOnInit(): void {
    this.selectedTabDetails = this.location.getState();
    this.platform = this.constant.getPlatform();

    this.openDepositTabSelection = this.selectedTabDetails.openDepositTabSelection ? this.selectedTabDetails.openDepositTabSelection : 'fixed';

    this.buildForm();
    this.customerProfileDetails = this.DataService.profileDetails;
    this.depositorTypeName = this.DataService.profileDetailsValue.responseParameter.userType;

    this.isStaffFlag = this.customerProfileDetails[0].stafFlag;
    this.custDetails = this.customerProfileDetails[0];
    this.custBirthDate = this.customerProfileDetails[0].custBirthDate;
    this.initialize();

    this.todayDate = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    console.log('today date: ', this.todayDate);

    //TODO: commented on 19-1-23 due to slowness issue and no use by purshottam
    // this.getAccountBalance(this.accountList[0].accountNo);
    // this.calculateDateRange();

    this.tabSelection(this.openDepositTabSelection);  //'fixed'
    if (this.nomination) {
      // this.getInquiryNomineeDetails(this.accountList[0].accountNo, 'fixedForm');
    }
  }

  calculateDateRange() {
    let date = this.custBirthDate.split("-")[0];
    let month = this.custBirthDate.split("-")[1];
    let year = this.custBirthDate.split("-")[2];
    var convertedDate = new Date(month + '/' + date + '/' + year);
    /* below condtion is to test popup */
    // var convertedDate = new Date('01-01-1941');
    var dateDiff = this.calculateDiff(convertedDate);
    console.log('dateDiff =====> ', dateDiff);
    var ageDiff = parseInt("" + dateDiff / 365);
    console.log('Age difference: ', ageDiff);
    if (ageDiff < 50) {
      this.isSeniorCitizenFlag = 'N';
    }
    else {
      this.isSeniorCitizenFlag = 'Y';
    }
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    console.log(Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()));
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  initialize() {
    this.getNomineeRelationList();
    this.getState();
    this.schemeCodeFetchDetails()

    this.DataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" || el.accountType != "SBDCT" || el.accountType != "SBKID") {
        // if(el.SchemeCode == AccountType.SAVING_ACCOUNT ||  el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT){
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT) {
          if (el.accountFlag == "P" && el.Status == 'Active' && (el.ModeOfOperation == "001" || el.ModeOfOperation == "002" || el.ModeOfOperation == "003" || el.ModeOfOperation == "004")) {
            console.log('account: ', el);
            this.accountList[0] = el;
          }
        }
      }
    })

    this.DataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" || el.accountType != "SBDCT" || el.accountType != "SBKID") {
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT) {
          if ((el.accountFlag != "P" || el.accountFlag == "L") && el.Status == 'Active' && (el.ModeOfOperation == "001" || el.ModeOfOperation == "002" || el.ModeOfOperation == "003" || el.ModeOfOperation == "004")) {
            console.log('account: ', el);
            this.accountList.push(el);
          }
        }
      }
    })

    console.log('accountList: ', this.accountList);

  }

  buildForm() {
    this.fixedForm = this.DataService.buildForm(this.formtypes[0].formDetails);
    this.recurringForm = this.DataService.buildForm(this.formtypes[1].formDetails);
    this.daysSelection(this.tenureType)
  }


  validateForm(formType) {

    switch (formType) {
      case 'fixed':
        if (this.fixedForm.invalid) {
          this.fixedForm.get('chooseDepositScheme').markAsTouched();
          this.fixedForm.get('depositorType').markAsTouched();
          this.fixedForm.get('amount').markAsTouched();
          this.fixedForm.get('interestPayout').markAsTouched();

          this.fixedForm.get('debitAccount').markAsTouched();
          this.fixedForm.get('modeOperation').markAsTouched();
          this.fixedForm.get('maturityInstruction').markAsTouched();
          // this.fixedForm.get('maturityPayoutAccount').markAsTouched();
          this.fixedForm.get('termsCondition').markAsTouched();

          if (this.tenureType == 'days') {
            this.fixedForm.get('dayField').markAsTouched();
          }

          if (this.tenureType == 'months') {
            this.fixedForm.get('monthField').markAsTouched();
          }

          if (this.tenureType == 'yearMonthDays') {
            this.fixedForm.get('year').markAsTouched();
            this.fixedForm.get('month').markAsTouched();
            this.fixedForm.get('day').markAsTouched();
          }

          if (!this.nomination) {
            this.fixedForm.get('nomineeName').markAsTouched();
            this.fixedForm.get('maturityInstruction2').markAsTouched();
            this.fixedForm.get('datepicker1').markAsTouched();
            this.fixedForm.get('guardianName').markAsTouched();
            this.fixedForm.get('guardianType').markAsTouched();
            this.fixedForm.get('address1').markAsTouched();
            this.fixedForm.get('address2').markAsTouched();
            this.fixedForm.get('state').markAsTouched();
            this.fixedForm.get('city').markAsTouched();
            this.fixedForm.get('pincode').markAsTouched();
            this.fixedForm.get('sameAddress').markAsTouched();
            this.fixedForm.get('custaddress1').markAsTouched();
            this.fixedForm.get('custaddress2').markAsTouched();
            this.fixedForm.get('custstate').markAsTouched();
            this.fixedForm.get('custcity').markAsTouched();
            this.fixedForm.get('custpincode').markAsTouched();
          }

          if (this.tenureType == 'days') {

          }
          return;
        }

        break;

      case 'recurring':

        if (this.recurringForm.invalid) {
          this.recurringForm.get('debitAccount').markAsTouched();
          this.recurringForm.get('amount').markAsTouched();
          this.recurringForm.get('year').markAsTouched();
          this.recurringForm.get('month').markAsTouched();
          this.recurringForm.get('termsCondition').markAsTouched();

          if (!this.recurringNomination) {
            this.recurringForm.get('nomineeName').markAsTouched();
            this.recurringForm.get('maturityInstruction2').markAsTouched();
            this.recurringForm.get('datepicker1').markAsTouched();
            this.recurringForm.get('guardianName').markAsTouched();
            this.recurringForm.get('guardianType').markAsTouched();
            this.recurringForm.get('address1').markAsTouched();
            this.recurringForm.get('address2').markAsTouched();
            this.recurringForm.get('state').markAsTouched();
            this.recurringForm.get('city').markAsTouched();
            this.recurringForm.get('pincode').markAsTouched();
            this.recurringForm.get('sameAddress').markAsTouched();
            this.recurringForm.get('custaddress1').markAsTouched();
            this.recurringForm.get('custaddress2').markAsTouched();
            this.recurringForm.get('custstate').markAsTouched();
            this.recurringForm.get('custcity').markAsTouched();
            this.recurringForm.get('custpincode').markAsTouched();
          }
          return;
        }
        break;
    }
  }

  depositSubmit(formType) {
    switch (formType) {
      case 'fixed':
        if (this.fixedForm.valid) {
          if (this.isMaturityCalculated) {
            console.log("Fixed Form Data :: ", this.fixedForm.value);
            this.getProductFetchDetails('FD');
          }
          else {
            /* Calling common information popup */
            this.DataService.information = "PLEASE_CLICK_ON_CALCULATE_MATURITY";
            this.DataService.informationLabel = 'INFORMATION';
            this.DataService.primaryBtnText = 'OK';
            this.commonMethod.openPopup('div.popup-bottom.show-common-info');
          }
        }
        else {
          this.validateForm(formType)
        }
        break;

      case 'recurring':
        if (this.recurringForm.valid) {
          if (this.isMaturityCalculated) {
            console.log("Recurring Form Data :: ", this.recurringForm.value);
            this.getProductFetchDetails('RD');
          }
          else {
            /* Calling common information popup */
            this.DataService.information = "PLEASE_CLICK_ON_CALCULATE_MATURITY";
            this.DataService.informationLabel = 'INFORMATION';
            this.DataService.primaryBtnText = 'OK';
            this.commonMethod.openPopup('div.popup-bottom.show-common-info');
          }
        }
        else {
          this.validateForm(formType)
        }
        break;
    }
  }

  getProductFetchDetails(FDRDType) {
    this.DataService.screenType = 'openDeposit' 

    console.log('Nominee age: ', this.nomineeAge);
    if (FDRDType == 'FD') {
      this.DataService.commonOtpServiceType = this.constant.val_OPENFD //common OTP Type
      this.schemeCode = this.finalLastFDArr.CBS_SCHEME_CODE;
      this.rdSchemeType = this.finalLastFDArr.CBS_SCHEME_NAME;
      this.DataService.feedbackType = "FDDetails";
      var params = this.openFdRdService.setTDAccountOpening(this.selAccDtl, this.fixedForm.value, 'TDA', this.tenureMonths, this.nomination, this.finalLastFDArr, this.nomineeDetails, this.isAddress, this.tenureDays, this.convertedMonthsDays);
      this.DataService.request = params;
      this.DataService.endPoint = this.constant.serviceName_TDACCOUNTOPENING;
      var objCheckFlag = this.DataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.DataService.endPoint.split('/')[1]);
      // if(this.DataService.activitySettingData[objCheckFlag].OTPALLOWED == 'Y') {
      this.DataService.screenDetails = {
        'DEPOSIT_TYPE': this.DataService.openFDReceiptObj.depositType = 'FD',
        'DEPOSIT_SCHEME': this.DataService.openFDReceiptObj.depositScheme = this.fixedForm.value.chooseDepositScheme,
        'INTEREST_PAYOUT': this.DataService.openFDReceiptObj.interestPayout = this.fixedForm.value.interestPayout,
        'DEPOSITOR_TYPE': this.DataService.openFDReceiptObj.depositorType = this.fixedForm.value.depositorType,
        'DEPOSIT_AMOUNT': this.DataService.openFDReceiptObj.depositAmount =  this.customCurrencyPipe.transform(this.fixedForm.value.amount.trim() , 'decimal'),
        'TENURE': this.tenureDays == 0 ? this.DataService.openFDReceiptObj.tenure = this.tenureMonths + " Months" : this.tenureMonths == 0 ?
          this.DataService.openFDReceiptObj.tenure = this.tenureDays + " Days" :
          this.DataService.openFDReceiptObj.tenure = this.tenureMonths + " Months" + " " + this.tenureDays + " Days",
        'ESTIMATED_INTEREST_RATE': this.DataService.openFDReceiptObj.interestRate = this.rateOfInterest + ' %',
        'ESTIMATED_MATURITY_RATE': this.DataService.openFDReceiptObj.maturityAmount = this.customCurrencyPipe.transform(this.maturityValue.trim() , 'decimal'),
        'MATURITY_DATE': this.DataService.openFDReceiptObj.maturityDate = this.maturityDate,
        'MODE_OF_OPERATION': this.DataService.openFDReceiptObj.modeOfOperation = this.fixedForm.value.modeOperation,
        'MATURITY_INSTRUCTION': this.DataService.openFDReceiptObj.maturityInstruction = this.fixedForm.value.maturityInstruction,
        'MATURITY_PAYOUT_ACCOUNT': this.DataService.openFDReceiptObj.maturityPayoutAccount = this.fixedForm.value.maturityPayoutAccount,
        'NOMINEE_NAME': this.DataService.openFDReceiptObj.nomineeName = this.fixedForm.value.nomineeName,
        'SCHEME_NAME': this.DataService.openFDReceiptObj.schemeName = this.schemeCode + " - " + this.rdSchemeType,
      }
      console.log("FD SCREEN DETAILS : ", this.DataService.screenDetails)
      console.log("FD : ", this.DataService.openFDReceiptObj)
      this.router.navigate(['/otpsession']);
    }
    else {
      this.DataService.commonOtpServiceType = this.constant.val_OPENRD //common OTP Type
      this.schemeCode = this.rdDetailsArr.CBS_SCHEME_CODE;
      this.rdSchemeType = this.rdDetailsArr.CBS_SCHEME_NAME;
      this.DataService.feedbackType = "RDDetails";
      var params = this.openFdRdService.setRDAccountOpening(this.selAccDtl, this.recurringForm.value, 'RDA', this.tenureMonths, this.recurringNomination, this.rdDetailsArr, this.autoClosureFlag, this.nomineeDetails, this.recurringIsAddress, this.tenureDays);
      this.DataService.request = params;
      this.DataService.endPoint = this.constant.serviceName_TDACCOUNTOPENING;
      var objCheckFlag = this.DataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.DataService.endPoint.split('/')[1]);
      // if(this.DataService.activitySettingData[objCheckFlag].OTPALLOWED == 'Y') {

      this.DataService.screenDetails = {
        'DEPOSIT_TYPE': this.DataService.openRDReceiptObj.depositType = 'RD',
        'DEPOSITOR_TYPE': this.DataService.openRDReceiptObj.depositorType = this.recurringForm.value.depositorType,

        'INSTALLMENT_AMOUNT': this.DataService.openRDReceiptObj.installmentAmount = this.customCurrencyPipe.transform(this.recurringForm.value.amount.trim() , 'decimal'), 

        'TENURE': this.tenureDays == 0 ? this.DataService.openRDReceiptObj.tenure = this.tenureMonths + " Months" : this.DataService.openRDReceiptObj.tenure = this.tenureMonths + " Months" + this.tenureDays + " Days",

        'ESTIMATED_INTEREST_RATE': this.DataService.openRDReceiptObj.interestRate = this.rateOfInterest,
        'MONTHLY_AUTO_DEBIT_START_DATE': this.DataService.openRDReceiptObj.monthlyDebitDate = this.todayDate,
        'ESTIMATED_MATURITY_AMOUNT': this.DataService.openRDReceiptObj.maturityAmount = this.customCurrencyPipe.transform(this.maturityValue.trim() , 'decimal'),  
        'MATURITY_DATE': this.DataService.openRDReceiptObj.maturityDate = this.maturityDate,
        'MODE_OF_OPERATION': this.DataService.openRDReceiptObj.modeOfOperation = this.recurringForm.value.modeOperation,
        'DEBIT_ACCOUNT': this.DataService.openRDReceiptObj.debitAccount = this.recurringForm.value.debitAccount,
        'MATURITY_PAYOUT_ACCOUNT': this.DataService.openRDReceiptObj.maturityPayoutAccount = this.recurringForm.value.maturityPayoutAccount,
        'NOMINEE_NAME': this.DataService.openRDReceiptObj.nomineeName = this.recurringForm.value.nomineeName,
        'SCHEME_NAME': this.DataService.openRDReceiptObj.schemeName = this.schemeCode + " - " + this.rdSchemeType,
      }

      this.DataService.openRDReceiptObj.tenureMonths = this.tenureMonths;
      this.DataService.openRDReceiptObj.paymentFrequency = 'M';
      this.DataService.openRDReceiptObj.autoClosureFlag = this.autoClosureFlag;
      this.DataService.openRDReceiptObj.rdSchemeType = this.rdSchemeType;

      this.router.navigate(['/otpsession']);
    }
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  tabSelection(value) {
    if (value == 'fixed' || value == 'recurring') {
      this.openDepositTabSelection = value;
      this.depositorSchemeTypeArr = "";
      this.isMaturityCalculated = false;
      this.accBalance = "";
      this.autoClosureFlag = true;
      this.invalidAmount = false;
      this.exceedMaxAmt = false;
      this.exceedMinAmt = false;
      this.exceedMinAmtRenewal = false;
      this.exceedMaxAmtRenewal = false;
      this.fixedMaturity = false;
      this.multipleof = false;
      this.taxminAmt = false;
      this.limitExceedValidation = false;
      this.minTenureDays = '';
      this.maxTenureDays = '';
      this.minTenureMonths = '';
      this.maxTenureMonths = '';
      this.minOneYearFlag = false;
      this.minFifteenDaysFlag = false;
      this.maturityInstructions = [];

      this.tenureType = 'days';
      if (value == 'fixed') {
        this.minorFlag = false;
        this.fixedForm.reset();
        // this.nomination = true;
        this.isAddress = false;
        this.fixedForm.get('debitAccount').setValue('');
        this.fixedForm.get('chooseDepositScheme').setValue('');
        // this.fixedForm.get('depositorType').setValue('');
        this.fixedForm.get('amount').setValue('');
        this.fixedForm.get('interestPayout').setValue('');
        this.fixedForm.get('modeOperation').setValue('');
        this.fixedForm.get('maturityInstruction').setValue('');
        this.fixedForm.get('maturityInstruction2').setValue('');
        this.fixedForm.get('maturityPayoutAccount').setValue('');
        this.fixedForm.get('custaddress1').setValue('');
        this.fixedForm.get('custaddress2').setValue('');
        this.fixedForm.get('custstate').setValue('');
        this.fixedForm.get('custcity').setValue('');
        this.fixedForm.get('custpincode').setValue('');
        if (this.nomineeAge < 18) {
          this.fixedForm.get('guardianName').setValue('');
          this.fixedForm.get('guardianType').setValue('');
          this.fixedForm.get('address1').setValue('');
          this.fixedForm.get('address2').setValue('');
          this.fixedForm.get('state').setValue('');
          this.fixedForm.get('city').setValue('');
          this.fixedForm.get('pincode').setValue('');
        }
        let date = this.custBirthDate.split("-")[0];
        let month = this.custBirthDate.split("-")[1];
        let year = this.custBirthDate.split("-")[2];
        var ageDiff = parseInt("" + moment().diff(year + "-" + month + "-" + date, 'years', true))
        this.fixedForm.patchValue({
          debitAccount: this.accountList[0].accountNo,
          maturityPayoutAccount: this.accountList[0].accountNo,
          depositorType: this.depositorTypeName,
          modeOperation: this.accountList[0].ModeOfOprn,
        });
        this.getAccountBalance(this.accountList[0].accountNo);
        this.getFDRDDetails(this.openDepositTabSelection);
      }
      else {
        this.yearsArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
        this.recurringMinorFlag = false;
        this.recurringForm.reset();
        // this.recurringNomination = true;
        this.recurringIsAddress = false;
        this.recurringMaturity = false;
        this.recurringForm.get('debitAccount').setValue('');
        this.recurringForm.get('chooseDepositScheme').setValue('');
        this.recurringForm.get('amount').setValue('');
        // this.recurringForm.get('monthlyDebitDate').setValue('');
        this.recurringForm.get('modeOperation').setValue('');
        this.recurringForm.get('maturityPayoutAccount').setValue('');
        this.recurringForm.get('maturityInstruction2').setValue('');
        this.recurringForm.get('year').setValue('');
        this.recurringForm.get('month').setValue('');
        this.recurringForm.get('custaddress1').setValue('');
        this.recurringForm.get('custaddress2').setValue('');
        this.recurringForm.get('custstate').setValue('');
        this.recurringForm.get('custcity').setValue('');
        this.recurringForm.get('custpincode').setValue('');
        if (this.nomineeAge < 18) {
          this.recurringForm.get('guardianName').setValue('');
          this.recurringForm.get('guardianType').setValue('');
          this.recurringForm.get('address1').setValue('');
          this.recurringForm.get('address2').setValue('');
          this.recurringForm.get('state').setValue('');
          this.recurringForm.get('city').setValue('');
          this.recurringForm.get('pincode').setValue('');
        }
        let date = this.custBirthDate.split("-")[0];
        let month = this.custBirthDate.split("-")[1];
        let year = this.custBirthDate.split("-")[2];
        var ageDiff = parseInt("" + moment().diff(year + "-" + month + "-" + date, 'years', true))
        console.log("age diff" + ageDiff)
        this.recurringForm.patchValue({
          monthlyDebitDate: this.todayDate,
          debitAccount: this.accountList[0].accountNo,
          maturityPayoutAccount: this.accountList[0].accountNo,
          depositorType: this.depositorTypeName,
          modeOperation: this.accountList[0].ModeOfOprn
        });
        this.getAccountBalance(this.accountList[0].accountNo);
        this.getFDRDDetails(this.openDepositTabSelection);

      }
    }
    else if (value == 'fixedMaturity') {
      this.isMaturityCalculated = true;
      // if(this.fixedForm.value.chooseDepositScheme == 'GENERAL') { //'G'
      // if(this.fixedForm.value.interestPayout == 'C') {
      if (this.fixedForm.value.amount != '' && (this.fixedForm.value.dayField != '' || this.fixedForm.value.monthField != '' || (this.fixedForm.value.day != '' || this.fixedForm.value.year != '' || this.fixedForm.value.month != ''))) {
        if (this.tenureType == "days") {
          if (this.fixedForm.controls['dayField'].value >= Number(this.minTenureDays)) {
            this.fixedMaturity = true;
            this.getInterestRates('fixedForm');
          }
          if (this.fixedForm.value.dayField == '') {
            this.fixedForm.get('dayField').markAsTouched();
          }

        } else if (this.tenureType == "months") {
          if (this.fixedForm.controls['monthField'].value >= Number(this.minTenureMonths)) {
            this.fixedMaturity = true;
            this.getInterestRates('fixedForm');
          }
          if (this.fixedForm.value.monthField == '') {
            this.fixedForm.get('monthField').markAsTouched();
          }

        } else if (this.tenureType == "yearMonthDays") {
          if ((this.fixedForm.value.day != '' || this.fixedForm.value.year != '' || this.fixedForm.value.month != '')) {
            if (this.fixedForm.value.year == '') {
              this.fixedForm.patchValue({
                year: '00'
              });
            }
            if (this.fixedForm.value.month == '') {
              this.fixedForm.patchValue({
                month: '00'
              });
            }
            if (this.fixedForm.value.day == '') {
              this.fixedForm.patchValue({
                day: '00'
              });
            }

            if (this.fixedForm.value.year == '00' && this.fixedForm.value.month == '00' && this.fixedForm.value.day < this.minTenureDays) {
              this.yearMonthDayZeroConditionFixedForm();
            }
            else {
              if (!this.exceedMaxAmt && !this.exceedMinAmt && !this.invalidAmount && !this.multipleof && !this.taxminAmt) {
                this.fixedMaturity = true;
                this.getInterestRates('fixedForm');
              }
            }
          }

          if (this.fixedForm.value.day == '' && this.fixedForm.value.year == '' && this.fixedForm.value.month == '') {
            this.fixedForm.get('day').markAsTouched();
            this.fixedForm.get('year').markAsTouched();
            this.fixedForm.get('month').markAsTouched();
          }

        } else {
          this.fixedMaturity = false;
        }
      }
      else {
        this.fixedForm.get('amount').markAsTouched();
        if (this.tenureType == 'days') {
          this.fixedForm.get('dayField').markAsTouched();
        }
        if (this.tenureType == 'months') {
          this.fixedForm.get('monthField').markAsTouched();
        }
        if (this.tenureType == 'yearMonthDays') {
          this.fixedForm.get('year').markAsTouched();
          this.fixedForm.get('month').markAsTouched();
          this.fixedForm.get('day').markAsTouched();
        }
      }
    }
    else if (value == 'recurringMaturity') {
      this.isMaturityCalculated = true;
      if (this.recurringForm.value.amount != '' && (this.recurringForm.value.year != '' || this.recurringForm.value.month != '')) {

        if (this.recurringForm.value.year == '' || this.recurringForm.value.year == '00') {
          if (this.recurringForm.value.month >= this.minTenureMonths) {
            this.recurringForm.get('month').setValidators([Validators.required, Validators.min(Number(this.minTenureMonths))]);
            this.recurringForm.controls['month'].updateValueAndValidity();
          }
          else {
            this.recurringForm.get('month').setValidators([]);
            this.recurringForm.controls['month'].updateValueAndValidity();
            this.recurringForm.patchValue({
              year: '00'
            });


            if (this.recurringForm.get('year').valid && !this.exceedMaxAmt && !this.exceedMinAmt && !this.invalidAmount && !this.multipleof && !this.taxminAmt) {
              this.recurringMaturity = true;
              this.getInterestRates('recurringForm');
            }

          }
        }
        else {
          if (this.recurringForm.value.month == '') {
            this.recurringForm.patchValue({
              month: '00'
            });
          }

          if (this.recurringForm.get('year').valid && !this.exceedMaxAmt && !this.exceedMinAmt && !this.invalidAmount && !this.multipleof && !this.taxminAmt) {
            this.recurringMaturity = true;
            this.getInterestRates('recurringForm');
          }

        }
      } else {
        this.recurringMaturity = false;
        this.recurringForm.get('amount').markAsTouched();
        this.recurringForm.get('year').markAsTouched();
        this.recurringForm.get('month').markAsTouched();
      }
    }
  }

  getInterestRates(formName) {
    if (this.finalLastFDArr.ROI_TYPE == 'FIXED' || this.rdDetailsArr.ROI_TYPE == 'FIXED') {
      if (this.finalLastFDArr.TD_CATEGORY == 'FD') {
        this.rateOfInterest = this.finalLastFDArr.FIXED_RATE;
      } else {
        this.rateOfInterest = this.rdDetailsArr.FIXED_RATE;
      }
      this.isValidTenure = true;
      if (formName == 'fixedForm') {
        this.fixedMaturity = true;
        this.recurringMaturity = false;
        // if(this.fixedForm.value.chooseDepositScheme == 'GENERAL') {   // G
        if (this.fixedForm.value.interestPayout == 'ON MATURITY') { // C
          this.calculateFDCI(this.rateOfInterest);
        }
        else {
          this.calculateFDSI(this.rateOfInterest);
        }
      }
      else {
        this.fixedMaturity = false;
        this.recurringMaturity = true;
        this.calculateRDCI(this.rateOfInterest);
      }
    } else {
      if (formName == 'fixedForm') {
        this.fixedMaturity = false;
        var param = this.openFdRdService.getInterestRatesCall(this.fixedForm.value, formName, this.selAccDtl, this.tenureType);
      }
      else {
        this.recurringMaturity = false;
        var param = this.openFdRdService.getInterestRatesCall(this.recurringForm.value, formName, this.selAccDtl, this.tenureType);
      }
      this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETFDRDMATURITYRATES).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.isValidTenure = true;
          this.rateOfInterest = data.set.records[0].percentage;
          var noOfDays = Number(data.set.records[0].noofdays);
          if (noOfDays > 999) {
            this.convertedMonthsDays = { months: data.set.records[0].convertedMonths, days: data.set.records[0].convertedDays };
          } else {
            this.convertedMonthsDays = '';
          }

          if (formName == 'fixedForm') {
            this.recurringMaturity = false;
            this.fixedMaturity = true;
            // if(this.fixedForm.value.chooseDepositScheme == 'GENERAL') {   // G
            this.rateOfInterest = (parseFloat(this.rateOfInterest) + parseFloat(this.finalLastFDArr.CBS_ADDITIONAL_ROI ? this.finalLastFDArr.CBS_ADDITIONAL_ROI : '0')).toFixed(2);
            if (this.fixedForm.value.interestPayout == 'ON MATURITY') { // C
              this.calculateFDCI(this.rateOfInterest);
            }
            else {
              this.calculateFDSI(this.rateOfInterest);
            }
          }
          else {
            this.fixedMaturity = false;
            this.recurringMaturity = true;
            this.rateOfInterest = (parseFloat(this.rateOfInterest) + parseFloat(this.finalLastFDArr.CBS_ADDITIONAL_ROI ? this.finalLastFDArr.CBS_ADDITIONAL_ROI : '0')).toFixed(2);
            this.calculateRDCI(this.rateOfInterest);
          }
        }
        else {
          this.isValidTenure = false;
        }
        // auto renewal with fixed amount
        if (this.finalLastFDArr.AUTO_RENEWAL_FLAG == 'F') {
          this.fixedRenewalAmtFlag = true;
          var cbsMaxAmt = Number(this.finalLastFDArr.CBS_MAX_AMOUNT);
          var fdAmt = Number(this.fixedForm.get('amount').value.split('.')[0].trim().replace(/[^0-9]+/g, ''));
          var maturityAmt = Number(this.maturityValue);
          this.minRenewalFixed = this.finalLastFDArr.CBS_MIN_AMOUNT;
          this.maxRenewalFixed = '';
          if (fdAmt > maturityAmt) {
            this.maxRenewalFixed = maturityAmt;
          } else if (maturityAmt > cbsMaxAmt) {
            this.maxRenewalFixed = cbsMaxAmt;
          } else {
            this.maxRenewalFixed = maturityAmt;
          }
        } else {
          this.fixedRenewalAmtFlag = false;
        }

      }, (error) => {
        console.log(error);
      });
    }
  }

  calculateFDSI(rateOfInterest) {
    this.maturityDate = new Date();
    var todaydate = new Date();
    var p = this.fixedForm.get('amount').value.split('.')[0].trim().replace(/[^0-9]+/g, '');
    console.log('principal amount: ', p);
    var i = rateOfInterest;
    var ic = 3; //QUARTERLY
    var n; //months
    var mv; //Maturity value
    var mYear;
    var mMonth;
    var mDay;
    if (this.tenureType == 'days') {
      // mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);
      n = (this.fixedForm.get('dayField').value) / 30.42;
      this.tenureDays = this.fixedForm.get('dayField').value;
      console.log('Tenure days: ', this.tenureDays);

      this.maturityDate = this.datePipe.transform(new Date(todaydate.setDate(todaydate.getDate() + Number(this.tenureDays))), 'dd MMM yyyy');
      console.log('Maturity Date: ', this.maturityDate);
    } else if (this.tenureType == 'months') {
      n = (this.fixedForm.get('monthField').value);
      this.tenureMonths = this.fixedForm.get('monthField').value;
      console.log('Tenure months: ', this.tenureMonths);

      this.maturityDate = this.datePipe.transform(new Date(todaydate.setMonth(todaydate.getMonth() + Number(this.tenureMonths))), 'dd MMM yyyy');
      console.log('Maturity Date: ', this.maturityDate);
    }
    else if (this.tenureType == 'yearMonthDays') {
      console.log('year: ', Number(this.fixedForm.get('year').value));
      console.log('month: ', Number(this.fixedForm.get('month').value));
      console.log('days: ', Number(this.fixedForm.get('day').value));

      mYear = todaydate.getFullYear() + Number(this.fixedForm.get('year').value);
      mMonth = todaydate.getMonth() + Number(this.fixedForm.get('month').value);
      mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);

      console.log('mYear: ', mYear);
      console.log('mMonth: ', mMonth);
      console.log('mDay: ', mDay);

      if (Number(this.fixedForm.get('day').value) == 0) {
        n = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value)) + (Number(this.fixedForm.get('day').value))

        this.maturityDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, todaydate.getDate())), 'dd MMM yyyy');
        console.log('Maturity Date: ', this.maturityDate);
      }
      else {
        n = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value)) + (Number(this.fixedForm.get('day').value)) / 30;

        this.maturityDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, mDay)), 'dd MMM yyyy');
        console.log('Maturity Date: ', this.maturityDate);
      }
      this.tenureMonths = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value));
      this.tenureDays = (Number(this.fixedForm.get('day').value));
      console.log('Tenure Months 1: ', this.tenureMonths);
      console.log('Tenure Days: ', this.tenureDays);
    }
    this.maturityValue = "";

    // The equation is A = p * [[1 + (r/n)] ^ nt]
    mv = ((p * i * n) / 1200).toFixed(2);
    this.maturityValue = p;
    console.log('Maturity Value: ', this.maturityValue);
    this.totalInterest = mv;
    console.log('Total Interest: ', this.totalInterest);
  }

  calculateFDCI(rateOfInterest) {
    this.maturityDate = new Date();
    var todaydate = new Date();
    var p = this.fixedForm.get('amount').value.split('.')[0].trim().replace(/[^0-9]+/g, '');
    console.log('principal amount: ', p);
    var i = rateOfInterest;
    var ic = 4; //QUARTERLY
    var n; //months
    var mv; //Maturity value
    var mYear;
    var mMonth;
    var mDay;
    if (this.tenureType == 'days') {
      // mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);
      n = (this.fixedForm.get('dayField').value) / 30.42;
      this.tenureDays = this.fixedForm.get('dayField').value;
      console.log('Tenure days: ', this.tenureDays);

      this.maturityDate = this.datePipe.transform(new Date(todaydate.setDate(todaydate.getDate() + Number(this.tenureDays))), 'dd MMM yyyy');
      console.log('Maturity Date: ', this.maturityDate);

    } else if (this.tenureType == 'months') {
      n = (this.fixedForm.get('monthField').value);
      this.tenureMonths = this.fixedForm.get('monthField').value;
      console.log('Tenure months: ', this.tenureMonths);

      this.maturityDate = this.datePipe.transform(new Date(todaydate.setMonth(todaydate.getMonth() + Number(this.tenureMonths))), 'dd MMM yyyy');
      console.log('Maturity Date: ', this.maturityDate);
    }
    else if (this.tenureType == 'yearMonthDays') {
      console.log('year: ', Number(this.fixedForm.get('year').value));
      console.log('month: ', Number(this.fixedForm.get('month').value));
      console.log('days: ', Number(this.fixedForm.get('day').value));

      mYear = todaydate.getFullYear() + Number(this.fixedForm.get('year').value);
      mMonth = todaydate.getMonth() + Number(this.fixedForm.get('month').value);
      mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);

      console.log('mYear: ', mYear);
      console.log('mMonth: ', mMonth);
      console.log('mDay: ', mDay);

      if (Number(this.fixedForm.get('day').value) == 0) {
        n = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value)) + (Number(this.fixedForm.get('day').value))

        this.maturityDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, todaydate.getDate())), 'dd MMM yyyy');
        console.log('Maturity Date: ', this.maturityDate);
      }
      else {
        n = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value)) + (Number(this.fixedForm.get('day').value)) / 30;

        this.maturityDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, mDay)), 'dd MMM yyyy');
        console.log('Maturity Date: ', this.maturityDate);
      }
      this.tenureMonths = (Number(this.fixedForm.get('year').value)) * 12 + (Number(this.fixedForm.get('month').value));
      this.tenureDays = (Number(this.fixedForm.get('day').value));
      console.log('Tenure Months 2: ', this.tenureMonths);
      console.log('Tenure Days: ', this.tenureDays);
    }
    this.maturityValue = "";

    // The equation is A = p * [[1 + (r/n)] ^ nt]
    mv = (p * Math.pow((1 + (i / (ic * 100))), (ic * n / 12))).toFixed(2);
    this.maturityValue = mv;
    console.log('Maturity Value: ', mv);
    this.totalInterest = this.maturityValue - p;
    console.log('Total Interest: ', this.totalInterest);
  }

  calculateRDCI(rateOfInterest) {
    this.maturityValue = "";
    var mYear;
    var mMonth;
    var todaydate = new Date();
    mYear = todaydate.getFullYear() + Number(this.recurringForm.get('year').value);
    mMonth = todaydate.getMonth() + Number(this.recurringForm.get('month').value);

    console.log('mYear: ', mYear);
    console.log('mMonth: ', mMonth);

    this.maturityDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, todaydate.getDate())), 'dd MMM yyyy');
    console.log('Maturity Date: ', this.maturityDate);

    var p = this.recurringForm.get('amount').value.split('.')[0].trim().replace(/[^0-9]+/g, '');
    var i = rateOfInterest;
    var ic = 4; //QUARTERLY
    var n = (Number(this.recurringForm.get('year').value)) * 12 + (Number(this.recurringForm.get('month').value)); //months
    var mv; //Maturity value

    this.tenureMonths = (Number(this.recurringForm.get('year').value)) * 12 + (Number(this.recurringForm.get('month').value));
    console.log('Tenure Months 3: ', this.tenureMonths);

    // The equation is A = p * [[1 + (r/n)] ^ nt]
    // mv = (p * Math.pow((1 + (i / (ic * 100))), (ic * n/12))).toFixed(2);
    mv = ((p * (Math.pow((1 + (i / ic) / 100), (ic * (n / 12))) - 1)) / (1 - Math.pow((1 + (i / ic) / 100), -ic / 12))).toFixed(2);
    // mv = ((Math.pow(((400+i)/400),(n/3))-1)*2*p*((600+i)/i)).toFixed(2);
    this.maturityValue = mv;
    console.log('Maturity Value: ', mv);
    this.totalInterest = this.maturityValue - (p * n);
    console.log('Total Interest: ', this.totalInterest);
  }

  nominationSelection(value) {
    this.nominationType = value;
    switch (value) {
      case 'nomination':
        // this.nomination = !this.nomination;
        if (!this.nomination) {
          this.fixedForm.controls['nomineeName'].setValidators([Validators.required])
          this.fixedForm.controls['maturityInstruction2'].setValidators([Validators.required])
          this.fixedForm.controls['datepicker1'].setValidators([Validators.required])
          this.fixedForm.controls['guardianType'].setValidators([Validators.required])
          this.fixedForm.controls['address1'].setValidators([Validators.required])
          this.fixedForm.controls['state'].setValidators([Validators.required])
          this.fixedForm.controls['city'].setValidators([Validators.required])
          this.fixedForm.controls['pincode'].setValidators([Validators.required])

          this.fixedForm.controls['custaddress1'].setValidators([Validators.required])
          this.fixedForm.controls['custaddress2'].setValidators([Validators.required])
          this.fixedForm.controls['custstate'].setValidators([Validators.required])
          this.fixedForm.controls['custcity'].setValidators([Validators.required])
          this.fixedForm.controls['custpincode'].setValidators([Validators.required])

          this.fixedForm.patchValue({
            nomineeName: '',
            maturityInstruction2: '',
            datepicker1: '',
            custaddress1: '',
            custaddress2: '',
            custstate: '',
            custcity: '',
            custpincode: '',
            guardianName: '',
            guardianType: '',
            address1: '',
            address2: '',
            state: '',
            city: '',
            pincode: '',
          });
        }
        else {

          this.fixedForm.controls['nomineeName'].clearValidators()
          this.fixedForm.controls['maturityInstruction2'].clearValidators()
          this.fixedForm.controls['datepicker1'].clearValidators()
          this.fixedForm.controls['guardianType'].clearValidators()
          this.fixedForm.controls['address1'].clearValidators()
          this.fixedForm.controls['state'].clearValidators()
          this.fixedForm.controls['city'].clearValidators()
          this.fixedForm.controls['pincode'].clearValidators()

          this.fixedForm.controls['custaddress1'].clearValidators()
          this.fixedForm.controls['custaddress2'].clearValidators()
          this.fixedForm.controls['custstate'].clearValidators()
          this.fixedForm.controls['custcity'].clearValidators()
          this.fixedForm.controls['custpincode'].clearValidators()

          // this.getInquiryNomineeDetails(this.fixedForm.value.debitAccount, 'fixedForm');
        }

        this.fixedForm.controls['nomineeName'].updateValueAndValidity();
        this.fixedForm.controls['maturityInstruction2'].updateValueAndValidity()
        this.fixedForm.controls['datepicker1'].updateValueAndValidity()
        this.fixedForm.controls['guardianType'].updateValueAndValidity()
        this.fixedForm.controls['address1'].updateValueAndValidity()
        this.fixedForm.controls['state'].updateValueAndValidity()
        this.fixedForm.controls['city'].updateValueAndValidity()
        this.fixedForm.controls['pincode'].updateValueAndValidity()

        this.fixedForm.controls['custaddress1'].updateValueAndValidity();
        this.fixedForm.controls['custaddress2'].updateValueAndValidity()
        this.fixedForm.controls['custstate'].updateValueAndValidity()
        this.fixedForm.controls['custcity'].updateValueAndValidity()
        this.fixedForm.controls['custpincode'].updateValueAndValidity()

        break;

      case 'recurringNomination':

        // this.recurringNomination = !this.recurringNomination;
        if (!this.recurringNomination) {
          this.recurringForm.controls['nomineeName'].setValidators([Validators.required])
          this.recurringForm.controls['maturityInstruction2'].setValidators([Validators.required])
          this.recurringForm.controls['datepicker1'].setValidators([Validators.required])
          this.recurringForm.controls['guardianType'].setValidators([Validators.required])
          this.recurringForm.controls['address1'].setValidators([Validators.required])
          this.recurringForm.controls['state'].setValidators([Validators.required])
          this.recurringForm.controls['city'].setValidators([Validators.required])
          this.recurringForm.controls['pincode'].setValidators([Validators.required])

          this.recurringForm.controls['custaddress1'].setValidators([Validators.required])
          this.recurringForm.controls['custaddress2'].setValidators([Validators.required])
          this.recurringForm.controls['custstate'].setValidators([Validators.required])
          this.recurringForm.controls['custcity'].setValidators([Validators.required])
          this.recurringForm.controls['custpincode'].setValidators([Validators.required])

          this.recurringForm.patchValue({
            nomineeName: '',
            maturityInstruction2: '',
            datepicker1: '',
            custaddress1: '',
            custaddress2: '',
            custstate: '',
            custcity: '',
            custpincode: '',
            guardianName: '',
            guardianType: '',
            address1: '',
            address2: '',
            state: '',
            city: '',
            pincode: '',
          })
        }
        else {
          this.recurringForm.controls['nomineeName'].clearValidators()
          this.recurringForm.controls['maturityInstruction2'].clearValidators()
          this.recurringForm.controls['datepicker1'].clearValidators()
          this.recurringForm.controls['guardianType'].clearValidators()
          this.recurringForm.controls['address1'].clearValidators()
          this.recurringForm.controls['state'].clearValidators()
          this.recurringForm.controls['city'].clearValidators()
          this.recurringForm.controls['pincode'].clearValidators()


          this.recurringForm.controls['custaddress1'].clearValidators()
          this.recurringForm.controls['custaddress2'].clearValidators()
          this.recurringForm.controls['custstate'].clearValidators()
          this.recurringForm.controls['custcity'].clearValidators()
          this.recurringForm.controls['custpincode'].clearValidators()

          // this.getInquiryNomineeDetails(this.recurringForm.value.debitAccount, 'recurringForm');
        }

        this.recurringForm.controls['nomineeName'].updateValueAndValidity();
        this.recurringForm.controls['maturityInstruction2'].updateValueAndValidity()
        this.recurringForm.controls['datepicker1'].updateValueAndValidity()
        this.recurringForm.controls['guardianType'].updateValueAndValidity()
        this.recurringForm.controls['address1'].updateValueAndValidity()
        this.recurringForm.controls['state'].updateValueAndValidity()
        this.recurringForm.controls['city'].updateValueAndValidity()
        this.recurringForm.controls['pincode'].updateValueAndValidity()

        this.recurringForm.controls['custaddress1'].updateValueAndValidity();
        this.recurringForm.controls['custaddress2'].updateValueAndValidity()
        this.recurringForm.controls['custstate'].updateValueAndValidity()
        this.recurringForm.controls['custcity'].updateValueAndValidity()
        this.recurringForm.controls['custpincode'].updateValueAndValidity()
        break;
    }

  }

  applicantAddressSelection() {
    console.log('profileDetails: ', this.DataService.profileDetails);
    console.log("profileDetailsValue :: ", this.DataService.profileDetailsValue)
    var address1 = "", address2 = "";

    var addressDetails = this.DataService.profileDetailsValue.responseParameter
    var address: any;
    if (this.DataService.profileDetails[0].add1 == "" || this.DataService.profileDetails[0].cityCode == "" || this.DataService.profileDetails[0].stateCode == "" || this.DataService.profileDetails[0].pin == "") {
      address = {
        add1: this.DataService.profileDetails[0].permenantAdd1,
        add2: this.DataService.profileDetails[0].permenantAdd2,
        // cityCode : this.DataService.profileDetails[0].permenantCityCode,
        // stateCode : this.DataService.profileDetails[0].permenantStateCode,
        cityCode: addressDetails.cityCodep,
        stateCode: addressDetails.stateCodep,
        pin: this.DataService.profileDetails[0].permenantPin,
      }
    }
    else {
      address = {
        add1: this.DataService.profileDetails[0].add1,
        add2: this.DataService.profileDetails[0].add2,
        // cityCode : this.DataService.profileDetails[0].cityCode,
        // stateCode : this.DataService.profileDetails[0].stateCode,
        cityCode: addressDetails.cityCode,
        stateCode: addressDetails.stateCode,
        pin: this.DataService.profileDetails[0].pin,
      }
    }



    // address1 = this.DataService.profileDetails[0]?.add1  ? this.DataService.profileDetails[0].add1 : this.DataService.profileDetails[0]?.permenantAdd1 ? this.DataService.profileDetails[0].permenantAdd1 : '';
    // address2 = this.DataService.profileDetails[0]?.add1  ? this.DataService.profileDetails[0].add2 : this.DataService.profileDetails[0]?.permenantAdd1 ? this.DataService.profileDetails[0].permenantAdd2 : '';

    switch (this.openDepositTabSelection) {
      case 'fixed':
        this.isAddress = !this.isAddress;
        if (this.isAddress) {
          // this.fixedForm.get('custaddress1').disable();
          // this.fixedForm.get('custaddress2').disable();
          // this.fixedForm.get('custstate').disable();
          // this.fixedForm.get('custcity').disable();
          // this.fixedForm.get('custpincode').disable();

          this.fixedForm.patchValue({
            custaddress1: address.add1,
            custaddress2: address.add2,
            custstate: address.stateCode,
            custcity: address.cityCode,
            custpincode: address.pin,
          });
          this.fixedForm.controls["custaddress2"].clearValidators();
          this.fixedForm.controls["custaddress2"].updateValueAndValidity();
        }
        else {
          this.fixedForm.patchValue({
            custaddress1: "",
            custaddress2: "",
            custstate: "",
            custcity: "",
            custpincode: ""
          });

          this.fixedForm.get('custaddress1').enable();
          this.fixedForm.get('custaddress2').enable();
          this.fixedForm.get('custstate').enable();
          this.fixedForm.get('custcity').enable();
          this.fixedForm.get('custpincode').enable();
          this.fixedForm.controls["custaddress2"].setValidators(Validators.required);
          this.fixedForm.controls["custaddress2"].updateValueAndValidity();
        }

        break;

      case 'recurring':
        this.recurringIsAddress = !this.recurringIsAddress;
        if (this.recurringIsAddress) {
          // this.recurringForm.get('custaddress1').disable();
          // this.recurringForm.get('custaddress2').disable();
          // this.recurringForm.get('custstate').disable();
          // this.recurringForm.get('custcity').disable();
          // this.recurringForm.get('custpincode').disable();

          this.recurringForm.patchValue({
            custaddress1: address.add1,
            custaddress2: address.add2,
            custstate: address.stateCode,
            custcity: address.cityCode,
            custpincode: address.pin
          });
          this.recurringForm.controls["custaddress2"].clearValidators();
          this.recurringForm.controls["custaddress2"].updateValueAndValidity();
        }
        else {
          this.recurringForm.patchValue({
            custaddress1: "",
            custaddress2: "",
            custstate: "",
            custcity: "",
            custpincode: ""
          });
          this.recurringForm.get('custaddress1').enable();
          this.recurringForm.get('custaddress2').enable();
          this.recurringForm.get('custstate').enable();
          this.recurringForm.get('custcity').enable();
          this.recurringForm.get('custpincode').enable();
        }

        break;
    }

  }


  schemeCodeFetchDetails() {

    var param;
    switch (this.openDepositTabSelection) {
      case 'fixed':
        param = this.openFdRdService.getSchemeDetails('TDA');
        break;
      case 'recurring':
        param = this.openFdRdService.getSchemeDetails('RDA');
        break;
    }

  }

  getFDRDDetails(FDRDType) {
    var depositType = '';
    if (FDRDType == 'fixed') {
      depositType = 'FD';
    } else {
      depositType = 'RD';
    }

    this.tenureType = "";
    this.rdDetailsArr = '';
    console.log(this.accountList);

    var param = this.openFdRdService.getFDRDDetailsParam(this.custDetails, this.selAccDtl, depositType);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETFDRDDETAILS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        this.fdrdMainArr = data.set.records;
        this.depositorSchemeTypeArr = this.getUnique(this.fdrdMainArr, 'OMNI_FD_TYPE');
        this.depositorSchemeTypeArr = this.depositorSchemeTypeArr.sort((a, b) => a.OMNI_FD_TYPE.localeCompare(b.OMNI_FD_TYPE));
        console.log(this.fdrdMainArr);
        console.log(this.depositorSchemeTypeArr);
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getUnique(arr, comp) {
    const unique = arr.map(e => e[comp]).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => arr[e]).map(e => arr[e]);
    return unique;
  }

  rdClosureValidation() {
    var param = this.openFdRdService.getDropDownMasterParam(DropDownMaster.GUARDIAN_TYPE);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_RDCLOSUREVALIDATION).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {

      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  tdClosureValidation() {
    var param = this.openFdRdService.getDropDownMasterParam(DropDownMaster.GUARDIAN);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETREFCODE).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty('listofDataset')) {
          this.gardianTypeList = data.listofDataset[0].records;
          this.gardianTypeList = this.gardianTypeList.sort((a, b) => a.DESCRIPTION.localeCompare(b.DESCRIPTION));
        }
      }
      else {
        // this.gardianTypeList = [
        //   { "DESCRIPTION": "Father", "ref_code": "1" },
        //   { "DESCRIPTION": "Mother", "ref_code": "2" },
        //   { "DESCRIPTION": "grandFather", "ref_code": "3" },
        //   { "DESCRIPTION": "Uncle", "ref_code": "4" }
        // ]
        // this.gardianTypeList = this.gardianTypeList.sort((a,b) => a.DESCRIPTION.localeCompare(b.DESCRIPTION));
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getGardianType() {
    var param = this.openFdRdService.getDropDownMasterParam(DropDownMaster.GUARDIAN);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETREFCODE).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty('listofDataset')) {
          this.gardianTypeList = data.listofDataset[0].records;
          this.gardianTypeList = this.gardianTypeList.sort((a, b) => a.DESCRIPTION.localeCompare(b.DESCRIPTION));
        }
      }
      else {
        // this.gardianTypeList = [
        //   { "DESCRIPTION": "Court Appointed", "ref_code": "C" },
        //   { "DESCRIPTION": "Defacto Guardin", "ref_code": "D" },
        //   { "DESCRIPTION": "father", "ref_code": "F" },
        //   { "DESCRIPTION": "Mother", "ref_code": "M" },
        //   { "DESCRIPTION": "Other", "ref_code": "O" }
        // ]
        // this.gardianTypeList = this.gardianTypeList.sort((a,b) => a.DESCRIPTION.localeCompare(b.DESCRIPTION));
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getNomineeRelationList() {
    var param = this.openFdRdService.getDropDownMasterParam(DropDownMaster.NOMINEE_TYPE);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_GETREFCODE).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty('listofDataset')) {
          this.nomineeRelationshipList = data.listofDataset[0].records;
          this.nomineeRelationshipList = this.nomineeRelationshipList.sort((a, b) => a.DESCRIPTION.localeCompare(b.DESCRIPTION));
          console.log('Nominee Relationship List: ', this.nomineeRelationshipList);
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  getState() {
    let stateListParams = this.openFdRdService.getStateListParams();
    this.http.callBankingAPIService(stateListParams, this.constant.deviceID, this.constant.serviceName_GETSTATES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          this.stateList = data.set.records;
          this.stateList = this.stateList.sort((a, b) => a.state.localeCompare(b.state));
          console.log('State List: ', this.stateList);
          this.stateNomineeList = data.set.records;
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getCity(stateId, type) {
    let cityListParams = this.openFdRdService.getCityListParams(stateId);
    this.http.callBankingAPIService(cityListParams, this.constant.deviceID, this.constant.serviceName_GETCITIES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        if (type == 'nominee') {
          this.cityList = [];
          console.log(data.responseParameter);
          // if (data.hasOwnProperty('set')) {
          //   this.cityList = data.set.records;
          // }
          if (data.hasOwnProperty('set')) {
            var newData = data.set.records
            var newArray = newData.filter(function (el) {
              return el.code != 'null'
            });
            this.cityList = newArray
            this.cityList = this.cityList.sort((a, b) => a.city.localeCompare(b.city));

          }
        }
        else {
          this.guardianCityList = [];
          console.log(data.responseParameter);
          // if (data.hasOwnProperty('set')) {
          //   this.guardianCityList = data.set.records;
          // }
          var newData = data.set.records
          var newArray = newData.filter(function (el) {
            return el.code != 'null'
          });
          this.guardianCityList = newArray
          this.guardianCityList = this.guardianCityList.sort((a, b) => a.city.localeCompare(b.city));
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  errorCallBack(subActionId, resp) {
    //showToastMessage(resp.Result, "error");
  }

  onFromAccountSelect(event, type) {
    console.log("onFromAccountSelect", event);
    if (type == 'fixedForm') {
      this.minOneYearFlag = false;
      this.minFifteenDaysFlag = false;
      if (event) {
        this.fixedForm.patchValue({
          maturityPayoutAccount: event
        });
        this.getAccountBalance(event);
        if (this.nomination) {
          // this.getInquiryNomineeDetails(event, type);
        }
        this.getFDRDDetails(this.openDepositTabSelection);
      }
      else {
        this.fixedForm.patchValue({
          maturityPayoutAccount: ''
        });
        this.accBalance = "";
      }
    }
    else {
      if (event) {
        this.recurringForm.get('amount').setValue('');
        this.limitExceedValidation = false;
        this.recurringForm.patchValue({
          maturityPayoutAccount: event
        });
        this.getAccountBalance(event);
        if (this.nomination) {
          // this.getInquiryNomineeDetails(event, type);
        }
        this.getFDRDDetails(this.openDepositTabSelection);
      }
      else {
        this.recurringForm.patchValue({
          maturityPayoutAccount: ''
        });
        this.accBalance = "";
      }
    }
  }

  /**
   * This function is use to call api to fetch
   * accounts balance
   */
  getAccountBalance(selectedAccount) {
    this.selAccDtl = this.accountList.filter((objs) => objs.accountNo == selectedAccount)[0];
    this.modeOfOperationName = this.selAccDtl.ModeOfOprn;
    if (this.openDepositTabSelection == 'fixed') {
      this.fixedForm.patchValue({
        debitAccount: this.selAccDtl.accountNo,
        maturityPayoutAccount: this.selAccDtl.accountNo,
        modeOperation: this.modeOfOperationName,     //'SELF',
        depositorType: this.depositorTypeName
      });
    } else {
      this.recurringForm.patchValue({
        debitAccount: this.selAccDtl.accountNo,
        maturityPayoutAccount: this.selAccDtl.accountNo,
        monthlyDebitDate: this.todayDate,
        modeOperation: this.modeOfOperationName,
        depositorType: this.depositorTypeName
      });
    }
    var param = this.instantPayService.getAccountBalanceParam(selectedAccount);
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_BALANCEINQUIRY
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          // if(this.selAccDtl.accountType == 'SBFSS' || this.selAccDtl.accountType == 'SBFSG' || this.selAccDtl.accountType == 'SBFFD'){
          //   this.accBalance = parseFloat(data.set.records[0].ledgerBalance) + parseFloat(data.set.records[0].ffdBalance);
          // }
          // else{
          //   this.accBalance = data.set.records[0].ledgerBalance
          // }
          this.accBalance = !this.commonMethod.validateNullAndUndefined(data.set.records[0].ffdBalance) ? parseFloat(data.set.records[0].ledgerBalance) + parseFloat(data.set.records[0].ffdBalance) : parseFloat(data.set.records[0].ledgerBalance);

          console.log('account balance: ', this.accBalance);

          if (this.openDepositTabSelection == 'fixed' && this.fixedForm.value.amount) {
            if (Number(this.accBalance) < Number((this.fixedForm.value.amount.trim().replace('₹', '')).replace(/,/g, ''))) {
              this.invalidAmount = true
            } else {
              this.invalidAmount = false
            }
          }
          else if (this.openDepositTabSelection == 'recurring' && this.recurringForm.value.amount) {
            if (Number(this.accBalance) < Number((this.recurringForm.value.amount.trim().replace('₹', '')).replace(/,/g, ''))) {
              this.invalidAmount = true
            } else {
              this.invalidAmount = false
            }
          }
        } else {
          // this.errorCallBack(data.subActionId, resp);
        }
      });
  }

  /**
   * This function is use to call api to fetch
   * accounts balance
   */
  getInquiryNomineeDetails(selectedAccount, type) {
    var param = this.openFdRdService.getInquiryNomineeValidations(selectedAccount);
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_InquiryNomineeValidation
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.nomineeDetails = data.set.records[0];
          if (type == 'fixedForm') {
            this.fixedForm.patchValue({
              nomineeName: this.nomineeDetails.nomineeName,
              maturityInstruction2: this.nomineeDetails.nomineeRelation,
              datepicker1: '',
              custaddress1: this.nomineeDetails.nomineeAddress1,
              custaddress2: this.nomineeDetails.nomineeAddress2,
              custstate: this.nomineeDetails.stateCode,
              custcity: this.nomineeDetails.cityCode,
              custpincode: '',
              guardianName: this.nomineeDetails.guardianName,
              guardianType: '',
              address1: this.nomineeDetails.guardianAddress,
              address2: '',
              state: '',
              city: '',
              pincode: '',
            })
          }
          else {
            this.recurringForm.patchValue({
              nomineeName: this.nomineeDetails.nomineeName,
              maturityInstruction2: this.nomineeDetails.nomineeRelation,
              datepicker1: '',
              custaddress1: this.nomineeDetails.nomineeAddress1,
              custaddress2: this.nomineeDetails.nomineeAddress2,
              custstate: this.nomineeDetails.stateCode,
              custcity: this.nomineeDetails.cityCode,
              custpincode: '',
              guardianName: this.nomineeDetails.guardianName,
              guardianType: '',
              address1: this.nomineeDetails.guardianAddress,
              address2: '',
              state: '',
              city: '',
              pincode: '',
            })
          }
        } else {
          if (type == 'fixedForm') {
            this.fixedForm.patchValue({
              nomineeName: '',
              maturityInstruction2: '',
              datepicker1: '',
              custaddress1: '',
              custaddress2: '',
              custstate: '',
              custcity: '',
              custpincode: '',
              guardianName: '',
              guardianType: '',
              address1: '',
              address2: '',
              state: '',
              city: '',
              pincode: '',
            })
          }
          else {
            this.recurringForm.patchValue({
              nomineeName: '',
              maturityInstruction2: '',
              datepicker1: '',
              custaddress1: '',
              custaddress2: '',
              custstate: '',
              custcity: '',
              custpincode: '',
              guardianName: '',
              guardianType: '',
              address1: '',
              address2: '',
              state: '',
              city: '',
              pincode: '',
            })
          }

          // this.errorCallBack(data.subActionId, resp);
        }
      });
  }

  sliderInput(month, from) {

    this.days = this.daysInMonth(month, new Date().getFullYear())

    switch (from) {
      case "month":

        break;
      case "day":

        break;
      case "recurringMonth":

        break;

    }

  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  onStateSelect(state, type) {
    console.log('state item: ', JSON.parse(state));
    this.fixedForm.get('city').setValue('');
    this.recurringForm.get('city').setValue('');
    let a = JSON.parse(state);
    this.getCity(+a.ID, type)
  }

  // onTermsAndCondition(value , type){

  //   if(type == 'fixed'){
  //       this.isTermsAndCondition = !this.isTermsAndCondition
  //   }else{
  //       this.recurringisTermsAndCondition = !this.recurringisTermsAndCondition
  //   }

  // }

  /**
 * set update currency value
 * @param value
 */
  formatCurrency(value, type) {
    // this.isMaturityCalculated = false;
    let amt = this.customCurrencyPipe
      .transform(value, 'decimal')
      .replace(/[^.0-9]+/g, '');
    if (type == 'fixedForm') {
      this.formValidation.formatCurrency(value, this.fixedForm);
    }
    else if (type == 'recurringForm') {
      this.formValidation.formatCurrency(value, this.recurringForm);
    }
  }

  formatCurrencyFixRenewalAmt(value, formGroup: FormGroup) {
    if (value == '0') {
      if (formGroup.contains('fixedRenewalAmount')) formGroup.get('fixedRenewalAmount').reset();
      return;
    }
    if (value != '') {
      let updatedCurrency = this.customCurrencyPipe.transform(value.trim(), 'decimal');
      if (updatedCurrency.trim().replace(/[^.0-9]+/g, '') == ' 0.00') {
        if (formGroup.contains('fixedRenewalAmount')) formGroup.get('fixedRenewalAmount').reset();
      } else {
        if (updatedCurrency.trim().replace(/[^.0-9]+/g, '') == '0') {
          formGroup.get('fixedRenewalAmount').reset()
        } else {
          console.log(updatedCurrency);
          this.fixedForm.patchValue({ fixedRenewalAmount: updatedCurrency });
        }
      }
    } else {
      formGroup.get('fixedRenewalAmount').reset('')
    }
  }

  OnInput(evn, finalFDArr, form: FormGroup) {
    this.isMaturityCalculated = false;
    this.recurringMaturity = false;
    this.fixedMaturity = false;
    var regex = new RegExp("(\\.\\d{" + 2 + "})\\d+", "g");
    evn = evn.replace(regex, '$1');

    form.patchValue({
      amount: evn
    })

    console.log(evn);
    var amt = evn;
    var investAmt = parseFloat(amt.trim().replace(/[^.0-9]+/g, ''));

    if (Number(this.accBalance) > Number((evn.trim().replace('₹', '')).replace(/,/g, ''))) {
      this.invalidAmount = false;
    } else {
      this.invalidAmount = true;
    }

    if (investAmt > Number(finalFDArr.CBS_MAX_AMOUNT)) {
      this.exceedMaxAmt = true;
    }
    else {
      this.exceedMaxAmt = false;
    }

    if (investAmt < Number(finalFDArr.CBS_MIN_AMOUNT)) {
      this.exceedMinAmt = true;
    }
    else {
      this.exceedMinAmt = false;
    }

    if (Number(finalFDArr.CBS_MIN_AMOUNT) >= investAmt || Number(finalFDArr.CBS_MAX_AMOUNT) <= investAmt || this.invalidAmount) {
      this.multipleof = false;
    } else {
      this.multipleof = true;
      // var multipleAmt = Number(finalFDArr.CBS_MIN_AMOUNT) + Number(finalFDArr.CBS_AMOUNT_MULTIPLE);
      var rem = investAmt % Number(finalFDArr.CBS_AMOUNT_MULTIPLE)
      if (rem == 0) {
        this.multipleof = false;
      } else {
        this.multipleof = true;
      }

      // while (investAmt >= multipleAmt) {
      //   if(investAmt == multipleAmt){
      //     this.multipleof = false;
      //   }else{
      //     this.multipleof = true;
      //   }     
      //   multipleAmt += Number(finalFDArr.CBS_AMOUNT_MULTIPLE);
      // }        
    }

    if (investAmt < Number(finalFDArr.CBS_MIN_AMOUNT)) {
      this.taxminAmt = true;
    }
    else {
      this.taxminAmt = false;
    }
  }

  OnInputFixedReneval(evn, min, max, form: FormGroup) {
    var amt = evn;
    if (parseFloat(amt.trim().replace(/[^.0-9]+/g, '')) > Number(max)) {
      this.exceedMaxAmtRenewal = true;
    }
    else {
      this.exceedMaxAmtRenewal = false;
    }

    if (parseFloat(amt.trim().replace(/[^.0-9]+/g, '')) < Number(min)) {
      this.exceedMinAmtRenewal = true;
    }
    else {
      this.exceedMinAmtRenewal = false;
    }
  }

  // Nomine Agee
  onDateChange(event) {
    console.log(event);
    var diff = Math.floor(this.currentDate - event);
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    var months = Math.floor(days / 31);
    this.nomineeAge = Math.floor(months / 12);

    // if(this.nomineeAge < 18 ){
    //   this.minorFlag = true;

    switch (this.openDepositTabSelection) {
      case 'fixed':
        if (this.nomineeAge < 18) {
          this.minorFlag = true;
          this.fixedForm.get('guardianName').setValidators([Validators.required, Validators.pattern("[a-zA-Z ]*$")]);
          this.fixedForm.get('guardianType').setValidators([Validators.required]);
          this.fixedForm.get('address1').setValidators([Validators.required]);
          this.fixedForm.get('address2').setValidators([Validators.required]);
          this.fixedForm.get('state').setValidators([Validators.required]);
          this.fixedForm.get('city').setValidators([Validators.required]);
          this.fixedForm.get('pincode').setValidators([Validators.required]);
          this.getGardianType();
        }
        else {
          this.minorFlag = false;
          this.fixedForm.get('guardianName').clearValidators();
          this.fixedForm.get('guardianType').clearValidators();
          this.fixedForm.get('address1').clearValidators();
          this.fixedForm.get('address2').clearValidators();
          this.fixedForm.get('state').clearValidators();
          this.fixedForm.get('city').clearValidators();
          this.fixedForm.get('pincode').clearValidators();
        }
        this.fixedForm.get('guardianName').updateValueAndValidity();
        this.fixedForm.get('guardianType').updateValueAndValidity();
        this.fixedForm.get('address1').updateValueAndValidity();
        this.fixedForm.get('address2').updateValueAndValidity();
        this.fixedForm.get('state').updateValueAndValidity();
        this.fixedForm.get('city').updateValueAndValidity();
        this.fixedForm.get('pincode').updateValueAndValidity();

        break;

      case 'recurring':
        if (this.nomineeAge < 18) {
          this.recurringMinorFlag = true;
          this.recurringForm.get('guardianName').setValidators([Validators.required, Validators.pattern("[a-zA-Z ]*$")]);
          this.recurringForm.get('guardianType').setValidators([Validators.required]);
          this.recurringForm.get('address1').setValidators([Validators.required]);
          this.recurringForm.get('address2').setValidators([Validators.required]);
          this.recurringForm.get('state').setValidators([Validators.required]);
          this.recurringForm.get('city').setValidators([Validators.required]);
          this.recurringForm.get('pincode').setValidators([Validators.required]);
          this.getGardianType();
        }
        else {
          this.recurringMinorFlag = false;
          this.recurringForm.get('guardianName').clearValidators();
          this.recurringForm.get('guardianType').clearValidators();
          this.recurringForm.get('address1').clearValidators();
          this.recurringForm.get('address2').clearValidators();
          this.recurringForm.get('state').clearValidators();
          this.recurringForm.get('city').clearValidators();
          this.recurringForm.get('pincode').clearValidators();
        }
        this.recurringForm.get('guardianName').updateValueAndValidity();
        this.recurringForm.get('guardianType').updateValueAndValidity();
        this.recurringForm.get('address1').updateValueAndValidity();
        this.recurringForm.get('address2').updateValueAndValidity();
        this.recurringForm.get('state').updateValueAndValidity();
        this.recurringForm.get('city').updateValueAndValidity();
        this.recurringForm.get('pincode').updateValueAndValidity();

        break;
    }
  }

  daysSelection(value) {
    this.tenureMonths = "";
    this.tenureDays = "";
    this.fixedMaturity = false;
    this.isMaturityCalculated = false;
    this.fixedRenewalAmtFlag = false;

    if (value == 'days') {
      this.fixedForm.get('dayField').reset();
      this.fixedForm.get('monthField').reset();
      this.fixedForm.get('dayField').setValidators([Validators.required, Validators.min(this.minTenureDays), Validators.max(this.maxTenureDays)]);
      this.fixedForm.get('year').clearValidators();
      this.fixedForm.get('month').clearValidators();
      this.fixedForm.get('day').clearValidators();
      this.fixedForm.get('dayField').setValue('');
      this.fixedForm.get('monthField').clearValidators();

      // this.recurringForm.get('dayField').reset();
      // this.recurringForm.get('monthField').reset();
      // this.recurringForm.get('dayField').setValidators([Validators.required, Validators.min(this.minTenureDays), Validators.max(this.maxTenureDays)]);
      // this.recurringForm.get('monthField').clearValidators();
    } else if (value == 'months') {
      this.fixedForm.get('dayField').reset();
      this.fixedForm.get('monthField').reset();
      this.fixedForm.get('monthField').setValidators([Validators.required, Validators.min(this.minTenureMonths), Validators.max(this.maxTenureMonths)]);
      this.fixedForm.get('year').clearValidators();
      this.fixedForm.get('month').clearValidators();
      this.fixedForm.get('day').clearValidators();
      this.fixedForm.get('dayField').clearValidators();
      this.fixedForm.get('monthField').setValue('');

      // this.recurringForm.get('dayField').clearValidators();
      // this.recurringForm.get('monthField').reset();
      // this.recurringForm.get('monthField').setValidators([Validators.required, Validators.min(this.minTenureMonths), Validators.max(this.maxTenureMonths)]);     
      // this.recurringForm.get('monthField').setValue('');
    } else if (value == 'yearMonthDays') {
      // this.fixedForm.get('dayField').clearValidators();
      this.fixedForm.get('year').reset();
      this.fixedForm.get('month').reset();
      this.fixedForm.get('day').reset();
      this.fixedForm.get('dayField').clearValidators();
      this.fixedForm.get('monthField').clearValidators();
      this.fixedForm.get('year').setValidators([Validators.required]);
      this.fixedForm.get('month').setValidators([Validators.required]);
      this.fixedForm.get('day').setValidators([Validators.required]);
      this.fixedForm.get('year').setValue('');
      this.fixedForm.get('month').setValue('');
      this.fixedForm.get('day').setValue('');
    }

    this.fixedForm.get('dayField').updateValueAndValidity();
    this.fixedForm.get('monthField').updateValueAndValidity();
    this.fixedForm.get('year').updateValueAndValidity();
    this.fixedForm.get('month').updateValueAndValidity();
    this.fixedForm.get('day').updateValueAndValidity();

    // this.recurringForm.get('dayField').updateValueAndValidity();
    // this.recurringForm.get('monthField').updateValueAndValidity();

  }

  onDepistSchemeChange(event) {
    this.isMaturityCalculated = false;
    this.limitExceedValidation = false;
    this.fixedMaturity = false;
    this.taxSaverFlag = false;
    this.minOneYearFlag = false;
    this.minFifteenDaysFlag = false;
    this.invalidAmount = false;
    this.exceedMaxAmt = false;
    this.exceedMinAmt = false;
    this.exceedMinAmtRenewal = false;
    this.exceedMaxAmtRenewal = false;
    this.multipleof = false;
    this.taxminAmt = false;
    this.fixedRenewalAmtFlag = false;
    this.maturityInstructions = [];

    this.fixedForm.get('interestPayout').setValue('');
    this.fixedForm.get('amount').setValue('');
    this.fixedForm.get('fixedRenewalAmount').setValue('');
    if (this.fixedForm.controls['chooseDepositScheme'].value == 'TAX SAVER') {
      this.yearsArray = ['05', '06', '07', '08', '09', '10'];
      /* Calling common information popup */
      this.DataService.information = "LOCK_PERIOD_TAX_FRD_5YR";
      this.DataService.informationLabel = 'INFORMATION';
      this.DataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
    } else {
      this.yearsArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
      this.daysSelection('days');
      this.tenureType = 'days';
      this.fixedForm.controls['selectOption'].setValue('days');
      this.fixedForm.get('year').setValidators([]);
      this.fixedForm.get('year').updateValueAndValidity();
    }
    console.log(event.target.value);
    this.selectedDepositTypeArr = this.fdrdMainArr.filter((objs) => objs.OMNI_FD_TYPE == event.target.value);
    console.log(this.selectedDepositTypeArr);
    this.maturityPayout = this.getUnique(this.selectedDepositTypeArr, 'OMNI_INTEREST_PAYOUT');
    this.maturityPayout = this.maturityPayout.sort((a, b) => a.OMNI_INTEREST_PAYOUT.localeCompare(b.OMNI_INTEREST_PAYOUT));
    console.log(this.maturityPayout);
  }

  onInterestPayoutChange(event) {
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.limitExceedValidation = true;
    this.fixedMaturity = false;
    this.taxSaverFlag = false;
    this.minOneYearFlag = false;
    this.minFifteenDaysFlag = false;
    this.fixedRenewalAmtFlag = false;
    this.isYearExceeds = false;
    console.log(event.target.value);
    this.finalFDArr = this.selectedDepositTypeArr.filter((objs) => objs.OMNI_INTEREST_PAYOUT == event.target.value);
    console.log(this.finalFDArr);
    this.maturityInstructions = this.getUnique(this.finalFDArr, 'OMNI_MATURITY_INSTRUCTIONS');
    this.maturityInstructions = this.maturityInstructions.sort((a, b) => a.OMNI_MATURITY_INSTRUCTIONS.localeCompare(b.OMNI_MATURITY_INSTRUCTIONS));
    console.log(this.maturityInstructions);

    //Only find minimum
    this.minDayfinalFDArr = this.finalFDArr.reduce((a, b) => a.CBS_MIN_TENURE_DAYS < b.CBS_MIN_TENURE_DAYS ? a : b);
    console.log("Min:", this.minDayfinalFDArr);

    //Only find maximum
    this.maxMonthfinalFDArr = this.finalFDArr.reduce((a, b) => a.CBS_MAX_TENURE_MONTHS > b.CBS_MAX_TENURE_MONTHS ? a : b);
    console.log("Max:", this.maxMonthfinalFDArr);

    if (this.finalFDArr.length == 1) {
      this.finalLastFDArr = this.finalFDArr[0];
    } else {
      this.finalLastFDArr = this.finalFDArr;
    }

    if (this.minDayfinalFDArr.CBS_MIN_TENURE_TYPE == this.maxMonthfinalFDArr.CBS_MAX_TENURE_TYPE) {
      if (this.minDayfinalFDArr.CBS_MIN_TENURE_TYPE == 'DAY' && this.maxMonthfinalFDArr.CBS_MAX_TENURE_TYPE == 'DAY') {
        this.tenureType = "days";
        this.minTenureDays = this.minDayfinalFDArr.CBS_MIN_TENURE_DAYS;
        this.maxTenureDays = this.maxMonthfinalFDArr.CBS_MAX_TENURE_DAYS;
        this.daysSelection('days')
        if (this.minTenureDays == this.maxTenureDays) {
          this.fixedForm.patchValue({
            dayField: this.maxTenureDays
          });
        }
      } else if (this.minDayfinalFDArr.CBS_MIN_TENURE_TYPE == 'MONTH' && this.maxMonthfinalFDArr.CBS_MAX_TENURE_TYPE == 'MONTH') {
        this.minTenureMonths = this.minDayfinalFDArr.CBS_MIN_TENURE_MONTHS;
        this.maxTenureMonths = this.maxMonthfinalFDArr.CBS_MAX_TENURE_MONTHS;
        this.tenureType = "months";
        this.daysSelection('months')
        if (this.minTenureMonths == this.maxTenureMonths) {
          this.fixedForm.patchValue({
            monthField: this.maxTenureMonths
          });
        } else if (Number(this.minDayfinalFDArr.CBS_MIN_TENURE_MONTHS) >= 12) {
          if (this.fixedForm.controls['chooseDepositScheme'].value == 'TAX SAVER') {
            this.taxSaverFlag = true;
            this.minOneYearFlag = false;
            this.yearsArray = ['05', '06', '07', '08', '09', '10'];
            this.daysSelection('yearMonthDays');
            this.tenureType = 'yearMonthDays';
            this.fixedForm.controls['selectOption'].setValue('yearMonthDays');
            this.fixedForm.get('year').setValidators([Validators.required]);
            this.fixedForm.get('year').updateValueAndValidity();
            this.minTenureMonths = this.minDayfinalFDArr.CBS_MIN_TENURE_MONTHS;
            this.maxTenureMonths = this.maxMonthfinalFDArr.CBS_MAX_TENURE_MONTHS;
            this.fixedForm.patchValue({
              year: '05',
              month: '00',
              day: '00'
            });
          } else {
            this.taxSaverFlag = false;
            this.minOneYearFlag = true;
            this.yearsArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            this.daysArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
            this.daysSelection('yearMonthDays');
            this.tenureType = "yearMonthDays";
            this.minTenureMonths = this.minDayfinalFDArr.CBS_MIN_TENURE_MONTHS;
            this.maxTenureMonths = this.maxMonthfinalFDArr.CBS_MAX_TENURE_MONTHS;
            this.fixedForm.patchValue({
              year: '01',
              month: '00',
              day: '00'
            });
          }
        }
      }
    } else {
      this.minFifteenDaysFlag = true;
      this.minTenureDays = this.minDayfinalFDArr.CBS_MIN_TENURE_DAYS;
      this.maxTenureDays = this.maxMonthfinalFDArr.CBS_MIN_TENURE_DAYS;
      this.minTenureMonths = this.minDayfinalFDArr.CBS_MAX_TENURE_MONTHS;
      this.maxTenureMonths = this.maxMonthfinalFDArr.CBS_MAX_TENURE_MONTHS;
      this.daysSelection('yearMonthDays');
      this.tenureType = "yearMonthDays";
      this.yearsArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
      this.fixedForm.patchValue({
        year: '00',
        month: '00',
        day: this.formatMe(this.minTenureDays)
      });
      this.daysArray = [];
      for (let i = this.minTenureDays; i <= 29; i++) {
        var rem = parseFloat(i) % Number(this.minDayfinalFDArr.CBS_TENURE_MULTIPLE_DAYS)
        if (rem == 0) {
          this.daysArray.push(this.formatMe(i));
        }
      }
    }
  }

  onMaturityInstructionChange(event) {
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.fixedRenewalAmtFlag = false;
    this.fixedForm.get('fixedRenewalAmount').setValue('');
    console.log(event);
    var todaydate = new Date();
    var mYear;
    var mMonth;
    var mDay;
    if (this.tenureType == "days") {
      mYear = todaydate.getFullYear() + 0;
      mMonth = todaydate.getMonth() + 0;
      mDay = todaydate.getDate() + Number(this.fixedForm.get('dayField').value);
    } else if (this.tenureType == "months") {
      mYear = todaydate.getFullYear() + 0;
      mMonth = todaydate.getMonth() + Number(this.fixedForm.get('monthField').value);
      mDay = todaydate.getDate() + 0;
    } else {
      mYear = todaydate.getFullYear() + Number(this.fixedForm.get('year').value);
      mMonth = todaydate.getMonth() + Number(this.fixedForm.get('month').value);
      mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);
    }
    // var mYear = todaydate.getFullYear() + Number(this.fixedForm.get('year').value);
    // var mMonth = todaydate.getMonth() + Number(this.fixedForm.get('month').value);
    // var mDay = todaydate.getDate() + Number(this.fixedForm.get('day').value);
    var nextMonthDate = this.datePipe.transform(new Date(Date.UTC(mYear, mMonth, mDay)), 'dd MMM yyyy');
    console.log('nextDate: ', nextMonthDate);

    var currentYear = todaydate.getFullYear();
    var currentMonth = todaydate.getMonth();
    var currentDay = todaydate.getDate();
    var currentMonthDate = this.datePipe.transform(new Date(Date.UTC(currentYear, currentMonth, currentDay)), 'dd MMM yyyy');
    // To calculate the time difference of two dates
    var Difference_In_Time = new Date(nextMonthDate).getTime() - new Date(currentMonthDate).getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);
    if (this.minFifteenDaysFlag) {
      if (this.finalFDArr.length > 0) {
        if (Difference_In_Days >= Number(this.maxTenureDays)) {
          this.finalLastFDArr = this.finalFDArr.filter((objs) => objs.CBS_MIN_TENURE_DAYS == this.maxTenureDays && objs.OMNI_MATURITY_INSTRUCTIONS == event.target.value);
          this.finalLastFDArr = this.finalLastFDArr[0];
          console.log(this.finalLastFDArr);
        } else {
          this.finalLastFDArr = this.finalFDArr.filter((objs) => objs.CBS_MIN_TENURE_DAYS == this.minTenureDays && objs.OMNI_MATURITY_INSTRUCTIONS == event.target.value);
          this.finalLastFDArr = this.finalLastFDArr[0];
          console.log(this.finalLastFDArr);
        }
      }
    } else {
      this.finalLastFDArr = this.finalFDArr.filter((objs) => objs.OMNI_MATURITY_INSTRUCTIONS == event.target.value);
      this.finalLastFDArr = this.finalLastFDArr[0];
    }
  }

  onToggleChange() {
    this.autoClosureFlag = !this.autoClosureFlag;
  }

  onYearChange(event) {
    this.fixedForm.get('maturityInstruction').setValue('');
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.recurringMaturity = false;
    console.log(event.target.value);
    if (event.target.value == 10) {
      this.isYearExceeds = true;
      this.fixedForm.patchValue({
        month: '00',
        day: '00'
      });
      // this.fixedForm.controls['month'].setValidators([]);
      // this.fixedForm.controls['day'].setValidators([]);
    }
    else {
      this.isYearExceeds = false;
      this.fixedForm.patchValue({
        month: '00',
        day: '00'
      });
    }

    if (this.fixedForm.get('year').value == '00' && this.fixedForm.get('month').value == '00' && this.fixedForm.get('day').value < this.minTenureDays) {
      this.fixedForm.patchValue({
        day: this.formatMe(this.minTenureDays)
      });
      this.fixedForm.get('day').setValidators([Validators.required, Validators.min(this.minTenureDays)]);
      this.fixedForm.controls['day'].updateValueAndValidity();
    }
    else {
      this.fixedForm.get('day').setValidators([]);
      this.fixedForm.get('month').setValidators([]);

      this.fixedForm.controls['day'].updateValueAndValidity();
      this.fixedForm.controls['month'].updateValueAndValidity();
    }

    //logic for multiple months first convert years
    if (this.fixedForm.get('year').value == '00' && this.fixedForm.get('month').value == '00' || event.target.value == '') {
      this.daysArray = [];
      for (let i = this.minTenureDays; i <= 29; i++) {
        var rem = parseFloat(i) % Number(this.minDayfinalFDArr.CBS_TENURE_MULTIPLE_DAYS)
        if (rem == 0) {
          this.daysArray.push(this.formatMe(i));
        }
      }
    } else {
      this.daysArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
    }
    console.log(this.daysArray);
    // this.yearMonthDayZeroConditionFixedForm();

  }

  onDayChange(event) {
    this.fixedForm.get('maturityInstruction').setValue('');
    this.isMaturityCalculated = false;
    console.log(event.target.value);
    if (this.fixedForm.get('year').value == '00' && this.fixedForm.get('month').value == '00') {
      if (event.target.value < this.minTenureDays) {
        this.fixedForm.controls['day'].setValidators([Validators.required, Validators.min(this.minTenureDays)]);
      }
      else {
        this.fixedForm.controls['day'].setValidators([Validators.required]);
      }
      this.fixedForm.controls['day'].updateValueAndValidity()
    }
  }

  onMonthChange(event) {
    this.fixedForm.get('maturityInstruction').setValue('');
    this.isMaturityCalculated = false;
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.recurringMaturity = false;
    this.yearMonthDayZeroConditionFixedForm();

    //logic for multiple months first convert years
    if (this.fixedForm.get('year').value == '00' && this.fixedForm.get('month').value == '00' || event.target.value == '') {
      this.daysArray = [];
      for (let i = this.minTenureDays; i <= 29; i++) {
        var rem = parseFloat(i) % Number(this.minDayfinalFDArr.CBS_TENURE_MULTIPLE_DAYS)
        if (rem == 0) {
          this.daysArray.push(this.formatMe(i));
        }
      }
    } else {
      this.daysArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'];
      this.fixedForm.patchValue({
        day: '00'
      });
    }
    console.log(this.daysArray);
  }

  yearMonthDayZeroConditionFixedForm() {
    if (this.fixedForm.get('year').value == '00' && this.fixedForm.get('month').value == '00' && this.fixedForm.get('day').value < this.minTenureDays) {
      this.fixedForm.get('day').setValidators([Validators.required, Validators.min(this.minTenureDays)]);
    }
    else {
      this.fixedForm.get('day').setValidators([]);
    }
    this.fixedForm.controls['day'].updateValueAndValidity();
    return;
  }

  onRdDepistSchemeChange(event) {
    this.isMaturityCalculated = false;
    this.limitExceedValidation = false;
    this.recurringMaturity = false;
    this.fixedMaturity = false;
    this.invalidAmount = false;
    this.exceedMaxAmt = false;
    this.exceedMinAmt = false;
    this.exceedMinAmtRenewal = false;
    this.exceedMaxAmtRenewal = false;
    this.multipleof = false;
    this.recurringForm.get('amount').setValue('');

    this.rdDetailsArr = this.depositorSchemeTypeArr.filter((objs) => objs.OMNI_FD_TYPE == event.target.value);
    this.rdDetailsArr = this.rdDetailsArr[0];
    if (this.rdDetailsArr.TD_CATEGORY == 'RD') {
      // this.rdDetailsArr = this.depositorSchemeTypeArr[0];
      this.limitExceedValidation = true;
      if (this.rdDetailsArr.CBS_MIN_TENURE_TYPE == 'DAY' && this.rdDetailsArr.CBS_MAX_TENURE_TYPE == 'DAY') {
        this.tenureType = "days";
        this.minTenureDays = this.rdDetailsArr.CBS_MIN_TENURE_DAYS;
        this.maxTenureDays = this.rdDetailsArr.CBS_MAX_TENURE_DAYS;
        this.daysSelection('days')
      } else if (this.rdDetailsArr.CBS_MIN_TENURE_TYPE == 'MONTH' && this.rdDetailsArr.CBS_MAX_TENURE_TYPE == 'MONTH') {
        this.tenureType = "months";
        this.minTenureMonths = this.rdDetailsArr.CBS_MIN_TENURE_MONTHS;
        this.maxTenureMonths = this.rdDetailsArr.CBS_MAX_TENURE_MONTHS;
        this.daysSelection('months');

        //logic for multiple months first convert years
        if (this.recurringForm.get('year').value == '' || this.recurringForm.get('year').value == '00') {
          this.RDMonthsArray = [];
          for (let i = this.minTenureMonths; i <= 11; i++) {
            var rem = parseFloat(i) % Number(this.rdDetailsArr.CBS_TENURE_MULTIPLE_MONTHS)
            if (rem == 0) {
              this.RDMonthsArray.push(this.formatMe(i));
            }
          }
          this.recurringForm.patchValue({
            year: '00',
            month: this.formatMe(this.minTenureMonths)
          });
        }
      }
    } else {
      this.rdDetailsArr = '';
      this.limitExceedValidation = false;
    }
  }

  onRDYearChange(event) {
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.recurringMaturity = false;
    console.log(event.target.value);
    if (event.target.value == 10) {
      this.isRDYearExceeds = true;
      this.recurringForm.patchValue({
        month: '00',
      });
    }
    else {
      this.isRDYearExceeds = false;
    }

    //logic for multiple months first convert years
    if (event.target.value == '' || event.target.value == '00') {
      this.RDMonthsArray = [];
      for (let i = this.minTenureMonths; i <= 11; i++) {
        var rem = parseFloat(i) % Number(this.rdDetailsArr.CBS_TENURE_MULTIPLE_MONTHS)
        if (rem == 0) {
          this.RDMonthsArray.push(this.formatMe(i));
        }
      }
      this.recurringForm.patchValue({
        year: '00',
        month: this.formatMe(this.minTenureMonths)
      });
    } else {
      // this.RDMonthsArray = ['00', '03', '06', '09'];
      this.RDMonthsArray = [];
      for (let i = 0; i <= 11; i++) {
        var rem = i % Number(this.rdDetailsArr.CBS_TENURE_MULTIPLE_MONTHS)
        if (rem == 0) {
          this.RDMonthsArray.push(this.formatMe(i));
        }
      }
      this.recurringForm.patchValue({
        month: '00',
      });
    }
    console.log(this.RDMonthsArray);

    if (event.target.value != '' && event.target.value > '00') {
      this.recurringForm.get('month').setValidators([]);
      this.recurringForm.controls['month'].updateValueAndValidity();
    }
  }

  formatMe(n) {
    return n > 9 ? "" + n : "0" + n;
  }
  onRDMonthChange(event) {
    this.isMaturityCalculated = false;
    this.fixedMaturity = false;
    this.recurringMaturity = false;
    if (this.recurringForm.value.year == '' || this.recurringForm.value.year == '00') {
      if (event.target.value == '' || event.target.value < this.minTenureMonths) {
        this.recurringForm.patchValue({
          year: '00',
        });
        this.recurringForm.get('month').setValidators([Validators.required, Validators.min(this.minTenureMonths)]);
        this.recurringForm.controls['month'].updateValueAndValidity();
      }
      else {
        this.recurringForm.get('month').setValidators([]);
        this.recurringForm.controls['month'].updateValueAndValidity();
      }
    }
  }

  onCancelClick() {
    // if(this.constant.getIsCordova() == "web"){ //JIJO & VIVEK
    this.router.navigateByUrl('/dashboard');
    // }
    // else{
    //   this.router.navigateByUrl('/dashboardMobile');
    // }
  }

  termsConditionPopup(type) {
    switch (type) {
      case 'fixed':
        this.commonMethod.openPopup('div.terms-conditions-popup')
        break;

      case 'recurring':
        this.commonMethod.openPopup('div.terms-conditions-popup-recurring')
        break;
    }
  }

  closeTerms() {
    this.commonMethod.closeAllPopup();
  }

  onDayfieldInput() {
    this.isMaturityCalculated = false;
  }

  onMonthfieldInput() {
    this.isMaturityCalculated = false;
  }

  restrictSpecialChar(event) {
    var k;
    k = event.charCode;  // k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (event.target.value.substr(-1) !== ' ' && k == 32))  // || (k >= 48 && k <= 57)
  }

  doubleSpaceRestrict(event) {
    return !(event.target.value.substr(-1) === ' ' && event.charCode === 32)
  }
}

