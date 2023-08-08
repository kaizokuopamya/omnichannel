import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { DatePipe, Location, getCurrencySymbol } from '@angular/common';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { OrdinalDatePipe } from 'src/app/pipes/date-ago.pipe'
import { ReceiptService } from './receipt.service';
import { FontBase64 } from 'src/app/enum/app-enum';
import { POSITIVEPAYREQJSON, RECEIPTCHEQUEBOOKREQJSON, RECEIPTDONATIONJSON, RECEIPTFDCLOSEDEPOSITJSON, RECEIPTFDOPENDEPOSITJSON, RECEIPTFUNDTRANSFERJSON, RECEIPTFUNDTRANSFERMMIDJSON, RECEIPTINSTAMMIDJSON, RECEIPTRDCLOSEDEPOSITJSON, RECEIPTRDOPENDEPOSITJSON, RECEIPTSTOPBULKCHEQUEJSON, RECEIPTSTOPCHEQUEJSON } from './receipt.model';

declare var OSREC: any;
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
  receiptType: any;
  freezereceiptType: any;
  receiptResp: any;
  billPayObj: any;
  receipdRefID: any;
  receiptmsg: any;
  maskAccountNo: any;
  todayDateTime: any;
  todayDateTime2: any;
  todayDateTimedisplay: any;
  totalAccountList: any = [];
  apyDataObj: any;
  information: "";
  branchcode: any;
  reqcheckbook: any;
  newdata: any;
  isFavourite: boolean = false;
  receiptObjs: any;
  receiptName = "";
  accountList: any = [];
  withinBenificiaryList: any = [];
  outsideBenificiaryList: any = [];
  selfBenificiaryList: any = [];
  mmidBenificiaryList: any = [];
  vpaBenificiaryList: any = [];
  ownBenificiaryList: any = [];
  otherBenificiaryList: any = [];
  internationalBenificiaryList: any = [];
  refTransJson: any = [{ 'key': 'Transaction ID', 'value': '' }];
  keys = Object.keys;
  screenDetails: any;
  customerDetails: any;

  ///////////////////// download receipt models //////////////
  receiptInstaMMIDJson = RECEIPTINSTAMMIDJSON;
  receiptDonationJson = RECEIPTDONATIONJSON;
  receiptFundTransferMMIDJson = RECEIPTFUNDTRANSFERMMIDJSON;
  receiptFundTransferJson = RECEIPTFUNDTRANSFERJSON;
  receiptFDOpenDepositJson = RECEIPTFDOPENDEPOSITJSON;
  receiptRDOpenDepositJson = RECEIPTRDOPENDEPOSITJSON;
  receiptCloseFDJson = RECEIPTFDCLOSEDEPOSITJSON;
  receiptCloseRDJson = RECEIPTRDCLOSEDEPOSITJSON;
  receiptChequeBookReqJson = RECEIPTCHEQUEBOOKREQJSON;
  positivePayReqJson = POSITIVEPAYREQJSON;
  receiptStopChequeJson = RECEIPTSTOPCHEQUEJSON;
  receiptStopBulkChequeJson = RECEIPTSTOPBULKCHEQUEJSON;
  
  constructor(
    public dataService: DataService,
    private receiptService: ReceiptService,
    private router: Router,
    public constant: AppConstants,
    private location: Location,
    public common: CommonMethods,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    private datepipe: DatePipe,
    public loader: pageLoaderService,
    public OrdinalDatePipe: OrdinalDatePipe
  ) { }

  ngOnInit(): void {
    this.customerDetails = this.dataService.profileDetails; //open deposit pdf generation 
    this.accountList = this.dataService.customerOperativeAccList.filter(
      (obj) => (obj.accountType != 'CAPPI')
    );
    
    console.log("accountList", this.accountList)
    this.branchcode = this.accountList[0].branchCode;
    console.log("branchcode", this.branchcode)
    this.todayDateTime = this.datepipe.transform(new Date(), 'ddMMyyyyhhmmss');
    this.todayDateTime2 = this.datepipe.transform(new Date(), 'dd MMM yyyy hh:mm a');
    this.screenDetails = this.dataService.screenDetails;
    if (this.dataService.screenType == 'donationTransfer' || this.dataService.screenType == 'donationTransfer' || this.dataService.screenType == 'debitCard' || this.dataService.screenType == 'reissuecard' || this.dataService.screenType == 'getPhysicalCard' || this.dataService.screenType == 'generatePin' || this.dataService.screenType == 'CardDetails' || this.dataService.screenType == 'blockCard' || this.dataService.screenType == 'positivePay') {
      this.receiptObjs = this.dataService.transactionReceiptObj?.accountNumber;
      this.AccountEnquiryDtl();
    }
    else if (this.dataService.screenType == 'instaPay') {
      this.receiptObjs = this.dataService.transactionReceiptObj?.from_acc
      this.AccountEnquiryDtl();
    }
    if (this.dataService.receiptTransactionDate) {
      this.todayDateTimedisplay = this.dataService.receiptTransactionDate
    }
    else {
      this.todayDateTimedisplay = this.datepipe.transform(new Date(), 'dd MMM yyyy hh:mm a');
    }

    this.receiptName = this.dataService.screenType ? this.dataService.screenType : 'Receipt';
    this.receiptType = this.dataService.receiptType;
    this.refTransJson[0].value = this.dataService.receipdRefID;
    this.initialize();

    // history.pushState({}, this.dataService.otpSessionPreviousPage, this.location.prepareExternalUrl(this.dataService.otpSessionPreviousPage));
    // history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));

  }

  initialize() {
    this.totalAccountList = this.dataService.screenType == 'closeDeposit' ? this.dataService.customerMyDepostie : this.dataService.customerOperativeAccList;
    console.log('total account list: ', this.totalAccountList);
    this.receiptType = this.dataService.receiptType;
    this.receiptmsg = this.dataService.receiptmsg;
    console.log('receiptmsg', this.receiptmsg);
    this.receipdRefID = this.dataService.transactionReceiptObj.type == 'vpa' ? this.dataService.transactionReceiptObj.rrn : this.dataService.receipdRefID;
    this.receiptResp = 
    this.dataService.screenType == 'openDeposit' && this.dataService.feedbackType == 'FDDetails' ? this.dataService.openFDReceiptObj :
      this.dataService.screenType == 'openDeposit' && this.dataService.feedbackType == 'RDDetails' ? this.dataService.openRDReceiptObj :
        this.dataService.screenType == 'closeDeposit' && this.dataService.closeDepositType == 'closeFD' ? this.dataService.closeFDObj :
          this.dataService.screenType == 'closeDeposit' && this.dataService.closeDepositType == 'closeRD' ? this.dataService.closeRDObj :
            this.dataService.transactionReceiptObj;
  }

  navigate(routeName: string) {
    this.dataService.routeWithNgZone(routeName);
  }

  addAsPayee() {
    this.dataService.isFromInstaRecipt = true;
    this.dataService.isEditPayee = false
    this.dataService.managePayeeToAddpayee = this.dataService.transactionReceiptObj.paymentType;
    this.dataService.payeeDtl = {
      "benefName": this.receiptResp?.payee_name,
      "beneficiary_account_no": this.receiptResp?.to_acc,
      "ifsc_code": this.receiptResp?.ifscCode ? this.receiptResp?.ifscCode : '',
      "beneficiary_nick_name": this.receiptResp?.payee_name,
      "beneficiaryMobileNo": this.receiptResp?.payeeMobileNo ? this.receiptResp?.payeeMobileNo : '',
      "MMID": this.receiptResp?.mmid ? this.receiptResp?.mmid : '',
    }
    this.dataService.previousPageUrl = 'instantPay';
    this.navigate('/addPayee');
  }

  downloadPdfReceipt(type) {
    this.loader.showLoader();
    var pdfsize = 'a4';
    var doc = new jspdf();
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    if (this.dataService.receiptType == this.constant.val_Successful) {
      var imgColor = 'success';
    }
    else {
      imgColor = 'failed';
    }

    switch (this.dataService.screenType) {
      case 'fundTransfer':
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.from_acc);
        console.log('selected account details : ', selAccDtl);
        if (this.receiptResp.type == "mmid") {
          this.receiptFundTransferMMIDJson[0].value = this.receiptResp.from_acc ? this.receiptResp.from_acc : '-';
          this.receiptFundTransferMMIDJson[1].value = this.receiptResp.payeeMMID ? this.receiptResp.payeeMMID : '-';
          this.receiptFundTransferMMIDJson[2].value = this.receiptResp.payeeMobile ? this.receiptResp.payeeMobile : '-';
          this.receiptFundTransferMMIDJson[3].value = this.receiptResp.payee_name ? this.receiptResp.payee_name : '-';
          this.receiptFundTransferMMIDJson[4].value = this.receiptResp.amount ? this.receiptResp.amount.split('₹')[1] : '-';
          this.receiptFundTransferMMIDJson[5].value = this.receiptResp.remarks ? this.receiptResp.remarks : '-';
          this.receiptFundTransferMMIDJson[6].value = this.receiptResp.date ? this.datepipe.transform(new Date().toISOString(), this.dataService.dateFormat) : '-';
          this.receiptFundTransferMMIDJson[7].value = this.receiptResp.actionType ? this.receiptResp.actionType : '-';
          if (this.receiptResp.isScheduled) {
            this.receiptFundTransferMMIDJson.push({ 'key': 'scheduled Date', 'value': this.receiptResp.scheduledDate ? this.datepipe.transform(this.receiptResp.scheduledDate, this.dataService.dateFormat) : '-' });
            this.receiptFundTransferMMIDJson.push({ 'key': 'scheduled Type', 'value': this.receiptResp.scheduledType ? this.receiptResp.scheduledType : '-' });
          }
        }
        else {
          this.receiptFundTransferJson[0].value = this.receiptResp.from_acc ? this.receiptResp.from_acc : '-';
          this.receiptFundTransferJson[1].value = this.receiptResp.to_acc ? this.receiptResp.to_acc : '-';
          this.receiptFundTransferJson[2].value = this.receiptResp.payee_name ? this.receiptResp.payee_name : '-';
          this.receiptFundTransferJson[3].value = this.receiptResp.amount ? this.receiptResp.amount.split('₹')[1] : '-';
          this.receiptFundTransferJson[4].value = this.receiptResp.remarks ? this.receiptResp.remarks : '-';
          if (this.dataService.screenType == 'fundTransfer' || this.dataService.screenType == 'freezeAccount' || this.dataService.screenType == 'donationTransfer' || this.dataService.screenType == 'payemi') {
            this.receiptFundTransferJson[5].value = this.todayDateTimedisplay;
          }
          else {
            this.receiptFundTransferJson[5].value = this.receiptResp.date ? this.datepipe.transform(new Date().toISOString(), this.dataService.dateFormat) : '-';
          }
          if (this.receiptResp.isScheduled) {
            this.receiptFundTransferJson.push({ 'key': 'scheduled Date', 'value': this.receiptResp.scheduledDate ? this.datepipe.transform(this.receiptResp.scheduledDate, this.dataService.dateFormat) : '-' });
            this.receiptFundTransferJson.push({ 'key': 'scheduled Type', 'value': this.receiptResp.scheduledType ? this.receiptResp.scheduledType : '-' });
          }
          if (this.receiptResp.benificaryBankName != '') this.receiptFundTransferJson.push({ 'key': 'Payee bank name', 'value': this.receiptResp.benificaryBankName });
          if (this.receiptResp.ifscCode != '') this.receiptFundTransferJson.push({ 'key': 'Ifsc code', 'value': this.receiptResp.ifscCode });
          if (this.receiptResp.modeOfTransfer != '') this.receiptFundTransferJson.push({ 'key': 'Transaction mode', 'value': this.receiptResp.modeOfTransfer })
        }
        var branchJSON = [
          { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
          { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
          { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number ? selAccDtl[0].phone_number : '-' },
          { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode },
          { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS }
        ];
        this.loader.hideLoader();
        this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptFundTransferJson, 'Fund Transfer', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        break;
      case 'donationTransfer':
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.accountNumber);
        this.receiptDonationJson[0].value = this.receiptResp.accountNumber;
        this.receiptDonationJson[1].value = this.receiptResp.payeeName;
        this.receiptDonationJson[2].value = this.receiptResp.to_acc;
        // this.receiptDonationJson[3].value = this.receiptResp.amount.split('₹')[1];
        this.receiptDonationJson[3].value = this.receiptResp.amount;
        this.receiptDonationJson[4].value = this.receiptResp.remarks;
        this.receiptDonationJson[5].value = this.todayDateTime2;

        var splitTitles = doc.splitTextToSize(" :" + this.newdata[0].BranchAddress, 30);
        doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
        var branchJSON = [
          { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
          { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
          { 'key': 'Branch Address', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].BranchAddress },
          { 'key': 'Branch Contact', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].phone_number },
          { 'key': 'IFSC', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].ifscCode },
        ];
        if (this.newdata != undefined && this.newdata != null) {
          var splitTitles = doc.splitTextToSize(" :" + this.newdata[0].BranchAddress, 30);
          doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
        }
        this.loader.hideLoader();
        this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptDonationJson, 'Donation', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        break;
      case 'instaPay':
        if (this.receiptResp.paymentType != 'mmid') {
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.from_acc);
          this.receiptDonationJson[0].value = this.receiptResp.from_acc;
          this.receiptDonationJson[1].value = this.receiptResp.payee_name;
          this.receiptDonationJson[2].value = this.receiptResp.to_acc;
          this.receiptDonationJson[3].value = this.receiptResp.amount.split('₹')[1];
          this.receiptDonationJson[4].value = this.receiptResp.remarks;
          this.receiptDonationJson[5].value = this.todayDateTime2;

          if (this.receiptResp.benificaryBankName != '') this.receiptDonationJson.push({ 'key': 'Payee bank name', 'value': this.receiptResp.benificaryBankName });
          if (this.receiptResp.ifscCode != '') this.receiptDonationJson.push({ 'key': 'Ifsc code', 'value': this.receiptResp.ifscCode });
          if (this.receiptResp.benificaryBankName != '') this.receiptDonationJson.push({ 'key': 'Transaction mode', 'value': 'IMPS' })

          if (this.newdata != undefined && this.newdata != null) {
            var splitTitles = doc.splitTextToSize(" :" + this.newdata[0].BranchAddress, 30);
            doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
          }

          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
            { 'key': 'Branch Address', 'value': this.newdata == undefined || this.newdata == null ? "_" : this.newdata[0].BranchAddress },
            { 'key': 'Branch Contact', 'value': this.newdata == undefined || this.newdata == null || this.newdata[0]?.phone_number ? "_" : this.newdata[0].phone_number },
            { 'key': 'IFSC', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].ifscCode },
          ];
          this.loader.hideLoader();
          this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptDonationJson, 'InstaPay', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        } else {
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.from_acc);
          this.receiptInstaMMIDJson[0].value = this.receiptResp.from_acc;
          this.receiptInstaMMIDJson[1].value = this.receiptResp.payee_name;
          this.receiptInstaMMIDJson[2].value = this.receiptResp.mmid;
          this.receiptInstaMMIDJson[3].value = this.receiptResp.amount.split('₹')[1];
          this.receiptInstaMMIDJson[4].value = this.receiptResp.modeOfTransfer;
          this.receiptInstaMMIDJson[5].value = this.receiptResp.remarks;
          this.receiptInstaMMIDJson[6].value = this.todayDateTime2;

          if (this.receiptResp.benificaryBankName != '') this.receiptInstaMMIDJson.push({ 'key': 'Payee bank name', 'value': this.receiptResp.benificaryBankName });
          if (this.receiptResp.ifscCode != '') this.receiptInstaMMIDJson.push({ 'key': 'Ifsc code', 'value': this.receiptResp.ifscCode });
          if (this.receiptResp.benificaryBankName != '') this.receiptInstaMMIDJson.push({ 'key': 'Transaction mode', 'value': 'IMPS' })

          if (this.newdata != undefined && this.newdata != null) {
            var splitTitles = doc.splitTextToSize(" :" + this.newdata[0].BranchAddress, 30);
            doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
          }
          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
            { 'key': 'Branch Address', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].BranchAddress },
            { 'key': 'Branch Contact', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].phone_number },
            { 'key': 'IFSC', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].ifscCode },
          ];
          this.loader.hideLoader();
          this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptInstaMMIDJson, 'InstaPay', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        }
        break;
      case "bbpsTransfer":
        
            this.dataService.finalRecentTransList = []
            this.dataService.allregisteredBillerList = []
            console.log("bbpstransfer")
            var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.dataService.primaryAccountDtl.accountNo);
      
            var bbpsJson = [];      
      
            for(var i = 0 ;i< this.dataService.bbpsReceiptDetails.length;  i++){
              bbpsJson.push(  
                {
                  'key' : this.dataService.bbpsReceiptDetails[i].label,
                  'value' : this.dataService.bbpsReceiptDetails[i].field
                }
              )  
            }
      
            var splitTitles = doc.splitTextToSize(" :"+ this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress, 30);
            doc.text(splitTitles, pageWidth - 150, 25, {align :'left'});
            var branchJSON = [
              { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
              { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
              { 'key': 'Ifsc Code', 'value': this.accountList[0].ifscCode },
              { 'key': 'Address', 'value': this.accountList[0].BRANCHADDRESS },
               
            ];
            this.loader.hideLoader();
            this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, bbpsJson, 'BBPS', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        

        break
      case 'addPayee':
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.dataService.primaryAccountDtl.accountNo);

        var addPayeeReqJson = [];

        if (this.dataService.beneficiaryType == '1') {
          addPayeeReqJson.push({ 'key': 'PAYEE_NAME', 'value': this.receiptResp?.payeeAccName });
          addPayeeReqJson.push({ 'key': 'PAYEE_ACCOUNT_NUMBER', 'value': this.receiptResp?.payeeAccNo });
          addPayeeReqJson.push({ 'key': 'NICK_NAME', 'value': this.receiptResp?.payeeNickName });
          addPayeeReqJson.push({ 'key': 'TRANSACTION_LIMIT', 'value': this.receiptResp?.payeeTransLimit });
        }
        else if (this.dataService.beneficiaryType == '2') {
          addPayeeReqJson.push({ 'key': 'PAYEE_NAME', 'value': this.receiptResp?.payeeAccName });
          addPayeeReqJson.push({ 'key': 'PAYEE_ACCOUNT_NUMBER', 'value': this.receiptResp?.payeeAccNo });
          addPayeeReqJson.push({ 'key': 'NICK_NAME', 'value': this.receiptResp?.payeeNickName });
          addPayeeReqJson.push({ 'key': 'IFSC_CODE', 'value': this.receiptResp?.payeeIfsc });
          addPayeeReqJson.push({ 'key': 'TRANSACTION_LIMIT', 'value': this.receiptResp?.payeeTransLimit });
        }
        else if (this.dataService.beneficiaryType == '3') {
          addPayeeReqJson.push({ 'key': 'PAYEE_MOBILE_NUMBER', 'value': this.receiptResp?.payeeMobileNo });
          addPayeeReqJson.push({ 'key': 'MMID', 'value': this.receiptResp?.payeeMMID });
          addPayeeReqJson.push({ 'key': 'PAYEE_NAME', 'value': this.receiptResp?.payeeAccName });
          addPayeeReqJson.push({ 'key': 'NICK_NAME', 'value': this.receiptResp?.payeeNickName });
          addPayeeReqJson.push({ 'key': 'TRANSACTION_LIMIT', 'value': this.receiptResp?.payeeTransLimit });
        }
        var splitTitles = doc.splitTextToSize(" :" + this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].BranchAddress, 30);
        doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
        var branchJSON = [
          { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
          { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
          { 'key': 'Branch Address', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].BranchAddress },
          { 'key': 'Branch Contact', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].phone_number },
          { 'key': 'IFSC', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].ifscCode },
        ];
        this.loader.hideLoader();
        this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, addPayeeReqJson, 'Add Payee', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        break;
      case 'openDeposit':
        if (this.dataService.feedbackType == 'FDDetails') {
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.maturityPayoutAccount);
          console.log('selected account details : ', selAccDtl);
          var currencySymbol = { currency: selAccDtl[0]?.currency, symbol: getCurrencySymbol(selAccDtl[0]?.currency, 'narrow'), negativePattern: '(! #)', formatWithSymbol: true };

          this.receiptFDOpenDepositJson[0].value = this.receiptResp.depositType ? this.receiptResp.depositType : '-';
          this.receiptFDOpenDepositJson[1].value = this.receiptResp.schemeName ? this.receiptResp.schemeName : '-'; // == 'G' ? 'General' : 'Tax Saver' : '-'
          this.receiptFDOpenDepositJson[2].value = this.receiptResp.depositorType ? this.receiptResp.depositorType : '-';
          this.receiptFDOpenDepositJson[3].value = this.receiptResp.depositAmount ? this.receiptResp.depositAmount : '-';
          this.receiptFDOpenDepositJson[4].value = this.receiptResp.tenure ? this.receiptResp.tenure : '-';
          this.receiptFDOpenDepositJson[5].value = this.receiptResp.interestRate ? this.receiptResp.interestRate + ' %' : '-';
          this.receiptFDOpenDepositJson[6].value = this.receiptResp.maturityAmount ? this.receiptResp.maturityAmount : '-';
          this.receiptFDOpenDepositJson[7].value = this.receiptResp.maturityDate ? this.receiptResp.maturityDate : '-';
          this.receiptFDOpenDepositJson[8].value = this.receiptResp.modeOfOperation ? this.receiptResp.modeOfOperation : '-';
          this.receiptFDOpenDepositJson[9].value = this.receiptResp.maturityInstruction ? this.receiptResp.maturityInstruction : '-';
          this.receiptFDOpenDepositJson[10].value = this.receiptResp.maturityPayoutAccount ? this.receiptResp.maturityPayoutAccount : '-';
          this.receiptFDOpenDepositJson[11].value = this.receiptResp.nomineeName ? this.receiptResp.nomineeName : '-';

          var interestFrequency = this.receiptResp.interestPayout ? this.receiptResp.interestPayout : '-';
          // if(this.receiptResp.interestPayout == 'M'){
          //   interestFrequency = 'Monthly';
          // }else if(this.receiptResp.interestPayout == 'Q'){
          //   interestFrequency = 'Quarterly';
          // }else if(this.receiptResp.interestPayout == 'C'){
          //   interestFrequency = 'On Maturity';
          // }

          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-' },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode ? selAccDtl[0].branchCode : '-' },
            { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-' },
            { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number ? selAccDtl[0].phone_number : '-' },
            { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode ? selAccDtl[0].ifscCode : '-' },
          ];

          var tblArr = [this.dataService.FDRDAccNumber, this.receiptFDOpenDepositJson[1].value, this.receiptFDOpenDepositJson[4].value, this.receiptFDOpenDepositJson[5].value, this.receiptFDOpenDepositJson[8].value, interestFrequency, this.receiptFDOpenDepositJson[9].value];

          var tblArrNext = [this.receiptFDOpenDepositJson[3].value, this.datepipe.transform(new Date(), 'dd-MM-yyyy'), this.receiptFDOpenDepositJson[7].value, this.convertCurrency(this.receiptFDOpenDepositJson[6].value, currencySymbol), (selAccDtl[0]['001'] ? selAccDtl[0]['001'] : '-') + ' & ' + (selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-'), selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-'];
          this.loader.hideLoader();
          this.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptFDOpenDepositJson, 'FD_Receipt', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime, tblArr, tblArrNext);
        }

        else if (this.dataService.feedbackType == 'RDDetails') {
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.maturityPayoutAccount);
          console.log('selected account details : ', selAccDtl);
          var currencySymbol = { currency: selAccDtl[0]?.currency, symbol: getCurrencySymbol(selAccDtl[0]?.currency, 'narrow'), negativePattern: '(! #)', formatWithSymbol: true };

          this.receiptRDOpenDepositJson[0].value = this.receiptResp.depositType ? this.receiptResp.depositType : '-';
          this.receiptRDOpenDepositJson[1].value = this.receiptResp.depositorType ? this.receiptResp.depositorType : '-';
          this.receiptRDOpenDepositJson[2].value = this.receiptResp.installmentAmount ? this.receiptResp.installmentAmount : '-';
          this.receiptRDOpenDepositJson[3].value = this.receiptResp.tenure ? this.receiptResp.tenure : '-';
          this.receiptRDOpenDepositJson[4].value = this.receiptResp.interestRate ? this.receiptResp.interestRate + ' %' : '-';
          this.receiptRDOpenDepositJson[5].value = this.receiptResp.monthlyDebitDate ? this.receiptResp.monthlyDebitDate : '-';
          this.receiptRDOpenDepositJson[6].value = this.receiptResp.maturityAmount ? this.receiptResp.maturityAmount : '-';
          this.receiptRDOpenDepositJson[7].value = this.receiptResp.maturityDate ? this.receiptResp.maturityDate : '-';
          this.receiptRDOpenDepositJson[8].value = this.receiptResp.modeOfOperation ? this.receiptResp.modeOfOperation : '-';
          this.receiptRDOpenDepositJson[9].value = this.receiptResp.debitAccount ? this.receiptResp.debitAccount : '-';
          this.receiptRDOpenDepositJson[10].value = this.receiptResp.maturityPayoutAccount ? this.receiptResp.maturityPayoutAccount : '-';
          this.receiptRDOpenDepositJson[11].value = this.receiptResp.nomineeName ? this.receiptResp.nomineeName : '-';
          if (this.receiptResp.autoClosureFlag) {
            this.receiptRDOpenDepositJson[12].value = 'Yes';
          } else {
            this.receiptRDOpenDepositJson[12].value = 'No';
          }
          this.receiptRDOpenDepositJson[13].value = this.receiptResp.schemeName ? this.receiptResp.schemeName : '-';

          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-' },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode ? selAccDtl[0].branchCode : '-' },
            { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-' },
            { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number ? selAccDtl[0].phone_number : '-' },
            { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode ? selAccDtl[0].ifscCode : '-' },
          ];

          var tblArr = [this.dataService.FDRDAccNumber, this.receiptRDOpenDepositJson[13].value, this.receiptRDOpenDepositJson[3].value, this.receiptRDOpenDepositJson[4].value, this.receiptRDOpenDepositJson[8].value, this.receiptRDOpenDepositJson[2].value];

          var tblArrNext = [(selAccDtl[0]['001'] ? selAccDtl[0]['001'] : '-') + ' & ' + (selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-'), selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-', this.datepipe.transform(this.receiptRDOpenDepositJson[5].value, 'dd-MM-yyyy'), this.receiptRDOpenDepositJson[7].value, this.convertCurrency(this.receiptRDOpenDepositJson[6].value, currencySymbol), this.receiptRDOpenDepositJson[12].value.toLocaleUpperCase()];
          this.loader.hideLoader();
          this.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptRDOpenDepositJson, 'RD_Receipt', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime, tblArr, tblArrNext);
        }
      break;
      case 'closeDeposit':
        if (this.dataService.closeDepositType == 'closeFD') {
          console.log('selected account details : ', this.receiptResp);
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.FDAccNumber);

          console.log('selected account details : ', selAccDtl);
          this.receiptCloseFDJson[0].value = this.receiptResp.depositType ? this.receiptResp.depositType : '-';
          this.receiptCloseFDJson[1].value = this.receiptResp.depositScheme ? this.receiptResp.depositScheme : '-';
          this.receiptCloseFDJson[2].value = this.receiptResp.FDAccNumber ? this.receiptResp.FDAccNumber : '-';
          this.receiptCloseFDJson[3].value = this.receiptResp.rateOfInterest ? this.receiptResp.rateOfInterest + '%' : '-';
          this.receiptCloseFDJson[4].value = this.receiptResp.maturityPayoutAccount ? this.receiptResp.maturityPayoutAccount : '-';

          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
            { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS },
            { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number },
            { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode },
          ];
          this.loader.hideLoader();
          this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptCloseFDJson, 'Close_FD_Receipt', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        }
        else if (this.dataService.closeDepositType == 'closeRD') {
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.RDAccNumber);
          console.log('selected account details : ', selAccDtl);

          this.receiptCloseRDJson[0].value = this.receiptResp.depositType ? this.receiptResp.depositType : '-';
          this.receiptCloseRDJson[1].value = this.receiptResp.RDAccNumber ? this.receiptResp.RDAccNumber : '-';
          this.receiptCloseRDJson[2].value = this.receiptResp.rateOfInterest ? this.receiptResp.rateOfInterest + '%' : '-';
          this.receiptCloseRDJson[3].value = '₹ ' + this.receiptResp.depositAmount ? this.receiptResp.depositAmount : '-';
          this.receiptCloseRDJson[4].value = this.receiptResp.maturityPayoutAccount ? this.receiptResp.maturityPayoutAccount : '-';

          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
            { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS },
            { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number },
            { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode },
          ];
          this.loader.hideLoader();
          this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptCloseRDJson, 'Close_RD_Receipt', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        }
        break;
      case 'chequeBookRequest':
          var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.receiptResp.accNumber);

          this.receiptChequeBookReqJson[0].value = this.receiptResp.accNumber;
          this.receiptChequeBookReqJson[1].value = this.receiptResp.checkPageNo;
          this.receiptChequeBookReqJson[2].value = this.receiptResp.commAddress;
    
          var splitTitles = doc.splitTextToSize(" :"+ this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress, 30);
          doc.text(splitTitles, pageWidth - 150, 25, {align :'left'});
          var branchJSON = [
            { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name },
            { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode },
            { 'key': 'Branch Address', 'value': this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress },
            { 'key': 'Branch Contact', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].phone_number },
            { 'key': 'IFSC', 'value': this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].ifscCode },
          ];
          this.loader.hideLoader();
          this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.receiptChequeBookReqJson, 'Chequebook request', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
      break;
      case 'positivePay':
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.dataService.primaryAccountDtl.accountNo);
        this.positivePayReqJson[0].value = this.receiptResp?.selectAccount;
        this.positivePayReqJson[1].value = this.receiptResp?.selectedName;
        this.positivePayReqJson[2].value = this.receiptResp?.payeeName;
        this.positivePayReqJson[3].value = this.receiptResp?.chequeNumber;
        this.positivePayReqJson[4].value = this.receiptResp?.amount;
        this.positivePayReqJson[5].value = this.receiptResp?.datepicker1;
        this.positivePayReqJson[6].value = this.receiptResp?.micr;

        var splitTitles = doc.splitTextToSize(" :" + this.newdata == undefined || this.newdata == null ? "" : this.newdata[0].BranchAddress, 30);
        doc.text(splitTitles, pageWidth - 150, 25, { align: 'left' });
        var branchJSON = [
          { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-' },
          { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode ? selAccDtl[0].branchCode : '-' },
          { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-' },
          { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number ? selAccDtl[0].phone_number : '-' },
          { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode ? selAccDtl[0].ifscCode : '-' },
        ];
        this.loader.hideLoader();
        this.common.generatePDF(imgColor, this.receiptType, this.dataService.receiptmsg, this.refTransJson, this.positivePayReqJson, 'Positive Pay', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
      break;
      case 'stopCheque':
        var selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.dataService.primaryAccountDtl.accountNo);
        
        var splitTitles = doc.splitTextToSize(" :"+ this.newdata == undefined || this.newdata == null  ? "" : this.newdata[0].BranchAddress, 30);
        doc.text(splitTitles, pageWidth - 150, 25, {align :'left'});
        var branchJSON = [
          { 'key': 'Branch Name', 'value': selAccDtl[0].branch_name ? selAccDtl[0].branch_name : '-' },
          { 'key': 'Branch Code', 'value': selAccDtl[0].branchCode ? selAccDtl[0].branchCode : '-' },
          { 'key': 'Branch Address', 'value': selAccDtl[0].BRANCHADDRESS ? selAccDtl[0].BRANCHADDRESS : '-' },
          { 'key': 'Branch Contact', 'value': selAccDtl[0].phone_number ? selAccDtl[0].phone_number : '-' },
          { 'key': 'IFSC', 'value': selAccDtl[0].ifscCode ? selAccDtl[0].ifscCode : '-' },
        ];
        this.loader.hideLoader();
        if(this.receiptResp?.chequeNo != '-') {
          this.receiptStopChequeJson[0].value = this.receiptResp?.accountNo ? this.receiptResp?.accountNo : '-';
          this.receiptStopChequeJson[1].value = this.receiptResp?.chequeNo ? this.receiptResp?.chequeNo : '-';
          this.receiptStopChequeJson[2].value = this.receiptResp?.remarks ? this.receiptResp?.remarks : '-';
          this.common.generatePDF(imgColor, 'Successful', this.dataService.receiptmsg, this.refTransJson, this.receiptStopChequeJson, 'Stop Cheque', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        }
        else {
          this.receiptStopBulkChequeJson[0].value = this.receiptResp?.accountNo ? this.receiptResp?.accountNo : '-';
          this.receiptStopBulkChequeJson[1].value = this.receiptResp?.remarks ? this.receiptResp?.remarks : '-';
          this.receiptStopBulkChequeJson[2].value = this.receiptResp?.fromChequeNo ? this.receiptResp?.fromChequeNo : '-';
          this.receiptStopBulkChequeJson[3].value = this.receiptResp?.toChequeNo ? this.receiptResp?.toChequeNo : '-';
          this.common.generatePDF(imgColor, 'Successful', this.dataService.receiptmsg, this.refTransJson, this.receiptStopBulkChequeJson, 'Stop Cheque', branchJSON, type, selAccDtl[0].accountNo, this.todayDateTime);
        }
      break;
    }
  }

  /*** Generate E-Receipt PDF OPEN DEPOSIT*/
  generatePDF(imageColor, msg, submsg, reftransJSON, receiptJSON, receiptName, branchJSON, printPDF, accountNo, todayDateTime, tblArr, tblArrNext) {

    let screenTypeDeposit = this.dataService.feedbackType == 'FDDetails' ? 'FD' : this.dataService.feedbackType == 'RDDetails' ? 'RD' : ''
    var pdfsize = 'a4';
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

    //FD RD Check
    if (screenTypeDeposit == 'FD') {
      doc.text("Online Fixed Deposit Receipt", pageWidth / 2, 35, { align: 'center' });
    }
    else {
      doc.text("Online Recurring Deposit Advice", pageWidth / 2, 35, { align: 'center' });
    }

    doc.setFontSize(10);
    doc.text(this.datepipe.transform(new Date(), 'dd MMMM, yyyy'), pageWidth - 20, 40, { align: 'right' });

    doc.text("Customer Name : " + this.dataService.userDetails.customerName, 15, 45, { align: 'left' });

    if (this.customerDetails[0].add1 == "" || this.customerDetails[0].add2 == "") {
      doc.text("Customer Address : " + this.customerDetails[0].permenantAdd1 + ' ' + this.customerDetails[0].permenantAdd2, 15, 50, { align: 'left' });
    } else {
      doc.text("Customer Address : " + this.customerDetails[0].add1 + ' ' + this.customerDetails[0].add2, 15, 50, { align: 'left' });
    }

    doc.text("Customer ID : " + this.dataService.userDetails.cifNumber, 15, 55, { align: 'left' });

    if (this.dataService.userDetails.MobileNo == "") {
      doc.text("Mobile Number : " + this.dataService.profileDetails[0].mobileNo, 15, 60, { align: 'left' });
    } else {
      doc.text("Mobile Number : " + this.dataService.userDetails.MobileNo, 15, 60, { align: 'left' });
    }

    doc.text("PAN Number : " + this.customerDetails[0].panNumber, 15, 65, { align: 'left' });

    //FD RD Check
    if (this.dataService.feedbackType == 'FDDetails') {
      if (this.receiptFDOpenDepositJson[11].value) {
        doc.text("Nominee Registered : Yes", 15, 70, { align: 'left' });
      } else {
        doc.text("Nominee Registered : No", 15, 70, { align: 'left' });
      }
      doc.text("Nominee Name : " + this.receiptFDOpenDepositJson[11].value, 15, 75, { align: 'left' });
    } else {
      if (this.receiptRDOpenDepositJson[11].value) {
        doc.text("Nominee Registered : Yes", 15, 70, { align: 'left' });
      } else {
        doc.text("Nominee Registered : No", 15, 70, { align: 'left' });
      }
      doc.text("Nominee Name : " + this.receiptRDOpenDepositJson[11].value, 15, 75, { align: 'left' });
    }


    var newData: any = [];
    newData.push(tblArr);

    //FD RD Check
    var _columns = screenTypeDeposit == 'FD' ?
      ["FD Account Number", "FD Scheme Name", "Period", "Interest Rate (% .p.a)", "Mode of Operation", "Interest Frequency", "Maturity Instructions"] :
      ["RD Account Number", "RD Scheme Name", "Period", "Interest Rate (% .p.a)", "Mode of Operation", "RD Instalment Amount"];

    var _rows = newData;
    console.log("newArray ====>");
    console.log(JSON.stringify(_rows));

    if (screenTypeDeposit == 'FD') {
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
    } else {
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
    }


    var newDataNext: any = [];
    newDataNext.push(tblArrNext);

    //FD RD Check
    var _columnsNext = screenTypeDeposit == 'FD' ?
      ["Principal Amount", "FD Open Date", "Maturity Date", "Maturity Amount", "Branch Code & Name", "Branch Address"] :
      ["Branch Code & Name", "Branch Address", "RD Start Date", "Maturity Date", "Maturity Amount", "Auto Closure"];

    var _rowsNext = newDataNext;
    console.log("newArray ====>");
    console.log(JSON.stringify(_rowsNext));

    //FD RD Check
    if (screenTypeDeposit == 'FD') {
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
    } else {
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

    }
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

    if (printPDF == 'Y') {
      if (!window.hasOwnProperty('cordova')) {
        doc.autoPrint();
        window.open(doc.output('bloburl').toString());
      }
      else {
        this.common.shareDownloadedPDF(doc, receiptName + '_xx' + this.maskCharacter(accountNo, 4) + '_' + todayDateTime);
      }
    }
    else {
      this.common.downloadPDF(doc, receiptName + '_xx' + this.maskCharacter(accountNo, 4) + '_' + todayDateTime);
    }
  }

  maskCharacter(str, n) {
    // Slice the string and replace with
    // mask then add remaining string
    // return ('' + str).slice(0, -n).replace(/./g, "*")+ ('' + str).slice(-n);
    return str.slice(-n);
  }

  openPopup(popup) {
    this.common.openPopup('div.popup-bottom.' + popup)
  }

  closePopup(popup) {
    this.common.closePopup('div.popup-bottom.' + popup)
  }

  addAndDeleteFav() {
    if (this.isFavourite) {
      //this.deleteFavourite();
    }
    else {
      //this.saveAsFavorite();
    }
  }

  shareDetails() {
    this.shareViaMail();
  }
  /**
   * share details via mail in desktop
   */
  shareViaMail() {
    let details = this.getValuesToSend();
    window.open('mailto:?subject=Receipt&body=' + details);
  }
  /**
   * Get selected values from account details
   */
  getValuesToSend() {
    let selectedFields = "";
    if (this.receiptResp.type == "vpa") {
      selectedFields += "UPI Id :" + this.receiptResp.payerAddr + ", ";
      selectedFields += "To Payee :" + this.receiptResp.payeeAddr + ", ";
    }
    else if (this.receiptResp.type == "mmid") {
      selectedFields += "From Account  :" + this.receiptResp.from_acc + ", ";
      selectedFields += "MMID :" + this.receiptResp.payeeMMID + ", ";
      selectedFields += "MOBILE NO :" + this.receiptResp.payeeMobile + ", ";

    }
    else {
      selectedFields += "From Account :" + this.receiptResp.from_acc + ", ";
      selectedFields += "To Account :" + this.receiptResp.to_acc + ", ";
    }

    selectedFields += "Payee Name :" + this.receiptResp.payee_name + ", ";
    selectedFields += "Amount :" + OSREC.CurrencyFormatter.format(this.receiptResp.amount, { currency: 'INR', symbol: 'INR' }); ", ";
    //  OSREC.CurrencyFormatter.format( this.receiptResp.amount, { currency: 'INR', symbol: 'INR' });
    selectedFields += "Remark :" + this.receiptResp.remarks + ", ";
    selectedFields += "Schedule Date :" + this.receiptResp.date + ", ";

    return selectedFields.replace(/,\s*$/, "");
  }

  goTofeedback() {
    this.router.navigate(['/feedback']);
  }

  goBack() {
    if (this.dataService.screenType == 'debitCard' ||
      this.dataService.screenType == 'reissuecard' ||
      this.dataService.screenType == 'getPhysicalCard' ||
      this.dataService.screenType == 'generatePin' ||
      this.dataService.screenType == 'CardDetails' ||
      this.dataService.screenType == 'blockCard') {
      this.router.navigateByUrl('/debitCards');
    } else if (this.dataService.screenType == 'closeDeposit') {
        if (this.constant.getPlatform() == 'web') {
          this.router.navigateByUrl('/myDeposits');
        }
        else {
          this.router.navigateByUrl('/myAccountMobile'); //JIJO / VIVEK
        }
    } else {
      if (this.constant.getPlatform() == "web") {
        this.router.navigateByUrl('/dashboard');
      }
      else {
        this.router.navigateByUrl('/dashboardMobile');
      }
    }
  }


  AccountEnquiryDtl() {
    var param = this.receiptService.getAccountEnquiryParams(this.receiptObjs, this.branchcode);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ACCOUNTINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log("Enqury", data);
        this.newdata = data.set.records
        console.log("datass", this.newdata[0].ifscCode)
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  goToPage(routeName) {
    if (routeName == 'myDeposits' && this.constant.getPlatform() != "web") {
      routeName = "myAccountMobile";
    }
    this.router.navigateByUrl('/' + routeName);
  }

  convertCurrency(value, currency) {
    return OSREC.CurrencyFormatter.format(value, currency);
  }


}
