import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Router } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { DatePipe, Location } from '@angular/common';
import { HttpRestApiService } from '../../../../services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import { PAGINATIONOBJ } from 'src/app/model/common.model';
import { AccountService } from '../account.service';




@Component({
  selector: 'app-my-loan',
  templateUrl: './my-loan.component.html',
  styleUrls: ['./my-loan.component.scss']
})
export class MyLoanComponent implements OnInit {

  constructor(
    public dataService: DataService,
    private router: Router,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    public datePipe: DatePipe,
    private accountService: AccountService,
  ) {
    let paginationObj = JSON.parse(JSON.stringify(PAGINATIONOBJ));
    this.config1 = paginationObj[0]
  }

  accountCarouselOptions: OwlOptions;
  activeTab = "home";

  refreshDate: any;
  myLoanAccount: any = [];
  loanAccountDtl: any = [];
  totalLoanAmt: any = 0;
  totalLoanAcc: any = '00';
  loanMandateDetailsList: any = [];
  refreshedTime: any;
  config1: any;
  showNoRecords: boolean = false
  isMyBorrowingSingleCurrency: boolean = false;


  pageChanged1(event) { this.config1.currentPage = event; }
  ngOnInit(): void {
    this.accountCarouselOptions = this.dataService.getAccountCarouselOptions();
    this.refreshedTime = this.datePipe.transform(new Date().toISOString(), this.dataService.timeFormat);
    this.getAccountList();
    this.refreshDate = this.dataService.onRefreshDate;
  }

  getAccountList(type?) {
    this.totalLoanAmt = 0;
    this.totalLoanAcc = 0;
    this.myLoanAccount = [];
    this.myLoanAccount = this.dataService.customerBorrowingsList;
    this.totalLoanAmt = this.dataService.totalMyBorrowingsBalance;

    this.myLoanAccount = this.dataService.modeOperationCheck(this.myLoanAccount);
    if (this.myLoanAccount.length > 0) this.isMyBorrowingSingleCurrency = this.myLoanAccount.some((e) => e.currency.toLowerCase() != "inr");

    if (this.myLoanAccount.length == 0) {
      this.showNoRecords = true
    }
    this.totalLoanAcc = this.myLoanAccount.length < 10 ? '0' + this.myLoanAccount.length : this.myLoanAccount.length;
    /*****modified by USER PSB1*****/
    if (this.totalLoanAcc != '00') { this.activeTab = 'home'; }
    /*****modified by USER PSB1 Ends****/

    if (type == 'refresh') {
      this.dataService.onRefreshDate = new Date();
      this.refreshDate = this.dataService.onRefreshDate
    }
  }

  getAccountBalance() {
    let param = this.accountService.getMyAccountList(this.dataService.userDetails.cifNumber);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_OMNIDASHBOARD).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        this.dataService.getAccountListApiCall(data)
        this.refreshedTime = this.datePipe.transform(new Date().toISOString(), this.dataService.timeFormat);
        this.getAccountList();
      } else { }
    },
      (error) => {
        console.log(error);
      });

  }

  loanDetails(item) {
    console.log(item);
    this.dataService.accDetails = item;
    this.dataService.loanDetails = item;
    this.dataService.accTypeSelected = "Loans"
    this.goToPage('/loanMiniStatement');
  }

  goToPage(page, item?) {
    if (page == 'payEmi') {
      console.log(item);
      this.dataService.accDetails = item;
      this.dataService.loanDetails = item;//accountNo
    }
    this.router.navigateByUrl('/' + page);
  }

  selectedAccount(item) {
    this.dataService.accDetails = item;
  }



}

