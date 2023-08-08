import { Component, OnInit, ViewChild, ElementRef, NgZone, ViewChildren } from '@angular/core';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { AppConstants } from '../../../../app.constant';
import { DataService } from '../../../../services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { Router, ActivatedRoute, ParamMap, NavigationStart } from '@angular/router';
import { ProfileDetailsService } from './profile-details.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { PluginService } from 'src/app/services/plugin-service';
import { Location } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileEditService } from '../profile-edit/profile-edit.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { CustomCurrencyPipe } from '../../../../pipes/custom-currency.pipe';
import { commonOtpModel } from 'src/app/model/common.model';
// import { ImageCroppedEvent } from 'ngx-image-cropper';
//import { LinkAccountService } from '../../link-delink-account/link-account/link-account.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Idle } from '@ng-idle/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import {  OTPINPUTMESSAGE } from './profile-details.model';
declare var $: any;
declare var rangeSlider: any;
declare var cordova: any;
declare var OSREC: any;
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit{
  maskedMobileNo: any;
  maskedEmailId: any;
  maskedAddharCard:any;
  icontype:any = 'info'
  maskedPanCard:any;
  otpfailMsg: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  limitsUpdateInfo: any = "";
  authMode = 'OTP';
  otpstart:boolean =false;
  OTPInputMessage:commonOtpModel = OTPINPUTMESSAGE;
  resendOtpLinkEmail: any;

  //@ViewChild(ProfileEditComponent) child: ProfileEditComponent;


  custAccountList: any = [];
  selectedAccount: any = [];
  accountList: any = [];
  lastLogin: any;
  emailId = "";
  receivedEmailId: any = "";
  url1 = "";
  profileImage: any = "";
  userName: any;
  custName: any;
  mobileNo = "";
  accNo = "";
  //accountNO="";
  showDetails = false;
  communicationAdd = "";
  permanentAdd = "";
  profileTypeModule = "";
  // platform:any;
  platform:any = 'web';
  storageMobileNo: any = '';
  fileToUpload: any;
  imageUrl: any;
  information:any;
  setlimitsview:any;
  addharCard: any = ""
  panCard: any = ""
  mbLimits: any = ""
  ibLimits: any = ""
  wbLimits: any = ""
  upiLimits: any = "";
  blLimits: any = "";
  billdeskLimits:any ="";
  amountText:any=""
  amountText1:any=""
  amountText2:any=""
  amountText3:any="";
  amountText4:any="";
  authType = "O";
  linkDelinkItem;
  type: any = "";
  mobileOtp:any;
  responsevalidate:any;
  responsevalid:boolean=false;
  linkDelinkList:any
  userInfo:any = "";
  buttonDisabled :boolean=true;
  otpName: string;
  tempDecryptedReq: any;
  invalidOtp: boolean;
  invalidOtpMsg: any;
  tpinAttempts: number;
  authModebuttonDisabled: boolean = true;
  kycStatus='';
  constructor(
    public constant: AppConstants,
    private router: Router,
    public dataService: DataService,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    private profileDtlsService: ProfileDetailsService,
    private domSanitizer: DomSanitizer,
    private commonMethod: CommonMethods,
    //private pluginService: PluginService,
    private ngZone: NgZone,
    private location: Location,
    private profileEditService: ProfileEditService,
    private customCurrencyPipe: CustomCurrencyPipe,
    public elem: ElementRef,
   // public linkAccService: LinkAccountService,
    public translatePipe: TranslatePipe,
    private dashboardService: DashboardService,
    private idle: Idle,
    private encryptDecryptService: EncryptDecryptService
     ) {
      this.getAuthType()
  }

  ngOnInit() {
  
    this.maskedMobileNo = this.maskCharacter(this.storage.getLocalStorage(this.constant.storage_mobileNo), 4);
    console.log('masked mobile number: ', this.maskedMobileNo);
    this.lastLogin = this.dataService.isCordovaAvailable ?  this.dataService.userDetails.mobileLastLogin  :  this.dataService.userDetails?.webLastLogin;


    //rangeSlider();
    this.setLimits();
    //this.dataService.setPageSettings('PROFILE_DETAILS');
    this.initialize();
    this.accountList = this.dataService.customerOperativeAccList;
    console.log("accountlist======", this.accountList);
    this.authMode = this.dataService.otpName;

    this.custAccountList = this.dataService.customerAccountList;
    console.log("list======", this.custAccountList);
    //this.getUpdateKycStatus();  When KYC functionality is required


    this.mobileNo = this.dataService.userDetails.MobileNo;
    this.userName = this.storage.getLocalStorage(this.constant.storage_username);
    console.log("this.userName =====>",this.userName);
    this.platform = this.constant.getPlatform();

    setTimeout(() => {
      const inputElements = document.querySelectorAll('[type="range"]');

      const handleInput = (inputElement) => {
        let isChanging = false;

        const setCSSProperty = () => {
          const percent =
            ((inputElement.value - inputElement.min) /
            (inputElement.max - inputElement.min)) *
            100;
          // Here comes the magic 🦄🌈
          inputElement.style.setProperty("--webkitProgressPercent", `${percent}%`);
        }

        // Set event listeners
        const handleMove = () => {
          if (!isChanging) return;
          setCSSProperty();
        };
        const handleUpAndLeave = () => isChanging = false;
        const handleDown = () => isChanging = true;

        inputElement.addEventListener("mousemove", handleMove);
        inputElement.addEventListener("mousedown", handleDown);
        inputElement.addEventListener("mouseup", handleUpAndLeave);
        inputElement.addEventListener("mouseleave", handleUpAndLeave);
        inputElement.addEventListener("click", setCSSProperty);

        // Init input
        setCSSProperty();
      }

      inputElements.forEach(handleInput)
    }, 1000);
    //TODO: commented on 19-1-23 due to slowness issue and no use by sarfaraj
    // this.fetchLinkDelinkAccountList();
    this.dataService.otpSessionPreviousPage = this.router.url;
  }

  /**
   * function on page initialize
   */
  initialize() {
 //  this.dataService.setPageSettings('PROFILE');
    console.log("this.dataService.profileDetailsValue ===>" ,this.dataService.profileDetailsValue)
    if(this.dataService.profileDetailsValue){
      this.renderData(this.dataService.profileDetailsValue)
    }else{
    this.getProfileDetails();
    }
    console.log(this.dataService.userDetails)
    this.linkDelinkItem=this.dataService.userDetails
    this.storageMobileNo = this.storage.getLocalStorage(this.constant.storage_mobileNo);
  }

  /**
     * function to navigate to next page
     * @location
     */
  routeTo(location) {
    this.router.navigate([location]);
  }


renderData(data){
  
  var resp = data.responseParameter
  var responseData = data.listofDataset[0].records;
  var responseDataParameter = data.responseParameter
  var limitsData = data.listofDataset[1].records;
  this.mobileNo = !this.commonMethod.validateEmpty(responseData[0].mobileNo) ? responseData[0].mobileNo : '-';
  this.emailId = !this.commonMethod.validateEmpty(responseData[0].emailId) ? responseData[0].emailId : '-';
  this.custName = !this.commonMethod.validateEmpty(responseData[0].custName) ? responseData[0].custName : '-';
  this.accNo = this.dataService.primaryAccountDtl.sbAccount;
  this.communicationAdd = (responseData[0].add1 + ', ' + responseData[0].add2 + ", " + this.dataService.custProfileStateCityObj.city +" "+ this.dataService.custProfileStateCityObj.state+ ", " + responseData[0].pin).replace(", ,", ",");

  this.permanentAdd = (responseData[0].permenantAdd1 + ', ' + responseData[0].permenantAdd2 + ", "+ responseData[0].permenantStateCode + ", "+ responseData[0].permenantCityCode + ", "+ responseData[0].permenantPin) == ', , , , ' ? '-'
                  :  (responseData[0].permenantAdd1 + ', ' + responseData[0].permenantAdd2 + ", "+ this.dataService.custProfileStateCityObj?.permenantCity + ", "+ this.dataService.custProfileStateCityObj?.permenantState + ", "+ responseData[0].permenantPin).replace(", ,", ",");

  this.addharCard = !this.commonMethod.validateEmpty(responseData[0].aadharNumber) ? responseData[0].aadharNumber : '-';
  this.panCard = !this.commonMethod.validateEmpty(responseData[0].panNumber) ? responseData[0].panNumber : '-';
  this.maskedEmailId = this.maskCharacter(this.emailId, 12);
  this.maskedAddharCard=this.maskCharacter(this.addharCard,4);
  this.maskedPanCard=this.maskCharacter(this.panCard,4);

  this.dataService.userName = resp.userName;
   this.storage.setLocalStorage("username", resp.userName);

  // this.dataService.userName = resp.userName;
  if (resp?.base64Image != "")
    this.dataService.profileImage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + resp?.base64Image);
  else
    this.dataService.profileImage = ""

  this.dataService.setDetails({ 'profileImg': 'data:image/png;base64,' + resp?.base64Image, 'username': this.userName, 'emailId': this.emailId });
  this.showDetails = true;
  this.dataService.profileDetails = responseData


}

  /**
   * function to get profile details and display
   * api call for frofile
   */
  getProfileDetails() {

    let param = this.profileDtlsService.getProfileDetailsParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CUSTPROFILEDETAILS).subscribe(data => {
      console.log("data of  getProfileDetails " + JSON.stringify(data));
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        this.renderData(data)
        
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    });
  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(subActionId, resp) {
    console.log(resp);
    if (resp.opstatus == "02") {
     // showToastMessage(resp.Result, "error");
    }
  }

  goToPage(routeName, routeType) {
    this.dataService.profileTabSelection = routeType;
    console.log("Tab Selection in Profile details :: ", routeType)

    this.router.navigateByUrl('/' + routeName);
  }

  profileEdit(profileEditValue) {
    this.dataService.profileTypeModule = profileEditValue
    this.routeTo('editProfile')
  }

  backToProfile(event) {
    this.profileTypeModule = event
  }

  closePopup() {
    this.commonMethod.closeAllPopup()
  }

  _closePopup(popupName) {
   
    this.authModebuttonDisabled = true
    this.commonMethod.closePopup(popupName);
  }


  onAccountNoChange() {
    var accountNO;
    $('radio[name="account"]').change(function () {
      accountNO = this.value;
    });

  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url1 = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }



  ibchange(event) {
    console.log(event);
    console.log(event.target.value)
    this.ibLimits.custSetlimit = event.target.value
    // this.amountText = '₹'+this.ibLimits.custSetlimit
    this.amountText = OSREC.CurrencyFormatter.format(this.ibLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
    var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;
  }

  IBblur()
  {
    this.amountText = OSREC.CurrencyFormatter.format(this.ibLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
  }

  mbchange(event) {
    console.log(event.target.value)
    this.mbLimits.custSetlimit = event.target.value
    // this.amountText1 = '₹'+this.mbLimits.custSetlimit
    this.amountText1 = OSREC.CurrencyFormatter.format(this.mbLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
    var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;
  }

  blchange(event) {
    console.log(event.target.value)
    this.blLimits.custSetlimit = event.target.value
    // this.amountText1 = '₹'+this.mbLimits.custSetlimit
    this.amountText4 = OSREC.CurrencyFormatter.format(this.blLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
    var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;
  }

  MBblur()
  {
    this.amountText1 = OSREC.CurrencyFormatter.format(parseFloat(this.mbLimits.custSetlimit.replace(/,/g, '')), { currency: 'INR', symbol: '₹' });
  }

  BLblur()
  {
    this.amountText4 = OSREC.CurrencyFormatter.format(parseFloat(this.blLimits.custSetlimit.replace(/,/g, '')), { currency: 'INR', symbol: '₹' });
  }

  upichange(event) {
    console.log(event.target.value)
    this.upiLimits.custSetlimit = event.target.value
      // this.amountText2 = '₹'+this.upiLimits.custSetlimit
     this.amountText2 = OSREC.CurrencyFormatter.format(this.upiLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
    var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;
  }

  UBblur()
  {
    this.amountText2 = OSREC.CurrencyFormatter.format(parseFloat(this.upiLimits.custSetlimit.replace(/,/g, '')), { currency: 'INR', symbol: '₹' });
  }

  focusRangeSlider(el, type ){
    // var lasttrim = el.substr(-2);
    // if (lasttrim == "00") {
    //   this.amountText = el.substr(0, el.length - 3)
    // }

    switch(type){
      case 'internetBanking':
        this.amountText = this.amountText.replace(/^\₹|,|\.\d*$/gm, '')

        break;

      case 'mobileBanking':
        this.amountText1 = this.amountText1.replace(/^\₹|,|\.\d*$/gm, '')
        break;

      case 'upiTransaction':
          this.amountText2 = this.amountText2.replace(/^\₹|,|\.\d*$/gm, '')
          break;

      case 'watchBanking':
          this.amountText3 = this.amountText3.replace(/^\₹|,|\.\d*$/gm, '')
          break;
      case 'bbpslimitBanking':
          this.amountText4 = this.amountText4.replace(/^\₹|,|\.\d*$/gm, '')
          break;
    }

    // alert(this.amountText)
  }

  wbchange(event) {
    console.log(event.target.value)
    this.wbLimits.custSetlimit = event.target.value
    // this.amountText3 = '₹'+this.wbLimits.custSetlimit
    this.amountText3 = OSREC.CurrencyFormatter.format(this.wbLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
    var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;
  }

  WBblur()
  {
    this.amountText3 = OSREC.CurrencyFormatter.format( parseFloat(this.upiLimits.custSetlimit.replace(/,/g, '')), { currency: 'INR', symbol: '₹' });
  }

  selectImage(){
    this.commonMethod.openPopup('div.popup-bottom.profile-dtl');
  }





  sliderInput(event)
  {


    var amoutVal = this.amountText.replace('₹','')
    console.log(amoutVal)
    if(parseFloat(amoutVal.replace(/,/g, '')) <= +this.ibLimits.maxAmount)
    {

      // this.ibLimits.custSetlimit = parseFloat(amoutVal.replace(/,/g, ''))
      // $(".maxmin").val("₹"+amoutVal)
      // $('.maxmin').autoNumeric('init', { aSign: "₹ " });

      this.ibLimits.custSetlimit = amoutVal;
    }

     else if(amoutVal == ''){
      this.ibLimits.custSetlimit = 0;
     }else{

      this.ibLimits.custSetlimit = this.ibLimits.maxAmount
      this.amountText = this.ibLimits.custSetlimit
      $(".maxmin").val("₹"+this.ibLimits.maxAmount)
      // $('.maxmin').autoNumeric('init', { aSign: "₹ " });
     // showToastMessage("Transaction Limit can not exceed "+this.ibLimits.maxAmount)
     }

     var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;

     if(this.amountText=="")
     $(".maxmin").val("₹");
     else
     {
      if(this.amountText.indexOf(".")<0)
      $(".maxmin").val("₹"+this.amountText.replace('.',''))
     }
  }



  sliderInput1(event)
  {
    var amoutVal = this.amountText1.replace('₹','')
    if(parseFloat(amoutVal.replace(/,/g, '')) <= +this.mbLimits.maxAmount)
    {
      this.mbLimits.custSetlimit = amoutVal

    }
    else if(amoutVal == ''){
      this.mbLimits.custSetlimit = 0;
     }
     else
     {
      this.mbLimits.custSetlimit = this.mbLimits.maxAmount
      this.amountText1 = this.mbLimits.custSetlimit
      $(".maxmin1").val("₹"+this.mbLimits.maxAmount)
      //showToastMessage("Transaction Limit can not exceed "+this.mbLimits.maxAmount)
     }

     var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;

     if(this.amountText1=="")
     $(".maxmin1").val("₹")
     else
     {
      if(this.amountText1.indexOf(".")<0)
      $(".maxmin1").val("₹"+this.amountText1.replace('.',''))
     }
  }

  sliderInput2(event)
  {
    var amoutVal = this.amountText2.replace('₹','')
    if(parseFloat(amoutVal.replace(/,/g, '')) <= +this.upiLimits.maxAmount)
    {
      this.upiLimits.custSetlimit = amoutVal

    }

    else if(amoutVal == ''){
      this.upiLimits.custSetlimit = 0;
     }else{
      this.upiLimits.custSetlimit = this.upiLimits.maxAmount
      this.amountText2 = this.upiLimits.custSetlimit
      $(".maxmin2").val("₹"+this.upiLimits.maxAmount)
      //showToastMessage("Transaction Limit can not exceed "+this.upiLimits.maxAmount)
     }

     var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;

     if(this.amountText2=="")
     $(".maxmin2").val("₹")
     else
     {
      if(this.amountText2.indexOf(".")<0)
      $(".maxmin2").val("₹"+this.amountText2.replace('.',''))
     }
  }

  sliderInput3(event)
  {
    var amoutVal = this.amountText3.replace('₹','')
    if(parseFloat(amoutVal.replace(/,/g, '')) <= +this.wbLimits.maxAmount)
    {
      this.wbLimits.custSetlimit = amoutVal

    }
    else if(amoutVal == ''){
      this.wbLimits.custSetlimit = 0;
     }
     else
     {
      this.wbLimits.custSetlimit = this.wbLimits.maxAmount
      this.amountText3 = this.wbLimits.custSetlimit
      $(".maxmin3").val("₹"+this.wbLimits.maxAmount)
      //showToastMessage("Transaction Limit can not exceed "+this.wbLimits.maxAmount)
     }

     var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;

     if(this.amountText3=="")
     $(".maxmin3").val("₹")
     else
     {
      if(this.amountText3.indexOf(".")<0)
      $(".maxmin3").val("₹"+this.amountText3.replace('.',''))
     }
  }

  sliderInput4(event)
  {
    var amoutVal = this.amountText4.replace('₹','')
    if(parseFloat(amoutVal.replace(/,/g, '')) <= +this.blLimits.maxAmount)
    {
      this.blLimits.custSetlimit = amoutVal

    }
    else if(amoutVal == ''){
      this.blLimits.custSetlimit = 0;
     }
     else
     {
      this.blLimits.custSetlimit = this.blLimits.maxAmount
      this.amountText4 = this.blLimits.custSetlimit
      $(".maxmin4").val("₹"+this.blLimits.maxAmount)
      //showToastMessage("Transaction Limit can not exceed "+this.mbLimits.maxAmount)
     }

     var amt = parseInt(this.amountText.replace('₹',''))
     var amt1 = parseInt(this.amountText1.replace('₹',''))
     var amt2 = parseInt(this.amountText2.replace('₹',''))
     var amt3 = parseInt(this.amountText3.replace('₹',''))
     var amt4 = parseInt(this.amountText4.replace('₹',''))
     if(amt>=0 && amt1>=0 && amt2>=0 && amt3>=0 && amt4>=0)
     this.buttonDisabled=false;
     else
     this.buttonDisabled=true;

     if(this.amountText1=="")
     $(".maxmin4").val("₹")
     else
     {
      if(this.amountText1.indexOf(".")<0)
      $(".maxmin4").val("₹"+this.amountText1.replace('.',''))
     }
  }

  goBack(){
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.router.navigateByUrl('/dashboardMobile');
    }
  }


setLimits(){
    var param = this.profileDtlsService.limitsView();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ADDLIMITMASTERDETAILS).subscribe(data => {
      console.log(data);
       this.setlimitsview=data.set.records;
       console.log("setlimitsview", this.setlimitsview)
       this.setlimitsview.forEach(element => {
        if (element.limitName == "MOBILELIMIT")
            {this.mbLimits = element
              // this.amountText1 = '₹'+ this.mbLimits.custSetlimit
              this.amountText1 =  OSREC.CurrencyFormatter.format(this.mbLimits.custSetlimit, { currency: 'INR', symbol: '₹' });

            }
          else if (element.limitName == "IBLIMIT")
            {this.ibLimits = element
            //  this.amountText = '₹'+ this.ibLimits.custSetlimit
            this.amountText =  OSREC.CurrencyFormatter.format(this.ibLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
            }
          else if (element.limitName == "WATCHLIMIT")
            {this.wbLimits = element
              // this.amountText3 = '₹'+ this.wbLimits.custSetlimit
              this.amountText3 = OSREC.CurrencyFormatter.format(this.wbLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
            }
          else if (element.limitName == "UPILIMIT")
            {this.upiLimits = element
              // this.amountText2 = '₹'+ this.upiLimits.custSetlimit
              this.amountText2 =  OSREC.CurrencyFormatter.format(this.upiLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
              // OSREC.CurrencyFormatter.format(this.upiLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
            }
          else if (element.limitName == "BBPSLIMIT")
            {this.blLimits = element
              // this.amountText2 = '₹'+ this.upiLimits.custSetlimit
              this.amountText4 =  OSREC.CurrencyFormatter.format(this.blLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
              // OSREC.CurrencyFormatter.format(this.upiLimits.custSetlimit, { currency: 'INR', symbol: '₹' });
            }
       });

      var resp = data.responseParameter;
      if (resp.opstatus == "00") {

        //  this.result = data.responseParameter.Result;
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    })
  }

  isChangeTransLimit:boolean
   addLimitsss(isChangeTransLimit:any){
    this.isChangeTransLimit = isChangeTransLimit ? true : false
    this.OTPInputMessage.headerMsg =   this.dataService.otpName + "_VERIFICATION"
    this.OTPInputMessage.subHeaderMsg = this.translatePipe.transform('PLEASE_ENTER_SIX_DIGIT_MOBILE_OTP') +' ' + this.maskedMobileNo;
    this.OTPInputMessage.mobStaticEncKey =  this.storage.getSessionStorage(this.constant.val_sessionKey)
    this.OTPInputMessage.otpSendEndpint = this.constant.serviceName_RESENDOTPSESSION
    this.OTPInputMessage.authType =  this.dataService.otpName
    this.OTPInputMessage.showCloseButton = true


    if(this.isChangeTransLimit){
    this.OTPInputMessage.serviceType = this.constant.val_UPDATETRANSATIONLIMIT
    this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_ADDLIMITS
    this.OTPInputMessage.params = this.profileDtlsService.addLimitsNew(this.ibLimits.custSetlimit,this.mbLimits.custSetlimit,this.upiLimits.custSetlimit,this.wbLimits.custSetlimit,this.blLimits.custSetlimit);
    this.OTPInputMessage.otpkeyName = "value"
    
  }else{

      this.OTPInputMessage.serviceType = "AuthMode"
      this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_UPDATETOKENFORCUSTOMER
      this.OTPInputMessage.showCloseButton = true,
      this.OTPInputMessage.params = this.profileDtlsService.getSaveAuthenticationMode(this.authType)
    }
    if(this.otpName == 'OTP')
    {
      this.otpstart = true;
     // this.getResendOTPSession()
    }
   }





  openPopup(popupName) {
    this.commonMethod.openPopup('div.popup-bottom.' + popupName);
  }

  maskCharacter(str, n) {
    // Slice the string and replace with
    // mask then add remaining string
    return ('' + str).slice(0, -n).replace(/./g, 'X') + ('' + str).slice(-n);
  }

  ngOnDestroy(){
   
  }

  closeLimitPopup() {
    this.commonMethod.closeAllPopup();
    this.limitsUpdateInfo = "";
  }


getAuthType(){
    this.otpName = "OTP";
    var objCheckFlag = this.dataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.constant.serviceName_ADDLIMITMASTERDETAILS.split('/')[1]);
    if(objCheckFlag == -1){
      return;
    }
    switch (this.dataService.otpName) {
      case 'TPIN':
        if (this.dataService.activitySettingData[objCheckFlag].TPINALLOWD == 'Y') {   /*when activitysetting enable for TPIN then uncomment this code*/
          this.otpName = this.dataService.otpName
          console.log(this.otpName)
        }
        break;
      case 'SOFT_TOKEN':
        if (this.dataService.activitySettingData[objCheckFlag].SOFTTOKENALLOWED == 'Y') { /*when activitysetting enable for Softtoken then uncomment this code*/
          this.otpName = this.dataService.otpName
          console.log(this.otpName)
        }
        break;
      case 'HARD_TOKEN':
        if (this.dataService.activitySettingData[objCheckFlag].HARDTOKENALLOWED == 'Y') { /*when activitysetting enable for Hardtoken then uncomment this code*/
          this.otpName = this.dataService.otpName
          console.log(this.otpName)
        }
        break;
      default:
        this.otpName = "OTP";
        console.log(this.otpName)
  }
}

  selModeAuth(type) {
    let compare = (type==='O')?'OTP':'TPIN'
    if (this.dataService.otpName != compare) {
      this.authModebuttonDisabled = false;
      this.authType = type;
    }else this.authModebuttonDisabled = true;
  }

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}

imageLoaded() {
    // show cropper
}
cropperReady() {
    // cropper ready
}
loadImageFailed() {
    // show message
}

close(){
  this.commonMethod.closeAllPopup() ;
}

  updateKyc(){
    this.router.navigateByUrl('/profileReKyc');
    this._closePopup('div.popup-bottom.kyc-expire-popup')
  }

  getUpdateKycStatus(){
    var param = this.profileDtlsService.getRekycParam(this.storage.getLocalStorage(this.constant.storage_username),this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param,this.storage.getLocalStorage(this.constant.storage_deviceId),this.constant.serviceName_GETCUSTREKYCSTATUS).subscribe(data=>{
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        switch(resp.kycCompleted.toUpperCase()){
          case 'N':
            this.kycStatus = 'valid';
            break;
          case 'G':
            this.kycStatus = 'pending';
            this.commonMethod.openPopup('div.popup-bottom.kyc-expire-popup');
            break;
          case 'Y':
            this.kycStatus = 'expired';
            this.commonMethod.openPopup('div.popup-bottom.kyc-expire-popup');
            break;
        }
      }else{
      }
    });

  }

    
  GetOtpPopData(data){
    var resp = data.responseParameter;
    if (resp.opstatus == '00') {
      this.icontype =  "success"
      this.otpstart = false;
      if(this.isChangeTransLimit){
      this.limitsUpdateInfo =  "LIMITS_UPDATED_SUCCESS"
      this.buttonDisabled = true
      }else{
        
        this.authModebuttonDisabled = true;
        this.limitsUpdateInfo = this.translatePipe.transform('AUTHENTICATION_UPDATED_SUCCESSFULLY');
        this.icontype = 'success'
        if(this.authType == "T"){
          this.dataService.otpName = 'TPIN'
        }
        else if(this.authType == "S"){
          this.dataService.otpName = 'SOFT_TOKEN'
        }
        else if(this.authType == "H"){
          this.dataService.otpName = 'HARD_TOKEN'
        }
        else if(this.authType == "O"){
          this.dataService.otpName = 'OTP'
        }
        console.log(data.responseParameter);
        this.getAuthType()
        
      }
      this.commonMethod.openPopup('div.popup-bottom.profile-limit-info');
    }else if(data = "closepop"){}
    else{
      if(this.isChangeTransLimit){
        this.icontype =  "info"
          this.limitsUpdateInfo =  "ERROR_UPDATE_LIMIT"
        } 
      this.otpstart = false;
      this.commonMethod.openPopup('div.popup-bottom.profile-limit-info');
    }
   
 } 



 
// ################## MOBILE PLUG FUNCTION ############################   Uncomment while integrating MB




// openGalleryIos(){
//   var self = this;
//   self.pluginService.openCameraGallery().then((fileUri) => {
//     console.log("ios fileUri");
//     self.dataService.imageUploadSelected = true;
//     self.ngZone.run(() => {
//       if(this.dataService.bezellessIphone) {
//         $("#mainDiv").removeClass("pre-login");
//       }
//     });
//     self.pluginService.cropImage(fileUri).then((fileUri) => {
//       if (fileUri) {
//         self.commonMethod._getResizeBase64(fileUri).then((base64Image) => {
 

//           var param = self.profileDtlsService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, base64Image);
//           self.http.callBankingAPIService(param, self.storage.getLocalStorage(self.constant.storage_deviceId), self.constant.serviceName_CUSTPROFILEIMGUPDATE).subscribe(data => {
//             var resp = data.responseParameter
//             if (resp.opstatus == "00") {
//               console.log("======  It is working ========");
//               self.dataService.profileImage = this.domSanitizer.bypassSecurityTrustUrl(base64Image);
//             } else {
//             }
//           });
//         });
//       }
//     }, (err) => {
//       console.log(err);
//     });
//   }, (err) => {
//     console.log(err);
//   })
// }



/**
 * Take photo from camera and crop image and update profile picture in UPI
 */




// takePhoto() {
//   var self = this;
//   self._closePopup('div.popup-bottom.profile-dtl');
//   cordova.plugins.diagnostic.requestCameraAuthorization(function (status) {
//     switch (status) {
//       case cordova.plugins.diagnostic.permissionStatus.GRANTED:
//         self.pluginService.openCamera().then((result) => {
//           console.log(result);
//           self.pluginService.cropImage(result).then((fileUri) => {
//             if (fileUri) {
//               console.log("fileUri 2 ==>" + fileUri);
//               self.commonMethod._getResizeBase64(fileUri).then((base64Image) => {
//                 var param = self.profileDtlsService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, base64Image);
//                 self.http.callBankingAPIService(param, self.storage.getLocalStorage(self.constant.storage_deviceId), self.constant.serviceName_CUSTPROFILEIMGUPDATE).subscribe(data => {
//                   var resp = data.responseParameter
//                   if (resp.opstatus == "00") {
//                     self.dataService.profileImage = base64Image;
//                   } else {
//                   }
//                 }); 
//               });
//             }
//           }, (err) => {
//             console.log(err);
//           });
//         }, (error) => {
//           console.error('camera ', error);
//         });
//         break;
//       case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
//         self.ngZone.run(() => {
//           self.information = 'ENABLE_CAMERA_PERMISSION_MSG';
//           self.commonMethod.openPopup('div.popup-bottom.camera-info');
//         });
//         return;
//       default:
//         break;
//     }
//   }, function (error) {
//     console.error(error);
//   });

// }

  /**
   * Select image from gallery and crop image in UPI for profile image upload
   */


  // selectImageFromGallery() {
  //   console.log("selectImageFromGallery");
  //   var self = this;
  //   self._closePopup('div.popup-bottom.profile-dtl');

  //   if (this.dataService.platform.toLowerCase() == this.constant.val_android) {
  //     cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (status) {
  //       switch (status) {
  //         case cordova.plugins.diagnostic.permissionStatus.GRANTED:
  //           self.pluginService.checkImagePickerReadPermission().subscribe((isPermissionAvailable) => {
  //             if (isPermissionAvailable) {
  //               self.pluginService.pickImage().subscribe((filePath) => {
  //                 self.pluginService.cropImage(filePath).then((fileUri) => {
  //                   console.log("fileUri", fileUri);
  //                   if (fileUri) {
  //                     self.commonMethod._getResizeBase64(fileUri).then((base64Image) => {
  //                       // var param = self.profileDtlsService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, base64Image);
  //                       // self.dataService.request = param;
  //                       // self.dataService.endPoint = self.constant.serviceName_CUSTPROFILEUPDATE;
  //                       // self.dataService.authorizeHeader = "Profile Update";
  //                       // self.dataService.screenType = 'profileUpdate';
  //                       // this.router.navigate(['/otpSession']);

  //                       var param = self.profileDtlsService.getProfileImageParam(self.emailId, self.userName, self.communicationAdd, base64Image);
  //                       self.http.callBankingAPIService(param, self.storage.getLocalStorage(self.constant.storage_deviceId), self.constant.serviceName_CUSTPROFILEIMGUPDATE).subscribe(data => {
  //                         var resp = data.responseParameter
  //                         if (resp.opstatus == "00") {
  //                           self.dataService.profileImage = base64Image;
  //                         } else {
  //                         }
  //                       });
  //                     });
  //                   }
  //                 }, (err) => {
  //                   console.log(err);
  //                 });
  //               });
  //             }
  //           });
  //           break;
  //         // case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
  //         //   window['imagePicker'].requestReadPermission();
  //         //   break;
  //         case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
  //           self.ngZone.run(() => {
  //             self.information = 'ENABLE_STORAGE_PERMISSION_MSG';
  //             self.commonMethod.openPopup('div.popup-bottom.camera-info');
  //           })
  //           // case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
  //           //   window['imagePicker'].requestReadPermission();
  //           //   break; self.commonMethods.openPopup('div.popup-bottom.camera-info');
  //           break;
  //         default:
  //           break;
  //       }
  //     }, function (error) {
  //       console.error(error);
  //     });
  //   } else if (this.dataService.platform.toLowerCase() == this.constant.val_ios) {
  //     this.getGalleryAccessStatusIos();
  //   } else {
  //     console.log("unknown platform..");
  //   }

  //   // window['imagePicker'].requestReadPermission();

  // }






  // getGalleryAccessStatusIos() {
  //   let self = this;
  //   cordova.plugins.diagnostic.getCameraRollAuthorizationStatus(function(status){
  //     console.log('getCameraRollAuthorizationStatus = ', status);
  //     switch(status){
  //       case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
  //         console.log("Permission not requested");
  //         self.requestCameraRollAccessIos();
  //       break;
  //       case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
  //         console.log("Permission denied");
  //         //TODO: go to settings
  //         self.ngZone.run(() => {
  //           self.information = 'ENABLE_PHOTOS_PERMISSION_MSG';
  //           self.commonMethod.openPopup('div.popup-bottom.header-info');
  //         });
  //         break;
  //       case cordova.plugins.diagnostic.permissionStatus.GRANTED:
  //         console.log("Permission granted, opening gallery");
  //         self.openGalleryIos();
  //       break;
  //       default:
  //         console.log("Default => ", status);
  //       break;
  //     }
  //   }, function(error){
  //       console.error("The following error occurred: "+error);
  //   });
  // }

  // requestCameraRollAccessIos() {
  //   let self = this;
  //   cordova.plugins.diagnostic.requestCameraRollAuthorization(function(status){
  //     console.log("Authorization request for camera roll was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
  //     if(status == cordova.plugins.diagnostic.permissionStatus.GRANTED) {
  //       self.openGalleryIos();
  //     } else {
  //       self.getGalleryAccessStatusIos();
  //     }
  //   }, function(error){
  //       console.error(error);
  //   });
  // }











}


  

 

