import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { AddPayeeService } from './add-payee.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppConstants } from 'src/app/app.constant';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { CommonMethods } from 'src/app/services/common-methods';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-payee',
  templateUrl: './add-payee.component.html',
  styleUrls: ['./add-payee.component.scss']
})
export class AddPayeeComponent {
  accountDigitLength: number;
  maxTransLimitError = false;
  maxTransLimit: any;
  isIFSCCodeAvail: boolean = false;
  isSwiftCodeAvail: boolean = false;
  ownAccCheck: boolean = false;
  selectedBankType: any = 'within';
  invalidAccount = false;
  showUserInfo = false;
  paymentType: string = 'within';
  bankAddress: any;
  beneficiaryTypeValue: any;
  isBankCustomer: boolean = false;
  bankDtl: any;
  beneficiaryype: any = '1';

  internationalBankPayeeForm: FormGroup;
  otherBankPayeeForm: FormGroup;
  withinBankForm: FormGroup;
  outsideBankForm: FormGroup;
  mmidForm: FormGroup;
  searchIfscForm: FormGroup;

  accountList: any = [];
  payeeList: any = [];
  withInPayeeList: any = [];
  oursidePayeeList: any = [];
  mmidPayeeList: any = [];
  searchIfsc: any = [];

  constructor(
    private router: Router,
    public dataService: DataService,
    private formValidation: FormValidationService,
    private addPayeeService: AddPayeeService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private customCurrencyPipe: CustomCurrencyPipe,
    public commonMethod: CommonMethods,
    private location: Location,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
   
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'dashboardMobile';
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.accountDigitLength = this.dataService.accountDigitLength;
    this.dataService.otpSessionPreviousPage = this.router.url;
    this.initialization();
  }

  initialization() {
    this.buildForm();
    this.maxTransLimit = this.getMaxTracLimit();
    this.getBenificiaryList();
    if (this.dataService.previousPageUrl == 'managePayee' || this.dataService.previousPageUrl == 'sendMoney' ||
      this.dataService.previousPageUrl == 'instantPay' || this.dataService.isFromInstaRecipt) {
      this.selectedBankType = this.dataService.managePayeeToAddpayee ? this.dataService.managePayeeToAddpayee : 'within';
      this.paymentType = this.selectedBankType != '' ? this.selectedBankType : 'within'
      if (this.dataService.isEditPayee || this.dataService.isFromInstaRecipt) {
        this.patchPayeeValue()
      }
    } else if (this.dataService.previousPageUrl == 'otpsession' || this.dataService.previousPageUrl == 'receipt') {
      this.selectedBankType = this.dataService.managePayeeToAddpayee ? this.dataService.managePayeeToAddpayee : 'within';
      this.paymentType = this.selectedBankType != '' ? this.selectedBankType : 'within'
    }
    else {
      this.selectedBankType = 'within';
    }
  }

  getMaxTracLimit() {
    return Math.max.apply(Math, this.dataService.userLimits.map(function (o) { return o.limitValue; }))
  }

  getBenificiaryList() {
    this.accountList = [];
    this.payeeList = [];
    this.accountList = this.dataService.customerOperativeAccList.filter((obj) => obj?.Status == 'Active');
    this.accountList = this.accountList.filter((obj) => obj.accountType != 'CAPPI');
    this.getBenefListAPICall();
  }

  getBenefListAPICall() {
    var param = this.addPayeeService.benificiaryListParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BENIFICIARYLIST).subscribe((data) => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == '00') {
        this.payeeList = data.set['records'];
        this.withInPayeeList = this.dataService.withinBankPayeeList = this.payeeList.filter((payee) => payee.beneficiaryType == 'INTRA');
        this.oursidePayeeList = this.dataService.outsideBankPayeeList = this.payeeList.filter((payee) => payee.beneficiaryType == 'INTERBANK');
        this.mmidPayeeList = this.dataService.mmidBankPayeeList = this.payeeList.filter((payee) => payee.beneficiaryType == 'MMID');
      } else {
        //this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error)
    });
  }

  searchBySwiftCode(value) {
    if (value && value.length >= 11) {
      var param = this.addPayeeService.getInfoBySwiftParams(this.internationalBankPayeeForm.value);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETINFOBYSWIFT).subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.addControlsForInterPayee();
          this.internationalBankPayeeForm.patchValue({
            bankName: resp.bankName,
            branchName: resp.branch_name,
            city: resp.city,
          });
          this.isSwiftCodeAvail = true;
        } else {
          //this.errorCallBack(data.subActionId, resp);
        }
      }, (error) => {
        console.log(error)
      });
    } else if (value.length < 11) {
      this.removeControlsForInterBankPayee();
    }
  }

  addControlsForInterPayee() {
    this.internationalBankPayeeForm.addControl('bankName', new FormControl({ value: '', disabled: true }));
    this.internationalBankPayeeForm.addControl('branchName', new FormControl({ value: '', disabled: true }));
    this.internationalBankPayeeForm.addControl('city', new FormControl({ value: '', disabled: true }));
    this.internationalBankPayeeForm.addControl('limitAmount', new FormControl('', [Validators.required]));
  }

  removeControlsForOtherPayee() {
    this.isIFSCCodeAvail = false;
    this.otherBankPayeeForm.removeControl('bankName');
    this.otherBankPayeeForm.removeControl('branchName');
    this.otherBankPayeeForm.removeControl('city');
    this.otherBankPayeeForm.removeControl('limitAmount');
  }

  removeControlsForInterBankPayee() {
    this.isSwiftCodeAvail = false;
    this.internationalBankPayeeForm.removeControl('bankName');
    this.internationalBankPayeeForm.removeControl('branchName');
    this.internationalBankPayeeForm.removeControl('city');
    this.internationalBankPayeeForm.removeControl('limitAmount');
  }

  buildForm() {
    //within bank
    this.withinBankForm = new FormGroup({
      payeeName: new FormControl('', [Validators.required]),
      payeeaccountNumber: new FormControl('', [Validators.required, Validators.minLength(this.accountDigitLength)]),
      confirmaccountNumber: new FormControl('', [Validators.required, Validators.minLength(this.accountDigitLength)]),
      payeenickName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*$')]),
      transactionLimit: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.dataService.withInpayeeAddLimit)])
    },
    );
    //outside bank
    this.outsideBankForm = new FormGroup({
      payeeName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*$')]),
      payeeaccountNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25), Validators.min(1), Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      confirmaccountNumber: new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(25), Validators.min(1), Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      ifsc: new FormControl('', [Validators.required, Validators.pattern("^[A-Z0-9_]*$"), Validators.maxLength(11)]),
      payeenickName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]*')]),
      transactionLimit: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.dataService.outsidePayeeAddLimit)])
    },
    );
    //mmid
    this.mmidForm = new FormGroup({
      mobileNumber: new FormControl('',[Validators.required, Validators.minLength(10)]),
      mmid: new FormControl('', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]),
      payeeName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*$')]),
      payeenickName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]*')]),
      transactionLimit: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.dataService.withInpayeeAddLimit)]),
    },
    );
    //search Ifsc
    this.searchIfscForm = new FormGroup({
      enterBank: new FormControl(''),
      enterBranch: new FormControl(''),
    });
  }

  validateForm(formType) {
    //within bank
    if (this.withinBankForm.invalid && formType == 'withinBank') {
      this.withinBankForm.get('payeeName').markAsTouched();
      this.withinBankForm.get('payeeaccountNumber').markAsTouched();
      this.withinBankForm.get('confirmaccountNumber').markAsTouched();
      this.withinBankForm.get('payeenickName').markAsTouched();
      this.withinBankForm.get('transactionLimit').markAsTouched();
      return;
    }

    //outside bank
    if (this.outsideBankForm.invalid && formType == 'outsideBank') {
      this.outsideBankForm.get('payeeName').markAsTouched();
      this.outsideBankForm.get('payeeaccountNumber').markAsTouched();
      this.outsideBankForm.get('confirmaccountNumber').markAsTouched();
      this.outsideBankForm.get('ifsc').markAsTouched();
      this.outsideBankForm.get('payeenickName').markAsTouched();
      this.outsideBankForm.get('transactionLimit').markAsTouched();
      return;
    }

    //mmid
    if (this.mmidForm.invalid && formType == 'mmid') {
      this.mmidForm.get('mobileNumber').markAsTouched();
      this.mmidForm.get('mmid').markAsTouched();
      this.mmidForm.get('payeeName').markAsTouched();
      this.mmidForm.get('payeenickName').markAsTouched();
      this.mmidForm.get('transactionLimit').markAsTouched();
      return;
    }

  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  focusTransactionAmount(el, form: FormGroup, fld){
    var amountText = el;
    amountText = amountText.replaceAll('₹','').replace(/^\₹|,|\.\d*$/gm, '');
    form.patchValue({ [fld]: amountText });
  }

  getToAccValue(bankDtl) {
    this.outsideBankForm.patchValue({ ifsc: bankDtl.IFSC });
    this.bankAddress = bankDtl.bank + "," + bankDtl.city + "," + bankDtl.cust_address;
    this.bankDtl = bankDtl;
    this.commonMethod.closePopup('div.search-ifsc2');
  }

  gotoContinue() {
    this.commonMethod.closePopup('div.popup-bottom.search-ifsc1');
    console.log('Star form:', this.searchIfscForm.value);
    var param = this.addPayeeService.getIFSCCodeParams(this.searchIfscForm.value);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETBRANCHLISTBYBRANCHBANK).subscribe((data) => {
      console.log(data);
      console.log('get favourite list', this.searchIfsc);
      var resp = data.responseParameter;
      if (resp.opstatus == '00') {
        this.commonMethod.openPopup('div.search-ifsc2');
        this.searchIfsc = data.set['records'];
      } else {
        //this.errorCallBack(data.subActionId, this.resp);
      }
    },(error)=>{
      console.log(error)
    });
  }

  changePaymentType(type) {
    this.invalidAccount = false;
    this.maxTransLimitError = false
    this.showUserInfo = false;
    this.paymentType = type;
    this.dataService.isEditPayee = false;
    switch (type) {
      case 'within':
        this.withinBankForm.reset();
        break;
      case 'outside':
        this.outsideBankForm.reset();
        this.bankAddress = ''
        break;
      case 'mmid':
        this.mmidForm.reset();
        break;
    }
  }

  /**
 * set update currency value
 * @param value
 */
  formatCurrency(value) {
    let amt = this.customCurrencyPipe.transform(value, 'decimal').replace(/[^.0-9]+/g, '');
    switch (this.paymentType) {
      case 'within':
        this.formValidation.formatTransLimit(value, this.withinBankForm);
        break;
      case 'outside':
        this.formValidation.formatTransLimit(value, this.outsideBankForm);
        break;
      case 'mmid':
        this.formValidation.formatTransLimit(value, this.mmidForm);
        break;
    }
  }

  onConfirmAccountChange(number, from) {

    if (this.withinBankForm.hasError("accountNotMatch")) {
      return;
    }
    if (number.length == this.dataService.accountDigitLength) {
      var param = this.addPayeeService.validatePayee(this.withinBankForm.value);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ACCOUNTNAME).subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.withinBankForm.patchValue({
            payeeName: data.set.records[0].accountName
          })
          this.invalidAccount = false;
          this.maxTransLimitError = false;
        } else {
          this.invalidAccount = true;
          //this.errorCallBack(data.subActionId, resp);
        }
      }, (error) => {
        console.log(error);
      });

    }
  }

  onCancel() {
    this.router.navigateByUrl('/managePayee');
  }

  submitPayee(formValue, formType) {
    if (this.dataService.isEditPayee) {
      this.editPayeeSubmit(formValue, formType)
    }
    else {
      this.addPayeeSubmit(formValue, formType);
    }
  }

  editPayeeSubmit(formValue, formType) {
    this.dataService.formType = formType;
    this.dataService.beneficiaryTypeValue = this.beneficiaryTypeValue;
    this.dataService.feedbackType = 'addPayee';
    if (formType == 'withinBank') {
      let accNo = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == formValue.payeeaccountNumber)
      if (accNo.length != 0) { this.ownAccCheck = true; return };
      console.log('withinPayeeList', this.withInPayeeList);

      if (this.withinBankForm.valid) {
        this.beneficiaryTypeValue = '1';
        if (this.invalidAccount) {
          return;
        }
        if (parseFloat(this.withinBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }
        this.modifyBenificary(formValue, this.beneficiaryTypeValue);
        console.log('FormTye :: ', formType);
        console.log('FormTye :: ', formValue);
      } else {
        this.validateForm(formType);
      }
    } else if (formType == 'outsideBank') {
      let accNo = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == formValue.payeeaccountNumber)
      if (accNo.length != 0) { this.ownAccCheck = true; return };
      if (this.outsideBankForm.valid && this.isBankCustomer == false) {
        this.beneficiaryTypeValue = '2';

        if (this.invalidAccount) {
          return;
        }

        if (parseFloat(this.outsideBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }

        this.modifyBenificary(formValue, this.beneficiaryTypeValue);
        console.log('FormTye :: ', formType);
        console.log('FormTye :: ', formValue);
      } else {
        this.validateForm(formType);
      }
    } else if (formType == 'mmid') {
      console.log(this.mmidForm.valid);
      let alreadyAccExist = this.mmidPayeeList.filter(obj => obj.MMID == formValue.mmid)
      if (alreadyAccExist.length != 0) { this.commonMethod.openPopup('div.popup-bottom.payee-already-added'); return };

      if (this.mmidForm.valid) {


        if (parseFloat(this.mmidForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }


        this.beneficiaryTypeValue = '3';
        this.modifyBenificary(formValue, this.beneficiaryTypeValue);
        console.log('FormTye :: ', formType);
        console.log('FormTye :: ', formValue);
      } else {
        this.validateForm(formType);
      }
    }
  }

  modifyBenificary(formValue, beneficiaryType) {
    this.dataService.resetTransactionObj();
    this.dataService.beneficiaryType = beneficiaryType;
    this.beneficiaryype = beneficiaryType;
    this.dataService.request = '';
    var param = this.addPayeeService.editPayeeParam(this.dataService.payeeDtl.ID, formValue.transactionLimit, beneficiaryType);
    // this.addBeneficiary(param);
    if (param == undefined || param == '') return;
    this.dataService.endPoint = this.constant.serviceName_UPDATEBENEFICIARYTRANSACTIONLIMIT;
    this.dataService.request = param;
    this.dataService.authorizeHeader = 'MODIFY PAYEE';
    if (beneficiaryType == 1) {
      this.dataService.transactionReceiptObj.payeeAccName = this.dataService.payeeDtl.benefName;
      this.dataService.transactionReceiptObj.payeeAccNo = this.dataService.payeeDtl.beneficiary_account_no;
      this.dataService.transactionReceiptObj.payeeNickName = this.dataService.payeeDtl.beneficiary_nick_name;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.withinBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        PAYEE_ACCOUNT_NUMBER:this.dataService.transactionReceiptObj.payeeAccNo,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    } else if (beneficiaryType == 2) {
      this.dataService.transactionReceiptObj.payeeAccName = this.dataService.payeeDtl.benefName;
      this.dataService.transactionReceiptObj.payeeAccNo = this.dataService.payeeDtl.beneficiary_account_no;
      this.dataService.transactionReceiptObj.payeeNickName = this.dataService.payeeDtl.beneficiary_nick_name;
      this.dataService.transactionReceiptObj.payeeIfsc = this.dataService.payeeDtl.ifsc_code;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.outsideBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        PAYEE_ACCOUNT_NUMBER:this.dataService.transactionReceiptObj.payeeAccNo,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        IFSC_CODE:this.dataService.transactionReceiptObj.payeeIfsc,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    } else if (beneficiaryType == 3) {
      this.dataService.transactionReceiptObj.payeeMobileNo = this.mmidForm.value.mobileNumber;
      this.dataService.transactionReceiptObj.payeeAccName = this.dataService.payeeDtl.benefName;
      this.dataService.transactionReceiptObj.payeeNickName = this.dataService.payeeDtl.beneficiary_nick_name;
      this.dataService.transactionReceiptObj.payeeMMID = this.mmidForm.value.mmid;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.mmidForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_MOBILE_NUMBER:this.dataService.transactionReceiptObj.payeeMobileNo,
        MMID:this.dataService.transactionReceiptObj.payeeMMID,
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    }
    this.dataService.screenType = 'addPayee';
    this.dataService.commonOtpServiceType = this.constant.val_ADDPAYEE;
    this.dataService.paymentType = this.selectedBankType;
    this.router.navigate(['/otpsession']);
  }


  addPayeeSubmit(formValue, formType) {
    this.dataService.formType = formType;
    this.dataService.beneficiaryTypeValue = this.beneficiaryTypeValue;
    this.dataService.feedbackType = 'addPayee';

    if (formType == 'withinBank') {

      let accNo = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == formValue.payeeaccountNumber)
      if (accNo.length != 0) { this.ownAccCheck = true; return };
      console.log('withinPayeeList', this.withInPayeeList);
      let alreadyAccExist = this.withInPayeeList.filter(obj => obj.beneficiary_account_no == formValue.payeeaccountNumber);
      console.log('alreadyAccExist', alreadyAccExist);
      if (alreadyAccExist.length != 0) { this.commonMethod.openPopup('div.popup-bottom.payee-already-added'); return };

      if (this.withinBankForm.valid) {
        this.beneficiaryTypeValue = '1';
        if (this.invalidAccount) {
          return;
        }
        if (parseFloat(this.withinBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }

        this.addBeneficy(formValue, this.beneficiaryTypeValue);
        console.log('FormTye :: ', formType);
        console.log('FormTye :: ', formValue);
      } else {
        this.validateForm(formType);
      }
    } else if (formType == 'outsideBank') {
      let accNo = this.dataService.customerOperativeAccList.filter(obj => obj.accountNo == formValue.payeeaccountNumber)
      if (accNo.length != 0) { this.ownAccCheck = true; return };

      let alreadyAccExist = this.oursidePayeeList.filter(obj => obj.beneficiary_account_no == formValue.payeeaccountNumber)
      if (alreadyAccExist.length != 0) { this.commonMethod.openPopup('div.popup-bottom.payee-already-added'); return };

      if (this.outsideBankForm.valid && this.isBankCustomer == false) {
        this.beneficiaryTypeValue = '2';
        if (this.invalidAccount) { return }
        if (parseFloat(this.outsideBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }
        this.addBeneficy(formValue, this.beneficiaryTypeValue);
      } else {
        this.validateForm(formType);
      }
    } else if (formType == 'mmid') {
      console.log(this.mmidForm.valid);
      let alreadyAccExist = this.mmidPayeeList.filter(obj => obj.MMID == formValue.mmid)
      if (alreadyAccExist.length != 0) { this.commonMethod.openPopup('div.popup-bottom.payee-already-added'); return };

      if (this.mmidForm.valid) {
        if (parseFloat(this.mmidForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '')) > this.maxTransLimit) {
          this.maxTransLimitError = true;
          return;
        }
        this.beneficiaryTypeValue = '3';
        this.addBeneficy(formValue, this.beneficiaryTypeValue);
        console.log('FormTye :: ', formType);
        console.log('FormTye :: ', formValue);
      } else {
        this.validateForm(formType);
      }
    }
  }

  addBeneficy(formValue, beneficiaryType) {
    this.dataService.resetTransactionObj();
    this.dataService.beneficiaryType = beneficiaryType;
    this.beneficiaryype = beneficiaryType;
    this.dataService.request = '';
    var param = this.addPayeeService._getAddBenficiaryParamss(formValue, beneficiaryType, this.bankDtl);
    this.dataService.endPoint = this.constant.serviceName_ADDBENEFICIARY;
    this.dataService.request = param;

    this.dataService.authorizeHeader = 'ADD PAYEE';
    if (beneficiaryType == 1) {
      this.dataService.transactionReceiptObj.payeeAccName = this.withinBankForm.value.payeeName;
      this.dataService.transactionReceiptObj.payeeAccNo = this.withinBankForm.value.confirmaccountNumber;
      this.dataService.transactionReceiptObj.payeeNickName = this.withinBankForm.value.payeenickName;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.withinBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        PAYEE_ACCOUNT_NUMBER:this.dataService.transactionReceiptObj.payeeAccNo,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    } else if (beneficiaryType == 2) {
      this.dataService.transactionReceiptObj.payeeAccName = this.outsideBankForm.value.payeeName;
      this.dataService.transactionReceiptObj.payeeAccNo = this.outsideBankForm.value.confirmaccountNumber;
      this.dataService.transactionReceiptObj.payeeNickName = this.outsideBankForm.value.payeenickName;
      this.dataService.transactionReceiptObj.payeeIfsc = this.outsideBankForm.value.ifsc;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.outsideBankForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        PAYEE_ACCOUNT_NUMBER:this.dataService.transactionReceiptObj.payeeAccNo,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        IFSC_CODE:this.dataService.transactionReceiptObj.payeeIfsc,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    } else if (beneficiaryType == 3) {
      this.dataService.transactionReceiptObj.payeeMobileNo = this.mmidForm.value.mobileNumber;
      this.dataService.transactionReceiptObj.payeeAccName = this.mmidForm.value.payeeName;
      this.dataService.transactionReceiptObj.payeeNickName = this.mmidForm.value.payeenickName;
      this.dataService.transactionReceiptObj.payeeMMID = this.mmidForm.value.mmid;
      this.dataService.transactionReceiptObj.payeeTransLimit = this.mmidForm.value.transactionLimit.trim().replace(/[^.0-9]+/g, '');
      this.dataService.screenDetails = {
        PAYEE_MOBILE_NUMBER:this.dataService.transactionReceiptObj.payeeMobileNo,
        MMID:this.dataService.transactionReceiptObj.payeeMMID,
        PAYEE_NAME:this.dataService.transactionReceiptObj.payeeAccName,
        NICK_NAME:this.dataService.transactionReceiptObj.payeeNickName,
        TRANSACTION_LIMIT:this.customCurrencyPipe.transform(this.dataService.transactionReceiptObj.payeeTransLimit.trim(), 'decimal'),
        DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
    }

    this.dataService.screenType = 'addPayee';
    this.dataService.commonOtpServiceType = this.constant.val_ADDPAYEE;
    this.dataService.paymentType = this.selectedBankType;
    this.router.navigate(['/otpsession']);

  }

  patchPayeeValue() {
    switch (this.selectedBankType) {
      case 'within': {
        this.withinBankForm.patchValue({
          payeeName: this.dataService.payeeDtl.benefName,
          payeeaccountNumber: this.dataService.payeeDtl.beneficiary_account_no,
          confirmaccountNumber: this.dataService.payeeDtl.beneficiary_account_no,
          payeenickName: this.dataService.payeeDtl.beneficiary_nick_name,
          transactionLimit: this.dataService.payeeDtl.maxAmount ? this.customCurrencyPipe.transform(this.dataService.payeeDtl.maxAmount.trim(), 'decimal') : ''
        })
        break;
      }
      case 'outside': {
        this.outsideBankForm.patchValue({
          payeeName: this.dataService.payeeDtl.benefName,
          payeeaccountNumber: this.dataService.payeeDtl.beneficiary_account_no,
          confirmaccountNumber: this.dataService.payeeDtl.beneficiary_account_no,
          payeenickName: this.dataService.payeeDtl.beneficiary_nick_name,
          ifsc: this.dataService.payeeDtl.ifsc_code,
          transactionLimit:this.dataService.payeeDtl.maxAmount ? this.customCurrencyPipe.transform(this.dataService.payeeDtl.maxAmount.trim(), 'decimal') : ''
        })
        this.getBranchDtlFromIfsc();
        break;
      }
      case 'mmid': {
        this.mmidForm.patchValue({
          mobileNumber: this.dataService.payeeDtl.beneficiaryMobileNo,
          mmid: this.dataService.payeeDtl.MMID,
          payeeName: this.dataService.payeeDtl.benefName,
          payeenickName: this.dataService.payeeDtl.beneficiary_nick_name,
          transactionLimit: this.dataService.payeeDtl.maxAmount ? this.customCurrencyPipe.transform(this.dataService.payeeDtl.maxAmount.trim(), 'decimal') : ''
        })
        break;
      }
    }
    this.commonMethod.closeAllPopup();
  }

  getBranchDtlFromIfsc() {
    this.isBankCustomer = false;
    if (this.outsideBankForm.value.ifsc.length != 11) {
      this.bankAddress = ''
      return;
    }
    this.outsideBankForm.patchValue({
      ifsc: this.outsideBankForm.value.ifsc.toUpperCase()
    })

    if (
      this.outsideBankForm.value.ifsc.length == 11 &&
      this.outsideBankForm.value.ifsc.slice(0, 4).toLowerCase() == 'psib'
    ) {
      this.isBankCustomer = true;
      return;
    }
    var param = this.addPayeeService.getBranchFromIFSC(this.outsideBankForm.value.ifsc);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETIMPSMASTERBYIFSC).subscribe((data) => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == '00') {
        if (data.hasOwnProperty('set')) {
          this.bankAddress = data.set.records[0].bank + "," + data.set.records[0].city + "," + data.set.records[0].cust_address;
          this.bankDtl = data.set.records[0];
        }
        // this.outsideBankForm.patchValue({ifsc: ifsc_code});
      } else {
        this.outsideBankForm.patchValue({
          ifsc: ''
        })
        this.bankAddress = ''
      }
    },(error)=>{
      console.log(error);
    });
  }

  clearIfscPrevData() {
    if (this.outsideBankForm.value.ifsc.length != 0 && this.outsideBankForm.controls['ifsc'].invalid) {
      this.outsideBankForm.patchValue({
        ifsc: ''
      })
      this.bankAddress = ''
    }
  }

  inputClick() {
    this.commonMethod.openPopup('div.popup-bottom.search-ifsc1');
  }

  closepopup(popup) {
    this.commonMethod.closePopup(popup);
    if (popup == 'div.popup-bottom.limit-updated-successfully') {
      if (this.constant.getPlatform() == "web") {
        this.router.navigateByUrl("/managePayee");
      }
      else {
        this.location.back();
      }
    }
  }

}
