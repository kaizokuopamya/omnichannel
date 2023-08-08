import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { DatePipe, Location, getCurrencySymbol, TitleCasePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { Subscription, timer } from 'rxjs';
import * as fs from 'file-saver';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { AccountsMiniStementService } from './accounts-mini-stement.service';
import { PERIODOBJ, SHAREDETAILFDOBJ, SHAREDETAILOBJ } from 'src/app/model/common.model';
import { FontBase64 } from 'src/app/enum/app-enum';
import { OTPINPUTMESSAGE } from './accounts-mini-statement.model';
import { commonOtpModel } from 'src/app/model/common.model';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

declare const ExcelJS: any;
declare var window: any;
declare var OSREC: any;


@Component({
  selector: 'app-accounts-mini-statement',
  templateUrl: './accounts-mini-statement.component.html',
  styleUrls: ['./accounts-mini-statement.component.scss']
})
export class AccountsMiniStatementComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    public dataService: DataService,
    private form: FormBuilder,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    public commonMethod: CommonMethods,
    public datePipe: DatePipe,
    private titlecasePipe: TitleCasePipe,
    private accountMiniStatementService: AccountsMiniStementService,
    private translatePipe: TranslatePipe,
    private location: Location,

  ) { }


  OTPInputMessage: commonOtpModel = OTPINPUTMESSAGE;

  totalAccountList: any = [];
  selectedAccountNo: any;
  selAccDtl: any = {};
  selAvlBal: any;
  refreshDate: Date;
  miniStatement: any = [];
  fdminiStatement: any = [];
  accountDtls: any;
  accountDetailsList: any = [];
  pdfTransactionData: any = [];
  showListAccount: boolean = false;
  totalAvailableBalance: boolean = false;
  selectionValue: any = 'miniStatement';
  lienEnqData: any;
  interestCertificateData: any = [];
  balanceCertificateData: any = [];
  showShare: boolean = false;
  accountOpeningdate: any;
  Date: any;
  recordNotFound = '';
  interestCertificateForm: FormGroup;
  // balanceCertificateForm: FormGroup;
  depositsDtl: any = {};
  assuredIntetest: any;
  maturityInstruction: any;
  downloadBalCertDateOfIssue: any;
  todayDateTime: any;
  depositAccType: any;
  currency: any;
  sanctionLimit;
  drawingPower;
  mmid;
  drawingSanctionPower: any;
  interestFrequency: any;
  platform: any;
  branchCode: any = "";
  mmidFlag: string;
  selType: string = "period";
  hasErrorOneYear: boolean = false;
  dateGreaterThan: boolean = false;
  maxFrom: Date = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
  maxTo: Date = new Date(Date.now() - 864e5);   // 864e5 == 86400000 == 24*60*60*1000
  accountselected: any;
  periodList = PERIODOBJ;
  shareDtl: any = SHAREDETAILOBJ
  shareDtlFD: any = SHAREDETAILFDOBJ
  maskedMobileNo: any = ' '
  otpstart: boolean = false;
  disable: boolean = true;

  ngOnInit(): void {
    this.todayDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
    this.maskedMobileNo = this.maskedMobileNumber(this.storage.getLocalStorage(this.constant.storage_mobileNo), 4);
    this.refreshDate = this.dataService.onRefreshDate;
    this.periodList = PERIODOBJ
    this.buildForm();
  }

  maskedMobileNumber(str,n){
    return ('' + str).slice(0, -n).replace(/./g, "*")+ ('' + str).slice(-n);
  }

  ngAfterViewInit() {
    this.getAccountList('onload');
  }

  buildForm() {
    this.interestCertificateForm = new FormGroup({
      accNo: new FormControl('', [Validators.required]),
      period: new FormControl('', [Validators.required])
    });

  }

  getAccountList(type?: any) {
    this.totalAccountList = [];

    if (this.dataService.accTypeSelected == "Operative") {
      this.totalAccountList = this.dataService.customerOperativeAccList;
    }
    else if (this.dataService.accTypeSelected == "Deposits") {
      this.totalAccountList = this.dataService.customerMyDepostie;
    }
    else if (this.dataService.accTypeSelected == "Borrowings") {
      this.totalAccountList = this.dataService.customerBorrowingsList;
    }

    if (type == 'onload') {
      this.selectedAccountNo = this.dataService.accDetails.accountNo;
      this.getSelectedAccount(this.selectedAccountNo);
      console.log('selected account no: ', this.selectedAccountNo);
    }
  }

  goToPage(routeName) {
    // if(routeName == 'closeFD' || routeName == 'closeRD') return;
    if (routeName == 'sendMoney' && this.selAccDtl?.Status != "Active") {
      this.dataService.information = "Selected Account is not Active";
      this.dataService.informationLabel = 'INFORMATION';
      this.dataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
      return;
    } else if (routeName == 'sendMoney' && this.selAccDtl?.Status == "Active") {
      this.dataService.isFromAccountDetails = true;
    }

    if (routeName == 'lienEnquiry') {
      this.dataService.lienAccSel = this.selAccDtl;
    }
    this.dataService.fromAccountInfo = true;
    this.dataService.fromAccInfoAccNumber = this.selectedAccountNo;
    this.dataService.loanAccNo = this.selectedAccountNo;

    if (routeName == 'closeFD' || routeName == 'closeRD') {
      this.dataService.closeDepositType = routeName ;
      
      if (this.depositsDtl.account == 'ONLINE USE') {
        if (this.depositsDtl.accountStatus == 'O') {
          // this.router.navigateByUrl('/' + routeName, { state: { account: this.selectedAccountNo, FDRDData: this.depositsDtl, accountDtls: this.accountDtls } });
          this.router.navigateByUrl('/closeDeposit', { state: { account: this.selectedAccountNo, FDRDData: this.depositsDtl, accountDtls: this.accountDtls } });
        }
        else {
          this.dataService.information = this.depositAccType + "is already closed";
          this.dataService.informationLabel = 'INFORMATION';
          this.dataService.primaryBtnText = 'OK';
          this.commonMethod.openPopup('div.popup-bottom.show-common-info');
        }
      }
      else {
        this.dataService.information = "Offline" + this.depositAccType + "can be closed through branch only";
        this.dataService.informationLabel = 'INFORMATION';
        this.dataService.primaryBtnText = 'OK';
        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
      }
    }
    else {
      this.router.navigateByUrl('/' + routeName, { state: { account: this.selectedAccountNo } });
    }
  }

  openAccountList() {
    this.commonMethod.openPopup('div.popup-bottom.sel-account');
  }

  getSelectedAccount(accNo) {

    this.commonMethod.closePopup('div.popup-bottom.sel-account');
    console.log(accNo);
    this.selectedAccountNo = accNo;
    var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.selectedAccountNo);
    this.accountselected = selAccDtl;
    this.selAccDtl = selAccDtl[0];
    console.log('selAcc', this.selAccDtl);
    //alert(JSON.stringify(this.selAccDtl))
    this.currency = getCurrencySymbol(this.selAccDtl?.currency, 'narrow')
    this.lienAccountData();
    this.dataService.fromAccInfoAccNumber = accNo;
    console.log('account type selected: ', this.dataService.accTypeSelected);
    this.AccountEnquiryDtl();

    if (this.dataService.accTypeSelected == "Operative") {
      this.getMiniStatement();
      this.balanceEnquiry();
      this.getCashCreditAccountInquiry(accNo);
    }
    else {
      //for desposit
      this.DepositeAccountEnquery();
      this.getFDRDMiniStatement();

      //getAccType
      let selAcc = accNo
      if (selAcc.slice(4, 6) == "14" || selAcc.slice(4, 6) == "17") { //"00501400002133" FD
        this.depositAccType = "FD";
      }
      else if (selAcc.slice(4, 6) == "15") { //"00501500002183" RD
        this.depositAccType = "RD";
      }
    }
  }

  getCashCreditAccountInquiry(accno) {
    var param = this.accountMiniStatementService.getCashCreditHistory(accno);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CASHCREDITACCOUNTINQUIRY).subscribe(data => {
      console.log("serviceName_CASHCREDITACCOUNTINQUIRY===>", data);
      this.fdminiStatement = [];
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {

        if (data.hasOwnProperty("set")) {
          this.sanctionLimit = data.set.records[0].SanctionLimit;
          this.drawingPower = data.set.records[0].DrawingPower;

        }
      }
    }, (error) => {
      console.log(error);
    });

  }

  getMMIDGenerate() {
    this.mmidFlag = "generateMMID"
    if (this.dataService.otpName == 'OTP') {
      this.OTPInputMessage.headerMsg = this.dataService.otpName + "_VERIFICATION"
      this.OTPInputMessage.subHeaderMsg = this.translatePipe.transform('PLEASE_ENTER_SIX_DIGIT_MOBILE_OTP') + ' ' + this.maskedMobileNo;
      this.OTPInputMessage.authType = this.dataService.otpName

      this.OTPInputMessage.otpSendEndpint = this.constant.serviceName_RESENDOTPSESSION
      this.OTPInputMessage.serviceType = this.constant.val_generateMMMID
      this.OTPInputMessage.mobStaticEncKey = this.storage.getSessionStorage(this.constant.val_sessionKey)
      this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_GENERATEMMID
      this.OTPInputMessage.showCloseButton = true
      this.OTPInputMessage.params = this.accountMiniStatementService.getSendOTPSessionReq(this.dataService.fromAccInfoAccNumber, this.accountDtls.ifscCode, this.accountDtls.customerName)
      this.OTPInputMessage.numCount = 2
      this.OTPInputMessage.otpkeyName = this.constant.key_OTP
      this.otpstart = true;
    }

  }

  getMMIDCancel() {
    this.mmidFlag = "cancelMMID"
    if (this.dataService.otpName == 'OTP') {
      this.OTPInputMessage.headerMsg = this.dataService.otpName + "_VERIFICATION"
      this.OTPInputMessage.subHeaderMsg = this.translatePipe.transform('PLEASE_ENTER_SIX_DIGIT_MOBILE_OTP') + ' ' + this.maskedMobileNo;
      this.OTPInputMessage.authType = this.dataService.otpName

      this.OTPInputMessage.otpSendEndpint = this.constant.serviceName_RESENDOTPSESSION
      this.OTPInputMessage.serviceType = this.constant.val_generateMMMID
      this.OTPInputMessage.mobStaticEncKey = this.storage.getSessionStorage(this.constant.val_sessionKey)
      this.OTPInputMessage.otpValidateEndpoint = this.constant.serviceName_CANCLEMMID
      this.OTPInputMessage.showCloseButton = true
      this.OTPInputMessage.params = this.accountMiniStatementService.getCancelMMID(this.dataService.fromAccInfoAccNumber, this.accountDtls.ifscCode, this.accountDtls.customerName);
      this.OTPInputMessage.numCount = 2
      this.OTPInputMessage.otpkeyName = this.constant.key_OTP
      this.otpstart = true;



    }
  }

  getFDRDMiniStatement() {
    var param = this.accountMiniStatementService.getMyLoansMiniStatement(this.selAccDtl.accountNo);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_LOANMINISTATEMENT).subscribe(data => {
      console.log("getMyLoansMiniStatement===>", data);
      this.fdminiStatement = [];
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        // if (data.hasOwnProperty("set")) {
        //   this.fdminiStatement = data.set.records;

        // }
        if (data.hasOwnProperty("set")) {
          this.fdminiStatement = data.set.records;
          if (data.set.records[0]['responseCode'] == "119") {
            this.recordNotFound = data.set.records[0]['CBS_RES_FAIL_MSG']
          }
          this.pdfTransactionData = [];
          this.fdminiStatement.forEach(el => {
            var crDr = el.creditDebitFlag == 'D' ? 'DR' : 'CR';
            var _data = [];
            _data.push(el.TransactionDate.split('-')[0] + "/" + el.TransactionDate.split('-')[1] + "/" + el.TransactionDate.split('-')[2]);
            _data.push(el.transactionParticulars);
            _data.push(crDr);
            _data.push(this.convertCurrency(el.TransactionAmount));
            this.pdfTransactionData.push(_data);
            console.log(this.pdfTransactionData);
          });

        }
      } else {
        if (data.hasOwnProperty("set")) {
          var depositAccInfo = data.set.records;
          if (data.set.records[0]['responseCode'] == "119") {
            this.recordNotFound = depositAccInfo[0]['CBS_RES_FAIL_MSG']
          }
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  onRefresh() {
    this.getSelectedAccount(this.selectedAccountNo);
  }


  balanceEnquiry() {
    this.drawingSanctionPower = ''
    console.log("selAccDtl =====>", this.selAccDtl);
    var param = this.accountMiniStatementService.getBalEnqParam(this.selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log("baalance", data);
        if (data.hasOwnProperty("set")) {
          this.selAvlBal = data.set.records[0]
          console.log(this.totalAccountList)
          var objIndex = this.totalAccountList.findIndex(
            (obj) => obj.accountNo == this.selectedAccountNo
          );
          this.totalAccountList[objIndex].acctBalance = this.selAvlBal.ledgerBalance
          this.drawingSanctionPower = this.totalAccountList[objIndex].SchemeCode
          // alert(this.drawingSanctionPower)

        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  getMiniStatement() {
    var param = this.accountMiniStatementService.getMiniStatementParam(this.selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_MINISTATEMENT).subscribe(data => {
      console.log('accountInfoMiniStatement', data);
      var resp = data.responseParameter;
      this.miniStatement = [];
      if (resp.opstatus == "00") {
        console.log(data);
        if (data.hasOwnProperty("set")) {
          this.miniStatement = data.set.records;
          this.pdfTransactionData = [];
          this.miniStatement.forEach(el => {
            var crDr = el.creditDebitFlag == 'D' ? 'DR' : 'CR';
            var _data = [];
            _data.push(this.formatDate(el.TransactionDate));
            _data.push(el.transactionDetails);
            _data.push(crDr);
            _data.push(this.convertCurrency(el.TransactionAmount));
            this.pdfTransactionData.push(_data);
            console.log(this.pdfTransactionData);
          });

          this.miniStatement.forEach(element => {
            var finalDate = this.formatDate(element.TransactionDate);
            console.log('final date: ', finalDate);
            element.TransactionDate = finalDate;
          });
        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  formatDate(str) {
    var year = "";
    var month = "";
    var day = "";
    var newString = "";
    for (var i = 0; i < str.length; i++) {
      if (i >= 0 && i <= 3) {
        year += str[i];
      }
      else if (i > 3 && i <= 5) {
        month += str[i];
      }
      else if (i > 5) {
        day += str[i];
      }
    }
    console.log('year: ', year);
    console.log('month: ', month);
    console.log('day: ', day);

    newString = day + '/' + month + '/' + year;
    console.log('formatted date: ', newString);
    return newString;
  }

  AccountEnquiryDtl() {
    var param = this.accountMiniStatementService.getAccountEnquiryParam(this.selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ACCOUNTINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.branchCode = data.set.records[0]['001']
        console.log(data);
        if (data.hasOwnProperty("set")) {
          this.accountDtls = data.set.records[0];
          this.mmid = this.accountDtls.MMID;
          // this.mmid = this.storage.getLocalStorage(this.constant.storage_mmid);
          this.mmid = this.storage.setLocalStorage(this.mmid, this.constant.storage_mmid);

          if (this.mmid == undefined) {
            this.mmid = ""
          }
          console.log("MMMMMMIIIDDDD :::: ", this.mmid)
          console.log('Account DTLS ::: ', this.accountDtls)
          this.accountOpeningdate = data.set.records[0].statement.split(',')[3];
          console.log("Opening date::", this.accountOpeningdate);
          this.Date = this.openingDate()
          console.log("Date", this.openingDate());
          console.log("Account details::", this.accountDtls);
          //hardcoded for now need to be changed later
          // if(this.accountDtls?.accountType == AccountType.SAVING_ACCOUNT){
          //   this.accountDtls.currentRateofInterest = "8.70 %*";
          // }
          // else if(this.accountDtls?.accountType == AccountType.CURRENT_ACCOUNT ){
          //   this.accountDtls.currentRateofInterest = "00 %";
          // }
          // else if(this.accountDtls?.accountType == AccountType.CASH_CREDIT){
          //   this.accountDtls.currentRateofInterest = "-";
          // }
          // else if(this.accountDtls?.accountType == AccountType.OVER_DRAFT_ACCOUNT){
          //   this.accountDtls.currentRateofInterest = "-";
          // }
        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  openPopup(popUpName) {
    this.buildForm();
    switch (popUpName) {
      case 'lienEnquiry':
        // this.commonMethod.openPopup('div.lien-enquiry-popup');
        break;
      case 'balanceEnquiry':
        this.commonMethod.openPopup('div.balance-popup');
        break;
      case 'interestCertificate':
        this.interestCertificateForm.patchValue({
          accNo: this.selectedAccountNo
        });
        this.commonMethod.openPopup('div.interest-popup');
        break;
    }

  }



  closePopUp() {
    this.commonMethod.closeAllPopup();
    this.selType = "period";
    this.selStatementType(this.selType);
  }

  shareAccountDtl() {
    this.showShare = !this.showShare;
    var details = this.getSelectedValues();
    if (this.constant.getPlatform() != "web") {
      window.plugins.socialsharing.share(details);
    }
    else {
      window.open('mailto:?subject=Account Details&body=' + details);
      //this.shareAccountDtl()
      // var details = "test";
      // window.open('https://www.facebook.com/sharer/sharer.php?u=' + details);
    }
  }

  /**
   * Get selected values from account details
   */
  getSelectedValues() {
    let selectedFields = "";
    this.accountDetailsList.forEach((customer, index) => {
      selectedFields += customer.label + " : " + customer.value + ", ";
    })
    return selectedFields.replace(/,\s*$/, "");
  }

  shareViaFb() {
    var details = this.getSelectedValues();
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + details);
  }

  lienAccountData() {
    var param = this.accountMiniStatementService.getLienAccountParam(this.selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_LIENACCOUNTENQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data);
        if (data.hasOwnProperty("set")) {
          this.lienEnqData = data.set.records[0];
          this.dataService.totalLienAmount = this.lienEnqData?.totalLienAmount
        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  DepositeAccountEnquery() {
    let param = this.accountMiniStatementService.depositeAccountEquirey(this.selAccDtl.accountNo);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DEPOSITACCOUNTINQUIRY).subscribe(data => {
      console.log(data);
      console.log('Temp Deposite Data :: ');
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data);
        this.depositsDtl = data.set.records[0];
        console.log('depositsDtl: ', this.depositsDtl);
        this.dataService.fdrdNomineeName = resp.nomineeName;
        console.log('Nominee Name: ', this.dataService.fdrdNomineeName);
        this.depositsDtl.interest_Rate = parseFloat(this.depositsDtl.interest_Rate).toFixed(2);
        this.depositsDtl.accountOpenDate = this.setDate(this.depositsDtl.accountOpenDate);
        this.depositsDtl.maturityDate = this.setDate(this.depositsDtl.maturityDate);
        this.depositsDtl.depositPeriodMonthsComponent = parseInt(this.depositsDtl.depositPeriodMonthsComponent);
        this.depositsDtl.depositPeriodDaysComponent = parseInt(this.depositsDtl.depositPeriodDaysComponent);
        this.assuredIntetest = parseFloat(this.depositsDtl?.accountClearBalance) - parseFloat(this.depositsDtl?.depositAmount);
        // this.maturityInstruction = this.getMaturityInstruction(this.depositsDtl) ? this.getMaturityInstruction(this.depositsDtl):'-';
        this.maturityInstruction = this.depositsDtl.remarks ? this.depositsDtl.remarks : '-';
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  setDate(date) {
    var validDate;
    var urDate = date.match(/(\d{4})(\d{2})(\d{2})/);
    validDate = urDate[3] + "/" + urDate[2] + "/" + urDate[1];
    return validDate
  }

  /**
   *
   * @param print
   */

  generatePDF(print?: any) {
    var pdfsize = 'a4';
    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    var img = new Image()
    img.src = this.constant.psbNewLogo;
    doc.addImage(img, 'png', 20, 16, 60, 15);

    doc.setLineWidth(0.5);
    doc.line(90, 7, 90, 40); // vertical line


    doc.setFontSize(7);
    doc.text("Branch Name : " + this.selAccDtl.branch_name, pageWidth - 110, 10, { align: 'left' });
    doc.text("Branch Code : " + this.branchCode, pageWidth - 110, 15, { align: 'left' });
    var splitTitles = doc.splitTextToSize("Branch Address : " + this.accountDtls.BranchAddress, 80);
    doc.text(splitTitles, pageWidth - 110, 20, { align: 'left' });
    // doc.text("Branch Address : "+this.accountDtls.BranchAddress, pageWidth - 110, 20, {align :'left'});
    var phoneNo = this.accountDtls.phone_number ? this.accountDtls.phone_number : '';
    doc.text("Branch Contact : " + phoneNo, pageWidth - 110, 30, { align: 'left' });
    doc.text("IFSC : " + this.accountDtls.ifscCode, pageWidth - 110, 35, { align: 'left' });
    // doc.text("MICR Code : ", pageWidth - 110, 35, {align :'left'});

    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(20);
    doc.text("Mini Statement", 20, 60, { align: 'left' });

    doc.setLineWidth(0.2);
    doc.rect(15, 70, doc.internal.pageSize.width - 30, 55, 'S');

    doc.setFontSize(15);
    doc.text("Account Name :" + this.dataService.userDetails?.customerName, 20, 80, { align: 'left' });
    doc.setFontSize(10);
    doc.text("Account Number : " + this.accountDtls.accountNo, 20, 90, { align: 'left' });
    doc.text("Account Type : " + this.selAccDtl?.accountDescription, 20, 95, { align: 'left' });
    //var splitTitle = doc.splitTextToSize("Address : "+this.accountDtls.BranchAddress, 80);

    var splitTitle;
    if (this.dataService.profileDetails[0].add1 == "" && this.dataService.profileDetails[0].add2 == "" && this.dataService.profileDetails[0].pin == "") {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].permenantAdd1 + "," + this.dataService.profileDetails[0].permenantAdd2 + "," + this.dataService.profileDetails[0].permenantPin), 90);
    }
    else {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 + "," + this.dataService.profileDetails[0].add2 + "," + this.dataService.profileDetails[0].pin), 90);
    }
    doc.text(splitTitle, 20, 100, { align: 'left' });

    // doc.text(, 20, 100, {align :'left'});
    doc.text("Mode of Operation : " + this.selAccDtl.accountHoldeType, 20, 112, { align: 'left' });
    // doc.text("Nominee Registered : "+this.accountDtls?.NomanieName, 20, 115, {align :'left'});
    if (this.dataService.accTypeSelected == 'Operative') {
      doc.text("Account Open Date : " + this.Date, 20, 117, { align: 'left' });
    } else {
      doc.text("Account Open Date : " + this.depositsDtl.accountOpenDate, 20, 117, { align: 'left' });
    }

    // doc.setLineWidth(0.5);
    // doc.line(pageWidth/2, 80, pageWidth/2, 110);

    doc.text("Customer ID : " + this.dataService.userDetails.cifNumber, pageWidth - 100, 90, { align: 'left' });
    doc.text("Account Holder : " + this.dataService.userDetails?.customerName, pageWidth - 100, 95, { align: 'left' });
    // doc.text("Address : ", pageWidth - 100, 100, {align :'left'});
    // doc.text("Joint Holder : ", pageWidth - 100, 105, {align :'left'});
    // doc.text("Nominee Name : "+this.accountDtls?.NomanieName, pageWidth - 100, 100, {align :'left'});
    doc.text("Date : " + this.datePipe.transform(new Date(), 'dd/MM/yyyy'), pageWidth - 100, 100, { align: 'left' });



    doc.setFontSize(7);

    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");



    var _columns = ["Transaction Date", "Transaction Reference", "CR/DR", "Amount (" + this.selAccDtl?.currency + ")"];
    var _rows = this.pdfTransactionData;
    console.log(_rows);

    (doc as any).autoTable(_columns, _rows, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 130 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        halign: 'center',
        horizontalPageBreak: true,
        font: "Sakalbharati"
      },
      columnStyles: {
        1: { cellWidth: 'auto' },
        3: { cellWidth: 40, halign: 'right' }
      }
    });
    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.text('Please examine your receipt immediately on receipt. If no error is reported in the printed statement with in 15 days, the acount will be considered correct.', 15, 278, { align: 'left' })
      doc.text('This is computer generated statement and does not require any signature. ', 15, 281, { align: 'left' })
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    if (print) {
      doc.autoPrint();
      window.open(doc.output('bloburl').toString());
    }
    else {
      this.commonMethod.downloadPDF(doc, 'My-Account-Info_XX' + this.maskCharacter(this.selectedAccountNo, 4) + '_' + this.todayDateTime);
    }
  }

  // old online FD receipt download
  generateOnlineFDReceipt() {
    let schemeCode = this.depositsDtl.SchemeCode;
    var param = this.accountMiniStatementService.getAccountSchemeDetails(schemeCode);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETACCOUNTSCHEMEDETAILS).subscribe(data => {
      console.log("serviceName_GETACCOUNTSCHEMEDETAILS===>", data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.interestFrequency = resp.InterestFrequency;
        let fdAccountNo = this.selAccDtl.accountNo ? this.selAccDtl.accountNo : '-';
        let fdSchemeType = this.depositsDtl.SchemeCode + ' - ' + this.depositsDtl.schemeDescription;
        var periodDays = '';
        var periodsMonths = '';
        if (this.depositsDtl.depositPeriodDaysComponent > 0) {
          periodDays = this.depositsDtl.depositPeriodDaysComponent + ' Days' ? this.depositsDtl.depositPeriodDaysComponent + ' Days' : '-';
        }

        if (this.depositsDtl.depositPeriodMonthsComponent > 0) {
          periodsMonths = this.depositsDtl.depositPeriodMonthsComponent + ' Months' ? this.depositsDtl.depositPeriodMonthsComponent + ' Months' : '-';
        }
        var period = periodsMonths + ' ' + periodDays;
        let interestRate = this.depositsDtl.interest_Rate + ' %' ? this.depositsDtl.interest_Rate + ' %' : '-';
        let modeOfOperation = this.selAccDtl.modeTypeValue ? this.selAccDtl.modeTypeValue : '-';
        let interestFrequency = this.interestFrequency ? this.interestFrequency : '-';

        let principalAmount = this.depositsDtl.depositAmount ? '₹ ' + this.depositsDtl.depositAmount : '-';
        let fdOpenDate = this.depositsDtl.accountOpenDate ? this.depositsDtl.accountOpenDate : '-';
        let maturityDate = this.depositsDtl.maturityDate ? this.depositsDtl.maturityDate : '-';
        let maturityAmount = this.depositsDtl.maturityAmount ? '₹ ' + this.depositsDtl.maturityAmount : '-';
        let branchCodeName = (this.selAccDtl['001'] ? this.selAccDtl['001'] : '-') + ' & ' + (this.selAccDtl.branch_name ? this.selAccDtl.branch_name : '-');
        let branchAddress = this.selAccDtl.BRANCHADDRESS ? this.selAccDtl.BRANCHADDRESS : '-';
        this.maturityInstruction = this.depositsDtl.remarks ? this.depositsDtl.remarks : '-';

        var tblArr = [fdAccountNo, fdSchemeType, period, interestRate, modeOfOperation.toLocaleUpperCase(), interestFrequency.toLocaleUpperCase(), this.maturityInstruction.toLocaleUpperCase()];
        var tblArrNext = [principalAmount, fdOpenDate, maturityDate, maturityAmount, branchCodeName, branchAddress];

        var doc = new jspdf();

        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        var img = new Image()
        img.src = this.constant.psbNewLogo;
        doc.addImage(img, 'png', 20, 8, 60, 15);

        doc.setFontSize(10);
        var splitTitle = doc.splitTextToSize('Registered Office: ' + this.constant.val_bank_address, 90);
        doc.text(splitTitle, pageWidth - 110, 15, { align: 'left' })

        doc.setLineWidth(0.5);
        doc.line(90, 7, 90, 23); // vertical line 90, 7, 90, 40

        doc.setLineWidth(0.1);
        doc.line(15, 25, pageWidth - 15, 25);

        // add the font to jsPDF
        doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
        doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
        doc.setFont("Sakalbharati");

        doc.setFontSize(12);
        doc.text("Online Fixed Deposit Receipt", pageWidth / 2, 35, { align: 'center' });

        doc.setFontSize(10);
        doc.text(this.datePipe.transform(new Date(), 'dd MMMM, yyyy'), pageWidth - 20, 40, { align: 'right' });

        doc.text("Customer Name : " + this.dataService.userDetails?.customerName, 15, 45, { align: 'left' });
        // doc.text("Customer Address : "+this.dataService.profileDetails[0].add1+' '+this.dataService.profileDetails[0].add2, 15, 50, {align :'left'});
        if (this.dataService.profileDetails[0].add1 == "" || this.dataService.profileDetails[0].add2 == "") {
          doc.text("Customer Address : " + this.dataService.profileDetails[0].permenantAdd1 + ' ' + this.dataService.profileDetails[0].permenantAdd2, 15, 50, { align: 'left' });
        } else {
          doc.text("Customer Address : " + this.dataService.profileDetails[0].add1 + ' ' + this.dataService.profileDetails[0].add2, 15, 50, { align: 'left' });
        }
        doc.text("Customer ID : " + this.dataService.userDetails.cifNumber, 15, 55, { align: 'left' });
        // doc.text("Mobile Number : "+this.dataService.userDetails.MobileNo, 15, 60, {align :'left'});
        if (this.dataService.userDetails.MobileNo == "") {
          doc.text("Mobile Number : " + this.dataService.profileDetails[0].mobileNo, 15, 60, { align: 'left' });
        } else {
          doc.text("Mobile Number : " + this.dataService.userDetails.MobileNo, 15, 60, { align: 'left' });
        }
        doc.text("PAN Number : " + this.dataService.profileDetails[0].panNumber, 15, 65, { align: 'left' });
        if (this.dataService.fdrdNomineeName) {
          doc.text("Nominee Registered : Yes", 15, 70, { align: 'left' });
        } else {
          doc.text("Nominee Registered : No", 15, 70, { align: 'left' });
        }
        doc.text("Nominee Name : " + this.dataService.fdrdNomineeName, 15, 75, { align: 'left' });

        var newData: any = [];
        newData.push(tblArr);
        var _columns = ["FD Account Number", "FD Scheme Type", "Period", "Interest Rate (% .p.a)", "Mode of Operation", "Interest Frequency", "Maturity Instructions"];
        var _rows = newData;
        console.log("newArray ====>");
        console.log(JSON.stringify(_rows));

        (doc as any).autoTable(_columns, _rows, {
          theme: 'grid', // 'striped', 'grid' or 'plain',
          headStyles: { lineWidth: 0.1, fillColor: [220, 220, 220], textColor: [0, 0, 0] },
          didDrawPage: function (data) {
            // Reseting top margin. The change will be reflected only after print the first page.
            data.settings.margin.top = 10;
          },
          margin: { top: 80 },
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            horizontalPageBreak: true,
            font: "Sakalbharati",
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 28 },
            2: { cellWidth: 22 },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 },
          }
        });

        var newDataNext: any = [];
        newDataNext.push(tblArrNext);
        var _columnsNext = ["Principal Amount", "FD Open Date", "Maturity Date", "Maturity Amount", "Branch Code & Name", "Branch Address"];
        var _rowsNext = newDataNext;
        console.log("newArray ====>");
        console.log(JSON.stringify(_rowsNext));

        (doc as any).autoTable(_columnsNext, _rowsNext, {
          theme: 'grid', // 'striped', 'grid' or 'plain',
          headStyles: { lineWidth: 0.1, fillColor: [220, 220, 220], textColor: [0, 0, 0] },
          didDrawPage: function (data) {
            // Reseting top margin. The change will be reflected only after print the first page.
            data.settings.margin.top = 10;
          },
          margin: { top: 80 },
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            horizontalPageBreak: true,
            font: "Sakalbharati",
          },
          columnStyles: {
            0: { cellWidth: 30, halign: 'right' },
            1: { cellWidth: 28, halign: 'right' },
            2: { cellWidth: 22, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' },
            4: { cellWidth: 38 },
            5: { cellWidth: 42 },
          }
        });

        // add the font to jsPDF
        doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
        doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
        doc.setFont("Sakalbharati");

        doc.setFontSize(11);
        doc.text("Terms & Conditions", pageWidth / 2, 162, { align: 'center' });

        doc.setLineWidth(0.2);
        doc.rect(15, 165, doc.internal.pageSize.width - 25, 105, 'S');

        doc.setFontSize(8)
        doc.text("1. The Online Fixed Deposit in INR is opened in the same name(s) of the account holder(s) as in account from which it is funded.", 20, 170);

        var splitTitle2 = doc.splitTextToSize("2. The interest on the Term Deposit, and the proceeds of the Term Deposit upon maturity, will be credited to the account from which the Term Deposit was funded.", 175);
        doc.text(splitTitle2, 20, 175);

        var splitTitle3 = doc.splitTextToSize("3. Bank will deduct the income tax as per the law applicable and in case no tax is to be deducted, form 15H/G has to be submitted by the depositor to the branch just after opening the Term Deposit and at the beginning the Financial Year in the subsequent Financial Years.", 175);
        doc.text(splitTitle3, 20, 182);

        var splitTitle4 = doc.splitTextToSize("4. Online Fixed Deposit with additional rate of interest for Senior Citizens will be issued if the age of customer is 60 years or above, on the date of creating the fixed deposit, as per date of birth recorded with the Bank. The minimum days applicable for additional rate of interest for senior citizen will be as per Bank's policy.", 175);
        doc.text(splitTitle4, 20, 192, { align: 'left' });

        var splitTitle5 = doc.splitTextToSize("5.  Online Fixed Deposit will be disposed of according to the Maturity Instruction given at the time of opening the deposit. In case of auto renewal, the deposit will be renewed for the same duration for which it was originally kept or maximum 12 months (whichever is lower), at the rate of interest prevailing on the date of renewal for that duration. If auto renewal instructions are given, the instructions will continue to executed till terminated by the account holder.", 175);
        doc.text(splitTitle5, 20, 205, { align: 'left' });

        var splitTitle6 = doc.splitTextToSize("6. The stipulation as to the payment of interest is subject to the condition that the rate of interest agreed to be paid by the Bank will be liable to revision (up or down) in accordance with directives (if any) issued by the Reserve bank of India, in exercise of the powers conferred on it by Section’s 21 & 35A of the Banking Regulations Act, 194 to such extent as may be applicable to this fixed deposit.", 175);
        doc.text(splitTitle6, 20, 220, { align: 'left' });

        var splitTitle7 = doc.splitTextToSize("7. The Bank shall have the first Lien on all kinds of deposits and securities in its possession for any kind of liability in favour of or for monies due to the Bank.", 175);
        doc.text(splitTitle7, 20, 232, { align: 'left' });

        var splitTitle8 = doc.splitTextToSize("8. In case deposit is not renewed interest on deposit ceases from due date.", 175);
        doc.text(splitTitle8, 20, 240, { align: 'left' });

        var splitTitle9 = doc.splitTextToSize("9. Where Interest on FDR’s exceeds or is likely to exceed a specific limit (fixed by I.T. Department from time to time) per depositor during a financial year, the depositor(s) is required to submit the form No. 15G/15H, as applicable invariably for non deduction of tax at source failing which bank will deduct T.D.S. as per Income Tax Rules.", 175);
        doc.text(splitTitle9, 20, 246, { align: 'left' });

        doc.setFontSize(8)
        doc.text("This is computer generated statement and does not require any signature.", 15, 279, { align: 'left' });

        const pageCount = (doc as any).internal.getNumberOfPages()
        doc.setFontSize(6)
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setLineWidth(0.1);
          doc.line(15, 282, pageWidth - 15, 282);
          doc.setFontSize(8)
          doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
          doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
        }
        // var currency = this.selAccDtl[0].currency;
        // var currencySymbol = {currency: currency, symbol: getCurrencySymbol( currency , 'narrow') , negativePattern: '(! #)', formatWithSymbol: true};
        this.commonMethod.downloadPDF(doc, 'FD_Receipt' + '_xx' + this.maskCharacter(this.depositsDtl.repaymentAccountNumber, 4) + '_' + this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss'));
      }
    }, (error) => {
      console.log(error);
    });
  }

  generateOnlineRDReceipt() {
    let rdAccountNo = this.accountDtls.accountNo ? this.accountDtls.accountNo : '-';
    let rdSchemeType = this.depositsDtl.SchemeCode + ' - ' + this.depositsDtl.schemeDescription;
    var periodDays = '';
    var periodsMonths = '';
    if (this.depositsDtl.depositPeriodDaysComponent > 0) {
      periodDays = this.depositsDtl.depositPeriodDaysComponent + ' Days' ? this.depositsDtl.depositPeriodDaysComponent + ' Days' : '-';
    }

    if (this.depositsDtl.depositPeriodMonthsComponent > 0) {
      periodsMonths = this.depositsDtl.depositPeriodMonthsComponent + ' Months' ? this.depositsDtl.depositPeriodMonthsComponent + ' Months' : '-';
    }
    var period = periodsMonths.toString() + ' ' + periodDays.toString();
    let interestRate = this.depositsDtl.interest_Rate + ' %' ? this.depositsDtl.interest_Rate + ' %' : '-';
    let modeOfOperation = this.selAccDtl.modeTypeValue ? this.selAccDtl.modeTypeValue : '-';
    let rdInstalmentAmount = this.depositsDtl.depositAmount ? '₹ ' + this.depositsDtl.depositAmount : '-';
    let rdOpenDate = this.depositsDtl.accountOpenDate ? this.depositsDtl.accountOpenDate : '-';
    let maturityDate = this.depositsDtl.maturityDate ? this.depositsDtl.maturityDate : '-';
    let maturityAmount = this.depositsDtl.maturityAmount ? '₹ ' + this.depositsDtl.maturityAmount : '-';
    let branchCodeName = (this.selAccDtl['001'] ? this.selAccDtl['001'] : '-') + ' & ' + (this.selAccDtl.branch_name ? this.selAccDtl.branch_name : '-');
    let branchAddress = this.selAccDtl.BRANCHADDRESS ? this.selAccDtl.BRANCHADDRESS : '-';
    var autoClosure = '';
    if (this.depositsDtl.autoClosureFlag == 'Y') {
      autoClosure = 'Yes';
    } else {
      autoClosure = 'No';
    }

    var tblArr = [rdAccountNo, rdSchemeType, period, interestRate, modeOfOperation.toLocaleUpperCase(), rdInstalmentAmount];
    var tblArrNext = [branchCodeName, branchAddress, rdOpenDate, maturityDate, maturityAmount, autoClosure.toLocaleUpperCase()];

    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var img = new Image()
    img.src = this.constant.psbNewLogo;
    doc.addImage(img, 'png', 20, 8, 60, 15);

    doc.setFontSize(10);
    var splitTitle = doc.splitTextToSize('Registered Office: ' + this.constant.val_bank_address, 90);
    doc.text(splitTitle, pageWidth - 110, 15, { align: 'left' })

    doc.setLineWidth(0.5);
    doc.line(90, 7, 90, 23); // vertical line 90, 7, 90, 40

    doc.setLineWidth(0.1);
    doc.line(15, 25, pageWidth - 15, 25);

    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");

    doc.setFontSize(12);
    doc.text("Online Recurring Deposit Advice", pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.text(this.datePipe.transform(new Date(), 'dd MMMM, yyyy'), pageWidth - 20, 40, { align: 'right' });

    doc.text("Customer Name : " + this.dataService.userDetails?.customerName, 15, 45, { align: 'left' });
    doc.text("Customer Address : " + this.dataService.profileDetails[0].add1 + ' ' + this.dataService.profileDetails[0].add2, 15, 50, { align: 'left' });
    doc.text("Customer ID : " + this.dataService.userDetails.cifNumber, 15, 55, { align: 'left' });
    doc.text("Mobile Number : " + this.dataService.userDetails.MobileNo, 15, 60, { align: 'left' });
    doc.text("PAN Number : " + this.dataService.profileDetails[0].panNumber, 15, 65, { align: 'left' });
    if (this.dataService.fdrdNomineeName) {
      doc.text("Nominee Registered : Yes", 15, 70, { align: 'left' });
    } else {
      doc.text("Nominee Registered : No", 15, 70, { align: 'left' });
    }
    doc.text("Nominee Name : " + this.dataService.fdrdNomineeName, 15, 75, { align: 'left' });

    var newData: any = [];
    newData.push(tblArr);
    var _columns = ["RD Account Number", "RD Scheme Type", "Period", "Interest Rate (% .p.a)", "Mode of Operation", "RD Instalment Amount"];
    var _rows = newData;
    console.log("newArray ====>");
    console.log(JSON.stringify(_rows));

    (doc as any).autoTable(_columns, _rows, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      headStyles: { lineWidth: 0.1, fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 80 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        horizontalPageBreak: true,
        font: "Sakalbharati",
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 42 },
        2: { cellWidth: 22 },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 30 },
        5: { cellWidth: 28, halign: 'right' },
      }
    });

    var newDataNext: any = [];
    newDataNext.push(tblArrNext);
    var _columnsNext = ["Branch Code & Name", "Branch Address", "RD Start Date", "Maturity Date", "Maturity Amount", "Auto Closure"];
    var _rowsNext = newDataNext;
    console.log("newArray ====>");
    console.log(JSON.stringify(_rowsNext));

    (doc as any).autoTable(_columnsNext, _rowsNext, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      headStyles: { lineWidth: 0.1, fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 80 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        horizontalPageBreak: true,
        font: "Sakalbharati",
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 42 },
        2: { cellWidth: 22, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 28 },
      }
    });

    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");

    doc.setFontSize(11);
    doc.text("Terms & Conditions", pageWidth / 2, 155, { align: 'center' });

    doc.setLineWidth(0.2);
    doc.rect(15, 160, doc.internal.pageSize.width - 25, 110, 'S');

    doc.setFontSize(8)
    doc.text("1. The Online Recurring Deposit in INR is opened in the same name(s) of the account holder(s) as in account from which it is funded.", 20, 165);

    var splitTitle2 = doc.splitTextToSize("2. The Online Recurring Deposit will be opened in the same branch where the debit account belongs.", 175);
    doc.text(splitTitle2, 20, 170);

    var splitTitle3 = doc.splitTextToSize("3. The interest on the Term Deposit, and the proceeds of the Term Deposit upon maturity, will be credited to the account from which the Term Deposit was funded.", 175);
    doc.text(splitTitle3, 20, 175);

    var splitTitle4 = doc.splitTextToSize("4. Bank will deduct the TDS as per the law applicable and in case no tax is to be deducted, form 15H/G has to be submitted by the depositor to the branch just after opening the Term Deposit and at the beginning the Financial Year in the subsequent Financial Years.", 175);
    doc.text(splitTitle4, 20, 183, { align: 'left' });

    var splitTitle5 = doc.splitTextToSize("5. Online Recurring Deposit with additional rate of interest for Senior Citizens will be issued if the age of customer is 60 years or above, on the date of creating the Recurring deposit, as per date of birth recorded with the Bank. The minimum days applicable for additional rate of interest for senior citizen will be as per Bank's policy.", 175);
    doc.text(splitTitle5, 20, 192, { align: 'left' });

    var splitTitle6 = doc.splitTextToSize("6. Online Recurring Deposit will be disposed of according to the Maturity Instruction given at the time of opening the deposit. In case of auto renewal, the deposit will be renewed for the same duration for which it was originally kept or maximum 12 months (whichever is lower), at the rate of interest prevailing on the date of renewal for that duration. If auto renewal instructions are given, the instructions will continue to executed till terminated by the account holder.", 175);
    doc.text(splitTitle6, 20, 203, { align: 'left' });

    var splitTitle7 = doc.splitTextToSize("7. The stipulation as to the payment of interest is subject to the condition that the rate of interest agreed to be paid by the Bank will be liable to revision (up or down) in accordance with directives (if any) issued by the Reserve bank of India, in exercise of the powers conferred on it by Section’s 21 & 35A of the Banking Regulations Act, 194 to such extent as may be applicable to this Recurring deposit.", 175);
    doc.text(splitTitle7, 20, 217, { align: 'left' });

    var splitTitle8 = doc.splitTextToSize("8. The Bank shall have the first Lien on all kinds of deposits and securities in its possession for any kind of liability in favour of or for monies due to the Bank.", 175);
    doc.text(splitTitle8, 20, 228, { align: 'left' });

    var splitTitle9 = doc.splitTextToSize("9. In case deposit is not renewed interest on deposit ceases from due date.", 175);
    doc.text(splitTitle9, 20, 237, { align: 'left' });

    var splitTitle10 = doc.splitTextToSize("10. Where Interest on FDR’s exceeds or is likely to exceed a specific limit (fixed by I.T. Department from time to time) per depositor during a financial year, the depositor(s) is required to submit the form No. 15G/15H, as applicable invariably for non deduction of tax at source failing which bank will deduct T.D.S. as per Income Tax Rules.", 175);
    doc.text(splitTitle10, 20, 242, { align: 'left' });

    var splitTitle11 = doc.splitTextToSize("11. The above guidelines are subject to change as per Income Tax regulations /directives of Finance Ministry Govt of India prevalent from time to time.", 175);
    doc.text(splitTitle11, 20, 254, { align: 'left' });

    doc.setFontSize(8)
    doc.text("This is computer generated statement and does not require any signature.", 15, 279, { align: 'left' });

    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }
    // var currency = this.selAccDtl[0].currency;
    // var currencySymbol = {currency: currency, symbol: getCurrencySymbol( currency , 'narrow') , negativePattern: '(! #)', formatWithSymbol: true};
    this.commonMethod.downloadPDF(doc, 'RD_Receipt' + '_xx' + this.maskCharacter(this.depositsDtl.repaymentAccountNumber, 4) + '_' + this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss'));

  }

  listExpander(value) {
    switch (value) {
      case 'list':
        // this.showListAccount = !this.showListAccount;
        this.showListAccount = !this.showListAccount;
        // if(this.showListAccount){
        //   $('.shortlink-control.show-links').slideToggle();
        // }
        break;

      case 'balanceList':
        this.totalAvailableBalance = !this.totalAvailableBalance
        break;
    }

  }

  openSelectedAccountList(value) {
    this.selectionValue = value;
  }


  dnldInterestCertificate() {
    if (this.interestCertificateForm.valid && !this.hasErrorOneYear && !this.dateGreaterThan) {
      //alert('in');
      this.interestCertificateData = [];
      var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.interestCertificateForm.value.accNo);
      var param = this.accountMiniStatementService.getInterestCertificateParam(this.interestCertificateForm.value, selAccDtl, this.selType);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_INTERESTCERTFORDEPOSITANDSAVING).subscribe(data => {
        //alert('inside');
        //console.log('correct');
        var resp = data.responseParameter;
        this.downloadBalCertDateOfIssue = resp.TransactionDate;
        if (resp.opstatus == "00") {
          console.log(data);
          if (data.hasOwnProperty("set")) {
            data.set.records.forEach(el => {
              var _data = [];
              _data.push(el.TransactionDate);
              _data.push(this.convertCurrency(el.interestAmt));
              _data.push(this.convertCurrency(el.tdsAmt));
              this.interestCertificateData.push(_data)
            });
            var intAmt = []
            var tdsAmt = []
            for (var i = 0; i < this.interestCertificateData.length; i++) {
              intAmt.push(parseFloat(this.interestCertificateData[i][1].replace('₹', '').replace(/,/g, '')))
              tdsAmt.push(parseFloat(this.interestCertificateData[i][2].replace('₹', '').replace(/,/g, '')))
            }
            var newData = []
            newData.push('Total');
            newData.push(this.convertCurrency(intAmt.reduce(function (a, b) { return a + b; }, 0)))
            newData.push(this.convertCurrency(tdsAmt.reduce(function (a, b) { return a + b; }, 0)));
            this.interestCertificateData.push(newData)
            this.commonMethod.closeAllPopup()
            this.dwnldInterestCertificate();
            this.interestCertificateForm.reset();
            this.selType = "period";
            this.selStatementType(this.selType);
          }
        }
        else {
          this.commonMethod.closePopup('div.popup-bottom.interest-popup');
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  dwnldInterestCertificate() {

    var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.selectedAccountNo);

    var curDate = this.datePipe.transform(new Date(), 'dd.MM.yyyy');
    var curTime = this.datePipe.transform(new Date(), 'h:mm a');
    var curDateTime = this.datePipe.transform(new Date(), 'dd MMM yyyy hh:mm:ss a')
    console.log('current date: ', curDate);
    console.log('current time: ', curTime);
    console.log('current date time: ', curDateTime);
    var pdfsize = 'a4';
    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var img = new Image()
    img.src = this.constant.psbNewLogo;
    doc.addImage(img, 'png', 15, 16, 60, 15);
    doc.setLineWidth(0.2);
    //doc.line(150, 10, 150, 40); // vertical line

    doc.setFontSize(9);
    doc.text("Branch Name : " + this.selAccDtl.branch_name, pageWidth - 115, 15, { align: 'left' });
    var phoneNo = this.accountDtls?.phone_number ? this.accountDtls.phone_number : "NA";
    // doc.text( doc.splitTextToSize("Branch Name : "+this.selAccDtl.branch_name,50) , pageWidth - 115, 20, {align :'left'});
    //var soleID = this.selAccDtl['001'];
    //console.log('soleid-----------',soleID) 
    //doc.text("Branch Code : "+soleID, pageWidth - 115, 20, {align :'left'});
    doc.text("Branch Contact : " + phoneNo, pageWidth - 115, 20, { align: 'left' });
    doc.text("IFSC : " + this.accountDtls.ifscCode, pageWidth - 115, 25, { align: 'left' });
    doc.text("MICR Code : " + this.accountDtls.micrCode, pageWidth - 115, 30, { align: 'left' });
    let branchAddress = this.accountDtls.BranchAddress + " " + (this.accountDetailsList.branchPinCode ? this.accountDetailsList.branchPinCode : ' ')
    var splitTitles = doc.splitTextToSize("Branch Address : " + branchAddress, 90);
    doc.text(splitTitles, pageWidth - 115, 35, { align: 'left' });

    doc.setLineWidth(0.2);
    //doc.line(90, 10, 90, 40); // vertical line
    doc.setFontSize(9);

    // doc.text("Branch Code : "+this.branchCode, pageWidth -55, 20, {align :'left'});
    // doc.text("IFSC Code : "+this.accountDtls.ifscCode, pageWidth - 55, 25, {align :'left'});
    // doc.text("MICR Code : "+this.accountDtls.micrCode, pageWidth - 55, 30, {align :'left'});
    // doc.text("Telephone: "+this.accountDtls.phone_number, pageWidth - 55, 35, {align :'left'});

    // doc.text("Branch Address : "+this.accountDtls.BranchAddress, pageWidth - 110, 20, {align :'left'});
    // doc.text("Branch Contact : "+this.accountDtls.phone_number, pageWidth - 110, 30, {align :'left'});
    // doc.text("IFSC : " +this.accountDtls.ifscCode, pageWidth - 110, 35, {align :'left'});
    // doc.text("MICR Code : ", pageWidth - 110, 35, {align :'left'});

    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Interest Certificate", pageWidth / 2, 60, { align: 'center' });


    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    // doc.text(this.downloadBalCertDateOfIssue.split(' ')[0], pageWidth - 15, 75, {align :'left'});
    // doc.text(this.downloadBalCertDateOfIssue.split(' ')[1], pageWidth - 60, 80, {align :'left'});
    doc.text("Date :", 145, 75, { align: 'left' });
    doc.text(this.downloadBalCertDateOfIssue?.split(' ')[0], 155, 75, { align: 'left' });
    //doc.text(this.downloadBalCertDateOfIssue.split(' ')[1], 155, 80, {align :'left'});

    doc.text(this.dataService.userDetails?.customerName, 15, 75, { align: 'left' });
    var accountType = this.titlecasePipe.transform(this.selAccDtl?.schemeDescription) + "(" + this.selAccDtl?.accountType + ")";
    doc.text("Account Type : " + accountType, 15, 80, { align: 'left' });
    doc.text("Account Number : " + this.selectedAccountNo, 15, 85, { align: 'left' });
    doc.text("Mobile Number : " + this.dataService.userDetails.MobileNo, 15, 90, { align: 'left' });
    doc.text("PAN Number: " + this.dataService.profiledateDetails[0]?.panNumber, 15, 95, { align: 'left' });
    var splitTitle;
    if (this.dataService.profileDetails[0].add1 == "" && this.dataService.profileDetails[0].add2 == "" && this.dataService.profileDetails[0].pin == "") {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].permenantAdd1 + "," + this.dataService.profileDetails[0]?.permenantAdd2 + "," + this.dataService.profileDetails[0].permenantPin), 90);
    }
    else {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 + "," + this.dataService.profileDetails[0]?.add2 + "," + this.dataService.profileDetails[0].pin), 90);
    }

    // var splitTitle = doc.splitTextToSize("Address : "+this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 +","+this.dataService.profileDetails[0].add2 +"," +this.dataService.profileDetails[0].pin),90);
    doc.text(splitTitle, 15, 100, { align: 'left' });
    // doc.setLineWidth(0.1);
    // doc.rect(15, 70, doc.internal.pageSize.width - 30, 45, 'S');

    // doc.setFontSize(15);
    // doc.text("Account Name :"+ this.dataService.userDetails?.customerName, 20, 80, {align :'left'});

    // doc.setFontSize(10);
    // doc.text("Address : "+this.dataService.profileDetails[0].add1 +" "+this.dataService.profileDetails[0].add2, 20, 90, {align :'left'});

    // var splitTitle = doc.splitTextToSize("Address : "+this.accountDtls.BranchAddress, 150);
    // doc.text(splitTitle, 20, 90, {align :'left'});

    // doc.text("Customer ID : "+ this.dataService.userDetails.cifNumber, 20, 100, {align :'left'});
    var toDate;
    var fromDate;
    if (this.selType == 'dateRange') {
      toDate = this.datePipe.transform(this.interestCertificateForm.value.toDate, 'dd-MM-yyyy');
      fromDate = this.datePipe.transform(this.interestCertificateForm.value.fromDate, 'dd-MM-yyyy');
    } else {
      toDate = "31-03-" + (+this.interestCertificateForm.value.period.split('-')[0] + 1);
      fromDate = "01-04-" + this.interestCertificateForm.value.period.split('-')[0]
    }
    doc.text("Dear Customer,", 15, 113, { align: 'left' });
    var reportTitle = "The entry wise breakup of Interest Paid and TDS Deducted (if any) for deposit account " + this.selectedAccountNo + "  during period " + fromDate + " to " + toDate + " is as below: ";
    var splitTitle = doc.splitTextToSize(reportTitle, 180);
    doc.text(splitTitle, 15, 120, { align: 'left' });


    // doc.text("Dear Sir /Madam", 15, 100, {align :'left'});
    // doc.text("This is to certify that the undernoted balance /s in the account number "+ this.balanceCertificateData[0] +" of the", 15, 100, {align :'left'});
    // doc.text("above mentioned is available as on date "+ this.downloadBalCertDateOfIssue.split(' ')[0] + " at "+ this.downloadBalCertDateOfIssue.split(' ')[1], 15,105, {align :'left'});

    doc.setFontSize(7);

    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");

    if (this.selAccDtl.SchemeCode == 'CCA' || this.selAccDtl.SchemeCode == 'ODA')
      var columnName = 'Gross Interest Collected'
    else
      var columnName = 'Gross Interest Paid'

    var _columns = ["Date of Transaction", columnName, "TDS Collected"];
    var _rows = this.interestCertificateData;
    console.log(_rows);

    (doc as any).autoTable(_columns, _rows, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      headStyles: { lineWidth: 0.1, fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 130 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        halign: 'center',
        horizontalPageBreak: true,
        font: "Sakalbharati"
      },
      columnStyles: {
        1: { cellWidth: 'auto', halign: 'right' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      }
    });

    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.text('This is computer generated statement and does not require any signature. ', 15, 281, { align: 'left' })
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    this.commonMethod.downloadPDF(doc, 'Interest-Certificate_XX' + this.maskCharacter(this.selectedAccountNo, 4) + '_' + this.todayDateTime);

    // if(this.dataService.accTypeSelected == "Operative"){
    //   this.commonMethod.downloadPDF(doc, 'Balance-Certificate_XX'+ this.maskCharacter(this.accountDtls?.accountNo, 4)+ '_' +this.todayDateTime);
    // }
    // else {
    //   this.commonMethod.downloadPDF(doc, 'Balance-Certificate_XX'+ this.maskCharacter(this.selectedAccountNo, 4)+ '_' +this.todayDateTime);
    // }

  }

  dwnldBalanceCertificate() {
    this.balanceCertificateData = [];
    // var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.balanceCertificateForm.value.accNo );
    var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.selectedAccountNo);
    console.log("selAccDtl ====>", selAccDtl);
    var param = this.accountMiniStatementService.getBalanceCertificateParam(selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ISSUEBALANCECERTIFICATE).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.commonMethod.closeAllPopup();
        this.downloadBalCertDateOfIssue = resp.dateOfIssue;
        // this.commonMethod.closePopup('div.popup-bottom.balance-popup');
        // this.balanceCertificateForm.reset();
        console.log(data);
        if (data.hasOwnProperty("set")) {
          data.set.records.forEach(el => {
            console.log('element currency code: ', el.currencyCode);
            var currencySymbol = getCurrencySymbol(el.currencyCode, 'wide');
            console.log('currency symbol: ', currencySymbol);
            var _data = [];
            _data.push(selAccDtl[0].accountNo);
            _data.push(selAccDtl[0].accountHoldeType);
            _data.push(selAccDtl[0].accountDescription);
            _data.push(el.currencyCode);
            _data.push(this.convertCurrency(el.ledgerBalance));
            this.balanceCertificateData.push(_data)
          });
          console.log('balance certificate array: ', this.balanceCertificateData);
          this.dwnldBalanceCertificatePdf();
          // this.balanceCertificateForm.reset();
        }
      }
      // else {
      //   this.commonMethod.closePopup('div.popup-bottom.balance-popup');
      // }
    }, (error) => {
      console.log(error);
    });
  }

  convertCurrency(value) {
    return OSREC.CurrencyFormatter.format(value, { currency: 'INR', symbol: '₹' });
  }

  dwnldBalanceCertificatePdf() {

    var curDate = this.datePipe.transform(new Date(), 'dd.MM.yyyy');
    var curTime = this.datePipe.transform(new Date(), 'h:mm a');
    var curDateTime = this.datePipe.transform(new Date(), 'dd MMM yyyy hh:mm:ss a')
    console.log('current date: ', curDate);
    console.log('current time: ', curTime);
    console.log('current date time: ', curDateTime);
    var pdfsize = 'a4';
    var doc = new jspdf();

    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var img = new Image()
    img.src = this.constant.psbNewLogo;
    doc.addImage(img, 'png', 15, 16, 60, 15);
    doc.setLineWidth(0.2);
    doc.line(150, 10, 150, 40); // vertical line

    doc.setFontSize(9);
    // doc.text( "Branch Name : "+this.selAccDtl.branch_name, pageWidth - 115, 20, {align :'left'});
    doc.text(doc.splitTextToSize("Branch Name : " + this.selAccDtl.branch_name, 50), pageWidth - 115, 20, { align: 'left' });
    // doc.text("Branch Code : "+this.selAccDtl.branchPinCode, pageWidth - 115, 20, {align :'left'});
    var splitTitles = doc.splitTextToSize("Branch Address : " + this.accountDtls.BranchAddress, 50);
    doc.text(splitTitles, pageWidth - 115, 30, { align: 'left' });

    doc.setLineWidth(0.2);
    doc.line(90, 10, 90, 40); // vertical line
    doc.setFontSize(9);

    var phoneNo = this.accountDtls.phone_number ? this.accountDtls.phone_number : '';
    doc.text("Branch Code : " + this.branchCode, pageWidth - 55, 20, { align: 'left' });
    doc.text("IFSC Code : " + this.accountDtls.ifscCode, pageWidth - 55, 25, { align: 'left' });
    doc.text("MICR Code : " + this.accountDtls.micrCode, pageWidth - 55, 30, { align: 'left' });
    doc.text("Telephone: " + phoneNo, pageWidth - 55, 35, { align: 'left' });

    // doc.text("Branch Address : "+this.accountDtls.BranchAddress, pageWidth - 110, 20, {align :'left'});
    // doc.text("Branch Contact : "+this.accountDtls.phone_number, pageWidth - 110, 30, {align :'left'});
    // doc.text("IFSC : " +this.accountDtls.ifscCode, pageWidth - 110, 35, {align :'left'});
    // doc.text("MICR Code : ", pageWidth - 110, 35, {align :'left'});

    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Balance Certificate (Account wise)", pageWidth / 2, 60, { align: 'center' });


    doc.setFontSize(10);
    doc.setFont(undefined, "normal")
    // doc.text(this.downloadBalCertDateOfIssue.split(' ')[0], pageWidth - 15, 75, {align :'left'});
    // doc.text(this.downloadBalCertDateOfIssue.split(' ')[1], pageWidth - 60, 80, {align :'left'});

    doc.text(this.downloadBalCertDateOfIssue.split(' ')[0], 155, 75, { align: 'left' });
    //doc.text(this.downloadBalCertDateOfIssue.split(' ')[1], 155, 80, {align :'left'});



    doc.text(this.dataService.userDetails?.customerName, 15, 75, { align: 'left' });
    // doc.text(this.selAccDtl.branch_name, 15, 80, {align :'left'});
    doc.text("Customer Id : " + this.dataService.userDetails.cifNumber, 15, 80, { align: 'left' });
    doc.text("PAN : " + this.dataService.profiledateDetails[0].panNumber, 15, 85, { align: 'left' });

    // doc.setLineWidth(0.1);
    // doc.rect(15, 70, doc.internal.pageSize.width - 30, 45, 'S');

    // doc.setFontSize(15);
    // doc.text("Account Name :"+ this.dataService.userDetails?.customerName, 20, 80, {align :'left'});
    var address;
    if (this.dataService.profileDetails[0].add1 == "" && this.dataService.profileDetails[0].add2 == "" && this.dataService.profileDetails[0].pin == "") {
      address = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].permenantAdd1 + "," + this.dataService.profileDetails[0].permenantAdd2 + "," + this.dataService.profileDetails[0].permenantPin), 90);
    }
    else {
      address = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 + "," + this.dataService.profileDetails[0].add2 + "," + this.dataService.profileDetails[0].pin), 90);
    }

    doc.setFontSize(10);
    doc.text(address, 15, 90, { align: 'left' });

    // var splitTitle = doc.splitTextToSize("Address : "+this.accountDtls.BranchAddress, 150);
    // doc.text(splitTitle, 20, 90, {align :'left'});

    // doc.text("Customer ID : "+ this.dataService.userDetails.cifNumber, 20, 100, {align :'left'});
    doc.text("Dear Sir /Madam", 15, 100, { align: 'left' });
    var reportTitle = "This is to certify that the undernoted balance /s in the account number    " + this.balanceCertificateData[0]['0'] + "  of the above mentioned is available as on date " + this.downloadBalCertDateOfIssue.split(' ')[0] + " at " + this.downloadBalCertDateOfIssue.split(' ')[1]
    var splitTitle = doc.splitTextToSize(reportTitle, 180);
    doc.text(splitTitle, 15, 105, { align: 'left' });


    // doc.text("Dear Sir /Madam", 15, 100, {align :'left'});
    // doc.text("This is to certify that the undernoted balance /s in the account number "+ this.balanceCertificateData[0] +" of the", 15, 100, {align :'left'});
    // doc.text("above mentioned is available as on date "+ this.downloadBalCertDateOfIssue.split(' ')[0] + " at "+ this.downloadBalCertDateOfIssue.split(' ')[1], 15,105, {align :'left'});

    doc.setFontSize(7);

    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");

    var _columns = ["ACCOUNT NO", "Mode Of Operation", "Account Type", "Currency", "Available Balance"];
    var _rows = this.balanceCertificateData;
    console.log(_rows);

    (doc as any).autoTable(_columns, _rows, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 120 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        halign: 'center',
        horizontalPageBreak: true,
        font: "Sakalbharati"
      },
      columnStyles: {
        1: { cellWidth: 'auto' },
        4: { cellWidth: 40, halign: 'right' }
      }
    });

    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(6)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setLineWidth(0.1);
      doc.text('This is computer generated statement and does not require any signature. ', 15, 281, { align: 'left' })
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    this.commonMethod.downloadPDF(doc, 'Balance-Certificate_XX' + this.maskCharacter(this.selectedAccountNo, 4) + '_' + this.todayDateTime);

    // if(this.dataService.accTypeSelected == "Operative"){
    //   this.commonMethod.downloadPDF(doc, 'Balance-Certificate_XX'+ this.maskCharacter(this.accountDtls?.accountNo, 4)+ '_' +this.todayDateTime);
    // }
    // else {
    //   this.commonMethod.downloadPDF(doc, 'Balance-Certificate_XX'+ this.maskCharacter(this.selectedAccountNo, 4)+ '_' +this.todayDateTime);
    // }
  }

  openingDate() {
    var x = this.accountOpeningdate;
    var day = x % 100;
    var month = Math.floor(x % 10000 / 100);
    var year = Math.floor(x / 10000);
    var date = new Date(year, month - 1, day);
    var OpDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    return OpDate;
  }

  getMaturityInstruction(depositsDtl) {
    var type = "";
    if (depositsDtl.autoClosureFlag == 'N' && depositsDtl.autoRenewalFlag == 'N') {
      type = "No Auto Renewal/No Auto Closure"
    }
    else if (depositsDtl.autoClosureFlag == 'Y' && depositsDtl.autoRenewalFlag == 'N') {
      type = "Auto Closure on Maturity"
    }
    else if (depositsDtl.autoClosureFlag == 'L' && depositsDtl.autoRenewalFlag == 'N') {
      type = "Limited Auto Renewal"
    }
    else if (depositsDtl.autoClosureFlag == 'U' && depositsDtl.autoRenewalFlag == 'N') {
      type = "Unlimited Auto Renewal"
    }

    return type;
  }

  //Nominee function
  getNomineeDetails() {

    this.selectedAccountNo = this.accountDtls?.accountNo;
    this.dataService.selectedNomineeAccNo = this.selectedAccountNo;
    var param = this.accountMiniStatementService.getNomineeData(this.selectedAccountNo, this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_InquiryNomineeValidation).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log("Nominneeeeeeeeee ka data:::::", data.set['records']);
        let nomineeData = data.set['records']

        if (nomineeData.length == 0) {
          this.dataService.nomineeType = 'ADD'
          this.commonMethod.openPopup("div.add-nominee")
        } else {
          this.dataService.nomineeType = 'MODIFY'
          this.router.navigateByUrl('/' + 'nomineeDetails', { state: { account: this.selectedAccountNo } });
        }

      }
      else if (resp.opstatus == "03") {
        this.dataService.nomineeType = 'ADD'
        this.commonMethod.openPopup("div.add-nominee")
      }
    }, (error) => {
      console.log(error);
    });
  }

  addNomineePopup() {
    
    this.dataService.selectedNomineeAccNo = this.selectedAccountNo;
    this.commonMethod.closePopup('div.add-nominee')
    this.router.navigateByUrl('/' + 'updateNominee', { state: { account: this.selectedAccountNo } });

  }

  close() {
    this.commonMethod.closeAllPopup();
  }

  cancelShare(type) {
    this.showShare = false;
  }

  submitShare(type) {
    this.accountDetailsList = [];
    if (type == 'Operative') {
      console.log(this.shareDtl);

      if (this.shareDtl.accNo) {
        this.accountDetailsList.push({ label: 'Account Number', value: this.accountDtls?.accountNo });
      }
      if (this.shareDtl.accStatus) {
        this.accountDetailsList.push({ label: 'Account Status', value: this.selAccDtl?.Status });
      }
      if (this.shareDtl.accType) {
        this.accountDetailsList.push({ label: 'Account Type', value: this.selAccDtl?.accountType + "-" + this.selAccDtl?.schemeDescription });
      }
      if (this.shareDtl.branchAdd) {
        this.accountDetailsList.push({ label: 'Branch Address', value: this.selAccDtl?.BRANCHADDRESS });
      }
      if (this.shareDtl.ifsc) {
        this.accountDetailsList.push({ label: 'IFSC code', value: this.selAccDtl?.ifscCode });
      }
      if (this.shareDtl.interest) {
        this.accountDetailsList.push({ label: 'Current Rate of Interest', value: this.accountDtls?.currentRateofInterest });
      }
      if (this.shareDtl.name) {
        this.accountDetailsList.push({ label: 'Customer Name', value: this.accountDtls?.customerName });
      }
      if (this.shareDtl.custId) {
        this.accountDetailsList.push({ label: 'Customer ID', value: this.accountDtls?.customerId });
      }
    }
    else {
      if (this.shareDtlFD.accNo) {
        this.accountDetailsList.push({ label: 'FD Account Number', value: this.selAccDtl?.accountNo });
      }
      if (this.shareDtlFD.accStatue) {
        this.accountDetailsList.push({ label: 'Account State', value: this.depositsDtl?.accountStatus == 'O' ? 'open' : 'closed' });
      }
      if (this.shareDtlFD.accType) {
        this.accountDetailsList.push({ label: 'FD Account Type', value: this.depositsDtl?.accountType });
      }
      if (this.shareDtlFD.accScheme) {
        this.accountDetailsList.push({ label: 'FD Account Scheme', value: this.depositsDtl?.accountCategory });
      }
      if (this.shareDtlFD.accHolderName) {
        this.accountDetailsList.push({ label: 'Account Holder Name', value: this.depositsDtl?.accountName });
      }
      if (this.shareDtlFD.openDate) {
        this.accountDetailsList.push({ label: 'Open Date', value: this.depositsDtl?.accountOpenDate });
      }
      if (this.shareDtlFD.maturityDate) {
        this.accountDetailsList.push({ label: 'Maturity Date', value: this.depositsDtl?.maturityDate });
      }
      if (this.shareDtlFD.tenure) {
        this.accountDetailsList.push({ label: 'Tenure', value: this.depositsDtl?.depositPeriodMonthsComponent });
      }
      if (this.shareDtlFD.interestRate) {
        this.accountDetailsList.push({ label: 'Interest Rate', value: this.depositsDtl?.interest_Rate });
      }
      if (this.shareDtlFD.modeOfFDOpening) {
        this.accountDetailsList.push({ label: 'Mode of FD Opening', value: this.depositsDtl?.account });
      }
      if (this.shareDtlFD.modeOfOpperation) {
        this.accountDetailsList.push({ label: 'Mode of Operation', value: this.selAccDtl?.accountHoldeType });
      }
      if (this.shareDtlFD.payoutAmt) {
        this.accountDetailsList.push({ label: 'Maturity Payout Amount', value: this.depositsDtl?.repaymentAccountNumber });
      }
      if (this.shareDtlFD.maturityInstruction) {
        this.accountDetailsList.push({ label: 'Maturity Instructions', value: this.maturityInstruction });
      }
      if (this.shareDtlFD.nonimeeDtl) {
        this.accountDetailsList.push({ label: 'Nominee Details', value: "-" });
      }
    }

    this.shareAccountDtl();
  }


  shareAccount() {
    this.showShare = !this.showShare;
  }

  delinkAccount(e) {
    this.dataService.resetTransactionObj();
    this.dataService.request = '';
    let param = this.accountMiniStatementService.delinkAccountParam(this.selectedAccountNo);
    this.dataService.endPoint = this.constant.serviceName_LINKDELINKACCOUNTS;
    this.dataService.request = param;
    // this.dataService.linkingMobileNumber = this.linkDelinkItem.MobileNo;
    this.dataService.authorizeHeader = 'DeLink Account';
    this.dataService.feedbackType = "delinkAccount"
    this.dataService.screenType = 'accountMiniStatement';
    this.dataService.otpSessionPreviousPage = "/delinkAccount";
    this.router.navigate(['/otpSession']);
  }

  maskCharacter(str, n) {
    return (str.slice(-n));
  }
  
  openFd() {
    this.router.navigate(['/openDeposit']);
  }

  goToOTPPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  closePopup(popup) {
    this.commonMethod.closePopup(popup);
  }

  dnldExcelInterestCertificate() {
    if (this.interestCertificateForm.valid && !this.hasErrorOneYear && !this.dateGreaterThan) {
      //alert('in');
      this.interestCertificateData = [];
      var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.interestCertificateForm.value.accNo);
      var param = this.accountMiniStatementService.getInterestCertificateParam(this.interestCertificateForm.value, selAccDtl, this.selType);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_INTERESTCERTFORDEPOSITANDSAVING).subscribe(data => {
        //alert('inside');
        //console.log('correct');
        var resp = data.responseParameter;
        this.downloadBalCertDateOfIssue = resp.TransactionDate;
        if (resp.opstatus == "00") {
          console.log(data);
          if (data.hasOwnProperty("set")) {
            data.set.records.forEach(el => {
              var _data = [];
              _data.push(el.TransactionDate);
              _data.push(el.interestAmt);
              _data.push(el.tdsAmt);
              this.interestCertificateData.push(_data)
            });
            var intAmt = []
            var tdsAmt = []
            for (var i = 0; i < this.interestCertificateData.length; i++) {
              intAmt.push(parseFloat(this.interestCertificateData[i][1].replace('₹', '').replace(/,/g, '')))
              tdsAmt.push(parseFloat(this.interestCertificateData[i][2].replace('₹', '').replace(/,/g, '')))
            }
            var newData = []
            newData.push('Total');
            newData.push(intAmt.reduce(function (a, b) { return a + b; }, 0))
            newData.push(tdsAmt.reduce(function (a, b) { return a + b; }, 0));
            this.interestCertificateData.push(newData)
            console.log('dataaaaaaaaaaaaaa----->', this.interestCertificateData)
            this.commonMethod.closeAllPopup()
            this.dwnldExcelInterestCertificate();
            this.interestCertificateForm.reset();
            this.selType = "period";
            this.selStatementType(this.selType);
          }
        }
        else {
          this.commonMethod.closePopup('div.popup-bottom.interest-popup');
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  dwnldExcelInterestCertificate(print?: any) {
    var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.interestCertificateForm.value.accNo);
    var img = new Image();
    img.src = this.constant.psbNewLogo;
    var newArray: any = [];
    for (var i = 0; i < this.interestCertificateData.length; i++) {
      var newData: any = []
      newData.push(this.interestCertificateData)
      // newArray.push(newData);
    }

    let toDate;
    let fromDate;
    if (this.selType == 'dateRange') {
      toDate = this.datePipe.transform(this.interestCertificateForm.value.toDate, 'dd-MM-yyyy');
      fromDate = this.datePipe.transform(this.interestCertificateForm.value.fromDate, 'dd-MM-yyyy');
    } else {
      toDate = "31-03-" + (+this.interestCertificateForm.value.period.split('-')[0] + 1);
      fromDate = "01-04-" + this.interestCertificateForm.value.period.split('-')[0]
    }

    if (this.selAccDtl.SchemeCode == 'CCA' || this.selAccDtl.SchemeCode == 'ODA')
      var columnName = 'Gross Interest Collected'
    else
      var columnName = 'Gross Interest Paid'

    var _rows = newData;
    console.log(_rows);
    //Excel Title, Header, Data
    const mainTitle = this.constant.val_bank_longForm;
    const title = 'Interest Certificate';
    const header = ["Date of Transaction", columnName, "TDS Collected"]
    const data = this.interestCertificateData;


    //Create workbook and worksheet
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet();

    // let logo = workbook.addImage({
    //       base64: img.src,
    //       extension: 'png',
    // });
    // worksheet.addImage(logo, 'A1:A2');

    // worksheet.addRow([]);
    //Add Row and formatting
    let mainTitleRow = worksheet.addRow([mainTitle]);
    mainTitleRow.font = { family: 4, size: 16, bold: true }
    // worksheet.addRow([]);
    var soleID = this.selAccDtl['001'];
    // console.log('soleid-----------',soleID)
    // console.log("-----------------------",typeof Object.keys(selAccDtl)[0]);

    worksheet.addRow(["Branch Name : " + this.selAccDtl.branch_name]);
    worksheet.mergeCells('A2:B2');
    worksheet.addRow(["Branch Code : " + soleID]);
    worksheet.mergeCells('A3:B3');
    worksheet.addRow(["Branch Address : " + this.accountDtls?.BranchAddress]);
    worksheet.mergeCells('A4:B4');
    var phoneNo = this.accountDtls?.phone_number ? this.accountDtls?.phone_number : '-';
    worksheet.addRow(["Branch Contact : " + phoneNo]);
    worksheet.mergeCells('A5:B5');
    worksheet.addRow(["IFSC : " + this.accountDtls?.ifscCode]);
    worksheet.mergeCells('A6:B6');
    worksheet.addRow(["MICR Code : " + this.accountDtls?.micrCode]);
    worksheet.mergeCells('A7:B7');
    worksheet.addRow([]);
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { family: 4, size: 16, underline: 'double', bold: true }

    // worksheet.mergeCells('A1:F2');
    worksheet.addRow([this.titlecasePipe.transform(this.dataService.userDetails?.customerName)]);
    worksheet.mergeCells('A10:B10');
    var accountType = this.titlecasePipe.transform(this.selAccDtl?.schemeDescription) + "(" + this.selAccDtl?.accountType + ")";
    worksheet.addRow(["Account Type : " + accountType]);
    worksheet.addRow(["Account Number : " + this.selectedAccountNo, "Date : " + this.downloadBalCertDateOfIssue?.split(' ')[0]]);
    worksheet.addRow(["Mobile Number : " + this.dataService.userDetails.MobileNo])
    worksheet.addRow(["PAN Number: " + this.dataService.profiledateDetails[0]?.panNumber]);


    var splitTitle;
    if (this.dataService.profileDetails[0].add1 == "" && this.dataService.profileDetails[0].add2 == "" && this.dataService.profileDetails[0].pin == "") {
      splitTitle = this.titlecasePipe.transform(this.dataService.profileDetails[0].permenantAdd1 + "," + this.dataService.profileDetails[0].permenantAdd2 + "," + this.dataService.profileDetails[0].permenantPin);
    }
    else {
      splitTitle = this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 + "," + this.dataService.profileDetails[0].add2 + "," + this.dataService.profileDetails[0].pin);
    }
    worksheet.addRow(["Address : " + splitTitle]);
    worksheet.mergeCells('A14:B14');
    // worksheet.addRow(["Nomination Registered : "]);
    // worksheet.mergeCells('A15:B15');
    // if(fromDate){
    //   worksheet.addRow(["Statement : From "+fromDate+" To "+toDate]);
    //   worksheet.mergeCells('A15:B15');
    // }


    worksheet.addRow([]);
    worksheet.addRow(["Dear Customer,"]);
    worksheet.mergeCells('A16:B16');
    worksheet.addRow(["The entry wise breakup of Interest Paid and TDS Deducted (if any) for deposit account " + this.accountDtls?.accountNo + "  during period " + fromDate + " to " + toDate + " is as below: "]);
    worksheet.mergeCells('A17:B17');
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      // cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCFFE5' }, bgColor: { argb: 'FFCCFFE5' } }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    headerRow.font = { size: 14, bold: true }
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow([d[0], parseFloat(d[1]), parseFloat(d[2])]);
      let qty1 = row.getCell(1);
      qty1.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      let qty2 = row.getCell(2);
      qty2.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty3 = row.getCell(3);
      qty3.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

    });

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 50;
    worksheet.getColumn(3).width = 30;

    worksheet.addRow([]);
    //Footer Row
    let digitalGenrateRow = worksheet.addRow(['This statement has been generated through Digital Channel']);
    digitalGenrateRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d3d3' }
    };
    digitalGenrateRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    digitalGenrateRow.font = { size: 10, bold: true }
    //Merge Cells
    worksheet.mergeCells(`A${digitalGenrateRow.number}:G${digitalGenrateRow.number}`);

    let footerRow = worksheet.addRow(['Registered Office: '+ this.constant.val_bank_address]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d3d3' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    footerRow.font = { size: 10, bold: true }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:G${footerRow.number}`);

    var todayDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');

    var self = this;
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (self.constant.getPlatform() != "web") {
        self.commonMethod.downloadExcel(blob, 'Interest-Certificate' + '_XX' + this.maskCharacter(this.selectedAccountNo, 4) + '_' + todayDateTime);
      }
      else {
        fs.saveAs(blob, 'Interest-Certificate' + '_XX' + this.maskCharacter(this.selectedAccountNo, 4) + '_' + todayDateTime);
      }
    })
  }

  selStatementType(type) {
    this.selType = type;
    switch (type) {
      case "period":
        this.interestCertificateForm = new FormGroup({
          accNo: new FormControl('', [Validators.required]),
          period: new FormControl('', [Validators.required]),
          fromDate: new FormControl(''),
          toDate: new FormControl('')
        });
        this.interestCertificateForm.patchValue({
          accNo: this.selectedAccountNo
        });
        break;
      case "dateRange":
        this.interestCertificateForm = new FormGroup({
          accNo: new FormControl('', [Validators.required]),
          period: new FormControl(''),
          fromDate: new FormControl('', [Validators.required]),
          toDate: new FormControl('', [Validators.required])
        });
        this.interestCertificateForm.patchValue({
          accNo: this.selectedAccountNo
        });
        break;
    }
  }

  fromDateChange(event) {
    if (this.interestCertificateForm.value.toDate) {
      var ageDifMs = event - this.interestCertificateForm.value.toDate;
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var dateDiff = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (dateDiff > 1) {
        this.hasErrorOneYear = true;
      }
      else {
        this.hasErrorOneYear = false;
      }
      this.interestCertificateForm.value.fromDate = new Date(event);
    }
    else {
      this.hasErrorOneYear = false;
      this.interestCertificateForm.value.fromDate = new Date(event);
    }

    var d1 = this.interestCertificateForm.value.fromDate
    var d2 = this.interestCertificateForm.value.toDate

    if (this.hasErrorOneYear == false && this.interestCertificateForm.value.fromDate != "" && this.interestCertificateForm.value.toDate) {

      if (d1 > d2) {
        this.dateGreaterThan = true
        this.hasErrorOneYear = false;
      }
      else {
        this.dateGreaterThan = false
      }
    }
  }

  ToDateChange(event) {
    console.log(event);
    if (this.interestCertificateForm.value.fromDate) {
      var ageDifMs = this.interestCertificateForm.value.fromDate - event;
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var dateDiff = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (dateDiff > 1) {
        this.hasErrorOneYear = true;
        this.dateGreaterThan = false
      }
      else {
        this.hasErrorOneYear = false;
      }
      this.interestCertificateForm.value.toDate = new Date(event);
    }
    else {
      this.hasErrorOneYear = false;
      this.interestCertificateForm.value.toDate = new Date(event);
    }

    var d1 = this.interestCertificateForm.value.fromDate
    var d2 = this.interestCertificateForm.value.toDate

    if (this.hasErrorOneYear == false && this.interestCertificateForm.value.fromDate != "" && this.interestCertificateForm.value.toDate) {
      if (d1 > d2) {
        this.dateGreaterThan = true
        this.hasErrorOneYear = false;
      }
      else {
        this.dateGreaterThan = false
      }
    }
  }

  // NEW CODE V.2.0
  GetOtpPopData(data) {
    var resp = data.responseParameter;
    if (resp.opstatus == "00" && this.mmidFlag == 'generateMMID') {
      // this.mmid = data.responseParameter.MMID;
          /* Calling common information popup */
        this.dataService.information = data.responseParameter.Result;
        this.dataService.informationLabel = 'INFORMATION';
        this.dataService.primaryBtnText = 'OK';
        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
        this.mmid = data.responseParameter.MMID;
       console.log("OTP DATA GENERATEMMID: ", data)

    } else {
      this.dataService.information = "MMID Succesfully Cancel";
      this.dataService.informationLabel = 'INFORMATION';
      this.dataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
      this.mmid = ''
      console.log("OTP DATA CNACELMMID: ", data)
    }
    this.otpstart = false;


  }


}
