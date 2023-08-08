import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { DashboardService } from './dashboard.service';
import { AppConstants } from 'src/app/app.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Idle } from '@ng-idle/core';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { DatePipe } from '@angular/common';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { AccountType } from 'src/app/enum/app-enum';
import { CARDCOLORSARR } from './dashboard.model';

declare var showToastMessage: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  custAccountList = [];
  accountList: any = [];
  transactionList: any = [];
  nonDisplayMenu: any = [];
  dashBoardMenu: any = [];
  viewMoreTransac: boolean = true;
  viewMoreCredit: boolean = true;
  Showcondition: boolean = false;
  creditCardList = [];
  makePrimary = "";
  makePrimaryobj: ''
  frequentTransactionList = [];
  frequentTransactionColor = ['green1', 'grey1', 'red1', 'greenlight', 'yellow'];
  accountCarouselOptions: OwlOptions;
  customizeMenuCarouselOptions: OwlOptions;
  recommendedCardCarouselOptions: OwlOptions
  investCarouselOptions: OwlOptions
  recentTransactionOption: OwlOptions
  canvasDonot: any;
  ctxDonot: any;
  totalAsset: any;
  totalLiablities: any;
  totalWorth: any = 0;
  refreshedTime: any;
  instaPayForm: FormGroup;
  instaAccountForm: FormGroup;
  selectedAccount: any = '';
  isValidIFSC = false;
  validmsg: any = ''
  transfertype = "within"
  ifscCheckFlag = false
  ifscerrormsg = false
  instapayAccSelected = false
  instapayerror = ''
  accountDetails: any;
  index: any;
  userName: any;
  bankAddress: any;
  ifscDtl: any;

  //feilds for card
  totalSavingAcc: any = '00';
  totalSavingAmt: any = 300.08;
  totalDepositeAcc: any = '00';
  totalDepositeAmt: any = 0;
  totalBorrowingAcc: any = '00';
  totalBorrowingAmt: any = 100.98;
  investProducts: any;
  investProductsupdated: any = [];
  recommendedCard: any;
  myBrowsingShow: boolean = false;
  myDepositShow: boolean = false;
  mySavingShow: boolean = false;
  instaPayAccount: boolean = false;
  mycustomMenu: any = [];
  oldRecord: any;

  totalSavingMaskedAmt: any;
  totalDepositeMaskedAmt: any;
  totalBorrowingMaskedAmt: any;
  getProfiledetail: any;

  recommendedOffer: any
  dashboardBanner: any;
  accountInsta = ''
  instaAccount = [];
  instaPayToUserData: any = '';
  exceedMinAmt: boolean = false;
  isOperativeSingleCurrency: boolean = false;
  isDepositeSingleCurrency: boolean = false;
  isBorrowingSingleCurrency: boolean = false;
  warningResp: any;
  timeStamp;


  constructor(
    private router: Router,
    public dataService: DataService,
    public loader: pageLoaderService,
    private http: HttpRestApiService,
    public commonMethod: CommonMethods,
    private dashboardService: DashboardService,
    private constant: AppConstants,
    private storage: LocalStorageService,
    private idle: Idle,
    public customCurrencyPipe: CustomCurrencyPipe,
    public datepipe: DatePipe,
    private formValidation: FormValidationService
  ) {
    this.timeStamp = Date.now();
  }


  buildForm() {
    this.instaAccountForm = new FormGroup({
      chooseAccount: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      remark: new FormControl(''),
    })

    this.instaPayForm = new FormGroup({
      accNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.min(1), Validators.pattern("^[a-zA-Z0-9_]*$")]),
      confirmAccountNumber: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$")]),
      IFSCCode: new FormControl('', []),
      custname: new FormControl('', [Validators.required])
    }, { validators: [this.accountNo.bind(this)] });
  }

  ngOnInit(): void {
    this.dataService.getBreadcrumb("DASHBOARD", this.router.url)
    if (this.dataService.primaryAccountDtl == '') {
      //this.fetchLinkDelinkAccountList();
    }
    // this.instaAccount = this.dataService.customerOperativeAccList;
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.Status == "Active") {
        this.instaAccount.push(el);
      }
    });
    this.mycustomMenu = this.dataService.setDashboardBankingServices$;
    this.investProductsupdated = this.dataService.setdashboardInvestment$;
    this.dataService.headerType = 'innerHeader';
    this.initialization();
  }

  ngAfterViewInit() { }

  /**
   * To initialize on load this function is invoked
   */
  initialization() {
    //console.log("customerFetchDetail:",this.dataService.profiledateDetails);

    this.buildForm();
    this.commonMethod.showLoader();

    this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
    console.log('Refreshed Time: ', this.refreshedTime);
    this.idle.watch();
    this.recommendedCardCarouselOptions = this.dataService.getrecommendedCardCarouselOptions();
    this.recentTransactionOption = this.dataService.getrecentTransactionOption();
    var cardParam = this.dashboardService.getOfferCradsparam('Cards');
    console.log('cardParam: ', cardParam);
    this.getOfferCardList(cardParam)
    // Offers
    var offerParam = this.dashboardService.getOfferCradsparam('Offer');
    console.log('offerParam: ', offerParam);
    // this.getOfferList(offerParam)

    this.accountList = this.dataService.customerAccountList;

    this.accountCarouselOptions = this.dataService.getAccountCarouselOptions();
    this.customizeMenuCarouselOptions = this.dataService.getCustomizeMenuCarouselOptions();
    this.investCarouselOptions = this.dataService.getinvestCarouselOptions();

    //set dashbord card details
    this.getAccountList();

    //set username
    //TODO:Need to modify with respect to edit profile
    this.userName = this.dataService.userDetails?.customerName;
    console.log('user details: ', this.dataService.userDetails);

    //webLastLogin
    if (this.storage.hasKeySessionStorage("isLoggedIn")) {
      console.log(this.dataService.totalMyOperativeBalance);
      // Amount of all account
      this.totalSavingAmt = this.dataService.totalMyOperativeBalance.toFixed(2);
      this.totalSavingMaskedAmt = this.commonMethod._maskBalance(this.totalSavingAmt.toString());
      this.totalDepositeAmt = this.dataService.totalMyDepositBalance.toFixed(2);
      this.totalDepositeMaskedAmt = this.commonMethod._maskBalance(this.totalDepositeAmt.toString());
      this.totalBorrowingAmt = this.dataService.totalMyBorrowingsBalance.toFixed(2);
      this.totalBorrowingMaskedAmt = this.commonMethod._maskBalance(this.totalBorrowingAmt.toString());
      let _totalWorth: any = this.dataService.totalMyOperativeBalance + this.dataService.totalMyDepositBalance + this.dataService.totalMyBorrowingsBalance;
      this.totalWorth = _totalWorth;
      let isMPIN = this.dataService.loginType == 'mpin';
      //frequent transaction
      var frequentTransacParam = this.dashboardService.getFrequentTransacParam(isMPIN);
      this.getFrequentTransaction(frequentTransacParam);
      this.selectedAccoutNo(this.dataService.customerAccountList[0]?.accountNo);
      if (this.dataService.isNRENRO) {
        this.isOperativeSingleCurrency = this.dataService.customerOperativeAccList.some((e) => e.currency.toLowerCase() != "inr");
        this.isDepositeSingleCurrency = this.dataService.customerMyDepostie.some((e) => e.currency.toLowerCase() != "inr");
        this.isBorrowingSingleCurrency = this.dataService.customerBorrowingsList.some((e) => e.currency.toLowerCase() != "inr");
        console.log("<===== checking nre and nro ====>");
        console.log(this.isOperativeSingleCurrency, this.isDepositeSingleCurrency, this.isBorrowingSingleCurrency);
      }

    } else {
      if (this.constant.getPlatform() == "web") {
        this.router.navigateByUrl('/login');
      }
      else {
        this.router.navigateByUrl('/loginMobile');
      }
    }
    this.dataService.recentTransData = {};
    console.log("<========== nre banner ===========>");
    if (this.dataService.isNRENRO) {
      var offerBannerParam = this.dashboardService.getOfferCradsparam('NRE_BANNER');
      this.getBannerList(offerBannerParam)
    }
  }

  selectPrimary(item) {

    this.makePrimary = item.accountNo
    this.makePrimaryobj = item

    console.log("item" + JSON.stringify(this.makePrimary))
    console.log("item" + JSON.stringify(this.makePrimaryobj))

  }

  /**
  * function to get all the account list and filter
  *  data with respect to it
  */
  getAccountList(type?: any) {
    this.totalSavingAcc = this.dataService.customerOperativeAccList.length < 10 ? '0' + this.dataService.customerOperativeAccList.length : this.dataService.customerOperativeAccList.length;
    this.totalDepositeAcc = this.dataService.customerMyDepostie.length < 10 ? '0' + this.dataService.customerMyDepostie.length : this.dataService.customerMyDepostie.length;
    this.totalBorrowingAcc = this.dataService.customerBorrowingsList.length < 10 ? '0' + this.dataService.customerBorrowingsList.length : this.dataService.customerBorrowingsList.length;

    console.log("this.totalSavingAcc" + JSON.stringify(this.dataService.customerOperativeAccList))
    console.log("this.totalDepositeAcc" + JSON.stringify(this.dataService.customerMyDepostie))
  }


  transferTypeChange(type) {
    this.transfertype = type;
    if (this.transfertype == 'outside') {
      this.instaPayForm.controls['IFSCCode'].setValidators([Validators.required, Validators.minLength(11), Validators.pattern("^[A-Z0-9]*$")])
      this.instaPayForm.controls['custname'].reset();
      this.instaPayForm.controls['accNumber'].reset();
      this.instaPayForm.controls['confirmAccountNumber'].reset();


    } else {
      this.instaPayForm.controls['accNumber'].reset();
      this.instaPayForm.controls['confirmAccountNumber'].reset();

      //this.instaPayForm.controls['custname'].setValidators([Validators.required])
      this.instaPayForm.controls['IFSCCode'].clearValidators();
    }


    this.instaPayForm.controls['IFSCCode'].updateValueAndValidity();
    //this.instaPayForm.controls['custname'].updateValueAndValidity();
  }
  /**
   * function called when account no is selected
   * @accountNumber
   */
  selectedAccoutNo(accountNumber) {
    console.log("inside====>", accountNumber);
    var index = this.accountList.findIndex(x => x.accountNumber === accountNumber)
    if (index === -1) return;
    this.accountDetails = this.accountList[index]
    this.index = index;
  }

  setLastRefreshedDate() {

    let param = this.dashboardService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
        this.accountList = data.set.records;
        this.dataService.fetchTotalBalance(data.set.records, "dashboard");

        this.dataService.customerMyDepostie = []; this.dataService.customerOperativeAccList = []; this.dataService.customerBorrowingsList;
        this.dataService.totalMyDepositBalance = 0; this.dataService.totalMyOperativeBalance = 0; this.dataService.totalMyBorrowingsBalance = 0;
        data.set.records.forEach(el => {
          if (el.accountType != "CAPPI") {
            if (el.SchemeCode == AccountType.FIXED_DEPOSITE_ACCOUNT) {
              this.dataService.customerMyDepostie.push(el);
              this.dataService.totalMyDepositBalance = this.dataService.totalMyDepositBalance + parseFloat(el.acctBalance);
            }
            else if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
              // el.AGSStatus = el["AGS Status"];
              this.dataService.customerOperativeAccList.push(el);
              this.dataService.totalMyOperativeBalance = this.dataService.totalMyOperativeBalance + parseFloat(el.acctBalance);
            }
            else if (el.SchemeCode == AccountType.LOAN_ACCOUNT) {
              this.dataService.customerBorrowingsList.push(el);
              this.dataService.totalMyBorrowingsBalance = this.dataService.totalMyBorrowingsBalance + parseFloat(el.acctBalance);
            }
          }
        });

        this.totalSavingAmt = this.dataService.totalMyOperativeBalance.toFixed(2);
        this.totalSavingMaskedAmt = this.commonMethod._maskBalance(this.totalSavingAmt.toString());
        this.totalDepositeAmt = this.dataService.totalMyDepositBalance.toFixed(2);
        this.totalDepositeMaskedAmt = this.commonMethod._maskBalance(this.totalDepositeAmt.toString());
        this.totalBorrowingAmt = this.dataService.totalMyBorrowingsBalance.toFixed(2);
        this.totalBorrowingMaskedAmt = this.commonMethod._maskBalance(this.totalBorrowingAmt.toString());

        this.totalSavingAcc
        this.totalDepositeAcc
        this.totalBorrowingAcc

        let _totalWorth: any = this.dataService.totalMyOperativeBalance + this.dataService.totalMyDepositBalance + this.dataService.totalMyBorrowingsBalance;
        this.totalWorth = _totalWorth;
        this.getAccountList();
      }
      else {

      }
    }, (error) => {
      console.log(error);
    });

  }
  /**
   * api call to get transaction history
   * @param
   */
  getTransactionHistory(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_TRANSACTIONHISTORY).subscribe(data => {
      console.log("=========>", data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        if (data.set !== undefined && data.set !== '' && data.set !== null) {
          this.transactionList = data.set.records;
          console.log('TRANSACTION LIST :::: ', this.transactionList)
          this.transactionList.forEach(el => {
            el.ShortName = el.productName.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase()
            el.formatDate = el.Date.split('-')
          });
          console.log(this.transactionList);
        }
        else {
          this.transactionList = [];
        }
      }
      else {
        this.transactionList = [];
        this.errorCallBack(data.subActionId, resp);
      }

    }, (error) => {
      console.log(error);
    });
  }
  /**
   * This function is called when refresh icon is clicked to check the balance
   * @param customerAccDetails
   * @param index
   */
  getBalanceEnquiry(customerAccDetails, selectedIndex) {
    let balEnquiryReq = this.dashboardService.getBalEnqParam(customerAccDetails);
    this.http.callBankingAPIService(balEnquiryReq, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEENQUIRY).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        // this.dataService.customerAccountList = data.set.records;
        let list = data.set.records;
        list.map((customer, index) => {
          customer.maskBalance = this.commonMethod._maskBalance(customer.sbBalance);
          this.setCardColor(customer, index);
          return customer;
        });
        let balanceEnq = this.getBalanceEnquiryObj(list, customerAccDetails);
        balanceEnq.showBal = true;
        this.dataService.customerAccountList[selectedIndex] = balanceEnq;
        this.custAccountList = this.dataService.customerAccountList;
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * This function is called to get the particular object updated from array
   */
  getBalanceEnquiryObj(array, obj) {
    return array.find(i => i.accountNumber == obj.accountNumber);
  }

  /**
   * To set the card colot dynamically this function is invoked
   * @param customerDetails
   * @param index
   */
  setCardColor(customerDetails, index) {
    customerDetails.cardColor = CARDCOLORSARR[index]?.cardColor;
    customerDetails.cardDetailsColor = CARDCOLORSARR[index]?.cardDetailsColor;
    return customerDetails;
  }

  /**
   * function to called on unsuccessfull responce
   * @subActionId
   * @resp
   */
  errorCallBack(subActionId, resp) {
    if (resp.opstatus == "02") {
      //showToastMessage(resp.Result, "error");
    }
  }

  /**
   * function to hide and show max no of
   * frequent transaction
   */
  viewMore() {
    this.dataService.accDetails = this.accountDetails;
    this.dataService.accDetails.showBal = false;
    this.dataService.accDetailsIdx = this.index;
    this.dataService.accDetails.maskBalance = this.commonMethod._maskBalance(this.accountDetails.sbBalance);
    this.router.navigateByUrl('/myAccountDetails');
  }

  viewMoreCreditList() {
    if (this.viewMoreCredit) {
      this.viewMoreCredit = false;
    }
    else {
      this.viewMoreCredit = true;
    }
  }


  /**
   * function to get all frequent transaction
   */
  getFrequentTransaction(frequentRransactionReq) {

    this.http.callBankingAPIService(frequentRransactionReq, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_FREQUENTTRANS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;

      if (resp.opstatus == "00") {
        console.log(resp);
        if (data.listofDataset !== undefined && data.listofDataset[0].records !== undefined) {
          //this.dataService.frequentTransact = data.set.records;

          data.listofDataset[0].records.forEach(el => {
            var dtl = {
              "benefName": el.benefName,
              "txn_amount": el.txn_amount,
              "DestinationType": el.DestinationType,
              // "color": this.frequentTransactionColor[Math.floor(Math.random() * 3) + 1],
              "TransactionDate": el.TransactionDate,
              "TransactionMonth": el.TransactionMonth,
              "transType": el.TransactionType,
              "accNo": el.accountNo,
              "fromAccNumber": el.fromAccNumber,
              "toAccNumber": el.toAccNumber,
              "beneficiary_bank_name": el.beneficiary_bank_name,
              "ifsc_code": el.ifscCode,
              "transactionType": el.RechargeType,
              "actionType": el.actionType
            }
            this.frequentTransactionList.push(dtl);

          });

          this.frequentTransactionList = this.dataService.getRecentTransactionList(this.frequentTransactionList);
          console.log("Frequest List :: == > ", this.frequentTransactionList)
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }



  /**
  * api call for getting cardlist
  * @Param get request in encrypted format
  */
  getRecommededCard(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_RECOMMENDEDCARDS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.recommendedCard = data.set?.records ? data.set?.records : [];
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }

  /**
  * api call for getting cardlist
  * @Param get request in encrypted format
  * @loginType
  */
  getCardList(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETCARDSLIST).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          // this.dataService.cardLists = data.set.records;
          this.creditCardList = data.set.records;
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    });
  }


  /**
* api call for getting cardlist
* @Param get request in encrypted format
* @loginType
*/
  getOfferCardList(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETOFFERS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        this.recommendedCard = data.set?.records ? data.set?.records : [];
        console.log('Recommended Cards: ', this.recommendedCard);
      }
      else {
        this.errorCallBack(data.subActionId, resp);

      }
    }, (error) => {
      console.log(error);
    });
  }

  /**
* api call for getting cardlist
* @Param get request in encrypted format
* @loginType
*/
  getBannerList(param) {
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETOFFERS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        if (data.hasOwnProperty("set")) {
          this.dashboardBanner = data.set.records[0];//base64Image;
          console.log(this.dashboardBanner);
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);

      }
    }, (error) => {
      console.log(error);
    });
  }

  closeTransferPopup() {
    this.Showcondition = false
  }

  transferRoute(path) {
    this.router.navigateByUrl(path);
  }

  goToPage(item) {
    console.log(item);
    if (item.menuName == "Fund Transfer") {
      this.Showcondition = true
      // this.router.navigateByUrl('/ownBanks');
    } else if (item.menuName == "Fund Transfer") {
      this.router.navigateByUrl("/freezeAccount");
    } else if (item.menuName == "BILL_PAY") {
      this.router.navigateByUrl("/rechargeBillPay");
    } else if (item.menuName == "STOP_CHEQUE") {
      this.router.navigateByUrl("/stopCheques");
    } else if (item.menuName == "send-money") {
      this.router.navigateByUrl("/sendMoney");
    }
    else {
      this.Showcondition = false
    }
  }


  goToRoutePage(route) {
    console.log(route)
    if (route && route != 'null') {
      this.router.navigateByUrl(route);
    }

  }

  goToRoutePageBankingService(route, routePageName, textToDisplay?: any) {
    console.log(route)
    if (textToDisplay != undefined && textToDisplay == 'coming soon' || (this.dataService.isNRENRO && routePageName == 'Tax Center')) {
      return;
    }
    if (route && route != 'null') {
      this.router.navigateByUrl(route);
    } else if (routePageName == 'tds-certificate') {
      this.router.navigateByUrl('/tdsCertificate');
    }
    else if (routePageName == 'create-si') {
      this.router.navigateByUrl('/standingInstructionList');
    } else if (routePageName == 'pending-bill') {
      this.router.navigateByUrl('/unpaidBill');
    } else if (routePageName == 'bills-recharges') {
      this.router.navigateByUrl('/retailRechargeBillPay')
    } else if (routePageName == 'scheduled-transaction') {
      this.router.navigateByUrl('/transactionStatus')
    }
    else if (routePageName == 'bills-recharges') {
      this.router.navigateByUrl('/retailRechargeBillPay')
    }

  }

  goToRoutePageInvestUs(route) {
    console.log(route)
    if (route == 'PMJJBY') {
      this.router.navigateByUrl('/pmjjby');
    } else if (route == 'PMSBY') {
      this.router.navigateByUrl('/pmsby');
    } else if (route == 'APY') {
      this.router.navigateByUrl('/socialSecurities');
    }
    else if (route == 'Open FD/RD' && !this.dataService.isNRENRO) {
      this.router.navigateByUrl('/applyForFdRD');
    }
  }

  gotoOffers() {
    showToastMessage("Coming soon", "success");
  }
  // goToAddpayee(){
  //   this.router.navigate(['/addPayee']);
  // }
  gotoInvestwithUs() {
    showToastMessage("Coming soon", "success");
  }

  onWeblinkClicked() {
    this.router.navigateByUrl("/applyCards");
  }
  transactiondetails(data) {
    console.log(JSON.stringify(data))
    this.dataService.recentTransData = data;
    if (!this.dataService.recentTransData.hasOwnProperty("beneficiary_account_no")) {
      this.dataService.recentTransData.beneficiary_account_no = this.dataService.recentTransData.toAccNumber;
    }
    if (data.actionType == "Quick") {
      this.router.navigate(['/instantPay']);
    }
    else if (data.actionType == "Donation") {
      this.router.navigate(['/donations']);
    }
    else if (data.actionType == 'AGGREGATORS') {
      //this.router.navigate(['/retailRechargeBillPay']);
    }
    else if (data.actionType == 'bbps') {
      this.router.navigate(['/retailPaymentHistory']);
    }
    else {
      this.router.navigate(['/sendMoney']);
    }

  }
  refreshBtn(value) {
    switch (value) {
      case 'operativeAccounts':
        this.mySavingShow = !this.mySavingShow
        break;

      case 'myDeposit':
        this.myDepositShow = !this.myDepositShow
        break;

      case 'myBorrow':
        this.myBrowsingShow = !this.myBrowsingShow
        break;
    }
  }

  instaPay(value) {
    // this.instaPayAccount = !this.instaPayAccount ;
    switch (value) {
      case 'open':
        $('#account').slideToggle();
        $('#account').parent().toggleClass('active')
        break;

      case 'close':
        this.instaPayAccount = false;
        $('#account').slideToggle();
        $('#account').parent().toggleClass('')
        break;

      case 'closeInstaPay':
        this.instaPayAccount = false;
        break;

      case 'user':
        this.instaPayAccount = true;
        if (this.oldRecord?.accNumber) {
          this.instaPayForm.patchValue({
            accNumber: this.oldRecord.accNumber,
            confirmAccountNumber: this.oldRecord.confirmAccountNumber,
            IFSCCode: this.oldRecord.IFSCCode,
            custname: this.oldRecord.custname,
          });
          if (this.oldRecord.IFSCCode != "") {
            this.onCheckIFSCAvailability();
          }
        }
        else {
          this.instaPayForm.reset();
          this.transfertype = 'within'
        }
        break;

      case 'instaProceed':
        if (this.instaPayForm.valid) {
          this.instaAccountForm.patchValue({
            "chooseAccount": this.selectedAccount
          });
          this.instaPayToUserData = this.instaPayForm.value.accNumber;
          console.log('Insta Pay to user account number :: ', this.instaPayToUserData);
          this.instaPayAccount = false;
          this.oldRecord = this.instaPayForm.value;
          console.log(this.instaPayForm.value);
        } else {
          this.validateForm();
          console.log('failed');
        }
        break;
    }

  }

  accountNo(formGroup: FormGroup) {
    const { value: payeeAccNo } = formGroup.get('accNumber');
    const { value: payeeCnfAccNo } = formGroup.get('confirmAccountNumber');
    return payeeAccNo === payeeCnfAccNo ? null : { accountNotMatch: true };
  }

  validateForm() {
    if (this.instaAccountForm.invalid) {
      this.instaAccountForm.get('chooseAccount').markAsTouched();
      this.instaAccountForm.get('amount').markAsTouched();
      this.instaAccountForm.get('remark').markAsTouched();
    }

    if (this.instaPayForm.invalid) {
      this.instaPayForm.get('accNumber').markAsTouched();
      this.instaPayForm.get('confirmAccountNumber').markAsTouched();
      this.instaPayForm.get('IFSCCode').markAsTouched();
    }
  }

  selectAccountInsta(account) {
    console.log(JSON.stringify(account));
    this.accountInsta = account.sbAccount;
    console.log('selected account number: ', event);
    this.selectedAccount = account.accountNo;
    this.instaAccountForm.patchValue({
      "chooseAccount": this.selectedAccount
    })
  }

  onTabChange(type) {
    if (type == 'instaPay') {
      this.instaPayForm.reset();
    }
  }

  onCheckIFSCAvailability() {

    if (this.instaPayForm.get('IFSCCode').valid) {
      this.ifscCheckFlag = true;
      // this.instaPayForm.patchValue({
      //   'IFSCCode' : this.instaPayForm.value.IFSCCode.toUpperCase()
      // })
      if (this.selectedAccount != '') {
        if (this.instaPayForm.get('accNumber').valid) {
          this.getNameInquiryAccountIFSCList();
        }
        else {
          this.instaPayForm.get('accNumber').markAsTouched();
        }
      }
      else {
        showToastMessage('Please select from account number');
        return;
      }
    }
    else {
      this.instaPayForm.get('IFSCCode').markAsTouched();
    }
  }

  getNameInquiryAccountIFSCList() {

    var param = this.dashboardService.getBranchFromIFSC(
      this.instaPayForm.value.IFSCCode
    );
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_GETIMPSMASTERBYIFSC
      )
      .subscribe((data) => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.ifscDtl = data.set.records[0];
          this.bankAddress = data.set.records[0].bank + "," + data.set.records[0].city + "," + data.set.records[0].cust_address;
          if (data.hasOwnProperty('set')) {
            this.isValidIFSC = true;
          }
        } else {
          this.validmsg = 'Invalid IFSC Code'
          this.isValidIFSC = false;
          this.instaPayForm.patchValue({
            ifsc: ''
          })
          // this.bankAddress = ''
        }
      }, (error) => {
        console.log(error);
      });

  }
  onConfirmAccountChange(target, from) {
    let number = target.value;
    if (this.instaPayForm.hasError("accountNotMatch")) {
      this.instaPayForm.patchValue({
        custname: ''
      })
      return;
    }

    if (number.length == 14 || number.length == 30) {

      var param = this.dashboardService.validatePayee(this.instaPayForm.value);


      this.http
        .callBankingAPIService(
          param,
          this.storage.getLocalStorage(this.constant.storage_deviceId),
          this.constant.serviceName_ACCOUNTNAME
        )
        .subscribe((data) => {
          console.log(data);
          var resp = data.responseParameter;
          if (resp.opstatus == '00') {

            this.instaPayForm.patchValue({
              custname: data.set.records[0].accountName
            })
            this.instapayerror = ""

          } else {
            this.instaPayForm.patchValue({
              custname: ''

            })
            this.errorCallBack(data.subActionId, resp);
            this.instapayerror = data.responseParameter.Result
          }
        }, (error) => {
          console.log(error);
        });
    }
    else {
      this.instapayerror = ""
    }
  }
  onInstaPaySubmit() {
    if (this.exceedMinAmt == true)
      return
    console.log("Formm :: ", this.instaAccountForm)
    if (this.instaPayToUserData == '') {
      this.instapayAccSelected = true
    } else {
      this.instapayAccSelected = false
    }
    if (this.instaAccountForm.valid && this.instaPayToUserData != '') {

      if (!this.isValidIFSC && this.transfertype == 'outside') {
        return
      }
      this.dataService.resetTransactionObj();
      var param;
      if (this.transfertype == 'within') {
        param = this.dashboardService.getFundTransferParam(this.instaPayForm.value, this.instaAccountForm.value, 'within');

        this.dataService.transactionReceiptObj.from_acc = this.instaAccountForm.value.chooseAccount;
        this.dataService.transactionReceiptObj.to_acc = this.instaPayForm.value.accNumber;
        this.dataService.transactionReceiptObj.payee_name = this.instaPayForm.value.custname;

        this.dataService.transactionReceiptObj.amount = this.instaAccountForm.value.amount;
        this.dataService.transactionReceiptObj.remarks = this.instaAccountForm.value.remark ? this.instaAccountForm.value.remark : "-";
        this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
        this.dataService.screenDetails = {
          FROM_ACCOUNT:this.dataService.transactionReceiptObj.from_acc,
          TO_ACCOUNT:this.dataService.transactionReceiptObj.to_acc,
          PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
          AMOUNT: this.dataService.transactionReceiptObj.amount,
          REMARKS: this.dataService.transactionReceiptObj.remarks,
          TRANSACTION_DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
        }
      }
      else {

        param = this.dashboardService.getIFSCFundTransferParam(this.instaPayForm.value, this.instaAccountForm.value, this.instaPayToUserData);

        this.dataService.transactionReceiptObj.from_acc = this.instaAccountForm.value.chooseAccount;
        this.dataService.transactionReceiptObj.to_acc = this.instaPayForm.value.accNumber;
        this.dataService.transactionReceiptObj.payee_name = this.instaPayForm.value.custname;
        this.dataService.transactionReceiptObj.amount = this.instaAccountForm.value.amount;
        this.dataService.transactionReceiptObj.ifscCode = this.ifscDtl.IFSC;
        this.dataService.transactionReceiptObj.benificaryBankName = this.ifscDtl.bank;
        this.dataService.transactionReceiptObj.modeOfTransfer = "IMPS";

        this.dataService.transactionReceiptObj.remarks = this.instaAccountForm.value.remark ? this.instaAccountForm.value.remark : "-";
        this.dataService.endPoint = this.constant.serviceName_PAYERTOPAYEEUSINGIFSCACCOUNTNUMBER;
        this.dataService.screenType = 'instaPay';
        this.dataService.screenDetails = {
          FROM_ACCOUNT:this.dataService.transactionReceiptObj.from_acc,
          TO_ACCOUNT:this.dataService.transactionReceiptObj.to_acc,
          PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
          AMOUNT: this.dataService.transactionReceiptObj.amount,
          TRANSACTION_MODE:this.dataService.transactionReceiptObj.modeOfTransfer,
          BANK_NAME: this.dataService.transactionReceiptObj.benificaryBankName,
          IFSC_CODE:this.dataService.transactionReceiptObj.ifscCode,
          REMARKS: this.dataService.transactionReceiptObj.remarks,
          TRANSACTION_DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
        }
      }

      this.dataService.authorizeHeader = "INSTA MONEY";
      this.dataService.screenType = 'instaPay';
      this.dataService.commonOtpServiceType = this.constant.val_FUNDTRANSFER;
      this.dataService.request = param;
      this.dataService.transactionReceiptObj.date = new Date().toISOString();
      var objCheckFlag = this.dataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.dataService.endPoint.split('/')[1]);
      this.dataService.otpSessionPreviousPage = "/dashboard";
      this.router.navigate(['/otpsession']);
    } else {
      this.validateForm()
    }
  }

  /**
 * set update currency value
 * @param value
 */
  formatCurrency(target, type) {
    let value = target.value;
    let amt = this.customCurrencyPipe
      .transform(value, 'decimal')
      .replace(/[^.0-9]+/g, '');
    this.formValidation.formatCurrency(value, this.instaAccountForm);

    if (parseFloat(amt.trim().replace(/[^.0-9]+/g, '')) > 10000) {
      this.exceedMinAmt = true;
    }
    else {
      this.exceedMinAmt = false;
    }
  }



  // fetchLinkDelinkAccountList() {
  //   var param = this.dashboardService.linkDelinkFetchAccountsList();
  //   this.http
  //     .callBankingAPIService(
  //       param,
  //       this.storage.getLocalStorage(this.constant.key_deviceId),
  //       this.constant.serviceName_LINKDELINKFETCHACCOUNT
  //     )
  //     .subscribe((data) => {
  //       console.log("fetchLinkDelinkAccountList",data);
  //       var resp = data.responseParameter;
  //       if (resp.opstatus == "00") {
  //         this.dataService.customerOperativeAccList = [];
  //         this.dataService.customerMyDepostie = [];
  //         this.dataService.customerBorrowingsList = [];
  //         data.set.records.forEach((el) => {
  //             if(el.LinkDelingFLG == "P") this.dataService.primaryAccountDtl = el;
  //             if (el.AccountType == AccountType.FIXED_DEPOSITE_ACCOUNT) {
  //               this.dataService.customerMyDepostie.push(el);
  //             } else if (
  //               el.AccountType == AccountType.SAVING_ACCOUNT ||
  //               el.AccountType == AccountType.CURRENT_ACCOUNT ||
  //               el.AccountType == AccountType.CASH_CREDIT ||
  //               el.AccountType == AccountType.OVER_DRAFT_ACCOUNT
  //             ) {
  //               this.dataService.customerOperativeAccList.push(el);
  //             } else if (el.AccountType == AccountType.LOAN_ACCOUNT) {
  //               this.dataService.customerBorrowingsList.push(el);
  //             }
  //         });

  //         if(this.dataService.primaryAccountDtl == ''){
  //           this.commonMethod.openPopup('.primarySelectAcc')
  //         }
  //       } else {
  //         //this.errorCallBack(data.subActionId, resp);
  //       }
  //     });
  // }

}




