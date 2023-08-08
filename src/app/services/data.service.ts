import { Injectable, NgZone } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConstants } from '../app.constant';
import { CommonMethods } from './common-methods';
import { LocalStorageService } from '../services/local-storage.service';
import { CustomCurrencyPipe } from '../pipes/custom-currency.pipe';
import { TRANSACTIONRECEIPTOBJ, PROFILEEDITOBJ, SIDEMENU, REGFEILDDATA, MODEOFOPERATIONOBJ, BENEFICIARYLIST, OPEN_FD_RECEIPTOBJMODEL, OPEN_RD_RECEIPTOBJMODEL, CLOSE_RD_MODEL, CLOSE_FD_MODEL, NOMINEERECEIPTOBJ} from '../model/common.model';
import { AccountType } from '../enum/app-enum'

declare var google: any;
declare var nativegeocoder: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private router: Router,
    private constant: AppConstants,
    private ngZone: NgZone,
    private commonMethod: CommonMethods,private storage: LocalStorageService,
    private customCurrencyPipe: CustomCurrencyPipe,
  ) { }


  private commonBehaviorSource = new BehaviorSubject("");
  private setThemeSource = new BehaviorSubject("");
  private setThemebackgroundSource = new BehaviorSubject("");
  private setThemeSidenavSource = new BehaviorSubject("");
  public setSideMenu$ = new BehaviorSubject<any>(SIDEMENU);
  public setDashboardBankingServices$ = new BehaviorSubject<any>([]);
  public setdashboardInvestment$ = new BehaviorSubject<any>([]);



  commonBehaviorObservable = this.commonBehaviorSource.asObservable();
  setThemeObservable = this.setThemeSource.asObservable();
  setThemebackgroundObservable = this.setThemebackgroundSource.asObservable();
  setThemeSidenavObservable = this.setThemeSidenavSource.asObservable();

  accountDigitLength = 14;
  regIsAtStep: number = 1;
  public subject = new Subject<any>();
  breadcrumblist:any = [{ 'currentRoute': 'dashboard', "routeName": '/dashboard' }];
  public disableBack: boolean;
  isCordovaAvailable = window.hasOwnProperty('cordova');
  platform: any = "android";
  checkLocationPermissions:any;
  networkSwitchedCount:any;
  activeSimCount
  simData:any;
  public latitude = null;
  public longitude = null;
  public userLocationName = null;
  //platform: any = "ios";
  informationLabel = "";
  informationDetails = "";
  primaryBtnText = "";
  maskRegisternumber = "";

  profileTypeModule:any= ''
  profileTabSelection = ''
  information = "";
  ipAddress = "";
  currentRoute:any;
  selectedCif: any;
  showMigrated: boolean = true;
  selectedCIFNo: string = "";
  email: any;
  isMigratedUser = false;
  userRegStaus: any;
  pendingAtToken: boolean = false;
  beneficiaryType: any;
   
  currentPageUrl: any;
  isLogOutOmni: boolean = false;
  isUPILogin = false;
  showDetails = false;

  isnliMoreService: boolean = false;


  isLoanRegistration: boolean = false;
  isContactsSyncEnabled = false;
  isContactSyncCompleted:any;
  updatedContacts:any;
  upiContactsList:any;
  mobileContacts = [];
  mobileContactsClone = [];
  timeoutHeader = '';
  timeoutMsg = '';
  errorMsg = '';
  serviceType: string = '';
  serviceUrl: string = '';
  serviceName_VALIDATEOTP = "OTP/VALIDATEOTP";
  serviceName_RESENDOTP = "OTP/RESENDOTP";
  isOTPValid: boolean = false;
  fromOmniLogin: boolean = false;
  isLoanAccount: boolean = false;
  isNRENRO: boolean = false;
  lastLoginDate: any;
  isOmniLogin = false;
  regBranchCode: any;
  registrationData: any;
  registrationSecQue: any;
  currentLat: any;
  currentLng:any;
  omniProfileName:any;
  primaryAccountDtl: any = '';
  customerID: string;
  tpinlength: any = 6;
  otplength: any = 6;
  otpName: any = 'OTP';
  dateFormat: any = 'dd MMM yyyy';
  amountFormat: any = "";
  mobStaticEncKey: any;
  customerCanTransferAccountList = [];
  customerLoanAccountList = [];
  customerMyDepostie = [];
  customerBorrowingsList = [];
  customerAccountList = [];
  customerOperativeAccList = [];
  recommendedCard = [];
  totalMyDepositBalance = 0;
  totalMyBorrowingsBalance = 0;
  totalMyOperativeBalance = 0;
  onRefreshDate: Date;
  loginType: any;
  userDetails: any;
  userProfile: any = "";
  profileImg: "";
  gotpage = "";
  LoginForm: any;
  loginFrom: any = "retail";
  regType: any = "";
  otpPreviousPage: any; //page to redirect when back event is called
  otpNextPage: any; //page to redirect on next page
  otpSessionPreviousPage: any; //page to redirect when back event is called
  otpSessionNextPage: any; //page to redirect on next page
  isLoggedIn = false;
  loginThemeName: string = "";    // Theme constant.
  themeName: string = "";
  themeBackground: string = "";
  themeSidenav: string = "";
  sideBarColor: string = "";

  profileEmailEdit:any
  emailIdProfile:any
  profiledateDetails: any = [];
  profileDetails: any;
  profileDetailsValue: any;
  profileImage: any = '';
  profileName: any;
  userLimits: any;
  userName = '';
  custName = '';
  communicationAddress:any
  errorResult: any = "";
  imageUploadSelected:any

  bezellessIphone:any
  updateLanguageCode: string = "";
  routefrom: string = '';

  notificationBadge: any = 0;
  headerType: string = "preloginHeader";
  imei: any;
  uuid: any;
  macAddress: any;
  devicemodel: any;
  osversion: any;
  recentTransData: any = {};
  timeFormat = "h:mm:ss a";
  mpin: string = "";
  accDetails: any;
  confmpin = '';

  accDetailsIdx: any;
  dashboardCustomizeMenuArr: any = [];
  ominiChannelParam: any = {};
  transactionReceiptObj = TRANSACTIONRECEIPTOBJ;
  profileEditObj = PROFILEEDITOBJ;
  regFeildData = REGFEILDDATA;
  profile: any = {};
  endPoint: string;
  screenType: string;
  editusername:any;
  authorizeHeader: string;
  request: string;
  receiptType: any = '';
  receiptmsg: any = "";
  receipdRefID: any = "";
  receiptTransactionDate: any;

  cityList = [];
  stateList = [];
  activitySettingData: any = [];
  debitCardIssuedData = "";
  isOTPMaxAttempts = false;
  referenceNo: any;
  refId: any;
  successFull:string="";
  successMsg:string ="";
  commonOtpServiceType: any;
  screenDetails: any;
  validateAddressResp: any;
  linkingMobileNumber: string;
  dellinkAccountnumber: any;

  withinBankPayeeList: any;
  outsideBankPayeeList: any;
  mmidBankPayeeList: any;
  vpainBankPayeeList: any;
  managePayeeToAddpayee = '';
  previousPageUrl: any;
  payeeDtl: any;
  isUPIInstantPay: boolean = false;
  instaSelectedTab = '';
  crmReferenceNumber: any = '';
  inwardchecklistvalue = [];
  inwardCheckDetails = [];
  //////////////////////Send Money ///////////////

  isFromAccountDetails = false;
  fundTransferTabType = 'self';
  receiptBackPage: any = ""; 
  managePayeeToFundTransferData: any = '';
  beneficiaryList = BENEFICIARYLIST;
  isAddPayeeFrompage: any;
  amntErrMsgMax = "Max transaction limit 2,00,000";          
  amntErrMsgMin = "Min transaction limit is 2,00,000";
  IMPSLimit = 200000;
  RTGSLimit = 200000;
  withInpayeeAddLimit = 200000;
  outsidePayeeAddLimit = 500000;
  feedbackType:string = '';
  transactionLimitAmount = "200000"

  ////////////// recent beneficiary ///////////
  isPayeeSelected = false;
  omniAllRecentPayeeList = [];

  ///////////// Manage Payee //////////////////
  bankTypeCode: string = "";
  paymentType: any = 'within';
  isEditPayee = false;
  isFromInstaRecipt: boolean = false;
  beneficiaryTypeValue: any;
  formType: any;
  
  //donation object
  payeeName: ''

  managePayeeToSend: any = {
    selected: ''
  }
  quickAccessFromDashboard = false;
  ///////////////////////////// billDESK //////////////////////////////////////////////
  electricBillObj = {
    custID: '',
    billerID: '',
    billername: ''
  }
  selectedNomineeAccNo = "";
  billerdata: any;
  billHistoryDetails: any
  unpaidbilldetail: any
  finalBilldata: any
  mobilePrepaidDetails: any;
  allregisteredBillerList: any = []
  allUnpaidBillerList: any = []
  finalRecentTransList: any = []
  bbpsBillerCategory: any = []
  newBillerArray: any
  complaintData: any;
  complainResponse: any;
  newBillerRegistraionResponse: any;
  searchProviderData: any;
  complaintbbpsrefNumber: any;
  bbpsPaymentType: any;
  billPaymentResponedJson: any
  addBillReminderData: any;
  billReminderValues: any;
  addbillerConfirmation: any;
  updatebillerConfirmation: any
  deletebillerConfirmation: any
  isComingfromRecept: boolean = false;
  bbpsReceiptDetails: any;
  bbpspaymentType: any;
  iscomingfromComplaint: boolean = false
  Complaintdetails: any = []
  isbbpsPage: boolean = false;
  isBillerBBPs: boolean = false
  SelectedBiller: any;
  payNowReminderData: any
  bbpsMobileNumber: any
  billtype:any;
  billcategory:any
  isComingFromReminderPayNow: Boolean = false
  PrepaidBillerList: any;
  fingerprintId: any = "adsfsdf";
  isbillerbbps: any;
  allComplaintList: any = [];
  rrnNo = "";
  billPayObj: any;
  isCardUpgrade: boolean = false;
  isUsernameChanged: boolean = false;
  billReminderList:any =[]
  isbbpsBiller:any;
  notificationArray = [];

  //////////////forgot password///////
  forgotPassUsername: any = "";
  forgotPassDtl: any;
  fromForgotMPIN = false;
  

  MMIdResp: any //MMID OTP RESP
  registrationObj: any = {
    MobileNo: '',
    oldPassword: '',
    password: '',
    userId: '',
    TPIN: '',
  }
  loginData = {
    "mobnumber": null,
    "tab": 'user'
  }

  custProfileStateCityObj: any = {
    state: '',
    city: '',
    stateId: '',
    cityId: ''
  }
  public componentchange: any = [];
  private messageSource = new BehaviorSubject(this.componentchange);
  currentMessage = this.messageSource.asObservable();

  /** My Account Declaration **/
  accTypeSelected: any = '';
  subAccTypeSelected: any = '';
  accountStatus : boolean = false ;

  listCountObj = {
    itemsPerPage: 10,
    currentPage: 1,
  }
  modeOfOpertion = MODEOFOPERATIONOBJ //model 

  /** LOAN Account */
  loanDetails: any;
  selLoanAccDtlNo: any;
  loanUserDtl: any;
  loanAmount: any;
  loanType = "";


  /****  ACCOUNTS MINISTATEMENT  ****/
  fromAccountInfo = false;
  totalLienAmount: any;
  lienAccSel: any;
  loanAccNo: any;
  fdrdNomineeName: any;
  fromAccInfoAccNumber: any = ''


  /********* OPEN FD RD  ******/
  openFDReceiptObj = OPEN_FD_RECEIPTOBJMODEL
  openRDReceiptObj = OPEN_RD_RECEIPTOBJMODEL
  closeFDObj  = CLOSE_FD_MODEL
  closeRDObj = CLOSE_RD_MODEL
  
  standingInstructionFlag: any = '';
  FDRDAccNumber: any = '';
  cbs_success_response: boolean = false;
  closeDepositType : any ;

  /********* NOMINEE DETAILS ******/
  nomineeType : any = ''
  minorFlagNominee: any;
  nomineeDetailsData: any = [];
  nomineeReceiptObj = NOMINEERECEIPTOBJ



  commonInputData() {
    return {
      [this.constant.key_entityId]: this.constant.getEntityId(),
      [this.constant.key_cbsType]: this.constant.val_cbsType,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_latitude]: this.latitude,
      [this.constant.key_longitude]: this.longitude,
      [this.constant.key_RRN]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_referenceNumber]: this.commonMethod.genRandomDigit(9),
      [this.constant.key_loginip]: this.ipAddress,
    }
  }
  
  commonInputDataBBPS() {
    return {
      [this.constant.key_entityId]: this.constant.val_entityId_BBPS,
      [this.constant.key_cbsType]: this.constant.val_cbsType,
      [this.constant.key_mobPlatform]: this.constant.val_mobPlatform,
      [this.constant.key_mobileAppVersion]: this.constant.val_mobileAppVersion,
      [this.constant.key_clientAppVersion]: this.constant.val_clientAppVersion,
      [this.constant.key_latitude]: this.latitude,
      [this.constant.key_longitude]: this.longitude,
      [this.constant.key_OSVERSION]: this.osversion,
      [this.constant.key_OS]: this.platform,
      [this.constant.key_deviceId]: this.storage.getLocalStorage("deviceId"),
    }
  }

  sendNotification(message: string) {
    this.subject.next({ text: message });
  }

  getNotification(): Observable<any> {
    return this.subject.asObservable();
  }

  buildForm(value:any) {
    var form ={}

        for(var i = 0;i < value.length; i++){
          var formarray = []
          if(value[i].hasOwnProperty("required") ){
            if(value[i].required == "Y"){
              formarray.push(Validators.required)
            }
          }
          if(value[i].hasOwnProperty("minLength")){
            formarray.push(Validators.minLength(value[i]?.minLength))
          }
          if(value[i].hasOwnProperty("maxLength")){
            formarray.push(Validators.maxLength(value[i]?.maxLength))
          }
          if(value[i].hasOwnProperty("regex")){
            formarray.push(Validators.pattern(value[i]?.regex))
          }
        form[value[i].fieldName ] = new FormControl('', formarray)
      }
        console.log(form)
        return  new FormGroup(form)
    

  }


  breadcrumroute(routeName) {
    // this.updateBreadcrumb(this.router.url, routeName)
    this.router.navigateByUrl('/' + routeName);
  }
  getBreadcrumb(currentRoute, routeName) {
   
    this.updateBreadcrumb(currentRoute, routeName)
    if (routeName != '') {
      // this.curruntURL.next(routeName);


      if (currentRoute == "sidenav" || currentRoute == "DASHBOARD") {

        if ('/' + routeName != this.router.url) {
          this.breadcrumblist = [{ 'currentRoute': 'DASHBOARD', "routeName": '/dashboard' }];
        }
      } else {
        var ind = -1
        ind = this.breadcrumblist.findIndex(function (person) {
          return person.routeName == routeName
        });
        if (ind == -1) {
          this.breadcrumblist.push({ 'currentRoute': currentRoute, "routeName": routeName })
        } else {
          this.breadcrumblist.splice(ind + 1, 1);
        }
      }
    
    }
  }

  updateBreadcrumb(currentRouteName, clickedRoute){
  
    var index = this.breadcrumblist.map((object:any) => object.routeName).indexOf(clickedRoute);
  
    
    if(index != -1){
      this.breadcrumblist.splice(index, this.breadcrumblist.length - index);
    }
    console.log("this.breadcrumblist" , this.breadcrumblist)
  }

  getAccountCarouselOptions() {
    var autowidth;
    if (window.innerWidth < 767) {
      autowidth = false
    } else {
      autowidth = true
    }

    let accountCarouselOptions: OwlOptions = {
      margin: 20,
      nav: false,
      autoplay: false,
      autoplayTimeout: 3000,
      loop: false,
      rewind: true,
      autoWidth: autowidth,
      dots: false,
      merge: true,
      items: 1,
      responsive: {
        0: {
          items: 1,
          nav: true,
          dots: true
        },
        600: {
          items: 3
        },
        900: {
          items: 3
        }

      }

    }
    return accountCarouselOptions;
  }

  getnliOfferCarouselOptions() {

    let nliOfferCarouselOptions: OwlOptions = {
      margin: 0,
      nav: false,
      autoplay: true,
      autoplayTimeout: 3000,
      loop: true,
      rewind: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      freeDrag: true,
      autoWidth: true,
      lazyLoad: true,
      dots: true,
      merge: true,
      items: 1,
      responsive: {
        0: {
          items: 1,
          nav: true,
          dots: true
        },
        600: {
          items: 3
        },
        900: {
          items: 3
        }

      }

    }
    return nliOfferCarouselOptions;
  }

  getLoginMobileServices() {

    let loginMobileServices: OwlOptions = {
      loop: false,
      nav: false,
      dots: true,
      margin: 20,
      merge: true,
      autoplay: false,
      navSpeed: 2000,
      responsive: {
        0: {
          items: 4,
          nav: false,
          dots: true
        },
        600: {
          items: 3
        },
        900: {
          items: 3
        }
      }

    }
    return loginMobileServices;

  }
  getAccountCarouselOptionsMobile() {

    let accountCarouselOptionsMobile: OwlOptions = {
      loop: false,
      nav: false,
      merge: true,
      dots: true,
      items: 1,
      autoplay: false,
      responsive: {
        0: {
          items: 1,
          nav: true,
          dots: true
        },
        600: {
          items: 3
        },
        900: {
          items: 3
        }
      }
    }
    return accountCarouselOptionsMobile;
  }
  getDashboardMobileServices(autowidth) {

    let dashboardMobileServices: OwlOptions = {
      loop: false,
      nav: false,
      dots: true,
      margin: 20,
      merge: false,
      autoplay: false,
      navSpeed: 2000,
      autoWidth: autowidth,

      responsive: {
        0: {
          items: 4,
          nav: false,
          dots: true
        },
        600: {
          items: 3
        },
        900: {
          items: 3
        }
      }

    }
    return dashboardMobileServices;

  }

  getrecommendedCardCarouselOptions() {
    let recommendedCardCarouselOptions = {
      autoWidth: false,
      loop: false,
      nav: true,
      merge: true,
      dots: true,
      autoplay: true,
      slideBy: 8,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        320: {
          items: 3,
        },
        600: {
          items: 8,
        }
      }

    }
    return recommendedCardCarouselOptions;
  }
  getrecommendedCardCarouselOptionsMobile() {

    let recommendedCardCarouselOptions3 = {
      autoWidth: true,
      loop: true,
      nav: false,
      merge: false,
      dots: true,
      autoplay: false,
      slideBy: 1,
      items: 1,
      // autoplayTimeout:3000,
      autoplayHoverPause: true,
      responsive: {
        320: {
          items: 1,
        },
        600: {
          items: 1,
        }
      }

    }
    return recommendedCardCarouselOptions3;
  }

  getrecentTransactionOption() {
    let recommendedCardCarouselOptions = {
      margin: 20,
      autoplay: false,
      autoplayTimeout: 3000,
      loop: false,
      rewind: true,
      autoWidth: true,
      dots: false,
      nav: false,

      items: 2
    }
    return recommendedCardCarouselOptions;
  }


  getinvestCarouselOptions() {
    let investCarouselOptions = {
      autoWidth: false,
      loop: false,
      nav: false,
      merge: true,
      dots: true,
      autoplay: false,
      items: 4

    }
    return investCarouselOptions;
  }

  getCustomizeMenuCarouselOptions() {
    let customizeMenuCarouselOptions = {
      autoWidth: true,
      loop: false,
      nav: true,
      merge: true,
      dots: true,
      autoplay: false,
      margin: 15,

      responsive: {
        0: {
          items: 1,
          nav: false,
          dots: false
        },
        600: {
          items: 2
        },
        900: {
          items: 8
        }
      }
    }
    return customizeMenuCarouselOptions;
  }

  getChannelType() {
    return this.constant.val_channelValueIB
  }

  routeWithNgZone(routeName) {
    this.ngZone.run(() => {
      this.router.navigate(['/' + routeName]);
    })
  }

  setDetails(details: any) {
    this.commonBehaviorSource.next(details);
  }


  /**
  * Setting theme using observable
  * @param themeName
  */
  setTheme(themeName: string) {
    this.setThemeSource.next(themeName);
  }
  setThemebackground(themeName: string) {
    this.setThemebackgroundSource.next(themeName);
  }
  setThemeSidenav(themeName: string) {
    this.setThemeSidenavSource.next(themeName);
  }


  getCurrentLatLong(countryCodeNeeded?: boolean): Observable<any> {
    var subject = new Subject<any>();
    let myObj = this;
    navigator.geolocation.getCurrentPosition(success, failure, { enableHighAccuracy: true })
    let self = this;
    function success(position) {
      console.log('MY CURRENT position', position);
      myObj.latitude = position.coords.latitude;
      myObj.longitude = position.coords.longitude;
      console.log("location lat long " + myObj.latitude + ":::" + myObj.longitude);
      if (countryCodeNeeded) {
        myObj.getReverseGeocodingData(myObj.latitude, myObj.longitude, subject, myObj)
      } else {
        subject.next(true);
        subject.complete();
      }
    }

    function failure(error) {
      console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
      subject.next(false);
      subject.complete();
    }

    return subject.asObservable();
  }

  getReverseGeocodingData(lat, lng, subject, myObj) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        subject.next(false);
        subject.complete();
        // alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results);
        var address = (results[0].formatted_address);
        myObj.address = address
        subject.next(true);
        subject.complete();
      }
    });
  }

  getUserLocationName(latitude, longitude): Observable<any> {
    var subject = new Subject<any>();
    let myObj = this;
    if (this.isCordovaAvailable) {
      nativegeocoder.reverseGeocode(success, failure, latitude, longitude);

      function success(result) {
        console.log('LOCATION RESULT => ', result);
        if (result[0]) {
          myObj.userLocationName = result[0].subLocality + ", " + result[0].locality + ", " + result[0].countryCode;
        } else {
          myObj.userLocationName = null;
        }
        subject.next(true);
        subject.complete();
      }

      function failure(error) {
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        subject.next(false);
        subject.complete();
      }
    } else {
      subject.next(true);
      subject.complete();
    }

    return subject.asObservable();
  }

  fetchTotalBalance(records, screen) {

    this.customerMyDepostie = [];
    this.customerBorrowingsList = [];
    this.customerOperativeAccList = [];

    this.totalMyDepositBalance = 0;
    this.totalMyBorrowingsBalance = 0;
    this.totalMyOperativeBalance = 0;

    records.forEach(el => {
      if (el.schemeDescription == 'My Deposits') {
        this.customerMyDepostie.push(el);
        this.totalMyDepositBalance = this.totalMyDepositBalance + parseFloat(el.acctBalance);
      }
      else if (el.schemeDescription == 'Operative Accounts') {
        this.customerOperativeAccList.push(el);
        this.totalMyOperativeBalance = this.totalMyOperativeBalance + parseFloat(el.acctBalance);
      }
      else if (el.schemeDescription == 'My Borrowings') {
        this.customerBorrowingsList.push(el);
        this.totalMyBorrowingsBalance = this.totalMyBorrowingsBalance + parseFloat(el.acctBalance);
      }
    });

    if (screen != "dashboard") {
      let _totalWorth: any = this.totalMyOperativeBalance + this.totalMyDepositBalance + this.totalMyBorrowingsBalance;
      var totalBal = this.totalMyOperativeBalance + this.totalMyDepositBalance;
      if (totalBal > (-this.totalMyBorrowingsBalance)) {
        return this.customCurrencyPipe.transform(_totalWorth.toString().trim(), 'decimal');
      } else {
        return " -" + this.customCurrencyPipe.transform(_totalWorth.toString().trim(), 'decimal');
      }
    } else {
      return
    }

  }

  getRecentTransactionList(recentTransaction) {
    let tempList = recentTransaction
    let counter = 1;
    for (let i = 0; i < tempList.length; i++) {
      if (counter == 1) {
        tempList[i]["color"] = "green1";
        counter++;
      } else
        if (counter == 2) {
          tempList[i]["color"] = "grey1";
          counter++;

        } else
          if (counter == 3) {
            tempList[i]["color"] = "red1";
            counter++;

          } else
            if (counter == 4) {
              tempList[i]["color"] = "greenlight";
              counter++;
            } else
              if (counter == 5) {
                tempList[i]["color"] = "yellow";
                counter = 1;
              }

    }
    recentTransaction = tempList;
    return recentTransaction;
  }

  getContactListColour(contactListData) {
    let tempList = contactListData
    let counter = 1;
    for (let i = 0; i < tempList.length; i++) {
      if (counter == 1) {
        tempList[i]["color"] = "green";
        counter++;
      } else
        if (counter == 2) {
          tempList[i]["color"] = "blue";
          counter++;

        } else
          if (counter == 3) {
            tempList[i]["color"] = "red";
            counter++;

          } else
            if (counter == 4) {
              tempList[i]["color"] = "yellow";
              counter = 1;
            }

    }
    contactListData = tempList;
    return contactListData;
  }


  setOmniChannelReqParam(key, param) {
    this.ominiChannelParam[key] = param;
  }

  resetTransactionObj() {
    for (var prop in this.transactionReceiptObj) {
      if (this.transactionReceiptObj.hasOwnProperty(prop)) {
        this.transactionReceiptObj[prop] = '';
      }
    }
  }


  /*** MODE OF OPERATION CHECK  */
  modeOperationCheck(operativeValues) {
    let temp = '';
    let temp2;
    console.log('Mode Operation :: ', this.modeOfOpertion.length)
    for (let i = 0; i < operativeValues.length; i++) {
      temp = operativeValues[i]['ModeOfOperation'];
      for (let j = 0; j < this.modeOfOpertion.length; j++) {
        if (temp == this.modeOfOpertion[j]['ModeOfOperation']) {
          temp2 = this.modeOfOpertion[j]['modeOfOperationType']
          break;
        }
      }
      operativeValues[i]['modeTypeValue'] = temp2;
    }
    console.log("MODE OF OPERATION :: ", operativeValues)

    return operativeValues;
  }

  /** COMMON ACCOUNT API CALL  **/

  getAccountListApiCall(data){
    this.fetchTotalBalance(data.set.records, "dashboard");
    this.customerMyDepostie = []; 
    this.customerOperativeAccList = []; 
    this.customerBorrowingsList;
    this.totalMyDepositBalance = 0; 
    this.totalMyOperativeBalance = 0; 
    this.totalMyBorrowingsBalance = 0;

    data.set.records.forEach(el => {
        if (el.accountType != "CAPPI") {
            if (el.SchemeCode == AccountType.FIXED_DEPOSITE_ACCOUNT) {
                this.customerMyDepostie.push(el);
                this.totalMyDepositBalance = this.totalMyDepositBalance + parseFloat(el.acctBalance);
            }
            else if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
                // el.AGSStatus = el["AGS Status"];
                this.customerOperativeAccList.push(el);
                this.totalMyOperativeBalance = this.totalMyOperativeBalance + parseFloat(el.acctBalance);
            }
            else if (el.SchemeCode == AccountType.LOAN_ACCOUNT) {
                this.customerBorrowingsList.push(el);
                this.totalMyBorrowingsBalance = this.totalMyBorrowingsBalance + parseFloat(el.acctBalance);
            }
        }
    });
    // this.onRefreshDate = new Date();
  }

}
