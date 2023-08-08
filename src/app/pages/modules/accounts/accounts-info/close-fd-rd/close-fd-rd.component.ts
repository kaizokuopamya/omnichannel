import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AppConstants } from 'src/app/app.constant';

import * as moment from 'moment';
import { CommonMethods } from 'src/app/services/common-methods';
import { CloseFdRdService } from './close-fd-rd.service';
import { FORMTYPES, SHAREDETAILFD, SHAREDETAILRD } from './close-fd-rd-model';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
declare var window: any;
declare var OSREC: any;

@Component({
  selector: 'app-close-fd-rd',
  templateUrl: './close-fd-rd.component.html',
  styleUrls: ['./close-fd-rd.component.scss']
})
export class CloseFdRdComponent implements OnInit {

  constructor(
    private router: Router,
    public dataService: DataService,
    private location: Location,
    private constant: AppConstants,
    private commonMethod: CommonMethods,
    private closeFdRDService: CloseFdRdService,
    private customCurrencyPipe: CustomCurrencyPipe,
  ) {
    this.selectedAccData = this.router.getCurrentNavigation().extras.state;
  }

  selectedAccData: any = "";
  fdDetailsData: any = "";
  rdDetailsData: any = "";
  totalAccountList: any = [];
  accountDetailsList: any = [];
  accountDtls: any;
  selAccDtl: any;
  isTermsAndCondition: boolean;
  shareDetails: boolean = false;

  shareDtlFD: any = SHAREDETAILFD
  shareDtlRD: any = SHAREDETAILRD
  formtypes: any = FORMTYPES

  closeFDForm: FormGroup;
  closeRDForm: FormGroup

  ngOnInit(): void {
    this.fdDetailsData = this.selectedAccData.FDRDData;
    this.rdDetailsData = this.selectedAccData.FDRDData;
    this.totalAccountList = this.dataService.customerMyDepostie;
    this.selAccDtl = this.totalAccountList.filter(item => item.accountNo == this.selectedAccData.account);
    this.accountDtls = this.selectedAccData.accountDtls;
    this.buildForm();
    this.patchValueForm()
    this.dataService.screenType = 'closeDeposit'
  }

  convertCurrency(value) {
    return OSREC.CurrencyFormatter.format(value, { currency: 'INR', symbol: '₹' });
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }

  buildForm() {
    const index = this.formtypes.map((object: any) => object.formType).indexOf(this.dataService.closeDepositType);
    var selectedForm = this.formtypes[index].formDetails
    if (this.dataService.closeDepositType == "closeFD") {
      this.closeFDForm = this.dataService.buildForm(selectedForm);
    } else if (this.dataService.closeDepositType == "closeRD") {
      this.closeRDForm = this.dataService.buildForm(selectedForm)
    }

  }

  patchValueForm() {
    switch (this.dataService.closeDepositType) {
      case 'closeFD':
        this.closeFDForm.patchValue({
          fdAccount: this.selectedAccData.account,
          depositAccount: this.convertCurrency(this.fdDetailsData.depositAmount),
          originalMaturityAmount: this.convertCurrency(this.fdDetailsData.maturityAmount),
          currentFDAccountBalance: this.convertCurrency(this.fdDetailsData.accountClearBalance),
          maturityPayoutAccount: this.fdDetailsData.repaymentAccountNumber,
          fdOpenDate: this.fdDetailsData.accountOpenDate,
          fdMaturityDate: this.fdDetailsData.maturityDate
        })
        break;

      case 'closeRD':
        this.closeRDForm.patchValue({
          fdAccount: this.selectedAccData.account,
          monthlyInstallment: this.convertCurrency(this.rdDetailsData.depositAmount),
          originalMaturityAmount: this.convertCurrency(this.rdDetailsData.maturityAmount),
          currentRDAccountBalance: this.convertCurrency(this.rdDetailsData.accountClearBalance),
          maturityPayoutAccount: this.rdDetailsData.repaymentAccountNumber
        })
        break;

      default:
        break;

    }
  }

  validateForm() {

    switch (this.dataService.closeDepositType) {
      case 'closeFD':
        if (this.closeFDForm.invalid) {
          this.closeFDForm.get('fdAccount').markAsTouched();
          this.closeFDForm.get('remark').markAsTouched();
          this.closeFDForm.get('termsCondition').markAsTouched();
          return;
        }
        break;

      case 'closeRD':
        if (this.closeRDForm.invalid) {
          this.closeRDForm.get('fdAccount').markAsTouched();
          this.closeRDForm.get('remark').markAsTouched();
          this.closeRDForm.get('termsCondition').markAsTouched();
          return;
        }
        break;
    }
  }

  closeDeposit() {
    if (this.dataService.closeDepositType == 'closeFD') {
      this.closeFdSubmit()
    } else {
      this.closeRdSubmit()
    }
  }

  closeFdSubmit() {

    if (this.closeFDForm.valid) {
      this.dataService.commonOtpServiceType = this.constant.val_CLOSEFD //common OTP Type

      let date = this.fdDetailsData.accountOpenDate.split("/")[0];
      let month = this.fdDetailsData.accountOpenDate.split("/")[1];
      let year = this.fdDetailsData.accountOpenDate.split("/")[2];
      var maturityDiff = parseInt("" + moment().diff(year + "-" + month + "-" + date, 'years', true))

      if (maturityDiff < 5 && this.fdDetailsData.SchemeCode == 'FDTXO' ||
        this.fdDetailsData.SchemeCode == 'FDTXC' ||
        this.fdDetailsData.SchemeCode == 'FDTSF' ||
        this.fdDetailsData.SchemeCode == 'FDTXS' ||
        this.fdDetailsData.SchemeCode == 'FDTXZ' ||
        this.fdDetailsData.SchemeCode == 'FDTSS'
      ) {
        this.commonMethod.openPopup('div.popup-bottom.FD')
        return;
      }

      this.dataService.feedbackType = "closeFD";
      var param = this.closeFdRDService.getCloseFDCall(this.selectedAccData.account);
      this.dataService.request = param;
      this.dataService.endPoint = this.constant.serviceName_TDCLOSUREVALIDATION;
      var objCheckFlag = this.dataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.dataService.endPoint.split('/')[1]);

      this.dataService.screenDetails = {
        'DEPOSIT_TYPE': this.dataService.closeFDObj.depositType = this.fdDetailsData.accountType,
        'DEPOSIT_SCHEME': this.dataService.closeFDObj.depositScheme = this.fdDetailsData.accountCategory + '-' + this.fdDetailsData.schemeDescription,
        'DEPOSITOR_TYPE': this.dataService.closeFDObj.depositorType = this.fdDetailsData?.schemeDescription ? this.fdDetailsData?.schemeDescription : '-',
        'FD_ACCOUNT_NUMBER': this.dataService.closeFDObj.FDAccNumber = this.selectedAccData.account,
        'CONTRACTED_RATE_OF_INTEREST': this.dataService.closeFDObj.rateOfInterest = this.fdDetailsData.interest_Rate + ' %',
        'DEPOSIT_AMOUNT': this.dataService.closeFDObj.depositAmount = this.customCurrencyPipe.transform(this.fdDetailsData.depositAmount.trim(), 'decimal'),
        'CURRENT_FD_ACCOUNT_BALANCE': this.dataService.closeFDObj.depositorType = this.fdDetailsData?.accountClearBalance ? this.customCurrencyPipe.transform(this.fdDetailsData?.accountClearBalance.trim(), 'decimal') : '-',
        'ORIGINAL_MATURITY_AMOUNT': this.dataService.closeFDObj.currentMaturityAmount = this.customCurrencyPipe.transform(this.fdDetailsData.maturityAmount.trim(), 'decimal'),
        'MATURITY_DATE': this.dataService.closeFDObj.maturityDate = this.fdDetailsData.maturityDate,
        'MATURITY_PAYOUT_ACCOUNT': this.dataService.closeFDObj.maturityPayoutAccount = this.fdDetailsData.repaymentAccountNumber,
        'REMARKS': this.dataService.closeFDObj.remarks = this.closeFDForm.value.remark,
      }

      this.dataService.closeFDObj.creditToClose = this.fdDetailsData.maturityAmount,
        this.router.navigateByUrl('/otpsession');
    }
    else {
      this.validateForm();
    }
  }

  closeRdSubmit() {
    if (this.closeRDForm.valid) {
      this.dataService.commonOtpServiceType = this.constant.val_CLOSERD //common OTP Type

      this.dataService.feedbackType = "closeRD";
      var param = this.closeFdRDService.getCloseRDCall(this.selectedAccData.account);
      this.dataService.request = param;
      this.dataService.endPoint = this.constant.serviceName_RDCLOSUREVALIDATION;
      var objCheckFlag = this.dataService.activitySettingData.findIndex(x => x.ACTIVITYNAME == this.dataService.endPoint.split('/')[1]);
      this.dataService.screenDetails = {
        'DEPOSIT_TYPE': this.dataService.closeRDObj.depositType = this.rdDetailsData.accountType,
        'DEPOSITOR_TYPE': this.dataService.closeRDObj.depositorType = this.rdDetailsData,
        'RD_ACCOUNT_NUMBER': this.dataService.closeRDObj.RDAccNumber = this.selectedAccData.account,
        'APPLICABLE_RATE_OF_INTEREST': this.dataService.closeRDObj.rateOfInterest = this.rdDetailsData.interest_Rate + ' %',
        'EFFECTIVE_RATE_OF_INTEREST': this.dataService.closeRDObj.rateOfInterest = this.rdDetailsData.interest_Rate + ' %',
        'INSTALLMENT_AMOUNT': this.dataService.closeRDObj.depositAmount = this.customCurrencyPipe.transform(this.rdDetailsData.depositAmount.trim(), 'decimal'),
        'CURRENT_MATURITY_AMOUNT': this.dataService.closeRDObj.currentMaturityAmount = this.customCurrencyPipe.transform(this.rdDetailsData.maturityAmount.trim(), 'decimal'),
        'CREDIT_TO_CLOSE': this.dataService.closeRDObj.creditToClose = this.customCurrencyPipe.transform(this.rdDetailsData.maturityAmount.trim(), 'decimal'),
        'MATURITY_PAYOUT_ACCOUNT': this.dataService.closeRDObj.maturityPayoutAccount = this.rdDetailsData.repaymentAccountNumber,
        'MATURITY_DATE': this.dataService.closeRDObj.maturityDate = this.rdDetailsData.maturityDate,
        'REMARKS': this.dataService.closeFDObj.remarks = this.closeRDForm.value.remark,
      }
      this.dataService.closeRDObj.depositScheme = this.rdDetailsData.accountCategory + '-' + this.rdDetailsData.schemeDescription,
        this.router.navigateByUrl('/otpsession');
    }
    else {
      this.validateForm();
    }
  }


  shareFdDetails() {
    this.shareDetails = !this.shareDetails;
  }

  onCancel() {
    // if(this.constant.getIsCordova() == "web"){ JIJO/VIVEK
    this.router.navigateByUrl('/accountMiniStatement');
    // }
    // else{
    //   this.location.back();
    // }
  }

  submitShare() {
    this.accountDetailsList = [];
    console.log("SHARE DETAILS :", this.shareDtlFD);

    switch (this.dataService.closeDepositType) {
      case 'closeFD':
        if (this.shareDtlFD.fdAccNumber) {
          this.accountDetailsList.push({ label: 'FD Account Number', value: this.selectedAccData?.account });
        }
        if (this.shareDtlFD.accType) {
          this.accountDetailsList.push({ label: 'Account Type', value: 'Term Deposit Account' });
        }
        if (this.shareDtlFD.accScheme) {
          this.accountDetailsList.push({ label: 'Account Scheme', value: this.fdDetailsData?.SchemeCode + "-" + this.selAccDtl?.schemeDescription });
        }
        if (this.shareDtlFD.interestRate) {
          this.accountDetailsList.push({ label: 'Current Rate of Interest', value: this.fdDetailsData?.interest_Rate });
        }
        if (this.shareDtlFD.branchAddress) {
          this.accountDetailsList.push({ label: 'Branch Address', value: this.accountDtls?.BranchAddress });
        }
        if (this.shareDtlFD.custId) {
          this.accountDetailsList.push({ label: 'Customer ID', value: this.dataService.userDetails.cifNumber });
        }
        if (this.shareDtlFD.nomineeName) {
          this.accountDetailsList.push({ label: 'Nominee Name', value: '' });
        }
        break;

      case 'closeRD':
        if (this.shareDtlRD.rdAccNumber) {
          this.accountDetailsList.push({ label: 'RD Account Number', value: this.selectedAccData?.account });
        }
        if (this.shareDtlRD.maturityDate) {
          this.accountDetailsList.push({ label: 'Maturity Date', value: this.rdDetailsData?.maturityDate });
        }
        if (this.shareDtlRD.tenure) {
          this.accountDetailsList.push({ label: 'Tenure', value: this.rdDetailsData?.depositPeriodMonthsComponent + ' Months' });
        }
        if (this.shareDtlRD.interestRate) {
          this.accountDetailsList.push({ label: 'Current Rate of Interest', value: this.rdDetailsData?.interest_Rate });
        }
        if (this.shareDtlRD.modeOdRdOpening) {
          this.accountDetailsList.push({ label: 'Mode Of RD Opening', value: this.rdDetailsData?.account == 'ONLINE USE' ? 'Online' : 'Branch' });
        }
        if (this.shareDtlRD.maturityPayoutAcc) {
          this.accountDetailsList.push({ label: 'Maturity Payout Account', value: this.rdDetailsData?.repaymentAccountNumber });
        }
        break;

      default:
        break;
    }

    this.shareAccountDtl();
  }


  shareAccountDtl() {
    this.shareDetails = !this.shareDetails;
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

  cancelShare() {
    this.shareDetails = false;
  }

  termsConditionPopup(type) {
    switch (type) {
      case 'closed':
        this.commonMethod.openPopup('div.terms-conditions-popup')
        break;
      default:
        break;
    }
  }

  closeTerms() {
    this.commonMethod.closeAllPopup();
  }

  openPopup(popup) {

    switch (this.dataService.closeDepositType) {
      case 'closeFD':
        if (this.closeFDForm.valid && this.isTermsAndCondition) {
          this.commonMethod.openPopup('div.popup-bottom.' + popup);
        } else {
          this.validateForm();
        }
        break;

      case 'closeRD':
        if (this.closeRDForm.valid && this.isTermsAndCondition) {
          this.commonMethod.openPopup('div.popup-bottom.' + popup);
        } else {
          this.validateForm();
        }
        break;
    }

  }

  closePopup() {
    this.commonMethod.closeAllPopup();
  }

  onCheckboxChecked(event) {
    console.log(event);
    this.isTermsAndCondition = event.target.checked;
  }
}
