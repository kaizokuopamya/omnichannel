import { Component, EventEmitter, HostListener, NgZone, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AppConstants } from 'src/app/app.constant';
import { AuthService } from 'src/app/pages/auth/auth.service';
import {CommonMethods} from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { LoginService } from './login.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { AccountType } from 'src/app/enum/app-enum';
import { FooterData } from 'src/app/model/footer.model';
import { commonOtpModel } from 'src/app/model/common.model';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { LOGINPAGEFOOTERDATA, OTPINPUTMESSAGE } from './login.model';


declare var $: any;
declare var showToastMessage: any;
declare var showToast:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  captchaStatus:any = '';
  captchaExpire:boolean=false;
  captchaError=''
  @ViewChildren('otpRow') otpRow: any;
  otpInput = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
  updateValue: any;
  maskedMobileNo: any;
  otpfailMsg: any;
  LoginForm: FormGroup;
  MPINForm: FormGroup;
  otpFormLimit: FormGroup;
  mobileNumber: null;
  activetab: string;
  sessionDecryptKey: any;
  isBiometricAvailable: boolean = false;
  isBiomertric: any = false;
  isMPINSet: any = false;
  isTPINSet: any = false;
  platform: string = '';
  data: any = {};
  langData: any = {};
  attempRemaining:any;
  attemptedTime:any;
  submitDisabled:boolean = false;
  code:any="";
  showCapcha:boolean = false;
  countDown: Subscription;
  counter = 120 ;
  capCounter = 180;
  tick = 1000;
  public innerWidth: any;
  public formErrors = {
    username: '',
    password: '',
    captcha: ''
  };
  config:any = {
    type:1,
    length:6,
    cssClass:'custom',
    back: {
     stroke:"#339AD5",
     solid:"#339AD5"
    } ,
    font:{
      color:"#000000",
      size:"35px"
    }
  };
  today:number;
  information:any;
  warningResp:any;
  otpstart:boolean = false;
  
  footerData:FooterData[] = LOGINPAGEFOOTERDATA;
  OTPInputMessage:commonOtpModel = OTPINPUTMESSAGE;
  //listner for all focusout event
  @HostListener("focusout")

  onBlur() {
    //call form validate on focus out
    this.formErrors = this.formValidation.validateForm(this.LoginForm, this.formErrors, true);
    
  }

  customers$: any;

  constructor(
    private form: FormBuilder,
    private router: Router,
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    private EncrDecr: EncryptDecryptService,
    public commonMethod: CommonMethods,
    private loginService: LoginService,
    public constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    private storage: LocalStorageService,
    private ngZone: NgZone,
    private formValidation: FormValidationService,
    private domSanitizer: DomSanitizer,
    private datepipe: DatePipe,
    private _authService: AuthService,
    public translate : TranslatePipe,
  )
  {
    
    this.dataService.fromOmniLogin = true;
    if (environment.production) {
        $(document).ready(function(){
          var username = document.getElementById('userNameTxt');
          var pwdTxt = document.getElementById('pwdTxt');
          $(username).bind("cut copy paste",function(e) {
          e.preventDefault();
        });
        $(username).attr("autocomplete", "off");

        /////////

        $(pwdTxt).bind("cut copy paste",function(e) {
          e.preventDefault();
        });
        $(pwdTxt).attr("autocomplete", "off");
        });
    }
  }
  playCaptcha() {
    var msg = new SpeechSynthesisUtterance(this.code.split('').join(' '));
    msg.pitch = 0.1;
    window.speechSynthesis.speak(msg);
  }
  buildForm() { 

    this.LoginForm = new FormGroup({
      username: new FormControl('', { validators: Validators.required, }),
      password: new FormControl('', { validators: Validators.required, }),
       
      captcha: new FormControl(''),
    });

    this.MPINForm = new FormGroup({
      // mobNumber: new FormControl('', [Validators.required, Validators.minLength(8)]),
      mpin: new FormControl('', [Validators.required, Validators.minLength(4), Validators.minLength(4)]),
    });

    this.otpFormLimit = new FormGroup({
      otp1: new FormControl('', [Validators.required]),
      otp2: new FormControl('', [Validators.required]),
      otp3: new FormControl('', [Validators.required]),
      otp4: new FormControl('', [Validators.required]),
      otp5: new FormControl('', [Validators.required]),
      otp6: new FormControl('', [Validators.required]),
    });

    if(this.showCapcha){
    this.LoginForm.get('captcha')?.setValidators([Validators.required]);
    this.LoginForm.get('captcha').updateValueAndValidity();
    }else{
      this.LoginForm.get('captcha').clearValidators();
      this.LoginForm.get('captcha').updateValueAndValidity();
    }
    //Keyboard on change and before visible event is called when typing using virtual keyboard
    $('#userName').bind('keyboardChange', this.updateUsername.bind(this));
    // $('#userName').bind('show', this.resetUserName.bind(this));
    $('#pwd').bind('keyboardChange', this.updatePwd.bind(this));
    $("#userName").bind('beforeVisible', this.resetUserName.bind(this));
    $("#pwd").bind('beforeVisible', this.resetPwd.bind(this));


    this.LoginForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formValidation.validateForm(this.LoginForm, this.formErrors, true);
    });
   
  }


  resetUserName() {
    $("#userName").val("")
    this.LoginForm.patchValue({ username: "" });

  }

  resetPwd() {
    $("#pwd").val("");
    this.LoginForm.patchValue({ password: "" })
  }

  /**
   * Below function is called for updating the input value of username &password using virtual keyboard
   * @param e
   * @param keyboard
   * @param el
   */
  updateUsername(e, keyboard, el) {
    console.log(e.target.value);
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9_.]/g,'')
    if(e.action == "bksp"){
      let userdata = this.reverse(e.target.value)
      var data = userdata.substring(0, userdata.length - 1)
      this.ngZone.run(() => {
        this.LoginForm.patchValue({ username: data });
        e.target.value = this.reverse(data);
      })
    }
    else if(e.action){
      this.ngZone.run(() => {
        this.LoginForm.patchValue({ username: this.reverse(e.target.value) });
      })
    }else{
      this.LoginForm.patchValue({ username: "" });
      $("#userName").val("")
    }
  }

  reverse(s) {
    // return s;
    return s.split("").reverse().join("");
  }

  updatePwd(e, keyboard, el) {
    if(e.action == "bksp"){
      let userdata = this.reverse(e.target.value)
      var data = userdata.substring(0, userdata.length - 1)
      this.ngZone.run(() => {
        this.LoginForm.patchValue({ password: data });
        e.target.value = this.reverse(data);
      })
    }
    else{
      this.ngZone.run(() => {
        this.LoginForm.patchValue({ password: this.reverse(e.target.value) });
      })
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth)
  }

  ngOnInit(): void {
    // this.createCaptcha();
  
    if (environment.production) {
      this.showCapcha = true
    }
    if(this.showCapcha){
         this.createCaptcha();
    }

    this.innerWidth = window.innerWidth;
  
    this.initialization();
    this.captchaCounter();

    this.dataService.isLoanAccount  = false;
    this.dataService.isNRENRO  = false;

    console.log(this.router.url);
    this.dataService.profileDetails = null;
  }

  /**
   * This function is called for intitialization purpose
   */
  initialization() {
    this.buildForm();
    //window.onbeforeunload = function() { window.history.forward(); };
    // this.showAutoCompleteUserName();
    // this.storage.clearLocalStorage();
    this.storage.clearSessionStorage();
    this.platform = this.constant.getPlatform();
    if(this.constant.getEntityId() == this.constant.val_entityIDMob){
      let mobEncryptKey =  this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey;
      this.storage.setLocalStorage('mobileStaticEncrypyKey',mobEncryptKey);
    }
    this.clearDataOnLoad();
  }

  clearDataOnLoad(){
    this.storage.removeFromLocalStorage(this.constant.storage_deviceId);
    this.storage.removeFromLocalStorage(this.constant.storage_username);
    this.storage.removeFromLocalStorage(this.constant.storage_mobileNo);
    this.storage.removeFromLocalStorage("custId");
    this.dataService.primaryAccountDtl = '';
  }

  showAutoCompleteUserName(){
    if(this.storage.hasKeyLocalStorage('username')){
      let userName = this.storage.getLocalStorage(this.constant.storage_username);
      // this.commonMethod.autocomplete(document.getElementById('userNameTxt'),[userName]);
    }
  }


  /**
   * called on form change
   */

  changeForm() {
    this.LoginForm.reset();
    this.MPINForm.reset();
  }

  /**
   * common function to validate form
   * @formname
   */
  validateForm(formname) {
    if (formname == "usernamelogin" && this.LoginForm.invalid )  {
      if( this.showCapcha) {
        this.LoginForm.get('username').markAsTouched();
        this.LoginForm.get('password').markAsTouched();
        this.LoginForm.get('captcha').markAsTouched();

        return;
      } else{
        this.LoginForm.get('username').markAsTouched();
        this.LoginForm.get('password').markAsTouched();
        return;
      }
    } else if (formname == "mpin" && this.MPINForm.invalid) {
      // this.MPINForm.get('mobNumber').markAsTouched();
      this.MPINForm.get('mpin').markAsTouched();
     
      return;
    }
  }

  

 
  /**
  * Login submit using username and password
  */
  loginUsername() {

    this.validateForm('usernamelogin')
    if (!this.LoginForm.invalid) {
      // this.loader.showLoader();
      console.log(this.LoginForm.value);
      this.LoginForm.value.username = this.LoginForm.value.username.toLowerCase();
      this.sessionDecryptKey = this.LoginForm.value.username.toLowerCase() + this.constant.sessionEncryptKey + this.encryptDecryptService.createMD5Value(this.LoginForm.value.password);

      console.log("sessionDecryptKey =====> " + this.sessionDecryptKey);

      var param = this.loginService.getParamForLogin(this.LoginForm.value);
      let deviceID = this.constant.deviceID;
      this.loginApiCall(param,deviceID, 'credentials');
      this.dataService.LoginForm = this.LoginForm.value;
    }
    else {
      this.formErrors = this.formValidation.validateForm(this.LoginForm, this.formErrors, true);
    }
  }

  closePopup(popUp){
    this.commonMethod.closePopup(popUp);
  }

  routeTo(location){
    console.log('location', location);
    this.router.navigateByUrl(location);
  }

  /**
  * api call for login
  * @Param get request in encrypted format
  * @loginType
  */
  loginApiCall(param,deviceID, loginType) {
    // this.finalLogin();
    this.warningResp = "";
    this.http.callBankingAPIService(param, deviceID, this.constant.serviceName_Login).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      console.log("response loginApiCall:" + JSON.stringify(data.responseParameter));
      if (resp.opstatus == "00" || resp.opstatus == "99") {
        if(resp.opstatus != "99" && (!data.hasOwnProperty("set") || !data.set.hasOwnProperty("records") || data.set.records.length == 0)){ //Check if account is available or not . In not then redirect to technical issue page
          this.dataService.timeoutHeader = "Temporary Unavailable"
          this.dataService.timeoutMsg = "Due to technical issue, Bank is facing some downtime"
          this.dataService.routeWithNgZone('/temporaryserviceout');
          return;
        }
        this.dataService.isNRENRO  = false;
        this.dataService.lastLoginDate =  resp.webLastLogin;
        this.loader.hideLoader();
        console.log( "CUSTID :" + resp.customerId);
        this.dataService.otplength = "6";
        this.dataService.customerID = resp.customerId;
        this.dataService.tpinlength = "6";
        this.dataService.dateFormat = resp.dateFormat ? resp.dateFormat : this.dataService.dateFormat;
        console.log('otp length:', this.dataService.otplength);
        this.dataService.amountFormat = resp.amountFormat
        var sessionKey = this.encryptDecryptService.decryptText(this.sessionDecryptKey, resp.Session);
        console.log('sessionKey', sessionKey);
        //handel null or empty session
        if(sessionKey == undefined || sessionKey == null || sessionKey == ""){
          // showToastMessage("Invalid Credentials.", "error");
          this.information = "Invalid Credentials";
          this.commonMethod.openPopup('div.popup-bottom.show-common-info-login');
          return;
        }
        this.storage.setSessionStorage(this.constant.val_sessionKey, sessionKey);
        console.log("resp.deviceId" + resp.deviceId);
        this.storage.setLocalStorage(this.constant.storage_deviceId, resp.deviceId);
        // this.storage.setLocalStorage(this.constant.storage_mobileNo, resp.MobileNo);
        (resp.MobileNo != resp.newMobileNo)? this.storage.setLocalStorage(this.constant.storage_mobileNo, resp.newMobileNo): this.storage.setLocalStorage(this.constant.storage_mobileNo, resp.MobileNo);
        //set authentication type
        if(resp.authFlag == "T"){
          this.dataService.otpName = 'TPIN'
        }
        else if(resp.authFlag == "S"){
          this.dataService.otpName = 'SOFT_TOKEN'
        }
        else if(resp.authFlag == "H"){
          this.dataService.otpName = 'HARD_TOKEN'
        }
        else if(resp.authFlag == "O"){
         
          this.dataService.otpName = 'OTP'
        }
        else{
          this.dataService.otpName = 'OTP'
        }

        this.maskedMobileNo = this.maskCharacter(this.storage.getLocalStorage(this.constant.storage_mobileNo), 4);
        this.dataService.mobStaticEncKey = this.storage.getLocalStorage(this.constant.storage_mobileNo) + this.constant.mapEncryptKey
        if (data.hasOwnProperty('set')) {
          this.dataService.customerAccountList = data.set.records;
          this._authService._authenticated = true; // handel page navigation after session timeout
          

          //filltered account list of saving Account, deposit Account , overDraftAccount
          //Accounts filtered will be used in dashbord and other module
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

            if(this.dataService.customerMyDepostie.length < 1 && this.dataService.customerOperativeAccList.length < 1 && this.dataService.customerBorrowingsList.length != 0  ){
              this.dataService.isLoanAccount  = true;
            }else{
              this.dataService.isLoanAccount  = false;
            }
          });
          this.dataService.onRefreshDate = new Date();
        }
        this.storage.setLocalStorage(this.constant.storage_username, this.LoginForm.get('username').value.toLowerCase());
        this.dataService.loginType = loginType;
        this._authService._authenticated = true;
        /*
        **** below condition will check internet banking with otp
        **** is required or not
        **** if require then navigate to dashboard else otp page
        */
        //TODO:need to add condition for internet banking only
        if (resp.IBLoginOtpRequired == 'N' ) {
          this.dataService.userDetails = resp;
          console.log("userDetails", this.dataService.userDetails);
          let userProfile = 'data:image/png;base64,'+ resp?.custProfileImage;
          this.dataService.setDetails(userProfile);
          this.storage.setSessionStorage("isLoggedIn", "true");
          if( this.dataService.gotpage){
            this.dataService.routeWithNgZone(this.dataService.gotpage);
          }else{
            this.dataService.routeWithNgZone('dashboard');
          }
          // this.dataService.routeWithNgZone('dashboard');
        }
        else {

          if(environment.production) {
            /* this condition is called when IBLoginOtpRequired == 'Y' */
            this.dataService.otpPreviousPage = "/login";
            this.dataService.otpNextPage = "/dashboard";          
            this.dataService.userDetails = resp;
            console.log("userDetails", this.dataService.userDetails);
            let userProfile = 'data:image/png;base64,'+ resp?.custProfileImage;
            this.dataService.setDetails(userProfile);
            this.dataService.loginData.mobnumber = resp.MobileNo;
            this.dataService.themeName = resp.themeName;                 // set theme 
            this.dataService.themeSidenav = resp.themeSideColor;
            this.dataService.themeBackground = resp.themeSideBackground;
            this.dataService.setTheme(resp.themeName);
            this.dataService.setThemebackground(resp.themeSideBackground);
            this.dataService.setThemeSidenav(resp.themeSideColor);
            this.OTPInputMessage.mobStaticEncKey =this.dataService.mobStaticEncKey;
            this.OTPInputMessage.subHeaderMsg = this.translate.transform('PLEASE_ENTER_SIX_DIGIT_MOBILE_OTP') +' ' + this.maskedMobileNo;
            this.getProfileDtl();
            this.getUserCustomizeMenu();
            this.otpstart = true;
          }
          else {
            this.dataService.userDetails = resp;
            console.log("userDetails", this.dataService.userDetails);
            let userProfile = 'data:image/png;base64,'+ resp?.custProfileImage;
            this.dataService.setDetails(userProfile);
            this.storage.setSessionStorage("isLoggedIn", "true");
            this.dataService.loginData.mobnumber = resp.MobileNo;
            this.dataService.loginThemeName = resp.themeName;
            this.dataService.themeName = resp.themeName;
            this.dataService.themeSidenav = resp.themeSideColor;
            this.dataService.themeBackground = resp.themeSideBackground;
            this.dataService.setTheme(resp.themeName);
            this.dataService.setThemebackground(resp.themeSideBackground);
            this.dataService.setThemeSidenav(resp.themeSideColor);
            this.dataService.headerType = 'innerHeader';
            this.dataService.routefrom = 'dashboard';
            this.getProfileDtl();
            this.getUserCustomizeMenu();
            if( this.dataService.gotpage){
              this.dataService.routeWithNgZone(this.dataService.gotpage);
            }else{
            //this.dataService.routeWithNgZone('dashboardMobile');
            this.dataService.routeWithNgZone('dashboard');
            }
          }
        }
      }else if(resp.opstatus == "92" || resp.opstatus == "115"){
        this.dataService.timeoutHeader = "Temporary Unavailable"
        this.dataService.timeoutMsg = "Due to technical issue, Bank is facing some downtime"
        this.dataService.routeWithNgZone('/temporaryserviceout');
      }
      
      else {
        this.createCaptcha();
        this.errorCallBack(data);
      }
    });
  }

  /** Get Notification Data */
  // getNotification()
  // {
  //   var param=this.notificationServicemob.getNotificationParam();
  //   let deviceID = this.storage.getLocalStorage(this.constant.storage_deviceId);
  //   this.getNotificationApiCall(param,deviceID)
  // }

//   getNotificationApiCall(param,deviceID)
//   {
//     this.http.callBankingAPIService(param,deviceID,this.constant.serviceName_NOTIFICATIONS).subscribe(data=>{
//       console.log(data);
//       var resp = data.responseParameter

//         if (resp.opstatus == "00") {
//           this.dataService.notificationArray = data.set.records;
//         }
//      });
//  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(data) {
    this.LoginForm.reset();
    if(data.responseParameter.invalidAttempts < 3 ){
      this.warningResp = 'You are left with '+ (3 - data.responseParameter.invalidAttempts)+' attempts, Kindly enter correct password';
    }
    else{
      this.warningResp = "";
    }
    this.LoginForm.reset();
    this.MPINForm.reset();
    this.information = data.responseParameter.Result;
    this.commonMethod.openPopup('div.popup-bottom.show-common-info-login');
  }


  ngOnDestroy() {
    this.dataService.loginData.mobnumber = this.mobileNumber;
    this.dataService.loginData.tab = this.activetab;
  }

  createCaptcha() {
    //clear the contents of captcha div first
    document.getElementById('captcha').innerHTML = ""; 
    var charsArray ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 200;
    canv.height = 50;

    var ctx = canv.getContext("2d");

    ctx.font = "35px Georgia";
    ctx.fillStyle = '#339AD5';
    canv.style.letterSpacing = 25 + "px";

    ctx.fillText(captcha.join(""), 40 , 40);

    if (this.config.back.stroke) {
      ctx.strokeStyle = this.config.back.stroke;
      for (var i = 0; i < 100; i++) {
        ctx.moveTo(Math.random() * 300, Math.random() * 300);
        ctx.lineTo(Math.random() * 300, Math.random() * 300);
      }
      ctx.stroke();
    }
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.code = captcha.join("");
    document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
  }
  closeCaptchaPopup(){

    this.captchaExpire=true;

    this.LoginForm.controls['username'].reset();
    this.LoginForm.controls['password'].reset();
    this.LoginForm.controls['captcha'].reset();
    this.createCaptcha();
    this.captchaCounter();
    this.commonMethod.closePopup('div.popup-bottom');
  }


  finalLogin(){
    // this.captchaTimeout();
     this.validateCaptcha();

  }

  validateCaptcha() {

    // this.captchaTimeout();
    this.validateForm('usernamelogin')
    if(this.showCapcha) {
      if(this.LoginForm.value.captcha == this.code) {

        this.loginUsername();

      }
      else {
        if(this.LoginForm.value.captcha !='') {
          this.LoginForm.controls['captcha'].reset()
          this.createCaptcha();
        }
      }
    } else{
      this.loginUsername();
    }
  }

  startCounter(){
    this.counter = 120;
    if (this.countDown  && !this.countDown.closed) { this.countDown.unsubscribe(); }
    this.countDown = timer(0, this.tick).subscribe(() => { if(this.counter == 1) this.countDown.unsubscribe(); --this.counter });
  }
  captchaCounter(){
    this.capCounter = 180;
    if (this.countDown  && !this.countDown.closed) { this.countDown.unsubscribe(); }
    this.countDown = timer(0, this.tick).subscribe(() => { if(this.capCounter == 1) this.countDown.unsubscribe(); --this.capCounter
      if(this.capCounter == 0){
      this.LoginForm.controls['username'].reset()
      this.LoginForm.controls['password'].reset()
      this.LoginForm.controls['captcha'].reset()
      this.createCaptcha();
    }
    });
  }
  
  GetOtpPopData(data){
    var resp = data.responseParameter;
    if(resp.opstatus == "00"){
      this.otpstart = false;
      this.dataService.headerType = 'innerHeader';
      this.dataService.routefrom = 'dashboard';
      if( this.dataService.gotpage){
        this.dataService.routeWithNgZone(this.dataService.gotpage);
      }else{
        //this.dataService.routeWithNgZone('dashboardMobile');
        this.dataService.routeWithNgZone('dashboard');
      }
    }else {
      this.otpstart = false;
    }
 } 

  maskCharacter(str, n) {
    // Slice the string and replace with
    // mask then add remaining string
    return ('' + str).slice(0, -n).replace(/./g, '*') + ('' + str).slice(-n);
  }


  // Profile Data
  getProfileDtl(){
    let param = this.loginService.getProfileDetailsParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CUSTPROFILEDETAILS).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        var responseData = data.listofDataset[0].records;
        console.log("response data getProfileDtl:: ", data)
        this.dataService.profiledateDetails= responseData;
        this.dataService.profileDetails = responseData;
        this.dataService.profileDetailsValue = data
        this.dataService.userName = responseData[0].userName;
        this.dataService.userLimits = data.listofDataset[1].records

        // alert( this.dataService.userName )
        if (resp?.base64Image != "")
          this.dataService.profileImage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + resp?.base64Image);
        else {
          this.dataService.profileImage = ''
          this.dataService.profileName = responseData[0].custName;
        }

        //get state and city code
        console.log('custProfileStateCityObj: ', this.dataService.custProfileStateCityObj);
        this.dataService.custProfileStateCityObj.state = data.responseParameter.stateCode;
        if(data.responseParameter.cityCode.includes('(')) {
          this.dataService.custProfileStateCityObj.city = data.responseParameter.cityCode.split('(')[0];
        }
        else {
          this.dataService.custProfileStateCityObj.city = data.responseParameter.cityCode;
        }

        this.dataService.custProfileStateCityObj.stateId = data.responseParameter.stateId;
        this.dataService.custProfileStateCityObj.cityId = data.responseParameter.CityId;
        this.dataService.custProfileStateCityObj.permenantState = data.responseParameter.stateCodep;
        if(data.responseParameter.cityCode.includes('(')) {
          this.dataService.custProfileStateCityObj.permenantCity = data.responseParameter.cityCodep.split('(')[0];
        }
        else {
          this.dataService.custProfileStateCityObj.permenantCity = data.responseParameter.cityCodep;
        }
      }
      else {

      }
    });
  }

   /**
   * api call to get customize menu
   * @param
   */
   getUserCustomizeMenu() {
    var param = this.loginService.getCustomizeMenuParam();
    let tempCustomMenu =[] ;
    this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_CUSTOMIZEMENU).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log("CustomizeMenu" + JSON.stringify(data.set.records));
        let sideMenu = [];
        let dashboardBankingServices = [];
        let dashboardInvestment = [];
        data.set.records.forEach((element) => {
          switch(element.type){
            case 'HAMBURGER':
              if(element.subMenu){
                element.subMenu = JSON.parse(element.subMenu);
              }
              sideMenu.push(element);
              break;
            case 'BANKING_SERVICES':
              dashboardBankingServices.push(element);
              break;
            case 'INVESTMENTS' :
              dashboardInvestment.push(element)
              break;
          }
        });
        //this.dataService.setSideMenu$.next(sideMenu);
        this.dataService.setDashboardBankingServices$.next(dashboardBankingServices);
        this.dataService.setdashboardInvestment$.next(dashboardInvestment);
      }
      else {
        this.information = "Issue in CustomizeMenu service";
        this.commonMethod.openPopup('div.popup-bottom.show-common-info-login');
      }
    },(error)=>{
      console.log(error)
    });
  }

  guideLinesPopUp(){
    this.commonMethod.openPopup('div.guidelines-popup') ;
  }

  clossGuidelinesPopup(){
    this.commonMethod.closeAllPopup() ;
  }

  gotoNli(){
    this.commonMethod.closeAllPopup() ;
    this.router.navigate(['/nliLanding']);
  }
}
