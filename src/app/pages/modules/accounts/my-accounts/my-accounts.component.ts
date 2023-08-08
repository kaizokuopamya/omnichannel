import { Component, ElementRef, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { Router } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe, Location } from '@angular/common';
import { CommonMethods } from 'src/app/services/common-methods';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AccountType } from '../../../../enum/app-enum';
import { PAGINATIONOBJ } from 'src/app/model/common.model';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-my-accounts',
  templateUrl: './my-accounts.component.html',
  styleUrls: ['./my-accounts.component.scss']
})
export class MyAccountsComponent implements OnInit {

  constructor(
    public dataService: DataService,
    private commonMethod: CommonMethods,
    private router: Router,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private accountService: AccountService,
    private constant: AppConstants,
    private location: Location,
    public datepipe: DatePipe,
    private elem: ElementRef,
  ) {
    let paginationObj = JSON.parse(JSON.stringify(PAGINATIONOBJ));
    this.config1 = paginationObj[0];
    this.config2 = paginationObj[1];
    /*****modified by USER PSB1*****/
    this.config3 = paginationObj[2];
    this.config4 = paginationObj[3];
    /*****modified by USER PSB1 Ends****/
  }

  isActive: boolean = true;
  isDeposite: boolean = false;
  mySavingAccount: any = [];
  totalSavAcc: any = '00';
  totalSavAmt: any = 0;
  myCurrentAccount: any = [];
  totalCurrentAcc: any = '00';
  totalCurrentAmt: any = 0;
  myDepositeAccount: any = [];
  totalDepositeAcc: any = '00';
  totalDepositeAmt: any = 0;
  myCashCreditAccount: any;
  totalCashCreditAmt: any;
  totalCashCreditAcc: any = '00'
  showNoRecords: boolean = false;
  accountCarouselOptions: OwlOptions;
  totalSavingAmt: any;
  activeTab = "savingAccount";
  cardSelectionSection: any;
  refreshDate: any;
  config1: any;
  config2: any;
  /*****modified by USER PSB1*****/
  config3: any;
  config4: any;
  /*****modified by USER PSB1 Ends****/
  norecords: boolean;
  isOperativeSingleCurrency: boolean = false;
  isSavingSingleCurrency: boolean = false;
  isCurrentSingleCurrency: boolean = false;
  isDepositeSingleCurrency: boolean = false;
  isCashCreditSingleCurrency: boolean = false;

  pageChanged1(event) { this.config1.currentPage = event; }
  pageChanged2(event) { this.config2.currentPage = event; }
  /*****modified by USER PSB1*****/
  pageChanged3(event) { this.config3.currentPage = event; }
  pageChanged4(event) { this.config4.currentPage = event; }
  /*****modified by USER PSB1 Ends****/

  ngOnInit(): void {
    this.accountCarouselOptions = this.dataService.getAccountCarouselOptions();
    this.initialize();
  }

  /**
  * filter and load data at the time of intialization
  */
  initialize() {
    this.getAccountList();
    this.refreshDate = this.datepipe.transform(this.dataService.onRefreshDate?.toISOString(), this.dataService.timeFormat);
    this.isOperativeSingleCurrency = this.dataService.customerOperativeAccList.some((e) => e.currency.toLowerCase() != "inr");
  }

  /**
  * function to get all the account list and filter
  *  data with respect to it
  */
  getAccountList(type?: any) {
    if (type == 'refresh') {
      let param = this.accountService.getMyAccountList(this.dataService.userDetails.cifNumber);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == "00") {
          this.dataService.getAccountListApiCall(data)
          this.dataService.onRefreshDate = new Date();
          this.refreshDate = this.datepipe.transform(this.dataService.onRefreshDate.toISOString(), this.dataService.timeFormat);
          this.setAccountDtl();
        } else { }
      },
        (error) => {
          console.log(error);
        });
    }
    else {
      this.setAccountDtl()
    }
  }

  //set account details
  setAccountDtl() {
    this.totalSavingAmt = 0;
    this.totalSavAmt = 0;
    this.totalCurrentAmt = 0;
    this.totalDepositeAmt = 0;
    this.totalSavAcc = 0;
    this.totalCurrentAcc = 0;
    this.totalDepositeAcc = 0;
    this.totalCashCreditAcc = 0;
    this.mySavingAccount = [];
    this.myCurrentAccount = [];
    this.myDepositeAccount = [];
    this.myCashCreditAccount = [];
    this.totalCashCreditAmt = 0;

    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI") {
        switch (el.SchemeCode) {
          case AccountType.SAVING_ACCOUNT:
            this.mySavingAccount.push(el);
            console.log("TESTTTTTTTTTTTTT ::: ", this.mySavingAccount)
            this.totalSavAmt = this.totalSavAmt + parseFloat(el.acctBalance);
            this.mySavingAccount = this.dataService.modeOperationCheck(this.mySavingAccount);
            break;
          case AccountType.CURRENT_ACCOUNT:
            this.myCurrentAccount.push(el);
            this.totalCurrentAmt = this.totalCurrentAmt + parseFloat(el.acctBalance);
            this.myCurrentAccount = this.dataService.modeOperationCheck(this.myCurrentAccount);
            break;
          case AccountType.OVER_DRAFT_ACCOUNT:
            this.myDepositeAccount.push(el);
            this.totalDepositeAmt = this.totalDepositeAmt + parseFloat(el.acctBalance);
            this.myDepositeAccount = this.dataService.modeOperationCheck(this.myDepositeAccount);
            break;
          case AccountType.CASH_CREDIT:
            this.myCashCreditAccount.push(el);
            this.totalCashCreditAmt = this.totalCashCreditAmt + parseFloat(el.acctBalance);
            this.myCashCreditAccount = this.dataService.modeOperationCheck(this.myCashCreditAccount);
            break;
        }
      }
      console.log("SAVING ACCOUNT :: ", this.mySavingAccount)
    });

    if (this.mySavingAccount.length == 0 && this.myCurrentAccount.length == 0 && this.myDepositeAccount.length == 0 && this.myCashCreditAccount.length == 0) {
      this.showNoRecords = true;
    }
    this.totalSavAcc = this.mySavingAccount.length < 10 ? '0' + this.mySavingAccount.length : this.mySavingAccount.length;

    if (this.dataService.isNRENRO) {
      this.isSavingSingleCurrency = this.mySavingAccount.some((e) => e.currency.toLowerCase() != "inr");
      this.isCurrentSingleCurrency = this.myCurrentAccount.some((e) => e.currency.toLowerCase() != "inr");
      this.isDepositeSingleCurrency = this.myDepositeAccount.some((e) => e.currency.toLowerCase() != "inr");
      this.isCashCreditSingleCurrency = this.myCashCreditAccount.some((e) => e.currency.toLowerCase() != "inr");
    }

    this.totalCurrentAcc = this.myCurrentAccount.length < 10 ? '0' + this.myCurrentAccount.length : this.myCurrentAccount.length;
    this.totalDepositeAcc = this.myDepositeAccount.length < 10 ? '0' + this.myDepositeAccount.length : this.myDepositeAccount.length;
    this.totalCashCreditAcc = this.myCashCreditAccount.length < 10 ? '0' + this.myCashCreditAccount.length : this.myCashCreditAccount.length;


    if (this.mySavingAccount.length != 0) {
      this.activeTab = "savingAccount";
    }
    else if (this.mySavingAccount.length == 0 && this.myCurrentAccount.length != 0) {
      this.activeTab = "currentAccount";
    }
    else if (this.mySavingAccount.length == 0 && this.myCurrentAccount.length == 0 && this.myDepositeAccount.length != 0) {
      this.activeTab = "odAccount";
    }
    else if (this.mySavingAccount.length == 0 && this.myCurrentAccount.length == 0 && this.myDepositeAccount.length == 0 && this.myCashCreditAccount.length != 0) {
      this.activeTab = "cashCreditAccount";
    }
    this.totalSavingAmt = this.totalSavAmt + this.totalCurrentAmt + this.totalDepositeAmt + this.totalCashCreditAmt;
  }

  gotoMyAccount(item) {
    console.log("ITEM :: ", item);
    if (item.Status.toLowerCase() == "active") {
      this.dataService.accDetails = item;
      this.dataService.accTypeSelected = "Operative"
      this.goToPage('accountMiniStatement');
    }
    else {
      /* Calling common information popup */
      this.dataService.information = "Selected Account is not Active";
      this.dataService.informationLabel = 'INFORMATION';
      this.dataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
    }
  }

  _gotoFundTransfer() {
    this.goToPage('sendMoney');
  }

  _gotoMyAccount() {
    if (this.dataService.accDetails) {
      this.goToPage('accountMiniStatement');
    }
    else {
      /* Calling common information popup */
      this.dataService.information = "Please select account to proceed";
      this.dataService.informationLabel = 'INFORMATION';
      this.dataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
    }
  }

  gotoFundTransfer(item) {
    this.dataService.accDetails = item;
    if (item.Status.toLowerCase() == "active")
      this.goToPage('sendMoney');
    else {
      /* Calling common information popup */
      this.dataService.information = "Selected Account is not Active";
      this.dataService.informationLabel = 'INFORMATION';
      this.dataService.primaryBtnText = 'OK';
      this.commonMethod.openPopup('div.popup-bottom.show-common-info');
    }

  }

  goToPage(page) {
    this.router.navigateByUrl('/' + page);
  }

  selectedAccount(item) {
    this.dataService.accDetails = item;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
    /* Commenting below code for Web Requirements */
    // if (this.constant.getIsCordova() == "web") {
    //   this.router.navigateByUrl('/dashboard');
    // }
    // else {
    //   this.router.navigateByUrl('/dashboardMobile');
    // }
  }

}
