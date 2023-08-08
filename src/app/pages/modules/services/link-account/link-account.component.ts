import { Component, NgZone, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { Subscription, timer } from 'rxjs';
import { AppConstants } from 'src/app/app.constant';
import { AccountType } from 'src/app/enum/app-enum';
import { CommonMethods } from 'src/app/services/common-methods';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OtpSessionService } from '../../common-otpsession/common-otpsession.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { LinkAccountService } from './link-account.service';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.scss']
})
export class LinkAccountComponent implements OnInit {
  linkAccountForm: FormGroup;
  otpSessionForm: FormGroup;
  accountList: any;
  confirm: boolean = false;
  formData: any;
  linkDelinkList: any = [];
  linkDelinkItem;
  existingOTP: any = '';
  linkingOTP: any = '';
  storageMobileNo: any = '';
  dataAvailable : boolean = false;
  countDown: Subscription;
  counter = 120;
  tick = 1000;
  dashboard:any;
  currentRoute:any;
  validationIssue: any = true;
  tempDecryptedReq: any;
  screentype="myAccount";
  myAccount:any;
  invaildotp = "";
  bankName:string;

  @ViewChildren('mOtpRow') mobileOtp: any;
  @ViewChildren('mNewOtpRow') mobileNewOtp: any;
  constructor(
    private router: Router,
    public dataService: DataService,
    public linkAccService: LinkAccountService,
    public constant: AppConstants,
    public storage: LocalStorageService,
    private http: HttpRestApiService,
    private commonMethod: CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
    private otpSessionService: OtpSessionService,
    private location: Location,
    private dashboardService: DashboardService,
    private ngZone: NgZone,
    private idle: Idle,
  ) {}

 
  ngOnInit(): void {
    this.initialization();
    this.bankName = this.constant.val_bank_name;
   console.log("currentPageUrl",this.dataService.currentPageUrl);
  }
  /**
   * Initialization functionality
   */
  initialization() {
    this.buildForm();
    var param = this.linkAccService.linkDelinkFetchAccountsList();

    this.fetchLinkDelinkAccountList(param);
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'dashboardMobile'
    history.pushState({}, this.dataService.previousPageUrl == 'myAccount' ? 'myAccount' : backUrl , this.location.prepareExternalUrl(this.dataService.previousPageUrl == 'myAccount' ? 'myAccount' : backUrl));
    history.pushState( {}, 'self',
      this.location.prepareExternalUrl(this.router.url)
    );
    this.storageMobileNo = this.storage.getLocalStorage(this.constant.storage_mobileNo);
    this.getPrimaryAccount();
  }

  buildForm() {
    console.log(
      'Saving/Operative account List: ',
      this.dataService.customerOperativeAccList
    );

    this.accountList = this.dataService.customerOperativeAccList;
    let getCheckedRadio = null;
    this.accountList.forEach((o) => {
      if (o.checked) getCheckedRadio = o.value;
    });
    this.linkAccountForm = new FormGroup({
      radioboxdemo: new FormControl('', { validators: Validators.required }),
      radioboxdemo1: new FormControl('', { validators: Validators.required }),
    });

    this.otpSessionForm = new FormGroup({
      otppassword1: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otppassword2: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otppassword3: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otppassword4: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otppassword5: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      otppassword6: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword1: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword2: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword3: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword4: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword5: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
      newotppassword6: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
      ]),
    });
  }

  getPrimaryAccount(){
    console.log(this.dataService.primaryAccountDtl);
  }


  breadcrumroute(routeName){
    this.dataService.updateBreadcrumb(this.router.url , routeName)
    this.router.navigateByUrl('/' + routeName);
  }
  fetchLinkDelinkAccountList(param) {
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.key_deviceId),
        this.constant.serviceName_LINKDELINKFETCHACCOUNT
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.linkDelinkList = [];
          var dataSet = data.set?.records;
          dataSet.forEach((element) => {
            var invalidAccType = this.isValidAccType(element.AccountType);
            if(invalidAccType){
              var isValidCustomer = this.isValidAccStatusFrmScheme(element.SchemeCode);
              if(isValidCustomer){
                if ( element.MobileNo != '' && element.LinkDelingFLG != 'L' && element.LinkDelingFLG != 'P' ) {
                  this.linkDelinkList.push(element);
                }
              }
            }
          },(error)=>{
            console.log(error);
          });

          console.log(
            JSON.stringify('this.linkDelinkList' + this.linkDelinkList)
          );
          if(!this.linkDelinkList.length){
            this.dataAvailable = true
          }
        } else {
          this.linkDelinkList = [];
          this.dataAvailable = true;
          this.errorCallBack(data.subActionId, resp);
        }
      });
  }


  isValidAccStatusFrmScheme(schemeCode){
    var validAccStatus = false;
    validAccStatus = (schemeCode != "CAPPI" && schemeCode != "SBDCT" && schemeCode != "SBKID") //TODO :  code is removed 'SBSRL','SBBAS','SBFIN','SBFIB'
    return validAccStatus;
  }
  isValidAccType(accType){
    var validAccStatus = false;
    validAccStatus = (accType != "LAA" && accType != "TDA" )
    return validAccStatus;
  }

  validateForm() {
    if (this.linkAccountForm.invalid) {
      this.linkAccountForm.get('radioboxdemo').markAsTouched();
      this.linkAccountForm.get('radioboxdemo1').markAsTouched();
      return;
    }
  }

  closePopup(popup){
    if(popup == 'div.popup-bottom.link-primary-account'){
      this.linkAccData();
    }
    this.commonMethod.closePopup(popup);
  }


  
  

  cancel() {
    this.commonMethod.closeAllPopup();
  }

  gotoDashboard(){
    if(this.constant.getPlatform() == 'cordova')
    {
       this.location.back();
    }
    else{
       if( this.dataService.previousPageUrl=='dashboard' ){

        if(this.constant.getPlatform() == "web"){
          this.router.navigateByUrl('/dashboard');
        }
        else{
          this.router.navigateByUrl('/dashboardMobile');
        }
       }
       else if( this.dataService.previousPageUrl=='myAccount')
        {
          this.router.navigate(['/myAccount']);
        }
    }

  }


  // && this.currentRoute == "sidenav"

  goToPage(routeName) {
    if(this.dataService.primaryAccountDtl.SchemeCode == AccountType.LOAN_ACCOUNT && this.linkDelinkItem?.AccountType != AccountType.LOAN_ACCOUNT){
      this.linkPrimaryAccount();
    }else{
      var param = this.linkAccService.linkDelinkFetchAccountsList();
      this.fetchLinkDelinkAccountList(param);
      this.router.navigateByUrl('/' + routeName);
    }
    this.commonMethod.closeAllPopup();
  }

  linkPrimaryAccount(){
    console.log("in autolimk");
    var param = this.linkAccService.getAccInfoAutoLinkCall(this.dataService.regFeildData.accNo,this.storage.getLocalStorage(this.constant.storage_mobileNo));
    console.log('Account Auto Link Params: ', param);
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_AUTOLINKACCOUNTS).subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
        } else {
          this.errorCallBack(data.subActionId, resp);
        }
        //this.logoutapp();
      });
  }

  radioBoxClicked(item) {
    console.log('linkdelimitm' + JSON.stringify(item));
    this.linkDelinkItem = item;
  }

  resendClicked() {}

  submit(data) {
    console.log(data);
    this.validateForm();
    if (this.linkAccountForm.valid) {


      if(this.dataService.primaryAccountDtl.SchemeCode == AccountType.LOAN_ACCOUNT && this.linkDelinkItem?.AccountType != AccountType.LOAN_ACCOUNT ){
        this.commonMethod.openPopup('div.popup-bottom.link-primary-account');
      }
      else{
        this.linkAccData();
      }
      this.formData = data;
    }
  }

  linkAccData(){
    if(this.linkDelinkItem?.MobileNo != this.storageMobileNo){
      this.commonMethod.openPopup('div.confirmationbox-setting');
    }else{
      this.proceed();
    }
  }

  proceed() {
    if (this.linkDelinkItem?.MobileNo == this.storageMobileNo) {
      this.resendOTPSession();
    } else {
      this.resendOTP();
    }
  }

  resendOTPSession(numCount?: any) {
    this.otpSessionForm.reset();
    var resendOTPReq = this.otpSessionService.getResendOTPSessionReq(this.constant.val_LINK);
    this.http
      .callBankingAPIService(
        resendOTPReq,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_RESENDOTPSESSION
      )
      .subscribe((data) => {
        if (data.responseParameter.opstatus == '00') {
          this.commonMethod.openPopup('div.opt-verification');
          this.countDown = timer(0, this.tick).subscribe(() => {
            if (this.counter != 0) {
              --this.counter;
            }
          });
        }
        else{
          this.commonMethod.openPopup('div.popup-bottom.otp-fetch-error');
        }
      });
  }

  resendOTP() {
    this.otpSessionForm.reset();
    var resendOTPReq = this.linkAccService.getResendLeadOtpParam(
      this.linkDelinkItem.MobileNo
    );
    this.http
      .callBankingAPIService(
        resendOTPReq,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_RESENDCHANNELOTPSESSION
      )
      .subscribe((data) => {
        if (data.responseParameter.opstatus == '00') {
          this.commonMethod.openPopup('div.opt-verification');
          this.countDown = timer(0, this.tick).subscribe(() => {
            if (this.counter != 0) {
              --this.counter;
            }
          });

        }
        else{
          this.commonMethod.openPopup('div.popup-bottom.otp-fetch-error');
        }
      });
  }

  validateOTP() {
    this.existingOTP =
      this.otpSessionForm.value.otppassword1 +
      this.otpSessionForm.value.otppassword2 +
      this.otpSessionForm.value.otppassword3 +
      this.otpSessionForm.value.otppassword4 +
      this.otpSessionForm.value.otppassword5 +
      this.otpSessionForm.value.otppassword6;
    this.linkingOTP =
      this.otpSessionForm.value.newotppassword1 +
      this.otpSessionForm.value.newotppassword2 +
      this.otpSessionForm.value.newotppassword3 +
      this.otpSessionForm.value.newotppassword4 +
      this.otpSessionForm.value.newotppassword5 +
      this.otpSessionForm.value.newotppassword6;

    var rrnNo = this.commonMethod.genRandomDigit(9);
    var resendOTPReq = this.linkAccService.getValidateLeadOtpParam(
      this.existingOTP,
      this.linkingOTP,this.dataService.endPoint.split('/')[1],this.dataService.userDetails.customerId , rrnNo );


    this.http
      .callBankingAPIService(
        resendOTPReq,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_VALIDATECHANNELOTPSESSION
      )
      .subscribe((data) => {
        if (data.responseParameter.opstatus == '00' && rrnNo == data.responseParameter.requestRRN) {
          this.submitReq();
        } else if (data.responseParameter.opstatus == "01"){
          var invalidAttempt: number = +data.responseParameter.invalidAttempts;
          this.invaildotp = (invalidAttempt-1).toString() + " of 4 unsuccessful attempts, Please try again";
          this.otpSessionForm.reset();
        }
        else if (data.responseParameter.opstatus == "11"){
          var invalidAttempt: number = +data.responseParameter.invalidAttempts;
          this.invaildotp = (invalidAttempt-1).toString() + " of 4 unsuccessful attempts, Please try again";
          this.otpSessionForm.reset();
        }
        else{
          this.invaildotp = "";
          this.commonMethod.closeAllPopup();
        }
      },(error)=>{
        console.log(error);
      });
  }

  singleOTPValidate() {

    this.dataService.request = '';
    let param = this.linkAccService.linkAccountParam(this.linkDelinkItem,'Y');
    this.dataService.endPoint = this.constant.serviceName_LINKDELINKACCOUNTS;
    this.dataService.request = param;

    console.log("this.dataService.request" + this.dataService.request);

    this.tempDecryptedReq = JSON.parse(this.encryptDecryptService.decryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), this.dataService.request));
    console.log(this.tempDecryptedReq);
    this.tempDecryptedReq.methodName = this.dataService.endPoint.split('/')[1];
    this.tempDecryptedReq.value = this.otpSessionForm.value.otppassword1 + this.otpSessionForm.value.otppassword2 +  this.otpSessionForm.value.otppassword3 + this.otpSessionForm.value.otppassword4 + this.otpSessionForm.value.otppassword5 + this.otpSessionForm.value.otppassword6;
    this.tempDecryptedReq.customerID = this.dataService.userDetails.customerId;

    console.log(this.tempDecryptedReq);
    let encryptData = this.encryptDecryptService.encryptText(this.storage.getSessionStorage(this.constant.val_sessionKey), JSON.stringify(this.tempDecryptedReq));
    this.dataService.request = encryptData;
    console.log(this.dataService.request);
    this.submitSingleOTPReq();

  }

  submitSingleOTPReq()
  {
    this.http
    .callBankingAPIService(
      this.dataService.request,
      this.storage.getLocalStorage(this.constant.storage_deviceId),
      this.dataService.endPoint
    )
    .subscribe((resp) => {
      this.otpSessionForm.reset();
      if (resp.responseParameter.opstatus == '00') {
        console.log(resp);
        this.commonMethod.closeAllPopup();
        this.getAccountList();
        this.dataService.feedbackType = 'linkAccount';
        this.commonMethod.openPopup('div.success-acct-link');
        this.invaildotp = ""
      }else if (resp.responseParameter.opstatus == "01" || resp.responseParameter.opstatus == "11" ){
        var invalidAttempt: number = +resp.responseParameter.invalidAttempts;
        this.invaildotp = (invalidAttempt-1).toString() + " of 4 unsuccessful attempts, Please try again";
        this.otpSessionForm.reset();
      }
      else{
        this.invaildotp = "";
        this.commonMethod.closeAllPopup();
      }

    },(error)=>{
      console.log(error);
    });
  }

  submitOTP() {
    if (this.linkDelinkItem?.MobileNo == this.storageMobileNo) {
      this.singleOTPValidate();
    } else {
      this.dataService.endPoint = this.constant.serviceName_LINKDELINKACCOUNTS;
      this.validateOTP();
    }
  }

  submitReq() {
    this.dataService.request = '';

    let param = this.linkAccService.linkAccountParam(this.linkDelinkItem,'N');
    this.dataService.endPoint = this.constant.serviceName_LINKDELINKACCOUNTS;
    var objCheckFlag = this.dataService.activitySettingData.findIndex(
      (x) => x.ACTIVITYNAME == this.dataService.endPoint.split('/')[1]
    );

    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.dataService.endPoint
      )
      .subscribe((resp) => {
        this.otpSessionForm.reset();
        if (resp.responseParameter.opstatus == '00') {
          this.commonMethod.closeAllPopup();
          this.getAccountList();
          this.dataService.feedbackType = 'linkAccount';
          this.commonMethod.openPopup('div.success-acct-link');
          this.invaildotp = ""
        }
      });
  }



  getAccountList(type?:any){
    var param = this.linkAccService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("set")) {
          this.dataService.customerCanTransferAccountList =[];
          this.dataService.customerMyDepostie =[];
          this.dataService.customerLoanAccountList =[];


          /* clearing all the arrays and resetting balances */

          this.dataService.customerMyDepostie = [];
          this.dataService.customerOperativeAccList = [];
          this.dataService.customerBorrowingsList = [];

          this.dataService.totalMyDepositBalance = 0;
          this.dataService.totalMyOperativeBalance = 0;
          this.dataService.totalMyBorrowingsBalance = 0;

          console.log("data.set.records" + JSON.stringify(data.set.records));
          data.set.records.forEach(el => {
            if(el.accountType != 'CAPPI'){
              if(el.accountFlag == "P") this.dataService.primaryAccountDtl = el;
              if(el.SchemeCode == AccountType.FIXED_DEPOSITE_ACCOUNT){
                this.dataService.customerMyDepostie.push(el);
                this.dataService.totalMyDepositBalance = this.dataService.totalMyDepositBalance + parseFloat(el.acctBalance);
              }
              else if( el.SchemeCode == AccountType.SAVING_ACCOUNT ||  el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT ){
                // el.AGSStatus = el["AGS Status"];
                this.dataService.customerOperativeAccList.push(el);
                this.dataService.totalMyOperativeBalance = this.dataService.totalMyOperativeBalance + parseFloat(el.acctBalance);
                console.log("customerOperativeAccList =====>",this.dataService.customerOperativeAccList);
              }
              else if( el.SchemeCode == AccountType.LOAN_ACCOUNT ){
                this.dataService.customerBorrowingsList.push(el);
                this.dataService.totalMyBorrowingsBalance = this.dataService.totalMyBorrowingsBalance + parseFloat(el.acctBalance);
              }
            }
          });
        }
      }
      else {

      }
    },(error)=>{
      console.log(error);
    });
  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(subActionId, resp) {
    if (resp.opstatus == '02') {
     // showToastMessage(resp.Result, 'error');
    }
  }

  onKeyupEvent(index, event, type) {
    const eventCode = event.which || event.keyCode;
    console.log(index);
    console.log(event.which);
    console.log(event.keyCode);

    if (this.getSpasswordElement(index, type).value.length === 1) {
      if (index !== 5) {
        this.getSpasswordElement(index + 1, type).focus();
      } else {
        this.getSpasswordElement(index, type).blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElement(index - 1, type).focus();
    }
    if (eventCode === 8 || eventCode === 229) {
      if (event.key != 'Unidentified') {
        this.getSpasswordElement(index - 1, type).focus();
      }
    }
  }

  onfocusEvent(index, type) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElement(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getSpasswordElement(index, type) {
    console.log(index);
    //console.log(this.mPinRows);
    if (type == 'mobileOtp') {
      if (index <= 5) return this.mobileOtp._results[index].nativeElement;
    } else if (type == 'mobileNewOtp') {
      if (index <= 5) return this.mobileNewOtp._results[index].nativeElement;
    }
  }

  // openPopUp(){
  //   this.commonMethod.openPopup('div.terms-condition')
  // }

  openPopUp(){
  
    this.commonMethod.openPopup("div.tpin-popup")
  }
  closepopup(){
    this.commonMethod.closePopup("div.tpin-popup")
  }
}

