import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationStart } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppConstants } from 'src/app/app.constant';
import * as moment from 'moment';
import jspdf from 'jspdf';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TitleCasePipe } from '@angular/common';
import { getCurrencySymbol } from '@angular/common';
import * as fs from 'file-saver';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AccountsDetailedStatementService } from './accounts-detailed-statement.service';
import { CommonMethods } from 'src/app/services/common-methods';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { CERTIFICATECONFIGOBJ, DetailedStatementData, FORMTYPES, TRANSACTIONTYPEOBJ } from './accounts-detailed-statement-model';
import { AccountType } from '../../../../../enum/app-enum';
import { FontBase64 } from 'src/app/enum/app-enum';

declare var OSREC: any;
declare const ExcelJS: any;
declare var $;

@Component({
  selector: 'app-accounts-detailed-statement',
  templateUrl: './accounts-detailed-statement.component.html',
  styleUrls: ['./accounts-detailed-statement.component.scss']
})
export class AccountsDetailedStatementComponent implements OnDestroy, OnInit {
  constructor(
    private router: Router,
    public dataService: DataService,
    public constant: AppConstants,
    private storage: LocalStorageService,
    private http: HttpRestApiService,
    private detailStatementService: AccountsDetailedStatementService,
    public commonMethod: CommonMethods,
    public loader: pageLoaderService,
    public datePipe: DatePipe,
    private location: Location,
    private translatePipe: TranslatePipe,
    private titlecasePipe: TitleCasePipe
  ) {
    this.onNumberchange(10)
  }


  totalAccountList: any = [];
  detailStatementList: any = [];
  periodList: any = [];
  transactionCnt: any = [];
  finalDisplayValue = []

  lastPostingDate: any;
  serialNumber: any;
  lastBalance: any;
  selectedAccountNo: any;
  selAccDtl: any;
  accountDtls: any;
  accountOpeningdate: any;
  Date: any;
  lastDate: any;
  lastTransactionID: any;
  toDate: any;
  dayDiff: any;
  //LOAN BORRWOING 
  depositsDtl: any;
  loanUserDtl: any;

  selectPeriodDropdown: any = ""
  globalPeriod: any = 'Select'
  globalCount: any = 'Select'

  openBal: any = 0;
  totalDeposit: any = 0;
  totalWithdraw: any = 0;
  closingBal: any = 0;
  itemsToShow = 20
  counter = 0

  refreshDate: Date;
  selType: string = "period";
  moreListFlag = 'N'

  disable: boolean = false;
  hasErrorOneYear: boolean = false;
  dateGreaterThan: boolean = false;
  minmaxCheck: boolean

  maxFrom: Date = new Date();
  maxTo: Date = new Date();
  minFrom: Date = new Date('01-01-1900');
  minTo: Date = new Date('01-01-1900');

  selectPeriodDtl = {
    fromDate: "",
    toDate: "",
  }
  selectPeriodDtlForExel = {
    fromDate: "",
    toDate: "",
  }

  dsForm: FormGroup;
  @ViewChild('search') advSearch: ElementRef;
  dtTrigger: Subject<any> = new Subject<any>();

  dtlStatementVal = {} as DetailedStatementData;
  transactionType = TRANSACTIONTYPEOBJ
  certificateConfig = CERTIFICATECONFIGOBJ
  formtypes: any = FORMTYPES


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.initialize();
    var self = this;
    $(document).on('click', '.paginate_button.next', function () {
      self.callDetailApiAgain();
    })
  }

  buildForm() {
    this.dsForm = this.dataService.buildForm(this.formtypes)
  }

  initialize() {
    this.buildForm();
    this.getAccountList('onload');
    this.selStatementType(this.selType);
    this.getPeriod();
    this.getCount();
    this.refreshDate = this.dataService.onRefreshDate;
  }


  onNumberchange(value) {
    if (this.finalDisplayValue.length > 0) {
      this.itemsToShow = value
      this.finalDisplayValue = []
      for (var i = 0; i < value; i++) {
        this.finalDisplayValue.push(this.detailStatementList[i])
      }
    }

  }

  callDetailApiAgain() {
    if (this.moreListFlag == "Y") {
      this.selectPeriodDtl.fromDate = this.lastDate
      this.selectPeriodDtl.toDate = this.datePipe.transform(this.dsForm.value.toDate, 'yyyyMMdd');
      var param = this.detailStatementService.getDetailedStatementParam(this.selAccDtl, this.getdetailedStatementDataMore(this.dsForm.value, this.lastTransactionID, this.lastDate, this.lastPostingDate, this.lastBalance, this.serialNumber));
      this.getDetailedStatement(param)
    }
  }


  getdetailedStatementDataMore(formData, lastTransId, lastTransDate, lastPostDate, lastBalance, serialNumber) {
    var fromDate = "", toDate = "";
    if (this.selType == 'period') {
      var d: any;
      var to: any;
      var from: any;
      var lastTrans: any;
      var TransDate: any;
      var count: any;
      var postDate: any;
      var sort: any;
      var balance: any
      switch (this.dsForm.value.selectPeriod) {
        case "LAST_WEEK":
          d = new Date();
          //d.setDate(d.getDate() -7);
          to = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
          from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
          break;
        case "CURRENT_MONTH":
          d = new Date();
          from = new Date(d.getFullYear(), d.getMonth(), 1);
          to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          break;
        case "QUARTERLY":
          d = new Date();
          var quarter = Math.floor((d.getMonth() / 3));
          from = new Date(d.getFullYear(), quarter * 3, 1);
          to = new Date(from.getFullYear(), from.getMonth() + 3, 0);
          break;
        case "HALF_YEARLY":
          d = new Date();
          var halfyrly = Math.floor((d.getMonth() / 6));
          from = new Date(d.getFullYear(), halfyrly * 6, 1);
          to = new Date(from.getFullYear(), from.getMonth() + 6, 0);
          break;
        case "YEARLY":
          from = new Date(new Date().getFullYear(), 0, 1);
          to = new Date(new Date().getFullYear(), 0, 365);
          break;
        case "PREVIOUS_FY":
          from = new Date(new Date().getFullYear() - 1, 0, 1);
          to = new Date(new Date().getFullYear() - 1, 0, 365)
          break;
        default:
          from = undefined;
          to = undefined;
          break;
      }
      fromDate = this.selectPeriodDtl.fromDate;
      toDate = this.datePipe.transform(to, 'yyyyMMdd');
      lastTrans = lastTransId
      TransDate = lastTransDate
      postDate = lastPostDate
      sort = ''
      count = ''
      balance = lastBalance
    }
    else if (this.selType == 'dateRange') {
      // fromDate = this.datePipe.transform( this.dsForm.value.fromDate, 'yyyyMMdd')
      // toDate = this.datePipe.transform( this.dsForm.value.fromDate, 'yyyyMMdd')
      fromDate = this.selectPeriodDtl.fromDate;
      toDate = this.selectPeriodDtl.toDate;
      lastTrans = lastTransId
      TransDate = lastTransDate
      postDate = lastPostDate
      sort = ''
      count = ''
      balance = lastBalance
    }
    else if (this.selType == 'transactionCount') {
      d = new Date();
      toDate = this.datePipe.transform(d, 'yyyyMMdd');
      fromDate = this.datePipe.transform(d.setDate(d.getDate() - 90), 'yyyyMMdd');
      lastTrans = lastTransId
      TransDate = lastTransDate
      postDate = lastPostDate
      sort = "D"
      balance = lastBalance

      switch (+formData.transCount) {
        case 50:
          if (this.detailStatementList.length == 40)
            count = 10
          else
            count = formData.transCount
          break;
        case 30:
          if (this.detailStatementList.length == 20)
            count = 10
          else
            count = formData.transCount
          break;
      }

    }


    this.dtlStatementVal.START_DATE = "" + fromDate;
    this.dtlStatementVal.END_DATE = toDate != "" ? "" + toDate : "        ";
    this.dtlStatementVal.LOW_AMOUNT = formData.minAmount != "" ? this.randomDigit(formData.minAmount) : "                 ";
    this.dtlStatementVal.HIGH_AMOUNT = formData.maxAmount != "" ? this.randomDigit(formData.maxAmount) : "                 ";
    this.dtlStatementVal.FIRST_CHEQUE_NUMBER = "                ";
    this.dtlStatementVal.LAST_CHEQUE_NUMBER = "                ";
    this.dtlStatementVal.NUMBER_OF_RECORDS_REQUESTED = count != "" ? count : "  ";
    this.dtlStatementVal.SORT_CRITERIA = sort != "" ? sort : " ";
    this.dtlStatementVal.CRDR_FLAG = formData.transType != "" ? formData.transType : " ";
    this.dtlStatementVal.LAST_TRANSACTION_DATE = TransDate != "" ? TransDate : "        ";
    this.dtlStatementVal.LAST_TRANSACTION_ID = lastTrans != "" ? this.randomIDDigit(lastTrans) : "         ";
    this.dtlStatementVal.LAST_PART_TRANSACTION_NUMBER = serialNumber != "" ? this.randomSerialNum(serialNumber) : "    ";
    this.dtlStatementVal.LAST_POSTING_DATE = postDate != "" ? postDate : "              ";
    this.dtlStatementVal.LAST_BALANCE = balance != "" ? this.randomDigit(balance) : "                 ";


    var detailStatementStr = "";
    detailStatementStr = this.dtlStatementVal.START_DATE +
      this.dtlStatementVal.END_DATE +
      this.dtlStatementVal.LOW_AMOUNT +
      this.dtlStatementVal.HIGH_AMOUNT +
      this.dtlStatementVal.FIRST_CHEQUE_NUMBER +
      this.dtlStatementVal.LAST_CHEQUE_NUMBER +
      this.dtlStatementVal.NUMBER_OF_RECORDS_REQUESTED +
      this.dtlStatementVal.SORT_CRITERIA +
      this.dtlStatementVal.CRDR_FLAG +
      this.dtlStatementVal.LAST_TRANSACTION_DATE +
      this.dtlStatementVal.LAST_TRANSACTION_ID +
      this.dtlStatementVal.LAST_PART_TRANSACTION_NUMBER +
      this.dtlStatementVal.LAST_POSTING_DATE +
      this.dtlStatementVal.LAST_BALANCE;


    detailStatementStr = detailStatementStr.trim();


    console.log(detailStatementStr);

    return detailStatementStr;

  }


  getAccountList(type?: any) {
    var param = this.detailStatementService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("set")) {
          if (this.dataService.accTypeSelected == "Operative") {

            for (var i = 0; i < data.set.records.length; i++) {
              if (data.set.records[i].accountType != "CAPPI") {
                if (data.set.records[i].SchemeCode == AccountType.SAVING_ACCOUNT || data.set.records[i].SchemeCode == AccountType.CURRENT_ACCOUNT || data.set.records[i].SchemeCode == AccountType.CASH_CREDIT || data.set.records[i].SchemeCode == AccountType.OVER_DRAFT_ACCOUNT)
                  this.totalAccountList.push(data.set.records[i])
              }
            }

          }
          else if (this.dataService.accTypeSelected == "Deposits") {

            for (var i = 0; i < data.set.records.length; i++) {
              if (data.set.records[i].accountType != "CAPPI") {
                if (data.set.records[i].SchemeCode == AccountType.FIXED_DEPOSITE_ACCOUNT)
                  this.totalAccountList.push(data.set.records[i])
              }
            }

          }
          else if (this.dataService.accTypeSelected == "Borrowings" || this.dataService.accTypeSelected == "Loans") {

            for (var i = 0; i < data.set.records.length; i++) {
              if (data.set.records[i].accountType != "CAPPI") {
                if (data.set.records[i].SchemeCode == AccountType.LOAN_ACCOUNT)
                  this.totalAccountList.push(data.set.records[i])
              }
            }

          }

          console.log(this.totalAccountList);
          if (type == 'onload') {
            this.dsForm.controls['selAcc'].setValue(this.dataService.accDetails.accountNo);
            this.dsForm.controls['filtertype1'].setValue("period");
            this.getSelectedAccount(this.dsForm.value.selAcc)
          }
        }
      }

    }, (error) => {
      console.log(error);
    });

  }


  getSelectedAccount(accNo) {
    this.detailStatementList = []
    this.finalDisplayValue = []
    this.lastDate = ""
    this.selectedAccountNo = accNo;
    var selAccDtl = this.totalAccountList.filter(item => item.accountNo == accNo);
    this.selAccDtl = selAccDtl[0];
    if (this.dataService.accTypeSelected == "Deposits") {
      this.DepositeAccountEnquery();
      this.AccountEnquiryDtl();
    }
    else if (this.dataService.accTypeSelected == 'Loans') {
      this.getLoanEnq(this.selAccDtl.accountNo);
      this.AccountEnquiryDtl();
    } else {
      this.AccountEnquiryDtl();
    }
  }

  DepositeAccountEnquery() {
    let param = this.detailStatementService.depositeAccountEquirey(this.selAccDtl.accountNo);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DEPOSITACCOUNTINQUIRY).subscribe(data => {
      console.log(data);
      console.log('Temp Deposite Data :: ');
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data);
        this.depositsDtl = data.set.records[0];
      }
    }, (error) => {
      console.log(error);
    });
  }


  AccountEnquiryDtl() {
    var param = this.detailStatementService.getAccountEnquiryParam(this.selAccDtl);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_ACCOUNTINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data);
        if (data.hasOwnProperty("set")) {
          this.accountDtls = data.set.records[0];

          if (this.dataService.accTypeSelected == 'Operative') {
            this.accountOpeningdate = data.set.records[0].statement.split(',')[3];
            console.log("Opening date::", this.accountOpeningdate);
            this.Date = this.openingDate()
            console.log("Date", this.openingDate());
            console.log("Account details::", this.accountDtls);
            //hardcoded for now need to be changed later
            if (this.accountDtls?.accountType == AccountType.SAVING_ACCOUNT) {
              this.accountDtls.CurrentRateofInterest = "3.10* %";
            }
            else if (this.accountDtls?.accountType == AccountType.CURRENT_ACCOUNT) {
              this.accountDtls.CurrentRateofInterest = "00 %";
            }
            else if (this.accountDtls?.accountType == AccountType.CASH_CREDIT) {
              this.accountDtls.CurrentRateofInterest = "-";
            }
            else if (this.accountDtls?.accountType == AccountType.OVER_DRAFT_ACCOUNT) {
              this.accountDtls.CurrentRateofInterest = "-";
            }
          }
        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  getLoanEnq(accNo) {
    var param = this.detailStatementService.getMyLoansInquiry(accNo, this.selAccDtl.branchCode);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_LOANACCOUNTINQUIRY).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty("set")) {
          this.loanUserDtl = data.set.records[0]
        }
      }
    }, (error) => {
      console.log(error);
    });
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

  closePopup() {
    this.commonMethod.closePopup('div.popup-bottom');
  }



  toggleDisable() {
    if (this.disable) {
      this.disable = false;
      this.dsForm.get('minAmount').setValidators(Validators.required);
      this.dsForm.get('maxAmount').setValidators(Validators.required);
      this.dsForm.get('transType').setValidators(Validators.required);
    } else {
      this.disable = true;
      this.dsForm.get('minAmount').setValidators(Validators.nullValidator);
      this.dsForm.get('maxAmount').setValidators(Validators.nullValidator);
      this.dsForm.get('transType').setValidators(Validators.nullValidator);
    }
    console.log(this.disable);
    this.dsForm.get('minAmount').updateValueAndValidity();
    this.dsForm.get('maxAmount').updateValueAndValidity();
    this.dsForm.get('transType').updateValueAndValidity();
  }

  selStatementType(type) {
    this.selType = type;
    this.disable = type == 'dateRange' ? true : false;
    this.detailStatementList = []
    switch (type) {
      case "period":
        this.dsForm.get('fromDate').setValue("");
        this.dsForm.get('toDate').setValue("");
        this.dsForm.get('transCount').setValue("");
        this.dsForm.get('selectPeriod').setValidators(Validators.required);
        this.dsForm.get('fromDate').setValidators(Validators.nullValidator);
        this.dsForm.get('toDate').setValidators(Validators.nullValidator);
        this.dsForm.get('transCount').setValidators(Validators.nullValidator);
        break;
      case "dateRange":
        this.dsForm.get('selectPeriod').setValue("");
        this.dsForm.get('transCount').setValue("");
        this.dsForm.get('selectPeriod').setValidators(Validators.nullValidator);
        this.dsForm.get('fromDate').setValidators(Validators.required);
        this.dsForm.get('toDate').setValidators(Validators.required);
        this.dsForm.get('transCount').setValidators(Validators.nullValidator);
        break;
      case "transactionCount":
        this.dsForm.get('fromDate').setValue("");
        this.dsForm.get('toDate').setValue("");
        this.dsForm.get('selectPeriod').setValue("");
        this.dsForm.get('selectPeriod').setValidators(Validators.nullValidator);
        this.dsForm.get('fromDate').setValidators(Validators.nullValidator);
        this.dsForm.get('toDate').setValidators(Validators.nullValidator);
        this.dsForm.get('transCount').setValidators(Validators.required);
        break;
    }

    this.dsForm.get('selectPeriod').updateValueAndValidity();
    this.dsForm.get('fromDate').updateValueAndValidity();
    this.dsForm.get('toDate').updateValueAndValidity();
    this.dsForm.get('transCount').updateValueAndValidity();
  }

  selectAccount() {
    this.commonMethod.openPopup('div.popup-bottom.sel-account');
  }

  selectMobperiod() {
    this.commonMethod.openPopup('div.popup-bottom.sel-period');
  }
  selectMobcount() {
    this.commonMethod.openPopup('div.popup-bottom.sel-count');
  }


  validateForm() {
    if (this.dsForm.invalid) {
      this.dsForm.get('selAcc').markAsTouched();
      this.dsForm.get('selectPeriod').markAsTouched();
      this.dsForm.get('fromDate').markAsTouched();
      this.dsForm.get('toDate').markAsTouched();
      this.dsForm.get('transCount').markAsTouched();
      this.dsForm.get('minAmount').markAsTouched();
      this.dsForm.get('maxAmount').markAsTouched();
      this.dsForm.get('transType').markAsTouched();
      return;
    }
  }

  submit(data) {
    console.log(" ========================  Inside submit data  =============================");
    this.commonMethod.showLoader();
    this.selectPeriodDtlForExel.fromDate = data.fromDate;
    this.selectPeriodDtlForExel.toDate = data.toDate;
    if (this.selType == "transactionCount")
      this.onCountSelected()
    if (this.selType == 'period')
      this.onPeriodChange(this.selectPeriodDropdown)
    this.validateForm();
    if (this.dsForm.valid && !this.hasErrorOneYear && !this.dateGreaterThan) {
      this.moreListFlag = "N"
      this.lastTransactionID = ""
      this.detailStatementList = []
      this.finalDisplayValue = []
      this.lastDate = ""
      console.log("from date ===>" + data.fromDate);
      console.log("to date ===>" + data.toDate);
      console.log(this.datePipe.transform(data.fromDate, 'yyyyMMdd'));
      // this.getdetailedStatementData(this.dsForm.value)

      var param = this.detailStatementService.getDetailedStatementParam(this.selAccDtl, this.getdetailedStatementData(this.dsForm.value));

      this.getDetailedStatement(param);
      var _param = this.detailStatementService.getDashboardHeader(this.selAccDtl, this.dsForm.value, this.selectPeriodDtl, this.selType);
      this.getDashboardData(_param);
    }
  }

  getDashboardData(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DASHBOARDHEADER).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("set")) {
          console.log(data.set.records);
          this.openBal = data.set.records[0].openingBalance;
          this.totalDeposit = data.set.records[0].totalDeposit
          this.totalWithdraw = data.set.records[0].totalWithdrawl
          this.closingBal = data.set.records[0].closingBalance

        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  getDetailedStatement(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_DETAILEDSTATEMENT).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00" && !resp.Result.toLowerCase().includes('no record')) {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("set")) {

          if (this.detailStatementList.length < 1) {
            this.detailStatementList = data.set.records;
            this.dtTrigger.next('');
            // this.nextCount = 1
            for (var i = 0; i < this.itemsToShow; i++) {
              if (data.set.records[i] != "" && data.set.records[i] != undefined && data.set.records.length != 0)
                this.finalDisplayValue.push(data.set.records[i])
            }

          } else {
            for (var i = 0; i < data.set.records.length; i++) {
              this.detailStatementList.push(data.set.records[i])

              this.moreListFlag = data.responseParameter.flag
              this.lastDate = this.detailStatementList[this.detailStatementList.length - 1].TransactionDate
              this.lastTransactionID = this.detailStatementList[this.detailStatementList.length - 1].TransactionId
              this.lastPostingDate = this.detailStatementList[this.detailStatementList.length - 1].postedDateAndTime
              this.lastBalance = this.detailStatementList[this.detailStatementList.length - 1].closingBalance
              this.serialNumber = this.detailStatementList[this.detailStatementList.length - 1].serialNumber
              if (data.set.records[i] != "" && data.set.records[i] != undefined && data.set.records.length != 0)
                this.finalDisplayValue.push(data.set.records[i])
            }
            console.log('this.detailStatementList Inside FOR', this.detailStatementList);
            var self = this;
          }

          console.log('lastDate' + this.lastDate)
          console.log('lastTransactionID' + this.lastTransactionID)
          console.log('srno' + this.serialNumber)


          this.lastDate = this.detailStatementList[this.detailStatementList.length - 1].TransactionDate
          this.lastTransactionID = this.detailStatementList[this.detailStatementList.length - 1].TransactionId
          this.moreListFlag = data.responseParameter.flag;
          this.lastPostingDate = this.detailStatementList[this.detailStatementList.length - 1].postedDateAndTime
          this.lastBalance = this.detailStatementList[this.detailStatementList.length - 1].closingBalance
          this.serialNumber = this.detailStatementList[this.detailStatementList.length - 1].serialNumber

          if (this.selType == 'transactionCount' && this.dsForm.value.transCount == "20" || this.dsForm.value.transCount == "40" || this.dsForm.value.transCount == "10")
            this.moreListFlag = "N"

          if (this.selType == 'transactionCount' && this.dsForm.value.transCount == "50" && this.detailStatementList.length == 50)
            this.moreListFlag = "N"

          if (this.selType == 'transactionCount' && this.dsForm.value.transCount == "30" && this.detailStatementList.length == 30)
            this.moreListFlag = "N"
        }

      }
      else {
        this.dataService.information = resp.Result;
        this.dataService.informationLabel = this.translatePipe.transform('INFORMATION');
        this.dataService.primaryBtnText = this.translatePipe.transform('OK');
        this.commonMethod.openPopup('div.popup-bottom.show-common-info');
        this.moreListFlag = "N"
      }
    }, (error) => {
      console.log(error);
    });
  }

  formatDate(str) {
    return str.substring(6, 8) + '/' + str.substring(4, 6) + '/' + str.substring(0, 4);
  }


  getPeriod() {
    var param = this.detailStatementService.getAssessmentYearCall(this.certificateConfig.STATEMENT_PERIOD);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CERTIFICATECONFIGS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("listofDataset")) {
          this.periodList = data.listofDataset[0].records
        }
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });
  }

  getCount() {
    var param = this.detailStatementService.getAssessmentYearCall(this.certificateConfig.STATEMENT_COUNT);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CERTIFICATECONFIGS).subscribe(data => {
      console.log("STATEMENT_COUNT", data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty("listofDataset")) {
          this.transactionCnt = data.listofDataset[0].records
        }
      }
      else {
      }
    }, (error) => {
      console.log(error);
    });
  }

  onPeriodChange(value) {
    this.selectPeriodDropdown = value
    var d, to, from;
    switch (value) {
      case "LAST_WEEK":
        d = new Date();
        //d.setDate(d.getDate() -7);
        //to = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
        // from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        from = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6)
        break;
      case "CURRENT_MONTH":
        d = new Date();
        from = new Date(d.getFullYear(), d.getMonth(), 1);
        to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        break;
      case "QUARTERLY":
        d = new Date();
        // var quarter = Math.floor((d.getMonth() / 3));
        //from = new Date(d.getFullYear(),d.getMonth() - 3)
        //to = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        from = new Date(to.getFullYear(), to.getMonth() - 3, to.getDate())
        break;
      case "HALF_YEARLY":
        d = new Date();
        // var halfyrly = Math.floor((d.getMonth() / 6));
        // from = new Date(d.getFullYear(), halfyrly * 6, 1);
        // to = new Date(from.getFullYear(), from.getMonth() + 6, 0);
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        from = new Date(to.getFullYear(), to.getMonth() - 6, to.getDate())
        break;
      case "YEARLY":
        d = new Date();
        // from = new Date(new Date().getFullYear(), 0, 1);
        // to = new Date(new Date().getFullYear(), 0, 365);
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        from = new Date(to.getFullYear() - 1, to.getMonth(), to.getDate())
        break;
      case "PREVIOUS_FY":
        // from = new Date(new Date().getFullYear() - 1, 0, 1);
        //  to = new Date(new Date().getFullYear() - 1, 0, 365)
        from = new Date(new Date().getFullYear() - 1, 3, 1)
        to = new Date(new Date().getFullYear(), 2, 31)
        break;
      default:
        from = undefined;
        to = undefined;
        break;
    }
    console.log(new Date(from));
    console.log(new Date(to));
    this.selectPeriodDtl.fromDate = from;
    this.selectPeriodDtl.toDate = to;
    this.selectPeriodDtlForExel.fromDate = from;
    this.selectPeriodDtlForExel.toDate = to;

    if (this.dataService.accTypeSelected == 'Operative') {
      this.globalPeriod = value
      //this.dsForm.controls['selectPeriod'].setValue(this.globalCount);
      this.dsForm.patchValue({ selectPeriod: this.globalPeriod })
    }


    // this.dsForm.controls['fromDate'].setValue(from);
    // this.dsForm.controls['toDate'].setValue(to);
  }


  onCountSelected() {
    var d, from
    d = new Date();
    //from = d.setDate(d.getDate() -90);
    this.selectPeriodDtl.fromDate = (new Date(d.getFullYear(), d.getMonth() - 12, new Date().getDate())).toString();
    this.selectPeriodDtl.toDate = d.setDate(d.getDate())
    //this.dsForm.controls['fromDate'].setValue(from);
  }

  onCountSelectedMob(value) {
    var d, from
    d = new Date();
    //from = d.setDate(d.getDate() -90);
    this.selectPeriodDtl.fromDate = (new Date(d.getFullYear(), d.getMonth() - 12, new Date().getDate())).toString();
    this.selectPeriodDtl.toDate = d.setDate(d.getDate())
    //this.dsForm.controls['fromDate'].setValue(from);
    this.globalCount = value
    // this.dsForm.controls['transCount'].setValue(this.globalCount);
    this.dsForm.patchValue({ transCount: this.globalCount })
  }

  getdetailedStatementData(formData) {
    var fromDate = "", toDate = "", sort = "";

    if (this.selType == 'period') {
      fromDate = this.selectPeriodDtl.fromDate;
      toDate = this.selectPeriodDtl.toDate;
    }
    else if (this.selType == 'dateRange') {
      fromDate = formData.fromDate;
      toDate = formData.toDate;
    }
    else if (this.selType == 'transactionCount') {
      fromDate = this.selectPeriodDtl.fromDate;
      toDate = this.selectPeriodDtl.toDate
      sort = "D"

    }


    this.dtlStatementVal.START_DATE = "" + this.datePipe.transform(fromDate, 'yyyyMMdd');
    this.dtlStatementVal.END_DATE = toDate != "" ? "" + this.datePipe.transform(toDate, 'yyyyMMdd') : "        ";
    this.dtlStatementVal.LOW_AMOUNT = formData.minAmount != "" ? this.randomDigit(formData.minAmount) : "                 ";
    this.dtlStatementVal.HIGH_AMOUNT = formData.maxAmount != "" ? this.randomDigit(formData.maxAmount) : "                 ";
    this.dtlStatementVal.FIRST_CHEQUE_NUMBER = "                ";
    this.dtlStatementVal.LAST_CHEQUE_NUMBER = "                ";
    this.dtlStatementVal.NUMBER_OF_RECORDS_REQUESTED = formData.transCount != "" ? formData.transCount : "  ";
    this.dtlStatementVal.SORT_CRITERIA = sort != "" ? sort : " ";
    this.dtlStatementVal.CRDR_FLAG = formData.transType != "" ? formData.transType : " ";
    this.dtlStatementVal.LAST_TRANSACTION_DATE = "        ";
    this.dtlStatementVal.LAST_TRANSACTION_ID = "         ";
    this.dtlStatementVal.LAST_PART_TRANSACTION_NUMBER = "    ";
    this.dtlStatementVal.LAST_POSTING_DATE = "              ";
    this.dtlStatementVal.LAST_BALANCE = "                 ";


    var detailStatementStr = "";
    detailStatementStr = this.dtlStatementVal.START_DATE +
      this.dtlStatementVal.END_DATE +
      this.dtlStatementVal.LOW_AMOUNT +
      this.dtlStatementVal.HIGH_AMOUNT +
      this.dtlStatementVal.FIRST_CHEQUE_NUMBER +
      this.dtlStatementVal.LAST_CHEQUE_NUMBER +
      this.dtlStatementVal.NUMBER_OF_RECORDS_REQUESTED +
      this.dtlStatementVal.SORT_CRITERIA +
      this.dtlStatementVal.CRDR_FLAG +
      this.dtlStatementVal.LAST_TRANSACTION_DATE +
      this.dtlStatementVal.LAST_TRANSACTION_ID +
      this.dtlStatementVal.LAST_PART_TRANSACTION_NUMBER +
      this.dtlStatementVal.LAST_POSTING_DATE +
      this.dtlStatementVal.LAST_BALANCE;


    detailStatementStr = detailStatementStr.trim();


    console.log(detailStatementStr);

    return detailStatementStr;

  }

  resetForm() {

    this.dsForm.patchValue({
      selectPeriod: '',
      fromDate: '',
      toDate: '',
      transCount: '',
      minAmount: '',
      maxAmount: '',
      transType: ''
    })
    this.finalDisplayValue = []
    this.detailStatementList = []

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


    doc.setFontSize(10);
    doc.text("Branch Name : " + this.selAccDtl.branch_name, pageWidth - 110, 10, { align: 'left' });
    doc.text("Branch Code : " + this.selAccDtl.branchCode, pageWidth - 110, 15, { align: 'left' });
    // doc.text("Branch Address : "+this.accountDtls.BranchAddress, pageWidth - 110, 20, {align :'left'});  // +this.selAccDtl.BRANCHADDRESS, pageWidth - 110, 20, {align :'left'});
    var splitTitle = doc.splitTextToSize("Branch Address : " + this.accountDtls?.BranchAddress, 90);
    doc.text(splitTitle, pageWidth - 110, 20, { align: 'left' });
    var phoneNo = this.accountDtls?.phone_number ? this.accountDtls.phone_number : '';
    doc.text("Branch Contact : " + phoneNo, pageWidth - 110, 33, { align: 'left' });
    doc.text("IFSC : " + this.accountDtls?.ifscCode, pageWidth - 110, 38, { align: 'left' });
    doc.text("MICR Code : " + this.accountDtls?.micrCode, pageWidth - 110, 43, { align: 'left' });

    doc.setLineWidth(0.1);
    doc.line(15, 45, pageWidth - 15, 45);

    doc.setFontSize(20);
    doc.text("Account Statement", 20, 60, { align: 'left' });

    doc.setLineWidth(0.2);
    doc.rect(15, 70, doc.internal.pageSize.width - 30, 55, 'S');

    doc.setFontSize(15);
    if (this.dataService.accTypeSelected == "Deposits")
      doc.text("Account Name : " + this.depositsDtl?.accountName, 20, 80, { align: 'left' });
    else if (this.dataService.accTypeSelected == "Loans")
      doc.text("Account Name : " + this.loanUserDtl?.accountName, 20, 80, { align: 'left' });
    else
      doc.text("Account Name : " + this.accountDtls?.customerName, 20, 80, { align: 'left' });


    doc.setFontSize(10);
    doc.text("Customer ID : " + this.accountDtls?.customerId, 20, 90, { align: 'left' });
    doc.text("Account Number : " + this.accountDtls?.accountNo, 20, 95, { align: 'left' });
    doc.text("Account Type : " + this.selAccDtl?.accountDescription, 20, 100, { align: 'left' });
    var splitTitle;
    if (this.dataService.profileDetails[0].add1 == "" && this.dataService.profileDetails[0].add2 == "" && this.dataService.profileDetails[0].pin == "") {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].permenantAdd1 + "," + this.dataService.profileDetails[0].permenantAdd2 + "," + this.dataService.profileDetails[0].permenantPin), 90);
    }
    else {
      splitTitle = doc.splitTextToSize("Address : " + this.titlecasePipe.transform(this.dataService.profileDetails[0].add1 + "," + this.dataService.profileDetails[0].add2 + "," + this.dataService.profileDetails[0].pin), 90);
    }
    doc.text(splitTitle, 20, 105, { align: 'left' });

    doc.text("Date : " + this.datePipe.transform(new Date(), 'dd/MM/yyyy'), pageWidth - 20, 80, { align: 'right' });

    var objIndex = this.dataService.modeOfOpertion.findIndex(
      (obj) => obj.ModeOfOperation == this.selAccDtl.ModeOfOperation
    );
    doc.text("Mode of Operation : " + this.dataService.modeOfOpertion[objIndex].modeOfOperationType, pageWidth - 130, 90, { align: 'left' });
    var datadate = this.Date.split('-')
    doc.text("Account Opening Date : " + this.Date.split('-')[0] + "/" + this.Date.split('-')[1] + "/" + this.Date.split('-')[2], pageWidth - 130, 95, { align: 'left' });

    var statementFromDate = this.datePipe.transform(this.selectPeriodDtlForExel.fromDate, 'dd/MM/yyyy');
    var statementToDate = this.datePipe.transform(this.selectPeriodDtlForExel.toDate, 'dd/MM/yyyy');
    if (statementFromDate) {
      doc.text("Statement : From " + statementFromDate + " To " + statementToDate, pageWidth - 130, 100, { align: 'left' });
    }

    var currency = this.selAccDtl.currency;
    doc.text("Amount in(" + currency + ")", pageWidth - 10, 133, { align: 'right' });


    // add the font to jsPDF
    doc.addFileToVFS("Sakalbharati.ttf", FontBase64.Sakalbharati);
    doc.addFont("Sakalbharati.ttf", "Sakalbharati", "normal");
    doc.setFont("Sakalbharati");
    doc.setFontSize(5);

    var currencySymbol = { currency: currency, symbol: getCurrencySymbol(currency, 'narrow'), negativePattern: '(! #)', formatWithSymbol: true };

    var newArray: any = []

    for (var i = 0; i < this.detailStatementList.length; i++) {
      var newData: any = []
      var date = this.detailStatementList[i].TransactionDate.substring(6, 8) + '/' + this.detailStatementList[i].TransactionDate.substring(4, 6) + '/' + this.detailStatementList[i].TransactionDate.substring(0, 4)
      var remark = this.detailStatementList[i].particulars
      var ref = this.detailStatementList[i].TransactionId
      var cheque = this.randomCheque(this.detailStatementList[i].instrumentNumber)

      if (this.detailStatementList[i].creditOrDebit == 'D') {
        var withdraw: any = this.convertCurrency(this.detailStatementList[i].amount, currencySymbol)
        var deposit: any = "-"
      }
      else {
        var withdraw: any = "-"
        var deposit: any = this.convertCurrency(this.detailStatementList[i].amount, currencySymbol)
      }
      var closing = this.convertCurrency(this.detailStatementList[i].closingBalance, currencySymbol)
      newData.push(date, remark, ref, cheque, withdraw, deposit, closing)
      newArray.push(newData)

    }
    var _columns = ["Transaction Date", "Remarks", "Ref. No.", "Cheque No.", "Withdraw", "Deposit", "Closing Balance"];
    var _rows = newArray;
    console.log("newArray ====>");
    console.log(JSON.stringify(_rows));



    (doc as any).autoTable(_columns, _rows, {
      theme: 'grid', // 'striped', 'grid' or 'plain',
      didDrawPage: function (data) {
        // Reseting top margin. The change will be reflected only after print the first page.
        data.settings.margin.top = 10;
      },
      margin: { top: 135 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        horizontalPageBreak: true,
        font: "Sakalbharati",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 45 },
        2: { cellWidth: 22 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' },
        6: { cellWidth: 28, halign: 'right' },
      }
    });



    const pageCount = (doc as any).internal.getNumberOfPages()
    doc.setFontSize(7)
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      // doc.setLineWidth(0.1);
      //  doc.text('Please examine your receipt immediately on receipt. If no error is reported in the printed statement with in 15 days, the acount will be considered correct.', 15, 278, {align :'left'})
      //  doc.text('This is computer generated statement and does not require any signature. ', 15, 281, {align :'left'})
      doc.setLineWidth(0.1);
      doc.line(15, 282, pageWidth - 15, 282);
      doc.setFontSize(8)
      doc.text('Registered Office: ' + this.constant.val_bank_address, 15, 287, { align: 'left' })
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width - 30, 287, { align: 'left' })
    }

    //  var poc = this.newpages(doc,pageWidth)

    var todayDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');


    if (print == "print") {
      doc.autoPrint();
      window.open(doc.output('bloburl').toString());
    }
    else if (print == "email") {
      // alert()
      // window.open('mailto:?subject=Detailed Statement&body=' + );
    }
    else {
      this.commonMethod.downloadPDF(doc, 'DtlStatement_' + todayDateTime);
    }
  }

  generateExcel(print?: any) {
    var img = new Image();
    img.src = this.constant.psbNewLogo;
    // var currency = this.selAccDtl.currency;
    // var currencySymbol = {currency: currency, symbol: getCurrencySymbol( currency , 'narrow') , negativePattern: '(! #)', formatWithSymbol: true};
    var newArray: any = [];
    for (var i = 0; i < this.detailStatementList.length; i++) {
      var newData: any = []
      var date = this.detailStatementList[i].TransactionDate.substring(6, 8) + '/' + this.detailStatementList[i].TransactionDate.substring(4, 6) + '/' + this.detailStatementList[i].TransactionDate.substring(0, 4);
      //var statementFromDate = this.detailStatementList[0].TransactionDate.substring(6,8) + '/' + this.detailStatementList[0].TransactionDate.substring(4,6) + '/' + this.detailStatementList[0].TransactionDate.substring(0,4);
      var statementFromDate = this.datePipe.transform(this.selectPeriodDtlForExel.fromDate, 'dd/MM/yyyy');
      //var statementToDate = this.detailStatementList[i].TransactionDate.substring(6,8) + '/' + this.detailStatementList[i].TransactionDate.substring(4,6) + '/' + this.detailStatementList[i].TransactionDate.substring(0,4);
      var statementToDate = this.datePipe.transform(this.selectPeriodDtlForExel.toDate, 'dd/MM/yyyy');
      var remark = this.detailStatementList[i].particulars;
      var ref = this.detailStatementList[i].TransactionId;
      var cheque = this.randomCheque(this.detailStatementList[i].instrumentNumber);
      if (this.detailStatementList[i].creditOrDebit == 'D') {
        var withdraw: any = parseFloat(this.detailStatementList[i].amount);
        // var withdraw:any = this.convertCurrency(this.detailStatementList[i].amount, currencySymbol);
        var deposit: any = "-";
      }
      else {
        var withdraw: any = "-";
        // var deposit:any = this.convertCurrency(this.detailStatementList[i].amount, currencySymbol)
        var deposit: any = parseFloat(this.detailStatementList[i].amount);
      }
      // var closing = this.convertCurrency(this.detailStatementList[i].closingBalance, currencySymbol)
      var closing = parseFloat(this.detailStatementList[i].closingBalance);
      newData.push(date, remark, ref, cheque, withdraw, deposit, closing)
      newArray.push(newData);
    }

    var _rows = newArray;
    console.log(_rows);
    //Excel Title, Header, Data
    const mainTitle = this.constant.val_bank_longForm;
    const title = 'Account Statement';
    const header = ["Transaction Date", "Remarks", "Ref. No.", "Cheque No.", "Withdraw", "Deposit", "Closing Balance"]
    const data = _rows;

    //Create workbook and worksheet
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet();

    let mainTitleRow = worksheet.addRow([mainTitle]);
    mainTitleRow.font = { family: 4, size: 16, bold: true }
    // worksheet.addRow([]);

    worksheet.addRow(["Branch Name : " + this.selAccDtl.branch_name]);
    worksheet.mergeCells('A2:B2');
    worksheet.addRow(["Branch Code : " + this.selAccDtl.branchCode]);
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
    var objIndex = this.dataService.modeOfOpertion.findIndex(
      (obj) => obj.ModeOfOperation == this.selAccDtl.ModeOfOperation
    );
    if (this.dataService.accTypeSelected == "Deposits")
      worksheet.addRow(["Customer Name : " + this.titlecasePipe.transform(this.depositsDtl?.accountName)]);
    else if (this.dataService.accTypeSelected == "Loans")
      worksheet.addRow(["Customer Name : " + this.titlecasePipe.transform(this.loanUserDtl?.accountName)]);
    else
      worksheet.addRow(["Customer Name : " + this.titlecasePipe.transform(this.accountDtls?.customerName)]);

    worksheet.mergeCells('A10:B10');

    var customerID: any = '';
    if (this.dataService.accTypeSelected == "Deposits")
      customerID = this.depositsDtl?.customerID;
    else if (this.dataService.accTypeSelected == "Loans")
      customerID = this.loanUserDtl?.customerID;
    else
      customerID = this.dataService.userDetails.cifNumber

    worksheet.addRow(["Customer ID : " + customerID, "Mode of Operation : " + this.dataService.modeOfOpertion[objIndex].modeOfOperationType]);
    worksheet.addRow(["Account Number : " + this.accountDtls?.accountNo, "Account Opening Date : " + this.Date?.split('-')[0] + "/" + this.Date?.split('-')[1] + "/" + this.Date?.split('-')[2]]);

    if (this.dataService.accTypeSelected == "Operative")
      worksheet.addRow(["Account Type : " + this.accountDtls?.accountType]);
    else
      worksheet.addRow(["Account Type : " + this.accountDtls?.accountType + " - " + this.selAccDtl?.schemeDescription]);


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
    if (statementFromDate) {
      worksheet.addRow(["Statement : From " + statementFromDate + " To " + statementToDate]);
      worksheet.mergeCells('A15:B15');
    }


    worksheet.addRow([]);

    var objIndex = this.dataService.modeOfOpertion.findIndex(
      (obj) => obj.ModeOfOperation == this.selAccDtl.ModeOfOperation
    );
    worksheet.addRow();

    if (this.selType != 'transactionCount') {
      let tblHeaderRow = worksheet.addRow(["Opening Balance", "Total Deposit", "Total Withdrawal", "Closing Balance"]);
      tblHeaderRow.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      tblHeaderRow.font = { size: 14, bold: true };
      let mainTblHeaderRow = worksheet.addRow([parseFloat(this.openBal), parseFloat(this.totalDeposit), parseFloat(this.totalWithdraw), parseFloat(this.closingBal)]);
      let qty1 = mainTblHeaderRow.getCell(1);
      qty1.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty2 = mainTblHeaderRow.getCell(2);
      qty2.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty3 = mainTblHeaderRow.getCell(3);
      qty3.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty4 = mainTblHeaderRow.getCell(4);
      qty4.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      worksheet.addRow([]);
    }

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
      let row = worksheet.addRow(d);
      let qty4 = row.getCell(4);
      qty4.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty5 = row.getCell(5);
      let color = 'ff3300';
      if (+qty5.value < 500) {
        color = 'ff3300'
      }
      qty5.font = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
      qty5.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty6 = row.getCell(6);
      qty6.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

      let qty7 = row.getCell(7);
      qty7.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
    });

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 50;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
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
        self.commonMethod.downloadExcel(blob, 'DtlStatement_' + todayDateTime);
      }
      else {
        fs.saveAs(blob, 'Detail_Statement' + todayDateTime);
      }
    })
  }

  convertCurrency(value, currency) {
    return OSREC.CurrencyFormatter.format(value, currency);
  }




  checkMinMax() {
    if (this.dsForm.value.minAmount != "" && this.dsForm.value.maxAmount != "")
      if (+this.dsForm.value.minAmount > +this.dsForm.value.maxAmount)
        this.minmaxCheck = true
      else
        this.minmaxCheck = false


  }

  toCheckdate() {
    var startDate = moment(this.dsForm.value.fromDate);
    var endDate = moment(this.dsForm.value.toDate);

    this.dayDiff = endDate.diff(startDate, 'days');
    console.log('Days:' + this.dayDiff);
  }


  ToDateChange(event) {
    console.log(event);
    if (this.dsForm.value.fromDate) {
      var ageDifMs = this.dsForm.value.fromDate - event;
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var dateDiff = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (dateDiff > 1) {
        this.hasErrorOneYear = true;
        this.dateGreaterThan = false
      }
      else {
        this.hasErrorOneYear = false;
      }
      this.dsForm.value.toDate = new Date(event);
    }
    else {
      this.hasErrorOneYear = false;
      this.dsForm.value.toDate = new Date(event);
    }

    var d1 = this.dsForm.value.fromDate
    var d2 = this.dsForm.value.toDate

    if (this.hasErrorOneYear == false && this.dsForm.value.fromDate != "" && this.dsForm.value.toDate) {
      if (d1 > d2) {
        this.dateGreaterThan = true
        this.hasErrorOneYear = false;
      }
      else {
        this.dateGreaterThan = false
      }
    }

  }

  randomDigit(value) {
    var predigits: any = this.dataService.accTypeSelected == 'Operative' ? '                 ' : '00000000000000000000'
    var digit: any = predigits + value
    var length: any = digit.length
    var diff: any = Math.abs(17 - +length)
    return digit.slice(diff)

  }
  randomSerialNum(value) {
    var predigits: any = '    '
    var digit: any = predigits + value
    var length: any = digit.length
    var diff: any = Math.abs(4 - +length)
    return digit.slice(diff)
  }

  randomCheque(value) {
    if (value != "") {
      var predigits: any = '000000'
      var digit: any = predigits + value
      var length: any = digit.length
      var diff: any = Math.abs(6 - +length)
      return digit.slice(diff)
    }
    else
      return '-'


  }



  randomIDDigit(value) {
    var predigits: any = this.dataService.accTypeSelected == 'Operative' ? '         ' : '000000000'
    var digit: any = predigits + value
    var length: any = digit.length
    var diff: any = Math.abs(9 - +length)
    var diffnew = digit.slice(diff)

    if (diffnew.includes('D')) {
      var split = diffnew.split('DL')
      var space = split[0].replace('0', ' ')
      return space + "DL" + split[1]
    }
    else {
      var split = diffnew.split('S')
      var space = split[0].replace('0', ' ')
      return space + "S" + split[1]
    }



  }


  fromDateChange(event) {
    if (this.dsForm.value.toDate) {
      var ageDifMs = event - this.dsForm.value.toDate;
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var dateDiff = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (dateDiff > 1) {
        this.hasErrorOneYear = true;
      }
      else {
        this.hasErrorOneYear = false;
      }
      this.dsForm.value.fromDate = new Date(event);
    }
    else {
      this.hasErrorOneYear = false;
      this.dsForm.value.fromDate = new Date(event);
    }
    var d1 = this.dsForm.value.fromDate
    var d2 = this.dsForm.value.toDate

    if (this.hasErrorOneYear == false && this.dsForm.value.fromDate != "" && this.dsForm.value.toDate) {

      if (d1 > d2) {
        this.dateGreaterThan = true
        this.hasErrorOneYear = false;
      }
      else {
        this.dateGreaterThan = false
      }
    }

  }

  setDate(date) {
    var validDate;
    var urDate = date.match(/(\d{4})(\d{2})(\d{2})/);
    validDate = urDate[3] + "/" + urDate[2] + "/" + urDate[1];
    return validDate
  }
}








