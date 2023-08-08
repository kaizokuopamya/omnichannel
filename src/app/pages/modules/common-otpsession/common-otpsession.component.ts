import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OtpSessionService } from './common-otpsession.service';
import { Subscription, timer } from 'rxjs';
import { AccountType } from 'src/app/enum/app-enum';
declare var showToastMessage: any;

@Component({
  selector: 'app-common-otpsession',
  templateUrl: './common-otpsession.component.html',
  styleUrls: ['./common-otpsession.component.scss']
})
export class CommonOtpsessionComponent implements OnInit {
  @ViewChildren('OTPFormRow') otpPinRows: any;
  otpName: string = "OTP";
  mobNumber: any;
  platform: any;
  inputtype:any
  otpSessionForm: FormGroup;
  otpFormInput:any = [] ;
  type: any = "";
  invalidOtp: boolean;
  invalidOtpMsg: any;
  tpinAttempts: any;
  counter = 120;
  tick = 1000;
  countDown: Subscription;
  tempDecryptedReq: any;
  keys = Object.keys;
  screenDetails: any;
  message: any = '';
  todayDateTimedisplay: any;
  public formErrors = {
    otp: '',
  };

  //listner for all focusout event
  @HostListener('focusout')
  onBlur() {
    //call form validarion on focus out
    this.formErrors = this.formValidation.validateForm(
      this.otpSessionForm,
      this.formErrors,
      true
    );
  }

  constructor(private router: Router,
    private formValidation: FormValidationService,
    private form: FormBuilder,
    public dataService: DataService,
    private http: HttpRestApiService,
    public constant: AppConstants,
    private storage: LocalStorageService,
    public commonMethod: CommonMethods,
    private encryptDecryptService: EncryptDecryptService,
    private datepipe: DatePipe,
    private location: Location,
    private translatePipe: TranslatePipe,
    private otpSessionService: OtpSessionService,
  ) {

  }

  ngOnInit() {
    this.platform = this.constant.getPlatform();
    if(this.platform == "web"){
      this.inputtype = "password"
    }else{
      this.inputtype = "tel"
    }
    this.otpName = this.dataService.otpName;
    this.type = this.dataService.commonOtpServiceType;
    this.screenDetails = this.dataService.screenDetails;
    this.mobNumber = this.storage.getLocalStorage(this.constant.storage_mobileNo);
    this.todayDateTimedisplay = this.datepipe.transform(new Date(), 'dd MMM yyyy');
    for(let i = 0 ; i < this.dataService.otplength ; i++){
      this.otpFormInput.push({ "fieldName" : "otp" + (i+1),"minLength": 1, "maxLength":1 , "required" :"Y" })
    }

    this.otpSessionForm = this.dataService.buildForm(this.otpFormInput)
    if (this.otpName == 'OTP') {
      this.resendOTP(1);
    }
  }


  ngOnDestroy() {

  }

  /**
 * call function for resend function
 */
  resendOTP(numCount?: any) {
    var otpUrl = "";
    this.invalidOtp = false;
    this.otpSessionForm.reset();
    var resendOTPReq = this.otpSessionService.getResendOTPSessionReq(this.type);
    otpUrl = this.constant.serviceName_RESENDOTPSESSION;
    resendOTPReq = this.otpSessionService.getResendOTPSessionReq(this.type);
    this.http
      .callBankingAPIService(
        resendOTPReq,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        otpUrl
      )
      .subscribe((data) => {
        if (data.responseParameter.opstatus == '00') {
          this.commonMethod.closeAllPopup();
          this.startCounter();
          //if (numCount == 2)
          //showToastMessage(data.responseParameter.Result, 'success');
        }
      }, (error) => {
        console.log(error)
      });
  }

  startCounter() {
    this.tick = 1000;
    this.counter = 120;
    if (this.countDown && !this.countDown.closed) {
      this.countDown.unsubscribe();
    }
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter == 1) this.countDown.unsubscribe();
      --this.counter;
    });
  }


  /**
   * Validate Form
   */
  validateForm() {
    if (this.otpSessionForm.invalid) {
      for(var i = 0; i < this.otpFormInput.length; i++){
        this.otpSessionForm.get(this.otpFormInput.fieldName).markAsTouched();
      }
     
     
      this.formErrors = this.formValidation.validateForm(
        this.otpSessionForm,
        this.formErrors,
        true
      );
      return;
    }
  }

  /**
   * On Otp confirmation this fucntion called
   */
  confirmOtpClick() {
    var otpValue = '';
    this.validateForm();
    console.log(this.otpSessionForm.value);
    if (this.otpSessionForm.valid) {
      for(var i = 0; i < this.otpFormInput.length; i++){
        otpValue =  otpValue + this.otpSessionForm.get("otp" + (i + 1)).value
      }
      var param = this.otpSessionService.getSendOTPSessionReq(otpValue);
      this.submitOtpSession(param);
    }
  }

  /**
  * function called on otp submit
  */
  submitOtpSession(param) {
    var encryptionKey = this.storage.getSessionStorage(this.constant.val_sessionKey);
    this.tempDecryptedReq = JSON.parse(this.encryptDecryptService.decryptText(encryptionKey, this.dataService.request));
    this.tempDecryptedReq.methodName = this.dataService.endPoint.split('/')[1];
    if (this.otpName == 'OTP') {
      this.tempDecryptedReq.value = this.otpSessionForm.value.otp1 + this.otpSessionForm.value.otp2 + this.otpSessionForm.value.otp3 + this.otpSessionForm.value.otp4 + this.otpSessionForm.value.otp5 + this.otpSessionForm.value.otp6;
    } else {
      this.tempDecryptedReq.value = this.encryptDecryptService.createMD5Value(this.otpSessionForm.value.otp1 + this.otpSessionForm.value.otp2 + this.otpSessionForm.value.otp3 + this.otpSessionForm.value.otp4 + this.otpSessionForm.value.otp5 + this.otpSessionForm.value.otp6)
      this.tempDecryptedReq.customerID = this.dataService.userDetails.customerId;
    }
    console.log(this.tempDecryptedReq);
    let encryptData = this.encryptDecryptService.encryptText(encryptionKey, JSON.stringify(this.tempDecryptedReq));
    this.dataService.request = encryptData;
    console.log(this.dataService.request);
    this.submitReq();
  }

  /**
   *
   * If otp is valid this function is called
   */
  submitReq() {
    this.http
      .callBankingAPIService(
        this.dataService.request,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.dataService.endPoint,
        {showErrorPopup :true}
      )
      .subscribe((resp) => {
        console.log(
          'this.dataService.screenType' + this.dataService.screenType
        );
        this.otpSessionForm.reset();
        switch (resp.responseParameter.opstatus) {
          // case this.constant.val_InvalidOTP:
          //   break;
          case this.constant.val_InvalidCredentials:
            if (this.dataService.endPoint == this.constant.serviceName_FreezeAccount) {
              this.invalidOtp = true;
            }
            break;
          case "03":
            this.dataService.isOTPMaxAttempts = true;
            break;
          case "11":
            //invaild otp
            this.invalidOtp = true;
            console.log("resp.responseParameter" + resp.responseParameter)
            this.invalidOtpMsg = resp.responseParameter.Result
            this.tpinAttempts = 3 - resp.responseParameter.invalidAttempts
            break;
          case "12":
            //otp attempt expired
            this.dataService.isOTPMaxAttempts = true;
            this.message = 'REACHED_MAXIMUM_ATTEMPT';
            this.commonMethod.openPopup('div.popup-bottom.commonotpsession-popup');
            break;
          default:
            switch (this.dataService.screenType) {
              case 'deletePayee':
                this.deletePayee(resp);
                break;

              case 'instaPay':
                this.fundTransfer(resp);
                break;

              case 'fundTransfer':
                this.fundTransfer(resp);
                break;

              case 'profileDetails':
                this.fundTransfer(resp);
                break;

              case 'addPayee':
                this.addPayee(resp)
                break;
              case 'bbpsTransfer':
                this.bbpsTransfer(resp)
                break;
              
              case 'openDeposit':
                this.openDeposit(resp)
                break;
                
              case 'donationTransfer':
                this.donationTransfer(resp);
              break;

              case 'closeDeposit':
                this.closeDeposit(resp);
              break;

              case 'chequeBookRequest':
                this.chequeBookRequest(resp);
              break;

              case 'positivePay':
                this.positivePay(resp);
              break;

              case 'stopCheque':
                this.stopCheque(resp);
              break;
              
              case 'delinkAccount':
                this.delinkAccount(resp)
                break;

              case 'nomineeDetails':
                this.nomineeDetails(resp)
                break;

              case 'freezeAccount':
                this.freezeAccount(resp)
                break;
              default:
            }
        }
      }, (error) => {
        console.log(error)
      });
  }

  // OTP auto focus and auto move
  onKeyUpEvent(index: any, event: any, type: any) {

    console.log(index, event, type);

    const eventCode = event.which || event.keyCode;

    if (this.getSpasswordElement(index, type).value.length === 1) {
      if (index !== 7) {
        this.getSpasswordElement(index + 1, type)?.focus();
      } else {
        this.getSpasswordElement(index, type)?.blur();
        // Submit code
        console.log('submit code ');
      }
    }
    if (eventCode === 12 && index !== 1) {
      this.getSpasswordElement(index - 1, type)?.focus();
    }


    if (eventCode === 8 || eventCode === 229) {
      if (event.key != "Unidentified") {
        if (type == 'otp') {
          this.otpSessionForm.get(this.otpFormInput[index].fieldName)?.setValue("");
        }
        this.getSpasswordElement(index - 1, type)?.focus();
      }
    }

  }

  onFocusEvent(index: any, type: any) {

    for (let item = 1; item < index; item++) {
      const currentElement = this.getSpasswordElement(item, type);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getSpasswordElement(index: any, type: any) {
    if (type == 'otp') {
      return this.otpPinRows._results[index]?.nativeElement;
    }
  }
  cancel() {
    this.router.navigateByUrl(this.dataService.otpSessionPreviousPage);
  }

  closePopup(popup) {
    this.commonMethod.closePopup(popup);
    switch (this.dataService.screenType) {
      case 'addPayee':
      case 'deletePayee':
        this.router.navigateByUrl('/managePayee');
        break;
      case 'fundTransfer':
      case 'schedule':
        this.router.navigateByUrl('/sendMoney');
        break;
      case 'instaPay':
        this.router.navigateByUrl('/instantPay');
        break;
      case 'myAccountsInfo':
        this.router.navigateByUrl("/" + 'myAccount');
        break;
      case 'linkAccount':
        this.router.navigateByUrl("/" + 'linkAccount');
        break;
      case 'delinkAccount':
          this.router.navigateByUrl("/" + 'delinkAccount');
        break;
      case 'freezeAccount':
        this.router.navigateByUrl("/" + 'freezeAccount' );
       break;
      default:
        if (this.dataService.screenType == "" || this.dataService.screenType == undefined || this.dataService.screenType == null) {
          var url = this.constant.getPlatform() == "web" ? "/login" : "/loginMobile"
          this.router.navigateByUrl(url);
        }
        else {
          this.router.navigateByUrl(this.dataService.previousPageUrl);
        }
    }

  }

  getAccountList() {
    let param = this.otpSessionService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.dataService.getAccountListApiCall(data);
      }
      else {

      }
    });
  }


  deletePayee(resp) {
    this.message = resp.responseParameter.Result;
    this.commonMethod.openPopup('div.popup-bottom.commonotpsession-popup');
  }

  fundTransfer(resp) {
    console.log(resp);
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }
    this.dataService.transactionReceiptObj.redirectUrl = '/sendMoney';
    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptmsg = resp.responseParameter.Result //resp.set.records[0].responseCode != '000' ? resp.set.records[0].CBS_RES_FAIL_MSG : 'Transaction Successful';
    if (resp.hasOwnProperty('set')) {
      this.dataService.receipdRefID = resp.set.records[0].referenceNumber;
      this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    }
    else if (resp.responseParameter.hasOwnProperty('RRN')) {
      this.dataService.receipdRefID = resp.responseParameter?.RRN;
      this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    }
    this.getAccountList();
    this.router.navigate(['/receipt']);
  }

  getDebitCard(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
      if (this.dataService.transactionReceiptObj.cardOnOffType != "") this.dataService.receiptmsg = this.dataService.transactionReceiptObj.cardOnOffType == "domestic" ? (this.dataService.transactionReceiptObj.cardOperationType == 'active' ? this.translatePipe.transform('DOMESTIC_TRANSACTION_ENABLED_SUCCESSFULLY') : this.translatePipe.transform('DOMESTIC_TRANSACTION_DISABLED_SUCCESSFULLY')) : (this.dataService.transactionReceiptObj.cardOperationType == 'active' ? this.translatePipe.transform('INTERNATIONAL_TRANSACTION_ENABLED_SUCCESSFULLY') : this.translatePipe.transform('INTERNATIONAL_TRANSACTION_DISABLED_SUCCESSFULLY'));
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
      if (this.dataService.transactionReceiptObj.cardOnOffType != "") this.dataService.receiptmsg = resp.responseParameter.Result;
    }

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    if (this.dataService.transactionReceiptObj.cardOnOffType == "") this.dataService.receiptmsg = resp.responseParameter.Result;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(
      new Date().toISOString(),
      this.dataService.dateFormat
    );
    this.router.navigate(['/receipt']);
  }

  getBlockCard(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptmsg = resp.responseParameter.Result;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(
      new Date().toISOString(),
      this.dataService.dateFormat
    );
    this.router.navigate(['/receipt']);
  }

  getRessiueCard(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
      // var cbsCode = this.dataService.cardDetailsNOffer.filter(obj => obj.cbsVarient == this.dataService.selectedDataCard.CardProgram)[0].cbsCode;
      //this.dataService.debitCardIssuedData = this.dataService.selectedDataCard.AccountNo +"|"+ JSON.parse(resp.responseParameter.responseMsg)[0].CardNumber +"|"+ cbsCode +"|"+this.dataService.physicalCard+"|"; //account number|card number|card type|
      this.dataService.transactionReceiptObj.newCardNo = JSON.parse(resp.responseParameter.responseMsg)[0].CardNumber;
      this.debitCardsReIssueCbs();
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
      this.dataService.transactionReceiptObj.newCardNo = "-";
    }


    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptmsg = resp.responseParameter.Result;
    this.dataService.receipdRefID = resp.RRN;
    // this.dataService.transactionReceiptObj.cardMode = this.dataService.physicalCard == "VP" ? "Physical" : "Virtual";
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(new Date().toISOString(), this.dataService.dateFormat);
    this.router.navigate(['/receipt']);
  }


  debitCardsIssue() {
    var param = this.otpSessionService.getDebitCardIssue();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DEBITCARDISSUE)
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  debitCardsReIssueCbs() {
    var param = this.otpSessionService.getDebitCardsReIssueCbs();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DEBITCARDREISSUE)
      .subscribe((resp) => {
        console.log(resp);
      });
  }


  debitCardModifyCbs() {
    var param = this.otpSessionService.getDebitCardModifyCbs();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DEBITCARDMODIFY)
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  getPhysicalCard(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.debitCardModifyCbs();
      this.dataService.receiptType = this.constant.val_Successful;
      this.dataService.receiptmsg = this.translatePipe.transform('PHYSICAL_CARD_APPLIED_VISIT_BANK_IN_SEVEN_DAYS');
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
      this.dataService.receiptmsg = resp.responseParameter.Result;
    }

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(
      new Date().toISOString(),
      this.dataService.dateFormat
    );
    this.router.navigate(['/receipt']);
  }

  CardDetails(resp) {
    if (resp.responseParameter.opstatus == '00') {
      var cardType = this.dataService.transactionReceiptObj.isPhysicalApplied == 'P' ? 'VP' : 'V';
      if (this.dataService.isCardUpgrade) {
        var cbsCode = this.dataService.transactionReceiptObj.cbsCode;
        this.dataService.debitCardIssuedData = this.dataService.transactionReceiptObj.accountNumber + "|" + JSON.parse(resp.responseParameter.responseMsg)[0].CardNumber + "|" + cbsCode + "|" + cardType + "|";
        this.debitCardsReIssueCbs();
      }
      else {
        this.dataService.debitCardIssuedData = this.dataService.debitCardIssuedData + JSON.parse(resp.responseParameter.CardDetails)[0].CardNumber + "|" + cardType + "|";
        console.log("=====>" + this.dataService.debitCardIssuedData);
        this.debitCardsIssue();
      }

      //Account number|card type|EcommFlag|DisplayName|CardNum|Personilzedcard(P/V)|

      this.dataService.receiptType = this.constant.val_Successful;
      if (this.dataService.transactionReceiptObj.isPhysicalApplied == 'P') {
        this.dataService.receiptmsg = "Virtual Debit Card generated successfully. To collect Physical Debit Card, kindly visit your branch in next 7-8 days";
      }
      else {
        this.dataService.receiptmsg = "Virtual Debit Card generated successfully";
      }
      // this.router.navigateByUrl('/debitCards');
      // showToastMessage("Your virtual card is generated Successfully.Please visit home branch to collect your debit card after 7-8 days" ,'success');

    }
    else {
      this.dataService.receiptType = this.constant.val_Failure;
      this.dataService.receiptmsg = resp.responseParameter.Result;
    }

    this.router.navigate(['/receipt']);
  }

  donationTransfer(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptmsg = resp.responseParameter.Result;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(
      new Date().toISOString(),
      this.dataService.dateFormat
    );
    this.router.navigate(['/receipt']);
  }


  bbpsTransfer(resp) {//16
    console.log("respresp" + JSON.stringify(resp))

    if (resp.responseParameter.opstatus == '00') {
      var bbpsData =  JSON.parse(resp.responseParameter.bbpsResponse)
      this.dataService.billPaymentResponedJson =  JSON.parse(resp.responseParameter.bbpsResponse)
    
      if( bbpsData.status == "00"){
        var txnDate = bbpsData.responseParameter.result.txn_date_time.split("-")
        var formatedtxndate = txnDate[1] +'/'+ txnDate[0]+ '/' + txnDate[2]
        console.log("formatedDuedate ==>" + formatedtxndate)
        var finaltxn = new Date(formatedtxndate)
     var response = resp.responseParameter.response
      console.log("resp.responseParameter" + JSON.stringify(resp.responseParameter))

      this.dataService.bbpsPaymentType = bbpsData.responseParameter.result.payment_type
      this.dataService.receiptType = this.constant.val_Successful;
      
      this.dataService.transactionReceiptObj.RRN = resp.responseParameter.RRN;
      this.dataService.receipdRefID = resp.RRN;
      
      console.log("bbpsDatabbpsData : " + JSON.stringify(bbpsData));

      console.log("responseresponse : " + response)
      var handingFees
     
      if(this.dataService.bbpspaymentType == 'billpay' || this.dataService.bbpspaymentType == 'instapay'){
      
      //code change by sarfaraj 23-12-22 added Handling fees
      handingFees =  (parseFloat( bbpsData.responseParameter.result.cou_conv_fee) + parseFloat( bbpsData.responseParameter.result.bou_conv_fee)).toFixed(2)
      
      this.dataService.bbpsReceiptDetails =[
        {
          'label' :  "Biller name",
          'field' :bbpsData.responseParameter.result.biller_name
        },
      {
        'label' :  "From Account ",
        'field' :  bbpsData.responseParameter.result.payment_account.account_number
      },
      {
        'label' :  "Debited Amount",
        'field' : "₹"+ bbpsData.responseParameter.result.debit_amount
      },
      {
        'label' :  "Handling fees",
        'field' : "₹"+ handingFees
      },
      {
        'label' :  "Bill remark",
        'field' :  bbpsData.responseParameter.result.payment_remarks
      },
      {
        'label' : "Status",
        'field' :  bbpsData.responseParameter.result.payment_status
      },
      {
        'label' :  "Date",
        'field' :   this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')

      }
      
      
      ]
      

      if(this.dataService.isbillerbbps == 'Y'){
        this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  "BBPS Reference Number",
          'field' :  bbpsData.responseParameter.result.bbps_ref_no
        })

      }else{
        this.dataService.bbpsReceiptDetails.push(
          {
            'label' :  "Source Reference Number",
            'field' :  bbpsData.responseParameter.result.source_ref_no
          })
      }
      if(bbpsData.responseParameter.result.billlist){
        this.dataService.bbpsReceiptDetails.unshift({
          'label' :  "Customer Name",
          'field' :  bbpsData.responseParameter.result.billlist[0].customer_name
        })

      }

      for(var i = 0 ;i < bbpsData.responseParameter.result.authenticators.length;  i++){
      this.dataService.bbpsReceiptDetails.push(

        {
          'label' :  bbpsData.responseParameter.result.authenticators[i].parameter_name,
          'field' :  bbpsData.responseParameter.result.authenticators[i].value
        }
      )

      }
      //code change by sarfaraj 23-12-22 added Handling fees
      if(this.dataService.bbpspaymentType == 'billpay' ){
          this.dataService.bbpsReceiptDetails.unshift(
            {
            'label' :  "Short Name",
            'field' :  bbpsData.responseParameter.result.short_name
          },
          )
        }
      }
    else if(this.dataService.bbpspaymentType == 'adhoc'){
 
    this.dataService.bbpsReceiptDetails =[
      {
        'label' :  "Biller name",
        'field' :bbpsData.responseParameter.result.biller_name
      },
    {
      'label' :  "From Account ",
      'field' :  bbpsData.responseParameter.result?.payment_account.account_number
    },
    {
      'label' :  "Debited Amount",
      'field' :  bbpsData.responseParameter.result?.debit_amount
    },

    {
      'label' : "Status",
      'field' :  bbpsData.responseParameter.result?.payment_status
    },
    {
      'label' :  "Date",
      'field' :    this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')

    }
    
    
    ]
    if(this.dataService.isbillerbbps == 'Y'){
      this.dataService.bbpsReceiptDetails.push(
      {
        'label' :  "BBPS Reference Number",
        'field' :  bbpsData.responseParameter.result.bbps_ref_no
      })

    }else{
      this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  "Source Reference Number",
          'field' :  bbpsData.responseParameter.result?.source_ref_no
        })
    }
    for(var i = 0 ;i < bbpsData.responseParameter.result?.authenticators.length;  i++){
    this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  bbpsData.responseParameter.result?.authenticators[i].parameter_name,
          'field' :  bbpsData.responseParameter.result?.authenticators[i].value
        }
      )
      }
    
     
      }

      console.log("this.dataService.billerdata" + JSON.stringify(this.dataService.billerdata))
      
      if(this.dataService.billerdata.billerType == 'BILLER'){
        this.dataService.receiptmsg = "Bill paid successfully";
      }
      else{
          if(bbpsData.responseParameter.result.biller_category == "DTH" || bbpsData.responseParameter.result.biller_category == "Mobile Prepaid"){
          this.dataService.receiptmsg = "Recharge  successful"
        }
      else if(bbpsData.responseParameter.result.biller_category == "Donation"){
          this.dataService.receiptmsg = "Donation successful"
      }else{
        this.dataService.receiptmsg = "Payment made successfully"
      }
    }
      if(bbpsData.responseParameter.result?.additional_info){
        for(var i = 0 ; i < bbpsData.responseParameter.result.additional_info.length; i++){
          this.dataService.bbpsReceiptDetails.push({
            'label' :  bbpsData.responseParameter.result.additional_info[i].parameter_name,
            'field' :  bbpsData.responseParameter.result.additional_info[i].value
          })
        }
      }
    }else{
      this.dataService.bbpsReceiptDetails = [{
        'label' :  "Transaction Failure Reason",
        'field' :  bbpsData.msg

      },
      {
        'label' :  "RRN",
        'field' :  bbpsData.responseParameter.rrn

      },
      {
        'label' :  "Date",
        'field' :   this.todayDateTimedisplay

      }
    ]

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptType = this.constant.val_Failure;
    this.dataService.receiptmsg = bbpsData.msg;
    this.dataService.receipdRefID = resp.RRN;

    
    }
  
    }else if (resp.responseParameter.opstatus == '16') {
      var bbpsData =  JSON.parse(resp.responseParameter.bbpsResponse)
      this.dataService.billPaymentResponedJson =  JSON.parse(resp.responseParameter.bbpsResponse)
    
      if( bbpsData.status == "00"){
        var txnDate = bbpsData.responseParameter.result.txn_date_time.split("-")
        var formatedtxndate = txnDate[1] +'/'+ txnDate[0]+ '/' + txnDate[2]
        console.log("formatedDuedate ==>" + formatedtxndate)
        var finaltxn = new Date(formatedtxndate)
     var response = resp.responseParameter.response
      console.log("resp.responseParameter" + JSON.stringify(resp.responseParameter))

      this.dataService.bbpsPaymentType = bbpsData.responseParameter.result.payment_type
      this.dataService.receiptType = this.constant.val_Failure;
      
      this.dataService.transactionReceiptObj.RRN = resp.responseParameter.RRN;
      this.dataService.receipdRefID = resp.RRN;
      
      console.log("bbpsDatabbpsData : " + JSON.stringify(bbpsData));

      console.log("responseresponse : " + response)
      var handingFees
     
      if(this.dataService.bbpspaymentType == 'billpay' || this.dataService.bbpspaymentType == 'instapay'){
      
      
      this.dataService.bbpsReceiptDetails =[
        {
          'label' :  "Biller name",
          'field' :bbpsData.responseParameter.result.biller_name
        },
        {
          'label' :  "Bill Category",
          'field' :  bbpsData.responseParameter.result.biller_category
        },
        {
          'label' :  "From Account ",
          'field' :  bbpsData.responseParameter.result.payment_account.account_number
        },
        {
          'label' :  "Payment remark",
          'field' :  bbpsData.responseParameter.result.payment_remarks
        },
        {
          'label' :  "Payment Failure Reason",
          'field' :  bbpsData.responseParameter.result.biller_status_desc
        },
        {
          'label' :  "Amount",
          'field' : "₹"+ bbpsData.responseParameter.result.debit_amount
        },
        {
          'label' :  "Paid on",
          'field' :   this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')
        }
      
      
      ]
      
      if(this.dataService.isbillerbbps == 'Y'){
        this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  "BBPS Reference Number",
          'field' :  bbpsData.responseParameter.result.bbps_ref_no
        })
      }else{
      this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  "Source Reference Number",
          'field' :  bbpsData.responseParameter.result.source_ref_no
        })
      }

      for(var i = 0 ;i < bbpsData.responseParameter.result.authenticators.length;  i++){
      this.dataService.bbpsReceiptDetails.push(

        {
          'label' :  bbpsData.responseParameter.result.authenticators[i].parameter_name,
          'field' :  bbpsData.responseParameter.result.authenticators[i].value
        }
      )

      }
      if(this.dataService.bbpspaymentType == 'billpay' ){
      handingFees =  (parseFloat( bbpsData.responseParameter.result.cou_conv_fee) + parseFloat( bbpsData.responseParameter.result.bou_conv_fee)).toFixed(2)
      this.dataService.bbpsReceiptDetails.push(
        {
          'label' :  "Handling fees",
          'field' :  handingFees
        },
      )
      this.dataService.bbpsReceiptDetails.unshift(
        {
        'label' :  "Short Name",
        'field' :  bbpsData.responseParameter.result.short_name
      },
      )
        }
      }
      else if(this.dataService.bbpspaymentType == 'adhoc'){
 
    this.dataService.bbpsReceiptDetails =[
      {
        'label' :  "Biller name",
        'field' :bbpsData.responseParameter.result.biller_name
      },
    {
      'label' :  "From Account ",
      'field' :  bbpsData.responseParameter.result?.payment_account.account_number
    },
    {
      'label' :  "Debited Amount",
      'field' :  bbpsData.responseParameter.result?.debit_amount
    },

    {
      'label' : "Status",
      'field' :  bbpsData.responseParameter.result?.payment_status
    },
    {
      'label' :  "Date",
      'field' :    this.datepipe.transform(finaltxn, 'dd MMM yy, hh:mm a')

    }
    
    
    ]
    if(this.dataService.isbillerbbps == 'Y'){
    this.dataService.bbpsReceiptDetails.push(
    {
      'label' :  "BBPS Reference Number",
      'field' :  bbpsData.responseParameter.result.bbps_ref_no
    })

    }else{
    this.dataService.bbpsReceiptDetails.push(
      {
        'label' :  "Source Reference Number",
        'field' :  bbpsData.responseParameter.result?.source_ref_no
      })
    }
    for(var i = 0 ;i < bbpsData.responseParameter.result?.authenticators.length;  i++){
    this.dataService.bbpsReceiptDetails.push(

      {
        'label' :  bbpsData.responseParameter.result?.authenticators[i].parameter_name,
        'field' :  bbpsData.responseParameter.result?.authenticators[i].value
      }
      )

      }
    
     
      }

      console.log("this.dataService.billerdata" + JSON.stringify(this.dataService.billerdata))
      
      this.dataService.receiptmsg = "Payment failed";

      if(bbpsData.responseParameter.result?.additional_info){
        for(var i = 0 ; i < bbpsData.responseParameter.result.additional_info.length; i++){
          this.dataService.bbpsReceiptDetails.push({
            'label' :  bbpsData.responseParameter.result.additional_info[i].parameter_name,
            'field' :  bbpsData.responseParameter.result.additional_info[i].value
          })
        }
      }
    }else{
      this.dataService.bbpsReceiptDetails = [{
        'label' :  "Transaction Failure Reason",
        'field' :  bbpsData.msg
      },
      {
        'label' :  "RRN",
        'field' :  bbpsData.responseParameter.rrn
      },
      {
        'label' :  "Date",
        'field' :   this.todayDateTimedisplay
      }
    ]

    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.receiptType = this.constant.val_Failure;
    this.dataService.receiptmsg = bbpsData.msg;
    this.dataService.receipdRefID = resp.RRN;

    
    }
  
    }else {

      
      console.log("sneharesp:" + JSON.stringify(resp))
      this.dataService.receiptType = this.constant.val_Failure;
      this.dataService.receiptmsg = resp.responseParameter.Result;
      this.dataService.transactionReceiptObj.rrn = resp.RRN;
      this.dataService.receipdRefID = resp.RRN;
     
     
      this.dataService.bbpsReceiptDetails = [{
        'label' :  "Transaction Failure Reason",
        'field' : "Technical down time"

      },
      {
        'label' :  "Date",
        'field' :   this.todayDateTimedisplay

      }
    ]
    this.dataService.transactionReceiptObj.rrn = resp.RRN;
   
    this.dataService.receipdRefID = resp.RRN;
    }

  
    this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(
      new Date().toISOString(),
      this.dataService.dateFormat
    );
    this.router.navigate(['/receipt']);
  }

  profileEdit(resp) {
    if (resp.responseParameter.opstatus == '00') {
      console.log(this.tempDecryptedReq);
      //this.dataService.receiptType = this.constant.val_Successful;
      // showToastMessage(resp.responseParameter.Result, 'success');
      this.dataService.userDetails.customerName = this.tempDecryptedReq.customerName;
      if (this.dataService.isUsernameChanged) {
        this.openPopup('success1');
        // this.router.navigateByUrl('/login');
      }
      else {
        this.router.navigateByUrl('/profileDetails');
      }
    } else {
      //this.dataService.receiptType = this.constant.val_Failure;
      showToastMessage(resp.responseParameter.Result);
      this.router.navigateByUrl('/profileDetails');
    }
  }

  openPopup(popupName) {
    this.commonMethod.openPopup('div.popup-bottom.' + popupName);
  }

  profileUpdate(resp) {
    if (resp.responseParameter.opstatus == '00') {
      console.log(this.tempDecryptedReq);
      //this.dataService.receiptType = this.constant.val_Successful;
      showToastMessage(resp.responseParameter.Result, 'success');
      //this.dataService.profileImage = this.tempDecryptedReq.customerName
      this.router.navigateByUrl('/profileDetails');
    } else {
      //this.dataService.receiptType = this.constant.val_Failure;
      //showToastMessage(resp.responseParameter.Result);
      this.router.navigateByUrl('/profileDetails');
    }
  }

  linkAccount(resp) {
    this.getAccountList();
    if (resp.responseParameter.opstatus == '00') {
      this.message = resp.responseParameter.Result;
      this.commonMethod.openPopup('div.popup-bottom.commonotpsession-popup');
    }
  }

  delinkAccount(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.getAccountList();
      this.message = resp.responseParameter.Result;
      this.commonMethod.openPopup('div.popup-bottom.commonotpsession-popup');
    }
  }

  freezeAccount(resp) {
    this.getAccountList();
    if (resp.set?.records[0]?.responseCode == '000') {
      this.message = "Your Account will be debit freezed, unfreezing will happen through branch.";
      this.commonMethod.openPopup('div.popup-bottom.commonotpsession-popup');
    }
  }

  scheduleTransfer(resp) {

    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }
    this.dataService.transactionReceiptObj.redirectUrl = '/sendMoney';
    this.dataService.receiptmsg = resp.responseParameter.Result //resp.set.records[0].responseCode != '000' ? resp.set.records[0].CBS_RES_FAIL_MSG : 'Transaction Successful';
    this.dataService.receipdRefID = resp.responseParameter.TransactionId;
    if (resp.hasOwnProperty('set')) {
      this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    }
    // this.dataService.transactionReceiptObj.date = this.datepipe.transform(
    //   new Date().toISOString(),
    //   this.dataService.dateFormat
    // );
    this.getAccountList();
    // this.setOmniChannelFinalReq(this.dataService.transactionReceiptObj.receiptType);
    this.router.navigate(['/receipt']);

  }

  instaTransfer(resp) {
    console.log(resp);
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }
    this.dataService.transactionReceiptObj.redirectUrl = '/sendMoney';
    this.dataService.receiptmsg = resp.responseParameter.Result //resp.set.records[0].responseCode != '000' ? resp.set.records[0].CBS_RES_FAIL_MSG : 'Transaction Successful';
    if (resp.hasOwnProperty('set')) {
      this.dataService.receipdRefID = resp.set.records[0].referenceNumber;
      this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    }
    else if (resp.responseParameter.hasOwnProperty('RRN')) {
      this.dataService.receipdRefID = resp.set.records[0].RRN;
      this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    }
    // this.dataService.transactionReceiptObj.date = this.datepipe.transform(
    //   new Date().toISOString(),
    //   this.dataService.dateFormat
    // );
    this.getAccountList();
    // this.setOmniChannelFinalReq(this.dataService.transactionReceiptObj.receiptType);
    this.router.navigate(['/receipt']);
  }

  addPayee(resp) {
    this.message = resp.responseParameter.Result;
    if (resp.responseParameter.opstatus == '00') {
      console.log(resp);
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.receiptType = this.constant.val_Failure;
    }
    this.dataService.receiptmsg = resp.responseParameter.Result;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.transactionReceiptObj.RRN = resp.RRN;
    this.dataService.transactionReceiptObj.date = this.datepipe.transform(new Date().toISOString(), this.dataService.dateFormat);
    this.router.navigate(['/receipt']);
  }

  positivePay(resp) {
    if (resp.responseParameter.opstatus == '00') {
      console.log(resp);
      this.dataService.transactionReceiptObj.response = this.constant.val_Successful;
      this.dataService.receiptType = this.constant.val_Successful;
      this.dataService.receiptmsg = 'Your request has been submitted successfully';
    } else {
      this.dataService.transactionReceiptObj.response = this.constant.val_Failure;
      this.dataService.receiptType = this.constant.val_Failure;
      this.dataService.receiptmsg = 'Your submitted request has failed';
    }

    console.log('respresp' + resp);
    this.dataService.transactionReceiptObj.msg = resp.responseParameter.Result;
    this.dataService.transactionReceiptObj.rrn = resp.RRN;
    this.dataService.receipdRefID = resp.RRN;
    this.dataService.receiptTransactionDate = resp.responseParameter?.TransactionDate;
    this.getAccountList();
    //this.router.navigate(['/positivePaySuccess']);
    this.router.navigate(['/receipt']);
  }

  stopCheque(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.transactionReceiptObj.receiptType = 'success';
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.transactionReceiptObj.receiptType = 'failure';
      this.dataService.receiptType = this.constant.val_Failure;
    }

    console.log(resp);
    this.dataService.receiptmsg = resp.responseParameter?.Result;
    this.dataService.transactionReceiptObj.msg = resp.responseParameter?.Result;
    this.dataService.transactionReceiptObj.RRN = resp.responseParameter?.RRN;
    this.dataService.receipdRefID = resp.RRN;
    this.router.navigate(['/receipt']);
  }

  chequeBookRequest(resp) {
    if (resp.responseParameter.opstatus == '00') {
      this.dataService.transactionReceiptObj.receiptType = 'success';
      this.dataService.receiptType = this.constant.val_Successful;
    } else {
      this.dataService.transactionReceiptObj.receiptType = 'failure';
      this.dataService.receiptType = this.constant.val_Failure;
    }
    console.log(resp);
    this.dataService.receiptmsg = resp.set.records[0].chequeReqId;
    this.dataService.transactionReceiptObj.msg = resp.set.records[0].chequeReqId;
    this.dataService.transactionReceiptObj.RRN = resp.responseParameter?.RRN;
    this.dataService.receipdRefID = resp.RRN;
    this.router.navigate(['/receipt']);
  }

  openDeposit(resp) {
    switch (this.dataService.feedbackType) {
      case 'FDDetails':
        if (resp.responseParameter.opstatus == '00') {
          this.dataService.FDRDAccNumber = resp.set.records[0].accountNumber;
          this.dataService.openFDReceiptObj.interestRate == resp.set.records[0].roi;
          this.dataService.openFDReceiptObj.maturityAmount = resp.set.records[0].maturityAmount;
          this.dataService.openFDReceiptObj.maturityDate = resp.set.records[0].maturityDate;
          console.log(resp);
          this.dataService.receiptType = 'Successful';
        } else {
          this.dataService.FDRDAccNumber = "";
          this.dataService.receiptType = 'Failed';
        }

        if (resp.set?.records[0]?.responseCode == "000") {
          this.dataService.cbs_success_response = true;
        } else {
          this.dataService.cbs_success_response = false;
        }

        this.dataService.receiptmsg = resp.responseParameter.Result;
        this.dataService.receipdRefID = resp.RRN == "" ? "-" : resp.RRN;
        break;

      case 'RDDetails':
        if (resp.responseParameter.opstatus == '00') {
          this.dataService.FDRDAccNumber = resp.set.records[0].accountNumber;
          console.log(resp);
          this.dataService.receiptType = 'Successful';
          this.dataService.FDRDAccNumber = resp.set.records[0].accountNumber;
          this.dataService.openRDReceiptObj.interestRate = resp.set.records[0].roi
          this.dataService.openRDReceiptObj.maturityAmount = resp.set.records[0].maturityAmount
          this.dataService.openRDReceiptObj.maturityDate = resp.set.records[0].maturityDate;
          this.dataService.openFDReceiptObj.interestRate == resp.set.records[0].roi;
          this.dataService.openFDReceiptObj.maturityAmount = resp.set.records[0].maturityAmount;
          this.dataService.openFDReceiptObj.maturityDate = resp.set.records[0].maturityDate;
          if (this.dataService.standingInstructionFlag == 'Y') {
            this.createStandingInstruction();
          }
        } else {
          this.dataService.FDRDAccNumber = "";
          this.dataService.receiptType = 'Failed';
        }

        if (resp.set?.records[0]?.responseCode == "000") {
          this.dataService.cbs_success_response = true;
        } else {
          this.dataService.cbs_success_response = false;
        }

        this.dataService.receiptmsg = resp.responseParameter.Result;
        this.dataService.receipdRefID = resp.RRN == "" ? "-" : resp.RRN;
        break;
    }
    this.getAccountList();
    this.router.navigate(['/receipt']);
  }

  closeDeposit(resp) {
    switch (this.dataService.closeDepositType) {
      case 'closeFD':
        if (resp.responseParameter.opstatus == '00') {
          console.log(resp);
          this.dataService.receiptType = 'Successful';
        } else {
          this.dataService.receiptType = 'Failed';
        }
        this.dataService.receiptmsg = resp.responseParameter.Result;
        this.dataService.receipdRefID = resp.RRN == "" ? "-" : resp.RRN;
        break;

      case 'closeRD':
        if (resp.responseParameter.opstatus == '00') {
          console.log(resp);
          this.dataService.receiptType = 'Successful';
        } else {
          this.dataService.receiptType = 'Failed';
        }
        this.dataService.receiptmsg = resp.responseParameter.Result;
        this.dataService.receipdRefID = resp.RRN =="" ? "-" : resp.RRN ;
        break;
    }
    this.getAccountList();
    this.router.navigate(['/receipt']);

  }

  nomineeDetails(resp) {
    if (resp.responseParameter.opstatus == '00') {
      console.log(resp);
      this.dataService.receiptType = 'Successful';
      this.dataService.receiptmsg  =  'Nominee details has been updated successfully'
    } else {
      this.dataService.receiptType = 'Failed';
      this.dataService.receiptmsg  = 'Nominee details not updated'

    }
    //this.dataService.receiptmsg  = resp.responseParameter.Result
    this.dataService.receipdRefID = resp.RRN == "" ? "-" : resp.RRN;

    this.router.navigate(['/receipt']);
  }

  createStandingInstruction() {
    var formData = {
      amount: this.dataService.openRDReceiptObj.installmentAmount,
      debitAccount: this.dataService.openRDReceiptObj.debitAccount,
      creditAccount: this.dataService.FDRDAccNumber,
      paymentFrequency: this.dataService.openRDReceiptObj.paymentFrequency,
      installmentNumber: this.dataService.openRDReceiptObj.tenureMonths,
      datepicker1: this.getDate(),
      remarks: "Open RD",
    };
    console.log("standing instrunction form data =====> " + formData);
    var param = this.otpSessionService.getStandingInstructionService(formData, 'N');
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ADDSTANDINGINSTRUCTION)
      .subscribe((data) => {
        console.log("standing instruction data =====>");
        if (data.responseParameter.opstatus == '00') {

        }
      });

  }

  getDate() {
    var date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    var dateValue = date.split("-");
    if (dateValue[0] == "29" || dateValue[0] == "30" || dateValue[0] == "31") {
      dateValue[0] = "28"
    }

    if (dateValue[1] == '12') {
      dateValue[2] = '' + (parseInt(dateValue[2]) + 1);
    }


    if (dateValue[1] == '12') {
      dateValue[1] = '01';
    }
    else if (parseInt(dateValue[1]) >= 9 && parseInt(dateValue[1]) <= 11) {
      dateValue[1] = '' + (parseInt(dateValue[1]) + 1);
    }
    else {
      dateValue[1] = '0' + (parseInt(dateValue[1]) + 1);
    }



    return (dateValue[0] + "-" + dateValue[1] + "-" + dateValue[2])


  }

  /**
   * * This function is called for Water pill pay when form is submitted
   * @param resp
   */
  addBiller(resp) {
    if (resp.responseParameter.opstatus == '00') {
      console.log(resp);
      this.dataService.transactionReceiptObj.receiptType = 'success';
    } else {
      this.dataService.transactionReceiptObj.receiptType = 'failure';
    }

    this.dataService.transactionReceiptObj.msg = resp.responseParameter.Result;
    this.dataService.transactionReceiptObj.RRN = new Date()
      .getTime()
      .toString(); //TODO : currently setting to timestamp later will change to RRN/TransactionId if getting from db.
    this.dataService.billPayObj.date = new Date().toISOString();
    //TODO: Uncomment below type when electricity api is implemented
    // this.setOmniChannelFinalReq(this.dataService.transactionReceiptObj.receiptType);
    this.router.navigate(['/receipt']);
  }

  setOmniChannelFinalReq(type) {
    var param = this.otpSessionService.getOmniChannelParam(type);
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_GETOMNICHANNELREQ
      )
      .subscribe((data) => {
        console.log('setOmniChannelFinalReq======>', data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
        } else {

        }
      });
  }

}

