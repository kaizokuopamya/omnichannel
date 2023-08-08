import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { CommonMethods } from 'src/app/services/common-methods';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AccountType } from '../../../../enum/app-enum';
import { PAGINATIONOBJ } from 'src/app/model/common.model';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-my-deposit',
  templateUrl: './my-deposit.component.html',
  styleUrls: ['./my-deposit.component.scss']
})

export class MyDepositComponent implements OnInit {

  constructor(
    public dataService: DataService,
    private commonMethod: CommonMethods,
    private router: Router,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private datepipe: DatePipe,
    private location: Location,
    private accountService: AccountService,
  ) {
    let paginationObj = JSON.parse(JSON.stringify(PAGINATIONOBJ));
    this.config1 = paginationObj[0]
    this.config2 = paginationObj[1]
  }

  pageChanged1(event) { this.config1.currentPage = event; }
  pageChanged2(event) { this.config2.currentPage = event; }

  isActive: boolean = true;
  isDeposite: boolean = false;
  totalFixedAcc: any = '00';
  totalFixedAmt: any = 0;
  totalRecuringAcc: any = '00';
  totalRecuringAmt: any = 0;
  accountCarouselOptions: OwlOptions;
  activeTab = "fixed";
  myFixedAccount: any = [];
  totalSavAmt: any = 0;
  myRecurringAccount: any = [];
  totalCurrentAmt: any = 0;
  totalDepositeAcc: any = '00';
  totalDepositeAmt: any = 0;
  totalSavingAmt: any;
  refreshedTime: any;
  config1: any;
  config2: any;
  showNoRecords: boolean = false;
  isDepositeSingleCurrency: boolean = false;
  isFixedDepositingleCurrency: boolean = false;
  isRecuringDepositeSingleCurrency: boolean = false;
  refreshDate: any;

  ngOnInit(): void {
    this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
    this.initialize();
    this.isDepositeSingleCurrency = this.dataService.customerMyDepostie.some((e) => e.currency.toLowerCase() != "inr");
  }

  /**
  * filter and load data at the time of intialization
  */
  initialize() {
    this.accountCarouselOptions = this.dataService.getAccountCarouselOptions();
    this.refreshDate = this.datepipe.transform(this.dataService.onRefreshDate.toISOString(), this.dataService.timeFormat);
    this.getAccountList();
  }

  refreshDetails() {
    let param = this.accountService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
          this.dataService.getAccountListApiCall(data)
          this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
          this.getAccountList();
      } else {} 
    },
      (error) => {
        console.log(error);
    });

  }

  getAccountList(type?: any) {
    this.totalSavingAmt = 0;
    this.totalSavAmt = 0;
    this.totalCurrentAmt = 0;
    this.totalDepositeAmt = 0;
    this.totalRecuringAcc = 0;
    this.totalFixedAcc = 0;
    this.totalDepositeAcc = 0;
    this.totalFixedAmt = 0;
    this.totalRecuringAmt = 0;
    this.myFixedAccount = [];
    this.myRecurringAccount = [];
    this.dataService.customerMyDepostie.forEach(el => {
      if (el.accountType != "CAPPI") {
        switch (el.SchemeCode) {
          case AccountType.FIXED_DEPOSITE_ACCOUNT:
            let accNo = el.accountNo
            if (this.dataService.isNRENRO) {
              if (accNo.slice(4, 6) == "14" || accNo.slice(4, 6) == "17") { //"00501400002133" FD
                this.myFixedAccount.push(el);
                this.totalFixedAmt = this.totalFixedAmt + parseFloat(el.acctBalance);
              }
              else if (accNo.slice(4, 6) == "15") { //"00501500002183" RD
                this.myRecurringAccount.push(el);
                this.totalRecuringAmt = this.totalRecuringAmt + parseFloat(el.acctBalance);
              }
            }
            else {
              if (accNo.slice(4, 6) == "14") { //"00501400002133" FD
                this.myFixedAccount.push(el);
                this.totalFixedAmt = this.totalFixedAmt + parseFloat(el.acctBalance);
              }
              else if (accNo.slice(4, 6) == "15") { //"00501500002183" RD
                this.myRecurringAccount.push(el);
                this.totalRecuringAmt = this.totalRecuringAmt + parseFloat(el.acctBalance);
              }
            }

            break;
        }
      }
    });

    if (this.myFixedAccount.length == 0 && this.myRecurringAccount.length == 0) {
      this.showNoRecords = true
    }
    console.log('this.myFixedAccount: ', this.myFixedAccount);
    console.log('this.myFixedAccount: ', this.myRecurringAccount);
    this.myFixedAccount = this.dataService.modeOperationCheck(this.myFixedAccount);
    this.myRecurringAccount = this.dataService.modeOperationCheck(this.myRecurringAccount);

    this.totalFixedAcc = this.myFixedAccount.length < 10 ? '0' + this.myFixedAccount.length : this.myFixedAccount.length;
    this.totalRecuringAcc = this.myRecurringAccount.length < 10 ? '0' + this.myRecurringAccount.length : this.myRecurringAccount.length;

    if (this.dataService.isNRENRO) {
      if (this.myFixedAccount.length > 0) this.isFixedDepositingleCurrency = this.myFixedAccount.some((e) => e.currency.toLowerCase() != "inr");
      if (this.totalRecuringAmt.length > 0) this.isRecuringDepositeSingleCurrency = this.totalRecuringAmt.some((e) => e.currency.toLowerCase() != "inr");
    }

    if (this.totalFixedAcc != '00') { this.activeTab = 'fixed'; }
    else { this.activeTab = 'recurring'; }

    this.totalDepositeAmt = this.totalFixedAcc + this.totalRecuringAcc;
    if (type == 'refresh') {
      this.dataService.onRefreshDate = new Date();
      this.refreshDate = this.datepipe.transform(this.dataService.onRefreshDate.toISOString(), this.dataService.timeFormat);
    }
  }

  gotoMyAccount(item, value) {
    console.log(item);
    this.dataService.accDetails = item;
    this.dataService.accTypeSelected = "Deposits";
    this.dataService.subAccTypeSelected = value;
    this.router.navigateByUrl('/accountMiniStatement');
  }

  goToPage(routeName, selTab) {
    this.router.navigateByUrl('/' + routeName, { state: { openDepositTabSelection: selTab } });
  }

  selectedAccount(item) {
    this.dataService.accDetails = item;
  }

}

