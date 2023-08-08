import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { AccountType } from 'src/app/enum/app-enum';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoginService } from '../../login/login.service';
import { Location } from '@angular/common';
import { DonationService } from './donation.service';

declare var $: any;
@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit, AfterViewInit {
  donationForm: FormGroup;
  ToDonateList = [];
  accountList: any = [];
  SchemeCode = "";
  maskedSelectedAccount = "";
  paymentType: any = 'self';
  paymentMode: any = '';
  accountNumber: any = '';
  refreshedTime: any;
  toAccSelected = '';
  totalSavingAmt: any = 0;
  totalDepositeAmt: any = 0;
  totalBorrowingAmt: any = 0;
  totalWorth: any = 0;
  ID: any;
  companyName: any = '';
  selectedAccount: any;
  isDonneSelected = false;
  invalidAmount = false;
  selDontationAcc: any;
  selDonateAccount: any;
  selectedFromAccMobile: any;
  
  isSelected = false;
  accBalance: any = ""

  constructor(
    private router: Router,
    public translate: TranslatePipe,
    public dataService: DataService,
    private formValidation: FormValidationService,
    private constant: AppConstants,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private donationService: DonationService,
    private customCurrencyPipe: CustomCurrencyPipe,
    private commonMethod: CommonMethods,
    public datepipe: DatePipe,
    private location: Location,
    private loginService: LoginService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.buildForm();
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'dashboardMobile';

    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status == "Active") {
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
          el.accountFlag == "P" ? this.accountList.splice(0, 0, el) : this.accountList.push(el);
        }
      }
    })

    this.accountNumber = this.accountList[0].accountNo;
    this.selectedAccount = this.accountNumber;
    this.onFromAccountSelect(this.selectedAccount);
    this.getAccountBalance(this.accountNumber);
    this.accBalance = this.accountList[0].acctBalance
    console.log("this.accountList" + JSON.stringify(this.accountList));
    this.dataService.otpSessionPreviousPage = this.router.url;

  }

  ngAfterViewInit() {
    var param = this.donationService.getDonationList();
    this.getDonationTypeList(param);
  }


  breadcrumroute(routeName) {
    this.dataService.updateBreadcrumb(this.router.url, routeName)
    this.router.navigateByUrl('/' + routeName);
  }

  getDonationTypeList(param) {
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_DONATIONLIST
      )
      .subscribe((data) => {
        console.log('=========>', data);
        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          this.ToDonateList = data.set.records;
          this.isFromResentPayee();
        } else {
          this.ToDonateList = [];
          this.errorCallBack(data.subActionId, resp);
        }
      },(error)=>{
        console.log(error);});
  }

  /**
  * function to called on unsuccessfull responce
  * @subActionId
  * @resp
  */
  errorCallBack(subActionId, resp) { }

  donationSubmit() {
    this.validateForm();
    this.onFundTransfer();
  }
  openList(e) {
    e.stopPropagation();
    $('#ToDonateList').slideToggle();
    $('#ToDonateList').parent().toggleClass('active')
  }

  selectToAcc(value) {
    console.log(JSON.stringify(value));
    this.isSelected = true
    this.donationForm.patchValue({
      toAccount: value.accountNumber,
    });

    this.toAccSelected = value.accountNumber;
    this.ID = value.ID;
    this.companyName = value.companyName;
    $('#ToDonateList').slideUp();
    this.isSelected = true;
  }

  accountItem(accountNo) {
    
    this.accountNumber = accountNo;
    this.getAccountBalance(accountNo);
  }

  buildForm() {
    this.donationForm = new FormGroup({
      toAccount: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(200000)]),
      remarks: new FormControl('', []),
      paymentMode: new FormControl(''),
      acceptTerms: new FormControl(false, [Validators.requiredTrue]),
    });
    if (this.dataService.profileDetails && this.dataService.profileDetails[0]?.panNumber) {
      this.donationForm.get("remarks").patchValue(this.dataService.profileDetails[0]?.panNumber);
    } else {
      this.getProfileDtl();
    }
  }

  maskCharacter(str, n) {
    // Slice the string and replace with
    // mask then add remaining string
    return ('' + str).slice(0, -n).replace(/./g, 'X') + ('' + str).slice(-n);
  }

  validateForm() {
    if (this.donationForm.invalid) {
      this.donationForm.get('toAccount').markAsTouched();
      this.donationForm.get('amount').markAsTouched();
      this.donationForm.get('paymentMode').markAsTouched();
      this.donationForm.get('acceptTerms').markAsTouched();
      return;
    }
  }


  onReset() {
    this.isDonneSelected = false;
    this.toAccSelected = ''
    this.donationForm.reset();
    this.companyName = ''
    this.donationForm.get('toAccount').markAsUntouched();
    this.donationForm.get('amount').markAsUntouched();
    this.donationForm.get('paymentMode').markAsUntouched();
    this.donationForm.get('acceptTerms').markAsUntouched();
    this.donationForm.get('acceptTerms').markAsPristine();
  }

  onFundTransfer() {

    this.isDonneSelected = true;
    this.dataService.request = ""

    if (this.donationForm.valid) {

      if (this.invalidAmount) {
        return
      }
      this.dataService.resetTransactionObj();
      var donationReqParam = this.donationService.getDonationFundTransferParam(this.donationForm.value, this.accountNumber, this.toAccSelected, 'self', this.ID, this.companyName);
      this.dataService.request = donationReqParam;
      this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;

      this.dataService.authorizeHeader = "DONATION SEND MONEY";
      this.dataService.transactionReceiptObj.accountNumber = this.accountNumber;
      this.dataService.transactionReceiptObj.to_acc = this.toAccSelected;
      this.dataService.transactionReceiptObj.payeeName = this.companyName;

      this.dataService.transactionReceiptObj.amount = this.donationForm.value.amount;
      this.dataService.transactionReceiptObj.remarks = this.donationForm.value.remarks;
      this.dataService.transactionReceiptObj.date = this.datepipe.transform(new Date().toISOString(), "dd MMM yyyy h:mm a");
      this.dataService.screenType = 'donationTransfer';
      this.dataService.commonOtpServiceType =this.constant.val_DONATIONTRANSFER;
      this.dataService.screenDetails = {
        FROM_ACCOUNT:this.dataService.transactionReceiptObj.accountNumber,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payeeName,
        TO_ACCOUNT:this.dataService.transactionReceiptObj.to_acc,
        AMOUNT: this.dataService.transactionReceiptObj.amount,
        REMARKS: this.dataService.transactionReceiptObj.remarks,
        TRANSACTION_DATE : this.datepipe.transform(new Date(), this.dataService.dateFormat)
      }
      this.router.navigate(['/otpsession']);


    }
  }

  /**
  * This function is use to call api to fetch
  * accounts balance
  */
  getAccountBalance(selectedAccount) {
    if (selectedAccount == "") {
      //showToastMessage("Please select account")
      return;
    }
    var selAccDtl = this.accountList.filter((objs) => objs.accountNo == selectedAccount)[0];

    var param = this.donationService.getAccountBalanceParam(selectedAccount);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEINQUIRY).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
       this.accBalance = !this.commonMethod.validateNullAndUndefined(data.set.records[0].ffdBalance) ? parseFloat(data.set.records[0].ledgerBalance) + parseFloat(data.set.records[0].ffdBalance) : parseFloat(data.set.records[0].ledgerBalance);
        this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);

      }
      else {
        this.errorCallBack(data.subActionId, resp);
      }
    })
  }


  goBack() {
    if (this.constant.getPlatform() == "web") {
      this.router.navigateByUrl("/dashboard");
    }
    else {
      this.location.back();
    }
  }

  clickedOut(event) {
    $('#ToDonateList').slideUp();
    $('#ToDonateList').parent().removeClass('active')
  }

  /**
* set update currency value
* @param value
*/
  formatCurrency(value) {
    let amt = this.customCurrencyPipe.transform(value, 'decimal').replace(/[^.0-9]+/g, '');
    this.formValidation.formatCurrency(value, this.donationForm);
  }

  OnInput(evn, form: FormGroup) {

    var regex = new RegExp("(\\.\\d{" + 2 + "})\\d+", "g");
    evn = evn.replace(regex, '$1');

    form.patchValue({
      amount: evn
    })

    if (Number(this.accBalance) >= Number((evn.trim().replace('₹', '')).replace(/,/g, ''))) {
      this.invalidAmount = false
    } else {
      this.invalidAmount = true
    }

  }

  onFocus(value) {
    // this.amountInWords = "";
    let _amount = value.replace(/[^0-9.]+/g, '');
    this.donationForm.patchValue({ amount: _amount });
  }
  focusTransactionAmount(el, form: FormGroup, fld){
    var amountText = el;
    amountText = amountText.replaceAll('₹','').replace(/^\₹|,|\.\d*$/gm, '');
    form.patchValue({ [fld]: amountText });
  }

  //designs for mobile
  selFromAccMobile() {
    this.commonMethod.openPopup('div.popup-bottom.sel-account');
  }

  onFromAccountSelect(selectedAccount) {
    console.log(selectedAccount);

    var account = this.accountList.filter((objs) => objs.accountNo == selectedAccount)[0];
    this.SchemeCode = account.SchemeCode
    this.maskedSelectedAccount = account.sbAccount;
    this.selectedFromAccMobile = selectedAccount;
    this.accountItem(selectedAccount)
  }


  closePopup() {
    this.commonMethod.closeAllPopup()
  }


  selDonateAcc(item) {
    this.selDontationAcc = item;
  }

  selectDonateAccount(donateAcc) {
    this.selDonateAccount = donateAcc.accountNumber;
    this.selectToAcc(donateAcc);
  }


  toDoneeAccMobile() {
    this.commonMethod.openPopup('div.popup-bottom.sel-account2');
  }

  openPopUp() {
    this.commonMethod.openPopup("div.tpin-popup")
  }

  closepopup() {
    this.commonMethod.closePopup("div.tpin-popup")
  }

  isFromResentPayee() {
    try {
      if (Object.keys(this.dataService.recentTransData).length !== 0) {
        var accDtl = this.ToDonateList.filter(obj => obj.accountNumber == this.dataService.recentTransData?.toAccNumber)[0]
        this.selectToAcc(accDtl);
      }
    }
    catch (ex) {

    }
  }

  getProfileDtl() {
    let param = this.loginService.getProfileDetailsParam();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CUSTPROFILEDETAILS).subscribe(data => {
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        var responseData = data.listofDataset[0].records;
        console.log("response data :: ", responseData)
        this.dataService.profiledateDetails = responseData;
        this.dataService.profileDetails = responseData;
        this.dataService.profileDetailsValue = data
        this.dataService.userName = responseData[0].userName;
        this.dataService.userLimits = data.listofDataset[1].records
        this.donationForm.get("remarks").patchValue(this.dataService.profileDetails[0]?.panNumber);
        // alert( this.DataService.userName )
        if (resp?.base64Image != "")
          this.dataService.profileImage = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + resp?.base64Image);
        else {
          this.dataService.profileImage = ''
          this.dataService.profileName = responseData[0].custName;
        }

        //get state and city code
        console.log('custProfileStateCityObj: ', this.dataService.custProfileStateCityObj);
        this.dataService.custProfileStateCityObj.state = data.responseParameter.stateCode;
        if (data.responseParameter.cityCode.includes('(')) {
          this.dataService.custProfileStateCityObj.city = data.responseParameter.cityCode.split('(')[0];
        }
        else {
          this.dataService.custProfileStateCityObj.city = data.responseParameter.cityCode;
        }

        this.dataService.custProfileStateCityObj.stateId = data.responseParameter.stateId;
        this.dataService.custProfileStateCityObj.cityId = data.responseParameter.CityId;
        this.dataService.custProfileStateCityObj.permenantState = data.responseParameter.stateCodep;
        if (data.responseParameter.cityCode.includes('(')) {
          this.dataService.custProfileStateCityObj.permenantCity = data.responseParameter.cityCodep.split('(')[0];
        }
        else {
          this.dataService.custProfileStateCityObj.permenantCity = data.responseParameter.cityCodep;
        }
      }
      else {
      }
    },(error)=>{
      console.log(error);
    });
    
  }

  ngOnDestroy() {
    this.dataService.recentTransData = {};
  }

}
