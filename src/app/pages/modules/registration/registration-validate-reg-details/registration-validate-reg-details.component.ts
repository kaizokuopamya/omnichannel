import { Component, EventEmitter, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import {DataService} from 'src/app/services/data.service';
import { RegistrationStatus } from 'src/app/enum/app-enum'

import { RegistrationValidateRegDetailsService } from './registration-validate-reg-details.service';
// import { ForgotPasswordUserAuthService } from '../../forgot-password/forgot-password-user-auth/forgot-password-user-auth.service';


@Component({
  selector: 'app-registration-validate-reg-details',
  templateUrl: './registration-validate-reg-details.component.html',
  styleUrls: ['./registration-validate-reg-details.component.scss']
})
export class RegistrationValidateRegDetailsComponent {
  @Output() nextEvent2 = new EventEmitter<number>();
  @ViewChildren('cardPinRow') cardPinRows: any;
  @ViewChildren('expdateRow') expdateRows: any;
  @ViewChildren('debitcardRow') debitcardRows: any;

  carpinInput = ['cvvPin1', 'cvvPin2', 'cvvPin3' , 'cvvPin4'];
  expdateInput = ['expDate1', 'expDate2' ,'expDate3' , 'expDate4'];
  debitCardInput = ['cardNumber1', 'cardNumber2', 'cardNumber3', 'cardNumber4']
  registrationFormstep2: FormGroup;
  bankTokenForm: FormGroup;
  userCredentialForm: FormGroup;
  genTokenError: string = "";
  chooseCredError: string = "";
  selectedButton: string = "debitCard"
  isRegenerateToken = false;
  tokenStatusId: any = 0;
  public formErrorsDebitCard = {
    cardNumber1: '',
    cardNumber2: '',
    cardNumber3: '',
    cardNumber4: '',
    expDate1: '',
    expDate2: '',
    expDate3: '',
    expDate4: '',
    cvvPin1: '',
    cvvPin2: '',
    cvvPin3: '',
    cvvPin4: ''
  };

  public formErrorUserName = {
    username: '',
    password: ''
  }

  public formErrorsBankToken = {
    bankToken: ''
  };
  accountNumberLen: any;
  selectedType: string = 'debitCard';
  platform: string = '';
  isEnterBankToken: boolean = false;
  registertoken;
  invalidCard: boolean = false;

  constructor(private form: FormBuilder,
    private router: Router,
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private formValidation: FormValidationService,
    private localStorage: LocalStorageService,
    public constant: AppConstants,
    private regService: RegistrationValidateRegDetailsService,
    public commonMethod: CommonMethods,
    // private forgotPasswordUserAuthService: ForgotPasswordUserAuthService
  ) { }


  ngOnInit(): void {
    this.initialization();
  }


  /** Initialization process */
  initialization() {
    //Set page common Components
    // this.dataService.changeMessage(this.commonPageComponent);
    console.log(this.dataService.registrationData);
    this.buildForm();
    this.bindForm();
    this.platform = this.constant.getEntityId();//get platfrom
    this.isEnterBankToken = this.dataService.userRegStaus == RegistrationStatus.PENDING_AT_VERIFY_TOKEN;
    if (this.dataService.isLoanRegistration == true) this.selectedUserAuth('banktoken');
    // this.isRegenerateToken = this.DataService.pendingAtToken;

    var param = this.regService.getTokenExistsParam();
    this.checkToken(param);
    if (this.dataService.isMigratedUser) {
    
      this.selectedUserAuth('internetBanking')
      this.userCredentialForm.controls['username'].setValue(this.dataService.regFeildData.custId);
      this.userCredentialForm.patchValue({ username: this.dataService.regFeildData.custId })
    }
  }


  checkToken(param) {
    this.http.callBankingAPIService(param, this.localStorage.getLocalStorage("deviceId"), this.constant.serviceName_VALIDATEBANKTOKEN_reg).subscribe(data => {
      console.log(data);     
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.isRegenerateToken = false;
      }
      else {
        this.isRegenerateToken = true;
        this.tokenStatusId = resp.statusId
      }
    });

  }


  bindForm() {
    this.registrationFormstep2.patchValue({
      cardNumber1: this.dataService.regFeildData.cardNumber1,
      cardNumber2: this.dataService.regFeildData.cardNumber2,
      cardNumber3: this.dataService.regFeildData.cardNumber3,
      cardNumber4: this.dataService.regFeildData.cardNumber4,
      cardNumber5: this.dataService.regFeildData.cardNumber5,
      cardNumber6: this.dataService.regFeildData.cardNumber6,
      expDate1: this.dataService.regFeildData.expDate1,
      expDate2: this.dataService.regFeildData.expDate2,
      expDate3: this.dataService.regFeildData.expDate3,
      expDate4: this.dataService.regFeildData.expDate4,
      cvvPin1: this.dataService.regFeildData.cvvPin1,
      cvvPin2: this.dataService.regFeildData.cvvPin2,
      cvvPin3: this.dataService.regFeildData.cvvPin3,
      cvvPin4: this.dataService.regFeildData.cvvPin4,
    });

    this.bankTokenForm.patchValue({
      bankToken: this.dataService.regFeildData.bankToken
    });

  }

  buildForm() {
    this.accountNumberLen = this.constant.val_accountNumberLength;
    this.registrationFormstep2 = new FormGroup({
      cardNumber1: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
      cardNumber2: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
      cardNumber3: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
      cardNumber4: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[0-9]*$")]),
      expDate1: new FormControl('', [Validators.required]),
      expDate2: new FormControl('', [Validators.required]),
      expDate3: new FormControl('', [Validators.required]),
      expDate4: new FormControl('', [Validators.required]),
      cvvPin1: new FormControl('', [Validators.required]),
      cvvPin2: new FormControl('', [Validators.required]),
      cvvPin3: new FormControl('', [Validators.required]),
      cvvPin4: new FormControl('', [Validators.required])
    });

    this.bankTokenForm = new FormGroup({
      bankToken: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.registrationFormstep2.valueChanges.subscribe((data) => {
      this.formErrorsDebitCard = this.formValidation.validateForm(this.registrationFormstep2, this.formErrorsDebitCard, true);
    });

    this.bankTokenForm.valueChanges.subscribe((data) => {
      this.formErrorsBankToken = this.formValidation.validateForm(this.bankTokenForm, this.formErrorsBankToken, true);
    });

    this.userCredentialForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });


  
  }


  validatesForm(formType) {
    switch (formType) {
      case 'banktoken': {
        if (this.bankTokenForm.invalid) {
          this.formValidation.markFormGroupTouched(this.bankTokenForm);
        }
        break;
      }
      case 'debitCard': {
        if (this.registrationFormstep2.invalid) {
          this.formValidation.markFormGroupTouched(this.registrationFormstep2);
        }
        break;
      }
      case 'internetBanking': {
        if (this.userCredentialForm.invalid) {
          this.formValidation.markFormGroupTouched(this.userCredentialForm);
        }
        break;
      }
    }
  }


  submit() {
    this.genTokenError = "";
    this.chooseCredError = "";
    //this.nextEvent2.next(2);
    if (this.selectedButton == "banktoken" && (this.isRegenerateToken || this.isEnterBankToken)) {
      this.validatesForm('banktoken'); 
      if (this.bankTokenForm.valid) {
        console.log(this.bankTokenForm.value)
        var rrnNo = this.commonMethod.genRandomDigit(9);
        var param = this.regService.getValidateTokenParam(this.bankTokenForm.value,rrnNo);
        this.validateToken(param,rrnNo);
      } else {
        this.formErrorsBankToken = this.formValidation.validateForm(this.bankTokenForm, this.formErrorsBankToken, true);
      }
    }
    else if (this.selectedButton == "banktoken" && !this.isEnterBankToken) {
      this.genTokenError = "*Please generate token.If generated please contact bank."
    }
    else if (this.selectedButton == "debitCard") {
      var card = '' + this.registrationFormstep2.value.cardNumber1 + '' + this.registrationFormstep2.value.cardNumber2 + '' + this.registrationFormstep2.value.cardNumber3 + '' + this.registrationFormstep2.value.cardNumber4
      var validCard = card.match("^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$")
      this.validatesForm('debitCard');
      if (this.registrationFormstep2.valid) {
        if(validCard == null || validCard == undefined){
          this.invalidCard = false;
          console.log(this.registrationFormstep2.value)
          var param = this.regService.getValidateDebitCardParam(this.registrationFormstep2.value);
          this.validateCredentials(param,'fromdebit');
        }
        else{
          console.log(this.registrationFormstep2.value)
          var param = this.regService.getValidateDebitCardParam(this.registrationFormstep2.value);
          this.validateCredentials(param,'fromdebit');
        }
      } else {
        this.formErrorsDebitCard = this.formValidation.validateForm(this.registrationFormstep2, this.formErrorsDebitCard, true);
      }
    }
    else if (this.selectedButton == "internetBanking") {
      this.validatesForm('internetBanking');
      if (this.userCredentialForm.valid) {
        console.log(this.userCredentialForm.value)

        var param = this.regService.getValidateCredentailParam(this.userCredentialForm.value);
        this.validateCredentials(param);
      } else {
        this.formErrorsBankToken = this.formValidation.validateForm(this.userCredentialForm, this.formErrorsBankToken, true);
      }
    }
    else {
      this.chooseCredError = "*Please choose channel to proceed"
    }
  }






  selectedUserAuth(type) {
    switch (type) {
      case 'banktoken': {
        this.selectedButton = "banktoken";
        this.bankTokenForm.reset() ;
        break;
      }
      case 'debitCard': {
        this.selectedButton = "debitCard" ;
        this.registrationFormstep2.reset() ;

        break;
      }
      case 'internetBanking': {
        this.selectedButton = "internetBanking"
        this.userCredentialForm.reset() ;
        this.userCredentialForm.controls['username'].setValue(this.dataService.regFeildData.custId);
        this.userCredentialForm.patchValue({ username: this.dataService.regFeildData.custId })

        break;
      }
    }
  }


  generateToken() {
    this.isRegenerateToken = true;
    // this.tokenStatusId = 3;
    var param = this.regService.getGenerateTokenParam();
    this.apiCallToGenerateToken(param);
  }



  
  /**getGenerateTokenCall
   * api call to generate token
   * @param
   */
  apiCallToGenerateToken(param) {
    this.http.callBankingAPIService(param, this.localStorage.getLocalStorage("deviceId"), this.constant.serviceName_VERFYCREDNTIALS_reg).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.isEnterBankToken = true;
        this.tokenStatusId = '8';
        this.isRegenerateToken = true;
        this.dataService.errorResult = "Bank Token request generated successfully, Please Contact your Branch"
        this.commonMethod.openPopup('div.popup-bottom.checkavailable-upi-error');
        //showToastMessage(resp.Result, "success");
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }

  /**
   * api call to validate token
   */
  validateToken(param,rrnNo) {
    this.http.callBankingAPIService(param, this.localStorage.getLocalStorage("deviceId"), this.constant.serviceName_VALIDATETOKEN_reg).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00" && rrnNo == resp.requestRRN) {
        console.log(data.responseParameter);
        this.dataService.regFeildData.bankToken = this.bankTokenForm.value.bankToken
        // this.router.navigateByUrl('/registrationUsername');
        this.nextEvent2.next(2);
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  /**
   * api call for validating all credentials
   */
  validateCredentials(param , type?) {

    var url = ''
    if(type == 'fromdebit'){
          url = this.constant.serviceName_VALIDATEDEBITCARD
    }else{
      url = this.constant.serviceName_VERFYCREDNTIALS;
    }

    console.log(this.localStorage.getLocalStorage("deviceId"))
    this.http.callBankingAPIService(param, this.constant.deviceID, url).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.dataService.regFeildData.cardNumber1 = this.registrationFormstep2.value.cardNumber1;
        this.dataService.regFeildData.cardNumber2 = this.registrationFormstep2.value.cardNumber2;
        this.dataService.regFeildData.cardNumber3 = this.registrationFormstep2.value.cardNumber3;
        this.dataService.regFeildData.cardNumber4 = this.registrationFormstep2.value.cardNumber4;
        this.dataService.regFeildData.expDate1 = this.registrationFormstep2.value.expDate1;
        this.dataService.regFeildData.expDate2 = this.registrationFormstep2.value.expDate2;
        this.dataService.regFeildData.expDate3 = this.registrationFormstep2.value.expDate3;
        this.dataService.regFeildData.expDate4 = this.registrationFormstep2.value.expDate4;
        this.dataService.regFeildData.cardPin1 = this.registrationFormstep2.value.cvvPin1;
        this.dataService.regFeildData.cardPin2 = this.registrationFormstep2.value.cvvPin2;
        this.dataService.regFeildData.cardPin3 = this.registrationFormstep2.value.cvvPin3;
        this.dataService.regFeildData.cardPin4 = this.registrationFormstep2.value.cvvPin4;
        //this.router.navigateByUrl('/registrationUsername');
        //this.router.navigateByUrl('/registrationStep6');
        this.nextEvent2.next(2);
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }


  errorCallBack(subActionId, resp) {
    //showToastMessage(resp.Result, "error");
  }




  
  expDate(formGroup: FormGroup) {
    let validDate = true;
    const { value: expDate } = formGroup.get('expDate');
    if (expDate.length < 5) {
      validDate = false;
    }
    else {
      let _expDate = expDate;
      if (parseInt("20" + _expDate.split("/")[1]) < new Date().getFullYear()) {
        validDate = false;
      }
      else if (parseInt("20" + _expDate.split("/")[1]) == new Date().getFullYear() && parseInt(_expDate.split("/")[0]) < new Date().getMonth() + 1) {
        validDate = false;
      }
      else {
        validDate = true;
      }
    }
    console.log(validDate);
    return validDate ? null : { invalidExpdate: true };
  }

  getSpasswordElement(index, type) {
    //console.log(this.mPinRows);
    if (index <= 3)
      if (type == 'cardpin') {
        return this.cardPinRows._results[index].nativeElement;
      }
      else if (type == 'debitcard') {
        return this.debitcardRows._results[index].nativeElement;
      } else {
        return this.expdateRows._results[index].nativeElement;
      }
  }



  onKeyUpEvent(index, event, type) {
    this.invalidCard = false;
    const eventCode = event.which || event.keyCode;
    console.log(index);
    console.log(event.which);
    console.log(event.keyCode);

    var textlength = type == 'debitcard' ? 4 : 1;
    if (this.getSpasswordElement(index, type).value.length >= textlength) {
      if (index !== 3) {
        if (type == 'expdate' && index == 1) {
          var month = this.getSpasswordElement(0, type).value + this.getSpasswordElement(1, type).value;
          if (month > 12) {
            this.registrationFormstep2.get(this.expdateInput[0]).setValue("");
            this.registrationFormstep2.get(this.expdateInput[1]).setValue("");
            this.getSpasswordElement(0, type).focus();
          }
          else if (month == 0) {
            this.registrationFormstep2.get(this.expdateInput[0]).setValue("");
            this.registrationFormstep2.get(this.expdateInput[1]).setValue("");
            this.getSpasswordElement(0, type).focus();
          }
          else {
            this.getSpasswordElement(index + 1, type).focus();
          }
        }
        else {
          this.getSpasswordElement(index + 1, type).focus();
        }
      }
      else {
        if (type == 'expdate' && index == 3) {
          var year = this.getSpasswordElement(2, type).value + this.getSpasswordElement(3, type).value;
          var currentYear = new Date().getFullYear().toString().slice(2, 4);
          var currentMonth: any = new Date().getMonth() + 1;
          var _month = this.getSpasswordElement(0, type).value + this.getSpasswordElement(1, type).value;
          if (year == 0) {
            this.registrationFormstep2.get(this.expdateInput[2]).setValue("");
            this.registrationFormstep2.get(this.expdateInput[3]).setValue("");
            this.getSpasswordElement(2, type).focus();
          }
          else if (year < currentYear) {
            this.registrationFormstep2.get(this.expdateInput[2]).setValue("");
            this.registrationFormstep2.get(this.expdateInput[3]).setValue("");
            this.getSpasswordElement(2, type).focus();
          }
          else if (year == currentYear && _month < currentMonth) {
            this.registrationFormstep2.get(this.expdateInput[2]).setValue("");
            this.registrationFormstep2.get(this.expdateInput[3]).setValue("");
            this.getSpasswordElement(2, type).focus();
          }
        }
        this.getSpasswordElement(index, type).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElement(index - 1, type).focus();
    }

    if (eventCode === 8 || eventCode === 229) {
      if (event.key != "Unidentified") {
        if (type == 'debitcard') {
          this.registrationFormstep2.get(this.debitCardInput[index]).setValue("");
        }
        else if (type == 'cardpin') {
          this.registrationFormstep2.get(this.carpinInput[index]).setValue("");
        }
        else {
          this.registrationFormstep2.get(this.expdateInput[index]).setValue("");
        }
        this.getSpasswordElement(index - 1, type).focus();
      }
    }
  }



  onFocusEvent(index, type) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElement(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }


  getDebitCardFormValue() {
    var mpin = "";
    for (const field in this.registrationFormstep2.controls) { // 'field' is a string
      const control = this.registrationFormstep2.get(field); // 'control' is a FormControl
      if (field.includes('cardNumber') && !control.hasError('required')) {
        mpin += control.value;
      }
    }
    return mpin;
  }


  getDebitCardExpiryValue() {
    var mpin = "";
    for (const field in this.registrationFormstep2.controls) { // 'field' is a string
      const control = this.registrationFormstep2.get(field); // 'control' is a FormControl
      if (field.includes('expDate') && !control.hasError('required')) {
        mpin += control.value;
      }
    }
    return mpin;
  }

  getCVVPINValue() {
    var mpin = "";
    for (const field in this.registrationFormstep2.controls) { // 'field' is a string
      const control = this.registrationFormstep2.get(field); // 'control' is a FormControl
      if (field.includes('cvvPin') && !control.hasError('required')) {
        mpin += control.value;
      }
    }
    return mpin;
  }





}
