import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { SendMoneyService } from './send-money.service';
import { AppConstants } from 'src/app/app.constant';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DatePipe, Location } from '@angular/common';
import { CommonMethods } from 'src/app/services/common-methods';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORMERRORS, SECHDULEFORMERRORS, SelectedPayee } from './send-money.model';
import { AccountType } from 'src/app/enum/app-enum';
declare var $ :any;
declare var showToastMessage: any;

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent {
  selBenificiary: any = "";
  paymentType: any = 'self';
  fundTransfer: FormGroup;
  schedulePaymentForm: FormGroup;
  mmidSendMoneyForm: FormGroup;
  selfForm: FormGroup;
  withinBankForm: FormGroup;
  outsideBankForm: FormGroup;
  formErrors = FORMERRORS;
  sechduleFormErrors = SECHDULEFORMERRORS;
  accBalance: any;
  pageType: any;
  showDetails = false;
  tomorrow: any;
  refreshedTime: any;
  selectedAccount: any = '';
  soleId: any;
  maskedSelectedAccount: any = '';
  schemeCode: any;
  invalidAmount = false;
  selectedPayee:SelectedPayee;
  selAccOfBenificiary = "";
  selBankOfBenificiary = "";
  payeeAccountNo: any;
  selPayee:any;
  query = "";
  payType = "";
  frequencyType: any = "";
  onSelAccNo: any;
  amountInWords: string = "";
  selfSchedulePayment: boolean = false;
  withinSchedulePayment: boolean = false;
  outsideSchedulePayment: boolean = false;
  isScheduleChecked: boolean = false;
  openSection: boolean = false;
  typeOfFrequency = "";
  favBenificiary: any = "";
  paymentMethod: any;
  amntErrSelfMsg = "";
  amntErrMmidMsg = "";
  isFormValid:boolean = false;
  isSelected = false;
  amountEnterError: boolean = false;
  amntErrMsg:string;
  searchPayeeSection: boolean = false;
  info = " ";
  bankName: string='';

  list = [];
  frequencyArraySet: any = [];
  frequencyTypeArraySet: any = [];
  installmentArraySet: any = [];
  payeeList: any = [];
  benificiaryList: any = [];
  tempMMIDPayeeList: any = [];
  tempSELFPayeeList: any = [];
  tempWITHINPayeeList: any = [];
  tempOUTSIDEPayeeList: any = [];
  tempVPAPayeeList: any = [];
  ownBenificiaryList: any = [];
  otherBenificiaryList: any = [];
  internationalBenificiaryList: any = [];
  benificiaryListForprefill:any =[];
  withinBankPayeeDetailsList: any = [];
  outsideBankPayeeDetailsList: any = [];
  mmidBankPayeeDetailsList: any = [];


  constructor(private router: Router,
    public dataService: DataService,
    private sendMoneyService: SendMoneyService,
    private constant: AppConstants,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private formValidation: FormValidationService,
    private customCurrencyPipe: CustomCurrencyPipe,
    private commonMethod: CommonMethods,
    public datepipe: DatePipe,
    private location: Location) {

  }

  ngOnInit(): void {
    this.buildForm();
    this.onloadStaticData();
  }

  ngAfterViewInit(){
    var self = this;
    setTimeout(()=>{
      self.initialize();
    },200)
  }

  buildForm() {

    this.fundTransfer = new FormGroup({
      fromAccount: new FormControl('', [Validators.required]),
      toAccount: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.accBalance)]),
      paymentMethod: new FormControl(''),
      remark: new FormControl('')
    });
    this.fundTransfer.valueChanges.subscribe((data) => {
      this.formErrors = this.formValidation.validateForm(this.fundTransfer, this.formErrors, true);
    });

    this.schedulePaymentForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      paymentType: new FormControl('', [Validators.required]),
      frequency: new FormControl('', []),
      noOfInstalment: new FormControl('', [])
    });

    this.schedulePaymentForm.valueChanges.subscribe((data) => {
      this.sechduleFormErrors = this.formValidation.validateForm(this.schedulePaymentForm, this.sechduleFormErrors, true);
    });

    this.selfForm = new FormGroup({
      sendTo: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.accBalance)]),
      remark: new FormControl(''),
      paymentType: new FormControl('', []),
      datepicker1: new FormControl('', []),
      frequencyType: new FormControl('', []),
      installmentNumber: new FormControl('', []),

    })

    this.withinBankForm = new FormGroup({
      sendTo: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.accBalance)]),
      remark: new FormControl(''),
      paymentType: new FormControl('', []),
      datepicker1: new FormControl('', []),
      frequencyType: new FormControl('', []),
      installmentNumber: new FormControl('', []),
    })

    this.outsideBankForm = new FormGroup({
      sendTo: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.accBalance)]),
      remark: new FormControl(''),
      paymentMethod: new FormControl('', [Validators.required]),
      datepicker1: new FormControl('', []),
      paymentType: new FormControl('', []),
      frequencyType: new FormControl('', []),
      installmentNumber: new FormControl('', []),
    })

    // this.upiIdForm = new FormGroup({
    //   sendTo: new FormControl('', [Validators.required]),
    //   amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.accBalance)]),
    //   remark: new FormControl(''),
    //   datepicker1: new FormControl('', []),
    //   paymentType: new FormControl('', []),
    //   frequencyType: new FormControl('', []),
    //   installmentNumber: new FormControl('', []),
    // })

    this.mmidSendMoneyForm = new FormGroup({
      sendTo: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(1), , Validators.max(this.accBalance)]),
      radioboxdemo: new FormControl('', []),
      datepicker1: new FormControl('', []),
      paymentType: new FormControl('', []),
      frequencyType: new FormControl('', []),
      installmentNumber: new FormControl('', []),
      mmidRemark: new FormControl('', []),
    })
  };

   /**
   * Initialization functionality
   */
   initialize() {
    this.paymentMethod = [];
    this.list = [];
    setTimeout(()=>{
      if(!this.dataService.isCordovaAvailable){
        this.showDetails = true;
      }
    })
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status?.toLowerCase() == "active") {
        if (el.SchemeCode == AccountType.SAVING_ACCOUNT || el.SchemeCode == AccountType.CURRENT_ACCOUNT || el.SchemeCode == AccountType.CASH_CREDIT || el.SchemeCode == AccountType.OVER_DRAFT_ACCOUNT) {
          el.accountFlag == "P" ? this.list.splice(0, 0, el) : this.list.push(el);
        }
      }
    })

    this.changePaymentType(this.dataService.fundTransferTabType)

    if (this.list.length != 0 && (this.dataService.previousPageUrl != "myAccount" && this.dataService.previousPageUrl != "myAccountsInfo")) {
      setTimeout(() => {
        this.selectedAccount = this.list[0].accountNo;
        this.soleId = this.list[0].soleID
        this.schemeCode = this.list[0].SchemeCode ;
        this.maskedSelectedAccount =  this.list[0].sbAccount
        this.accBalance = this.list[0].acctBalance
        switch (this.paymentType) {
          case 'self':
            this.payeeList = this.list.filter(obj => (obj.accountNo != this.selectedAccount && obj?.Status == 'Active'));
            break;
        }
      });
      this.dataService.transactionReceiptObj.upiOmnifromAcc = this.list[0].accountNo;
      this.getAccountBalance(this.list[0].accountNo)
    }

    //select account if from my account
    if (this.dataService.previousPageUrl == "myAccount" || this.dataService.previousPageUrl == "myAccountsInfo") {
      this.setAccountNoFromMyAcc();
    }

    if (this.dataService.managePayeeToFundTransferData != '') {

      switch (this.dataService.managePayeeToFundTransferData.beneficiaryType) {
        case "INTRA":
          this.paymentType = "within"
          this.selAccOfBenificiary = "" + this.dataService.managePayeeToFundTransferData.benefName + "," + this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          this.selBankOfBenificiary = "" + this.dataService.managePayeeToFundTransferData?.beneficiary_bank_name + "," + this.dataService.managePayeeToFundTransferData?.ifsc_code;
          this.withinBankForm.patchValue({ sendTo: this.selAccOfBenificiary })
          this.payeeAccountNo = this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          this.selectedAccount = this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          break;
        case "INTERBANK":
          this.paymentType = "outside"
          this.selAccOfBenificiary = "" + this.dataService.managePayeeToFundTransferData.benefName + "," + this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          this.selBankOfBenificiary = "" + this.dataService.managePayeeToFundTransferData?.beneficiary_bank_name + "," + this.dataService.managePayeeToFundTransferData?.ifsc_code;
          this.outsideBankForm.patchValue({ sendTo: this.selAccOfBenificiary })
          this.payeeAccountNo = this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          this.selectedAccount = this.dataService.managePayeeToFundTransferData.beneficiary_account_no;
          this.fundTransfer.patchValue({ amount: this.dataService.managePayeeToFundTransferData?.txn_amount });
          break;
        case "MMID":
          this.paymentType = "mmid"
          this.selAccOfBenificiary = "" + this.dataService.managePayeeToFundTransferData.benefName + "," + this.dataService.managePayeeToFundTransferData.MMID;
          this.payeeAccountNo = this.dataService.managePayeeToFundTransferData.MMID;
          this.mmidSendMoneyForm.patchValue({ sendTo: this.selAccOfBenificiary })
          break;
        default:
          this.paymentType = "within";
          break;
      }
      this.selBenificiary = this.dataService.managePayeeToFundTransferData;
      this.selectedPayee = this.selBenificiary;
      this.dataService.managePayeeToFundTransferData = '';
      this.showDetails = true;
    } else {
      this.changePaymentType(this.paymentType)
    }

    this.getBeneficiaryList();
    this.isFromResentPayee();
  }

  setAccountNoFromMyAcc() {
    this.onSelAccNo = this.dataService.accDetails.accountNo;
    this.onFromAccountSelect(this.onSelAccNo);
  }

  onloadStaticData() {
    var backUrl = "";
    this.bankName = this.constant.val_bank_longForm;
    if (this.constant.getPlatform() == 'web') {
      if (this.dataService.isFromAccountDetails) {
        backUrl = 'myAccountDetails';
      } else { backUrl = 'dashboard'; }
    } else {
      if (this.dataService.isFromAccountDetails) {
        backUrl = 'myAccountsInfo';
      } else {
        backUrl = 'dashboardMobile';
      }
    }

    this.dataService.otpSessionPreviousPage = '/sendMoney';
    this.selBenificiary = '';

    this.getScheduleFrequency('SI_FREQUENCY')
    this.getScheduleFrequency('SI_FREQUENCY_TYPE')
    this.getScheduleFrequency('SI_TENURE')
    const today = new Date();
    this.tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
  }

  onFromAccountSelect(event) {
    console.log("onFromAccountSelect", event);
    this.selectedAccount = event;
    this.soleId = this.dataService.customerOperativeAccList.filter((objs) => objs.accountNo == event)[0].soleID;
    this.maskedSelectedAccount = event
    this.dataService.transactionReceiptObj.upiOmnifromAcc = event;
    this.schemeCode = this.dataService.customerOperativeAccList.filter((objs) => objs.accountNo == event)[0].SchemeCode;
    console.log(this.selectedAccount);
    this.getAccountBalance(event);
    this.changePaymentType(this.paymentType, 'Y');
  }

  /**
    * This function is use to call api to fetch
    * accounts balance
    */
  getAccountBalance(selectedAccount, isrefresh?) {
    this.withinBankForm.patchValue({
      amount: ''
    })

    if (selectedAccount == "") {
      showToastMessage("Please select account")
      return;
    }
    var selAccDtl = this.list.filter((objs) => objs.accountNo == selectedAccount)[0];

    if (isrefresh == 'refresh') {
      var param = this.sendMoneyService.getAccountBalanceParam(selectedAccount);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEINQUIRY).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter
        if (resp.opstatus == "00") {
          this.accBalance = !this.commonMethod.validateNullAndUndefined(data.set.records[0].ffdBalance) ? parseFloat(data.set.records[0].ledgerBalance) + parseFloat(data.set.records[0].ffdBalance) : parseFloat(data.set.records[0].ledgerBalance);
          this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
        }
        else {
          //this.errorCallBack(data.subActionId, resp);
        }
      },(error) => {
        console.log(error)
      })
    } else {
      var param = this.sendMoneyService.getAccountBalanceParam(selectedAccount);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BALANCEINQUIRY).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter
        if (resp.opstatus == "00") {
          this.accBalance = !this.commonMethod.validateNullAndUndefined(data.set.records[0].ffdBalance) ? parseFloat(data.set.records[0].ledgerBalance) + parseFloat(data.set.records[0].ffdBalance) : parseFloat(data.set.records[0].ledgerBalance);
          this.refreshedTime = this.datepipe.transform(new Date().toISOString(), this.dataService.timeFormat);
        }
        else {
          //this.errorCallBack(data.subActionId, resp);
        }
      },(error) => {
        console.log(error)
      })
    }

  }

  changePaymentType(type, setToAccount?: any) {
    this.invalidAmount = false
    this.paymentType = type;
    this.dataService.fundTransferTabType = type;
    if (this.dataService.isCordovaAvailable && setToAccount != 'Y') {
      this.showDetails = false;
    }
    switch (type) {
      case 'self':
        this.selfForm.reset();
        if (setToAccount == 'Y') {
          this.selfForm.patchValue({ sendTo: this.selectedPayee?.accountNo });
        }
        break;
      case 'within':
        this.withinBankForm.reset();
        if (setToAccount == 'Y') this.withinBankForm.patchValue({ sendTo: this.selectedPayee?.beneficiary_account_no });
        break;
      case 'outside':
        this.outsideBankForm.reset();
        if (setToAccount == 'Y') this.outsideBankForm.patchValue({ sendTo: this.selectedPayee?.beneficiary_account_no });
        break;
      case 'mmid':
        this.mmidSendMoneyForm.reset();
        if (setToAccount == 'Y') this.mmidSendMoneyForm.patchValue({ sendTo: this.selectedPayee?.MMID });
        break;
    }
    this.dataService.receiptBackPage = this.paymentType;
    if (setToAccount != 'Y') {
      this.selAccOfBenificiary = "";
      this.selBankOfBenificiary = "";
    }
    this.payeeListOnPaymentType()
  }

  payeeListOnPaymentType(isonLoad?) {

    switch (this.paymentType) {

      case 'self':
        if (isonLoad != 'onload') {
          this.payeeList = this.list.filter(obj => (obj.accountNo != this.selectedAccount && obj?.Status == 'Active'));
        }
        break;
      case 'within':
        this.payeeList = this.benificiaryList.filter(obj => (obj.statusId == '3' && obj.beneficiaryType == 'INTRA'));
        this.tempWITHINPayeeList = this.payeeList;
        break;
      case 'outside':
        this.payeeList = this.benificiaryList.filter(obj => (obj.statusId == '3' && obj.beneficiaryType == 'INTERBANK'));
        this.tempOUTSIDEPayeeList = this.payeeList;
        break;
      case 'vpa':
        this.payeeList = this.benificiaryList.filter(obj => (obj.statusId == '3' && obj.beneficiaryType == 'VPA'));
        break;
      case 'mmid':
        this.payeeList = this.benificiaryList.filter(obj => (obj.statusId == '3' && obj.beneficiaryType == 'MMID'));
        this.tempMMIDPayeeList = this.payeeList
        break;
    }

    this.payeeList = this.payeeList.filter(
      (obj) => (obj.accountType != 'CAPPI')
    );
    console.log(this.payeeList);
    this.tempSELFPayeeList = this.payeeList;

  }


  /**
 * This function is use to call api to fetch
 * payment type, frequency , no of iinstallation
 */
  getScheduleFrequency(type) {
    var param = this.sendMoneyService.getFrequencyParam(type);
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_CERTIFICATECONFIGS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter
      if (resp.opstatus == "00") {
        console.log("Frequency" + resp)
        var dataSet = data.listofDataset[0].records;
        console.log('dataset: ', dataSet);
        if (type == "SI_FREQUENCY") {
          this.frequencyArraySet = dataSet;
        }
        else if (type == "SI_FREQUENCY_TYPE") {

          this.frequencyTypeArraySet = dataSet
        }
        else if (type === "SI_TENURE") {
          dataSet.sort((a, b) => a.configVal - b.configVal)
          this.installmentArraySet = dataSet
        }
      }
      else {
        //this.errorCallBack(data.subActionId, resp);
      }
    }, (error) => {
      console.log(error);
    })
  }

  filterScheduleFrequency() {
    return this.frequencyArraySet.filter(x => x.configVal != 'WEEKLY')
  }

  backbtnClick() {
    this.location.back();
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboardMobile');
  }

  onAccountDropdownOpen() {
    if (window.innerWidth < 767) {
      this.commonMethod.openPopup('div.popup-bottom.sel-account');
    }
  }

  openSearchPayee(viewType, pageType, e) {
    if (e.stopPropagation) e.stopPropagation();
    this.pageType = pageType;
    switch (pageType) {
      case 'selfBank':
        if (this.constant.getPlatform()=="web") {
          $('#selfBankSelect').slideToggle();
          $('#selfBankSelect').parent().toggleClass('active')
        }
        else
          this.commonMethod.openPopup("div.popup-bottom.sel-account2")
        break;
      case 'withinBank':
        if (this.constant.getPlatform()=="web") {
          $('#withinBanlSelect').slideToggle();
          $('#withinBanlSelect').parent().toggleClass('active')
        }
        else
          this.commonMethod.openPopup("div.popup-bottom.sel-account2")
        break;
      case 'outside':
        if (this.constant.getPlatform()=="web") {
          $('#outsideBank').slideToggle();
          $('#outsideBank').parent().toggleClass('active')
        }
        else
          this.commonMethod.openPopup("div.popup-bottom.sel-account2")
        break;
      case 'upid':
        if (this.constant.getPlatform()=="web") {
          $('#upidBank').slideToggle();
          $('#upidBank').parent().toggleClass('active')
        }
        else
          this.commonMethod.openPopup("div.popup-bottom.sel-account2")
        break;
      case 'mmid':
        if (this.constant.getPlatform()=="web") {
          $('#mmidbankselect').slideToggle();
          $('#mmidbankselect').parent().toggleClass('active')
        }
        else
          this.commonMethod.openPopup("div.popup-bottom.sel-account2")
        break;
    }
  }

  searchListDrop(value, e){
    if (e.stopPropagation) e.stopPropagation();
    switch(value){
      case 'selfBank':
        $('#selfBankSelect').parent().addClass('active')
        break;

      case 'withinBank':
        $('#withinBanlSelect').parent().addClass('active')
        break;

      case 'outside':
        $('#outsideBank').parent().addClass('active')
        break;

      case 'upid':
        $('#upidBank').parent().addClass('active')
        break;

      case 'mmid':
        $('#mmidbankselect').parent().addClass('active')
        break;
    }
  }

  selectAccount(selectedBenfNo) {

    console.log(selectedBenfNo);

    this.selectedPayee = selectedBenfNo;
    if (this.paymentType != 'self') {

      this.selAccOfBenificiary = "" + selectedBenfNo?.benefName + "," + selectedBenfNo?.beneficiary_account_no;
      this.selBankOfBenificiary = "" + selectedBenfNo?.beneficiary_bank_name + "," + selectedBenfNo?.ifsc_code;

    }

    switch (this.paymentType) {
      case 'self':
        this.openSearchPayee('desktop', 'selfBank', '');
        this.selAccOfBenificiary = selectedBenfNo.accountNo;
        // this.selBankOfBenificiary = ""+selectedBenfNo?.beneficiary_bank_name+","+selectedBenfNo?.ifsc_code;
        this.selfForm.patchValue({ sendTo: selectedBenfNo.accountNo });
        this.payeeAccountNo = selectedBenfNo.accountNo;
        break;
      case 'within':
        this.openSearchPayee('desktop', 'withinBank', '');
        this.withinBankForm.patchValue({ sendTo: selectedBenfNo.beneficiary_account_no });
        this.payeeAccountNo = selectedBenfNo.beneficiary_account_no;
        break;
      case 'outside':
        this.openSearchPayee('desktop', 'outside', '');
        this.outsideBankForm.patchValue({ sendTo: selectedBenfNo.beneficiary_account_no });
        this.payeeAccountNo = selectedBenfNo.beneficiary_account_no;
        break;
      case 'upid':
        break;
      case 'mmid':
        this.openSearchPayee('desktop', 'mmid', '');
        this.mmidSendMoneyForm.patchValue({ sendTo: selectedBenfNo.MMID });
        this.payeeAccountNo = selectedBenfNo.MMID;
        break;
    }

    this.selBenificiary = selectedBenfNo;

  }

  searchAccount(event) {
    console.log("eventssssssssss", event.target.value);

    switch (this.paymentType) {
      case "self":
        if (event.target.value != '') {
          var payeeArrays = this.tempSELFPayeeList;
          var filterArray = payeeArrays.filter((objs) =>
            objs.schemeDescription.toLowerCase().includes(event.target.value.toLowerCase())
          );
          this.payeeList = [];
          this.payeeList = filterArray;
        } else {
          this.payeeList = [];
          this.payeeList = this.tempSELFPayeeList;
        }
        break;
      case "within":
        if (event.target.value != '') {
          var payeeArrays = this.tempWITHINPayeeList;
          var filterArray = payeeArrays.filter((objs) =>
            objs.benefName.toLowerCase().includes(event.target.value.toLowerCase())
          );
          this.payeeList = [];
          this.payeeList = filterArray;
          console.log("payyyyyy", this.payeeList)
        } else {
          this.payeeList = [];
          this.payeeList = this.tempWITHINPayeeList;
        }
        break;
      case "outside":
        if (event.target.value != '') {
          var payeeArrays = this.tempOUTSIDEPayeeList;
          var filterArray = payeeArrays.filter((objs) =>
            objs.benefName.toLowerCase().includes(event.target.value.toLowerCase())
          );
          this.payeeList = [];
          this.payeeList = filterArray;
          console.log("payyyyyy", this.payeeList)
        } else {
          this.payeeList = [];
          this.payeeList = this.tempOUTSIDEPayeeList;
        }
        break;
      case "mmid":
        if (event.target.value != '') {
          var payeeArrays = this.tempMMIDPayeeList;
          var filterArray = payeeArrays.filter((objs) =>
            objs.benefName.toLowerCase().includes(event.target.value.toLowerCase())
          );
          this.payeeList = [];
          this.payeeList = filterArray;
          console.log("payyyyyy", this.payeeList)
        } else {
          this.payeeList = [];
          this.payeeList = this.tempMMIDPayeeList;
        }
    }
  }

  /**
   * set update currency value
   * @param value
   */
  formatCurrency(value) {
    let amt = this.customCurrencyPipe.transform(value, 'decimal').replace(/[^.0-9]+/g, '');
    switch (this.paymentType) {
      case 'self':
        this.formValidation.formatCurrency(value, this.selfForm);
        break;
      case 'within':
        this.formValidation.formatCurrency(value, this.withinBankForm);
        break;
      case 'outside':
        this.formValidation.formatCurrency(value, this.outsideBankForm);
        break;
      case 'mmid':
        this.formValidation.formatCurrency(value, this.mmidSendMoneyForm);
        break;
      case 'vpa':
        break;
    }
  }

  OnInput(evn, form: FormGroup) {
    var regex = new RegExp("(\\.\\d{" + 2 + "})\\d+", "g");
    evn = evn.replace(regex, '$1');
    form.patchValue({amount: evn})
    if (Number(this.accBalance) >= Number((evn.trim().replace('₹', '')).replace(/,/g, ''))) {
      this.invalidAmount = false
    } else {
      this.invalidAmount = true
    }
  }

  focusTransactionAmount(el, form: FormGroup, fld){
    var amountText = el;
    amountText = amountText.replaceAll('₹','').replace(/^\₹|,|\.\d*$/gm, '');
    form.patchValue({ [fld]: amountText });
    this.amntErrSelfMsg = "";
    this.amntErrMmidMsg = "";
    this.amountEnterError = true;
  }

  scheduleCheckbox(type) {
    this.isScheduleChecked = !this.isScheduleChecked
    switch (type) {
      case 'self':
        this.selfSchedulePayment = !this.selfSchedulePayment
        this.sendMoneyUpdateValueValidity(this.selfForm, this.selfSchedulePayment)
        break;
      case 'within':
        this.withinSchedulePayment = !this.withinSchedulePayment
        this.sendMoneyUpdateValueValidity(this.withinBankForm, this.withinSchedulePayment)
        break;
      case 'outsideBank':
        this.outsideSchedulePayment = !this.outsideSchedulePayment
        this.sendMoneyUpdateValueValidity(this.outsideBankForm, this.outsideSchedulePayment)
        break;
      case 'mmid':
        this.openSection = !this.openSection
        this.sendMoneyUpdateValueValidity(this.mmidSendMoneyForm, this.openSection)
        break;
    }
  }

  sendMoneyUpdateValueValidity(sendMoneyForm, scheduledPayment) {
    if (scheduledPayment) {
      sendMoneyForm.controls['datepicker1'].setValidators([Validators.required])
      sendMoneyForm.controls['paymentType'].setValidators([Validators.required])
      sendMoneyForm.controls['frequencyType'].setValidators([])
      sendMoneyForm.controls['installmentNumber'].setValidators([])

    } else {
      sendMoneyForm.controls['datepicker1'].setValidators([])
      sendMoneyForm.controls['paymentType'].setValidators([])
      sendMoneyForm.controls['frequencyType'].setValidators([])
      sendMoneyForm.controls['installmentNumber'].setValidators([])
    }

    sendMoneyForm.controls['datepicker1'].updateValueAndValidity();
    sendMoneyForm.controls['paymentType'].updateValueAndValidity()
    sendMoneyForm.controls['frequencyType'].updateValueAndValidity()
    sendMoneyForm.controls['installmentNumber'].updateValueAndValidity()
  }

  onFrequencyChange(event) {
    this.typeOfFrequency = event.target.value;
    console.log("event.target.value" + event.target.value);
  }

  goToSendMoneyPayee(outputDtl) {
    var payee = outputDtl.output;
    if(outputDtl.payeeType == "recent"){
      this.dataService.recentTransData = {
          "benefName": payee.benefName,
          "txn_amount": payee.txn_amount,
          "DestinationType": payee.DestinationType,
          // "color": this.frequentTransactionColor[Math.floor(Math.random() * 3) + 1],
          "TransactionDate" : payee.TransactionDate,
          "TransactionMonth" : payee.TransactionMonth,
          "transType" : payee.TransactionType,
          "accNo": payee.accountNo,
          "fromAccNumber": payee.fromAccNumber,
          "toAccNumber": payee.toAccNumber,
          "beneficiary_bank_name": payee.beneficiary_bank_name,
          "ifsc_code": payee.ifscCode,
          "transactionType" : payee.RechargeType
        }
      this.showDetails = true;
      this.isFromResentPayee();
    }
    else{
      this.selBenificiary = payee;
      this.favBenificiary = payee;
      if (!payee?.accountNo) payee.accountNo = payee.beneficiary_account_no;


      switch (payee.beneficiaryType) {
        case "INTRA":
        case "WITHIN":
          this.paymentType = "within"
          this.selAccOfBenificiary = payee.benefName + "," + payee.accountNo;
          this.selBankOfBenificiary = "" + payee?.beneficiary_bank_name + "," + payee?.ifsc_code;
          this.payeeAccountNo = payee.accountNo;
          this.withinBankForm.patchValue({ sendTo: this.selAccOfBenificiary })
          break;
        case "INTERBANK":
        case "OUTSIDE":
          this.paymentType = "outside"
          this.selAccOfBenificiary = payee.benefName + "," + payee.accountNo;
          var bankName = payee?.beneficiary_bank_name != undefined ? payee?.beneficiary_bank_name : "-";
          this.selBankOfBenificiary = "" + bankName + "," + payee?.ifsc_code;
          this.payeeAccountNo = payee.accountNo;
          this.selectedPayee = {beneficiary_bank_name : bankName, ifsc_code : payee?.ifsc_code}
          this.outsideBankForm.patchValue({ sendTo: this.selAccOfBenificiary })
          break;
        case "MMID":
          this.paymentType = "mmid"
          this.selAccOfBenificiary = payee.benefName + "," + payee.MMID;  //payee.MMID
          this.payeeAccountNo = payee.MMID;
          this.mmidSendMoneyForm.patchValue({ sendTo: this.selAccOfBenificiary })
          break;
        default:
          this.paymentType = "within";
          break;
      }
      this.showDetails = true;
      this.payeeListOnPaymentType()
    }
  }

  isFromResentPayee(){
    try{
      if(Object.keys(this.dataService.recentTransData).length !== 0){
        if(this.dataService.recentTransData.transactionType.toLowerCase() != "self"
          && this.dataService.recentTransData.transactionType.toLowerCase() != "within"
          && this.dataService.recentTransData.transactionType.toLowerCase() != "neft"
          && this.dataService.recentTransData.transactionType.toLowerCase() != "rtgs"
          && this.dataService.recentTransData.transactionType.toLowerCase() != "upid"
          && this.dataService.recentTransData.transactionType.toLowerCase() != "mmid"
        ){
          return;
        }
        this.paymentType = this.dataService.recentTransData.transactionType.toLowerCase();
        this.selAccOfBenificiary = "" + this.dataService.recentTransData?.benefName + "," + this.dataService.recentTransData?.toAccNumber;
        this.selBankOfBenificiary = "" + this.dataService.recentTransData?.beneficiary_bank_name + "," + this.dataService.recentTransData?.ifsc_code;

        this.selBenificiary = {
          ID : this.dataService.recentTransData?.ID,
          benefName : this.dataService.recentTransData?.benefName,
          beneficiary_bank_name : this.dataService.recentTransData?.beneficiary_bank_name,
          branch_name : this.dataService.recentTransData?.branch_name,
          ifsc_code : this.dataService.recentTransData?.ifsc_code
        }
        this.selectedPayee = this.selBenificiary;
        this.showDetails = true;

        switch (this.paymentType) {
          case 'self':
            this.selfForm.patchValue({ 
              sendTo: this.dataService.recentTransData?.accountNo });
            this.payeeAccountNo = this.dataService.recentTransData?.accountNo;
            this.selectedAccount = this.dataService.recentTransData?.accountNo;
            break;
          case 'within':
            var toaccount = this.dataService.recentTransData?.beneficiary_account_no ;
            if(this.dataService.recentTransData?.beneficiary_account_no == undefined ){
              toaccount = this.dataService.recentTransData?.toAccNumber
            }
            this.withinBankForm.patchValue({ 
              sendTo: toaccount,
             });
            this.payeeAccountNo = toaccount;
            //this.selectedAccount = toaccount;
            break;
          case 'neft':
            this.paymentType = "outside";
            var toaccount = this.dataService.recentTransData?.beneficiary_account_no ;
            if(this.dataService.recentTransData?.beneficiary_account_no == undefined ){
              toaccount = this.dataService.recentTransData?.toAccNumber
            }
            this.outsideBankForm.patchValue({ 
              sendTo: toaccount,
             });
            this.payeeAccountNo = toaccount;
            //this.selectedAccount = toaccount;

            break;
            case 'rtgs':
              this.paymentType = "outside";
              var toaccount = this.dataService.recentTransData?.beneficiary_account_no ;
              if(this.dataService.recentTransData?.beneficiary_account_no == undefined ){
                toaccount = this.dataService.recentTransData?.toAccNumber
              }
              this.outsideBankForm.patchValue({ 
                sendTo: toaccount,
              });
              this.payeeAccountNo = toaccount;
              break;
          case 'upid':
            break;
          case 'mmid':
            this.mmidSendMoneyForm.patchValue({ 
              sendTo: this.dataService.recentTransData?.MMID,
             });
            this.payeeAccountNo = this.dataService.recentTransData?.MMID;
            this.selectedAccount = this.dataService.recentTransData?.MMID;
            break;
        }
        this.showDetails = true;
        this.payeeListOnPaymentType();
      }
    }
    catch(ex){

    }
  }

  /**
   * on add payee click this function is called
   */
  gotoAddPayee(code) {
    this.dataService.previousPageUrl = 'sendMoney';
    this.dataService.managePayeeToAddpayee = code;
    this.dataService.isAddPayeeFrompage = "/sendMoney";
    this.router.navigate(['/addPayee']);
  }



  getBeneficiaryList() {
    var param = this.sendMoneyService.benificiaryListParam();
    this.http
      .callBankingAPIService(
        param,
        this.storage.getLocalStorage(this.constant.storage_deviceId),
        this.constant.serviceName_BENIFICIARYLIST
      )
      .subscribe((data) => {
        console.log(data);

        let payeeDetailsListData = data.set['records'];
        console.log('Temp Manage beneficiary Data :: ', payeeDetailsListData);

        this.dataService.beneficiaryList.payeeAccNumber = payeeDetailsListData.ID;

        // Payee List Data Collection
        this.getBeneficiaryListData(payeeDetailsListData);

        var resp = data.responseParameter;
        if (resp.opstatus == '00') {
          console.log(this.ownBenificiaryList.length);
          this.benificiaryList = data.set.records;
          this.benificiaryListForprefill = data.set.records;

          this.payeeListOnPaymentType('onload')
        } else {
          //this.errorCallBack(data.subActionId, resp);
        }
      },(error) => {
        console.log(error)
      });
  }

    //Collecting data for all beneficiary of different types mode
    getBeneficiaryListData(payeeDetailsListData) {
      this.withinBankPayeeDetailsList = [];
      this.outsideBankPayeeDetailsList = [];
      this.mmidBankPayeeDetailsList = [];

      for (let i = 0; i < payeeDetailsListData.length; i++) {
        //Within Bank
        if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['beneficiaryType'] == 'INTRA') {
          this.withinBankPayeeDetailsList[i] = payeeDetailsListData[i]; //success payee list data Object.assign({}, ...this.payeeDetailsListData[i]);
        }
        //Outside Bank
        if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['beneficiaryType'] == 'INTERBANK') {
          this.outsideBankPayeeDetailsList[i] = payeeDetailsListData[i]; //success payee list data Object.assign({}, ...this.payeeDetailsListData[i]);
        }
        //mmid Bank
        if (payeeDetailsListData[i]['statusId'] == '3' && payeeDetailsListData[i]['MMID'] != 'null') {
          this.mmidBankPayeeDetailsList[i] = payeeDetailsListData[i]; //success payee list data Object.assign({}, ...this.payeeDetailsListData[i]);
        }
      }
      this.withinBankPayeeDetailsList = this.withinBankPayeeDetailsList.filter((obj) =>!(obj && Object.keys(obj).length === 0 && obj.constructor === Object));
      this.outsideBankPayeeDetailsList = this.outsideBankPayeeDetailsList.filter((obj) =>!(obj && Object.keys(obj).length === 0 && obj.constructor === Object));
      this.mmidBankPayeeDetailsList = this.mmidBankPayeeDetailsList.filter((obj) => !(obj && Object.keys(obj).length === 0 && obj.constructor === Object));
      this.tempMMIDPayeeList = this.mmidBankPayeeDetailsList;
      this.tempWITHINPayeeList = this.withinBankPayeeDetailsList;
      this.tempOUTSIDEPayeeList = this.outsideBankPayeeDetailsList;

      // this.searchFilter();
    }



  selAccountMobile(payee) {
    this.showDetails = true
    this.selPayee = payee;
  }

  goBack() {
    if (this.constant.getPlatform() == "web") {
      this.router.navigate(['/dashboard']);
    }
    else {
      this.location.back();
    }
  }

    /**
   * This function is called to make fund transfer
   */
    onFundTransfer() {

      this.isSelected = true;
      this.amountEnterError = false;
      this.amntErrMsg = this.dataService.amntErrMsgMax;
      this.dataService.request = ""
      this.amntErrSelfMsg = "";
      this.amntErrMmidMsg = "";
  
      this.validateForm()
  
      if (this.invalidAmount) {
        return
      }
  
      if (this.isFormValid) {
        this.dataService.resetTransactionObj();
        var amount;
       
        if (this.paymentType == 'outside' && this.outsideBankForm.value.paymentMethod == "RTGS" && this.outsideBankForm.value.amount.trim().replace(/[^.0-9]+/g, '') < this.dataService.RTGSLimit) {
          this.amntErrMsg = this.dataService.amntErrMsgMin;
          this.amountEnterError = true;
          return;
        }
        this.dataService.transactionReceiptObj.modeOfTransfer = "";
        this.dataService.authorizeHeader = "INITIATE SEND MONEY";
        this.dataService.screenType = 'fundTransfer';
        this.dataService.commonOtpServiceType = this.constant.val_FUNDTRANSFER;
        switch (this.paymentType) {
          case "self":
            this.selfFundTransfer();
            break;
          case "within":
            this.withInFundTransfer();
            break;
          case "outside":
            this.outsideFundTransfer();
            break;
          case "mmid":
            this.mmidFundTransfer();
            break;
          default:
        }
      }
      else {
        this.formErrors = this.formValidation.validateForm(this.fundTransfer, this.formErrors, true);
        this.sechduleFormErrors = this.formValidation.validateForm(this.schedulePaymentForm, this.sechduleFormErrors, true);
      }
    }

  selfFundTransfer() {
    /* Below code is added for installment limit validation */
    if ((this.selfForm.value.frequencyType == 'DAILY' && this.selfForm.value.installmentNumber > 1825)
      || (this.selfForm.value.frequencyType == 'MONTHLY' && this.selfForm.value.installmentNumber > 60)
      || (this.selfForm.value.frequencyType == 'QUARTERLY' && this.selfForm.value.installmentNumber > 20)
      || (this.selfForm.value.frequencyType == 'HALFYEARLY' && this.selfForm.value.installmentNumber > 10)
      || (this.selfForm.value.frequencyType == 'YEARLY' && this.selfForm.value.installmentNumber > 5)) {
      this.info = 'Number of installments exceeds more than 5 years';
      this.commonMethod.openPopup('div.popup-bottom.show-info');
      return;
    }
    // if(this.selfForm.value.frequencyType)

    if (this.isScheduleChecked) {
      this.setSchedulePayment(this.selfForm.value, this.selBenificiary, this.selectedAccount, 'self', this.payeeAccountNo);
      this.dataService.transactionReceiptObj.scheduledDate = this.selfForm.value.datepicker1;
      this.dataService.transactionReceiptObj.scheduledType = this.selfForm.value.paymentType
      this.dataService.transactionReceiptObj.isScheduled = this.isScheduleChecked
    } else {
      var selfReqParam = this.sendMoneyService.getFundTransferParam(this.selfForm.value, this.selBenificiary, this.selectedAccount, 'self', this.payeeAccountNo, this.soleId, 'sendmoneyself');
      this.dataService.request = selfReqParam;
      this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
      this.dataService.transactionReceiptObj.isScheduled = false;
      this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
      this.dataService.transactionReceiptObj.to_acc = this.payeeAccountNo;
      this.dataService.transactionReceiptObj.payee_name = this.dataService.userDetails?.customerName;
      this.dataService.transactionReceiptObj.amount = this.selfForm.value.amount;
      this.dataService.transactionReceiptObj.remarks = this.selfForm.value.remark;
      this.dataService.transactionReceiptObj.date = new Date().toISOString();
    }
    this.dataService.screenDetails = {
      FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
      TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
      PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
      AMOUNT: this.dataService.transactionReceiptObj.amount,
      REMARKS: this.dataService.transactionReceiptObj.remarks,
      TRANSACTION_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
      TRANSACTION_MODE:this.paymentType
    }
    if (this.isScheduleChecked) {
      this.dataService.screenDetails = {
        FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
        TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
        AMOUNT: this.dataService.transactionReceiptObj.amount,
        REMARKS: this.dataService.transactionReceiptObj.remarks,
        TRANSACTION_INITIATED_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
        SCHEDULED_DATE: this.datepipe.transform(this.dataService.transactionReceiptObj.scheduledDate, this.dataService.dateFormat),
        FREQUENCY: this.dataService.transactionReceiptObj.scheduledType,
        TRANSACTION_MODE: this.paymentType
      }
    }
    this.dataService.transactionReceiptObj.paymentType = this.paymentType;
    this.dataService.transactionReceiptObj.payee_id = this.selBenificiary.ID;
    this.dataService.recentTransData = {};
    this.router.navigate(['/otpsession']);
  }

  withInFundTransfer() {
    let amount = this.withinBankForm.value.amount.trim().replace(/[^.0-9]+/g, '');
    if (parseFloat(amount) > parseFloat(this.selBenificiary.maxAmount)) {
      this.amntErrSelfMsg = "Entered amount is more than transaction limit set for the selected user";
      return;
    }

    /* Below code is added for installment limit validation */
    if ((this.withinBankForm.value.frequencyType == 'DAILY' && this.withinBankForm.value.installmentNumber > 1825)
      || (this.withinBankForm.value.frequencyType == 'MONTHLY' && this.withinBankForm.value.installmentNumber > 60)
      || (this.withinBankForm.value.frequencyType == 'QUARTERLY' && this.withinBankForm.value.installmentNumber > 20)
      || (this.withinBankForm.value.frequencyType == 'HALFYEARLY' && this.withinBankForm.value.installmentNumber > 10)
      || (this.withinBankForm.value.frequencyType == 'YEARLY' && this.withinBankForm.value.installmentNumber > 5)) {
      this.info = 'Number of installments exceeds more than 5 years';
      this.commonMethod.openPopup('div.popup-bottom.show-info');
      return;
    }

    if (this.isScheduleChecked) {
      this.setSchedulePayment(this.withinBankForm.value, this.selBenificiary, this.selectedAccount, 'within', this.payeeAccountNo);
      this.dataService.transactionReceiptObj.scheduledDate = this.withinBankForm.value.datepicker1;
      this.dataService.transactionReceiptObj.scheduledType = this.withinBankForm.value.paymentType
      this.dataService.transactionReceiptObj.isScheduled = this.isScheduleChecked
    } else {
      var ownReqParam = this.sendMoneyService.getFundTransferParam(this.withinBankForm.value, this.selBenificiary, this.selectedAccount, 'within', this.payeeAccountNo, this.soleId, 'sendmoneywithin');
      this.dataService.request = ownReqParam;
      this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
      this.dataService.transactionReceiptObj.isScheduled = false;
      this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
      this.dataService.transactionReceiptObj.to_acc = this.payeeAccountNo;
      this.dataService.transactionReceiptObj.payee_name = this.selBenificiary.benefName;
      this.dataService.transactionReceiptObj.amount = this.withinBankForm.value.amount;
      this.dataService.transactionReceiptObj.remarks = this.withinBankForm.value.remark != "" ? this.withinBankForm.value.remark : "";
      this.dataService.transactionReceiptObj.date = new Date().toISOString();
    }
    this.dataService.screenDetails = {
      FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
      TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
      PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
      AMOUNT: this.dataService.transactionReceiptObj.amount,
      REMARKS: this.dataService.transactionReceiptObj.remarks,
      TRANSACTION_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
      TRANSACTION_MODE: this.paymentType
    }
    if (this.isScheduleChecked) {
      this.dataService.screenDetails = {
        FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
        TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
        AMOUNT: this.dataService.transactionReceiptObj.amount,
        REMARKS: this.dataService.transactionReceiptObj.remarks,
        TRANSACTION_INITIATED_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
        SCHEDULED_DATE: this.datepipe.transform(this.dataService.transactionReceiptObj.scheduledDate, this.dataService.dateFormat),
        FREQUENCY: this.dataService.transactionReceiptObj.scheduledType,
        TRANSACTION_MODE: this.paymentType
      }
    }

    this.dataService.transactionReceiptObj.paymentType = this.paymentType;
    this.dataService.transactionReceiptObj.payee_id = this.selBenificiary.ID;
    this.dataService.recentTransData = {};
    this.router.navigate(['/otpsession']);
  }

  outsideFundTransfer() {
    let amount = this.outsideBankForm.value.amount.trim().replace(/[^.0-9]+/g, '');
    if (parseFloat(amount) > parseFloat(this.selBenificiary.maxAmount)) {
      this.amntErrMsg = "Entered amount is more than transaction limit set for the selected user";
      this.amountEnterError = true;
      return;
    }

    if (this.outsideBankForm.value.paymentMethod == "IMPS" && parseFloat(amount) > this.dataService.IMPSLimit) {
      this.amntErrMsg = "Amount Greater than 2 lakhs is not allowed in IMPS transaction.";
      this.amountEnterError = true;
      return;
    }
    /* Below code is added for installment limit validation */
    if ((this.outsideBankForm.value.frequencyType == 'DAILY' && this.outsideBankForm.value.installmentNumber > 1825)
      || (this.outsideBankForm.value.frequencyType == 'MONTHLY' && this.outsideBankForm.value.installmentNumber > 60)
      || (this.outsideBankForm.value.frequencyType == 'QUARTERLY' && this.outsideBankForm.value.installmentNumber > 20)
      || (this.outsideBankForm.value.frequencyType == 'HALFYEARLY' && this.outsideBankForm.value.installmentNumber > 10)
      || (this.outsideBankForm.value.frequencyType == 'YEARLY' && this.outsideBankForm.value.installmentNumber > 5)) {
      this.info = 'Number of installments exceeds more than 5 years';
      this.commonMethod.openPopup('div.popup-bottom.show-info');
      return;
    }
    if (this.isScheduleChecked) {
      this.setSchedulePayment(this.outsideBankForm.value, this.selBenificiary, this.selectedAccount, 'outside', this.payeeAccountNo);
      this.dataService.transactionReceiptObj.scheduledDate = this.outsideBankForm.value.datepicker1;
      this.dataService.transactionReceiptObj.scheduledType = this.outsideBankForm.value.paymentType
      this.dataService.transactionReceiptObj.isScheduled = this.isScheduleChecked;

      this.dataService.transactionReceiptObj.modeOfTransfer = this.outsideBankForm.value.paymentMethod;
      this.dataService.transactionReceiptObj.benificaryBankName = this.selectedPayee.beneficiary_bank_name;
      this.dataService.transactionReceiptObj.ifscCode = this.selectedPayee.ifsc_code;

    } else {
      this.dataService.transactionReceiptObj.isScheduled = false;
      if (this.outsideBankForm.value.paymentMethod == "NEFT") {
        var neftReqParam = this.sendMoneyService.getFundTransferParam(this.outsideBankForm.value, this.selBenificiary, this.selectedAccount, 'NEFT', this.payeeAccountNo, this.soleId, 'sendmoneyoutsideneft');
        this.dataService.request = neftReqParam;
        this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
      }
      else if (this.outsideBankForm.value.paymentMethod == "RTGS") {
        var rtgsReqParam = this.sendMoneyService.getFundTransferParam(this.outsideBankForm.value, this.selBenificiary, this.selectedAccount, 'RTGS', this.payeeAccountNo, this.soleId, 'sendmoneyoutsidertgs');
        this.dataService.request = rtgsReqParam;
        this.dataService.endPoint = this.constant.serviceName_TRANSFERTRANSACTION;
      }
      else if (this.outsideBankForm.value.paymentMethod == "IMPS") {
        var ReqParam;
        if (this.favBenificiary != "") {
          ReqParam = this.sendMoneyService.getIFSCFundTransferParam(this.outsideBankForm.value, this.favBenificiary, this.selectedAccount, this.payeeAccountNo, this.outsideBankForm.value.remark, 'fromFav', 'sendmoneyoutsideimps');
        } else {
          this.selBenificiary.beneficiary_account_no = this.payeeAccountNo;
          ReqParam = this.sendMoneyService.getIFSCFundTransferParam(this.outsideBankForm.value, this.selBenificiary, this.selectedAccount, this.payeeAccountNo, this.outsideBankForm.value.remark, '', 'sendmoneyoutsideimps');

        }
        this.dataService.request = ReqParam;
        this.dataService.endPoint = this.constant.serviceName_PAYERTOPAYEEUSINGIFSCACCOUNTNUMBER;
      }

      this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
      this.dataService.transactionReceiptObj.to_acc = this.payeeAccountNo;
      this.dataService.transactionReceiptObj.payee_name = this.selBenificiary.benefName;
      this.dataService.transactionReceiptObj.amount = this.outsideBankForm.value.amount;
      this.dataService.transactionReceiptObj.modeOfTransfer = this.outsideBankForm.value.paymentMethod;
      this.dataService.transactionReceiptObj.benificaryBankName = this.selectedPayee.beneficiary_bank_name;
      this.dataService.transactionReceiptObj.ifscCode = this.selectedPayee.ifsc_code;

      // if (this.outsideBankForm.value.remark == null) {
      //   this.outsideBankForm.value.remark = ""
      // }
      this.dataService.transactionReceiptObj.remarks = this.outsideBankForm.value.remark != '' ? this.outsideBankForm.value.remark : "";
      this.dataService.transactionReceiptObj.date = new Date().toISOString();
    }
    this.dataService.screenDetails = {
      FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
      TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
      PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
      AMOUNT: this.dataService.transactionReceiptObj.amount,
      MODE_OF_TRANSFER: this.dataService.transactionReceiptObj.modeOfTransfer,
      BANK_NAME: this.dataService.transactionReceiptObj.benificaryBankName,
      IFSC_CODE: this.dataService.transactionReceiptObj.ifscCode,
      REMARKS: this.dataService.transactionReceiptObj.remarks,
      TRANSACTION_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
      TRANSACTION_MODE:  this.paymentType,
    }
    if (this.isScheduleChecked) {
      this.dataService.screenDetails = {
        FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
        TO_ACCOUNT: this.dataService.transactionReceiptObj.to_acc,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
        AMOUNT: this.dataService.transactionReceiptObj.amount,
        MODE_OF_TRANSFER: this.dataService.transactionReceiptObj.modeOfTransfer,
        BANK_NAME: this.dataService.transactionReceiptObj.benificaryBankName,
        IFSC_CODE: this.dataService.transactionReceiptObj.ifscCode,
        REMARKS: this.dataService.transactionReceiptObj.remarks,
        TRANSACTION_INITIATED_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
        SCHEDULED_DATE: this.datepipe.transform(this.dataService.transactionReceiptObj.scheduledDate, this.dataService.dateFormat),
        FREQUENCY: this.dataService.transactionReceiptObj.scheduledType,
        TRANSACTION_MODE: this.outsideBankForm.value.paymentType
      }
    }
    this.dataService.transactionReceiptObj.paymentType = this.paymentType;
    this.dataService.transactionReceiptObj.payee_id = this.selBenificiary.ID;
    this.dataService.recentTransData = {};
    this.router.navigate(['/otpsession']);
  }

  mmidFundTransfer() {
    let amount = this.mmidSendMoneyForm.value.amount.trim().replace(/[^.0-9]+/g, '');
    if (parseFloat(amount) > parseFloat(this.selBenificiary.maxAmount)) {
      this.amntErrMmidMsg = "Entered amount is more than transaction limit set for the selected user";
      return;
    }
    /* Below code is added for installment limit validation */
    if ((this.mmidSendMoneyForm.value.frequencyType == 'DAILY' && this.mmidSendMoneyForm.value.installmentNumber > 1825)
      || (this.mmidSendMoneyForm.value.frequencyType == 'MONTHLY' && this.mmidSendMoneyForm.value.installmentNumber > 60)
      || (this.mmidSendMoneyForm.value.frequencyType == 'QUARTERLY' && this.mmidSendMoneyForm.value.installmentNumber > 20)
      || (this.mmidSendMoneyForm.value.frequencyType == 'HALFYEARLY' && this.mmidSendMoneyForm.value.installmentNumber > 10)
      || (this.mmidSendMoneyForm.value.frequencyType == 'YEARLY' && this.mmidSendMoneyForm.value.installmentNumber > 5)) {
      this.info = 'Number of installments exceeds more than 5 years';
      this.commonMethod.openPopup('div.popup-bottom.show-info');
      return;
    }


    if (this.isScheduleChecked) {
      this.setSchedulePayment(this.mmidSendMoneyForm.value, this.selBenificiary, this.selectedAccount, 'mmid', this.payeeAccountNo);
      // this.setSchedulePayment(this.mmidSendMoneyForm.value,this.selectedAccount);
      this.dataService.transactionReceiptObj.scheduledDate = this.mmidSendMoneyForm.value.datepicker1;
      this.dataService.transactionReceiptObj.scheduledType = this.mmidSendMoneyForm.value.paymentType
      this.dataService.transactionReceiptObj.isScheduled = this.isScheduleChecked
    } else {
      var mmidReqParam;
      if (this.selBenificiary.MMID != 'null') {
        console.log(this.selectedAccount);
        mmidReqParam = this.sendMoneyService.getMMIDFundTransferParam(this.mmidSendMoneyForm.value, this.selBenificiary, this.selectedAccount, this.payeeAccountNo, 'sendmoneyoutsidemmid');
        this.dataService.endPoint = this.constant.serviceName_MMID;
      }
      else {
        mmidReqParam = this.sendMoneyService.getIFSCFundTransferParam(this.mmidSendMoneyForm.value, this.selBenificiary, this.selectedAccount, this.payeeAccountNo, this.mmidSendMoneyForm.value.mmidRemark, '', 'sendmoneyoutsidemmid');
        this.dataService.endPoint = this.constant.serviceName_PAYERTOPAYEEUSINGIFSCACCOUNTNUMBER;
      }
      this.dataService.transactionReceiptObj.isScheduled = false
      this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
      this.dataService.transactionReceiptObj.to_acc = this.payeeAccountNo;
      this.dataService.transactionReceiptObj.payee_name = this.selBenificiary?.benefName;
      this.dataService.transactionReceiptObj.mobileNo = this.selBenificiary?.beneficiaryMobileNo;
      this.dataService.transactionReceiptObj.amount = this.mmidSendMoneyForm.value.amount;
      this.dataService.transactionReceiptObj.modeOfTransfer = this.selBenificiary?.beneficiaryType;
      this.dataService.transactionReceiptObj.remarks = this.mmidSendMoneyForm.value.mmidRemark != "" ? this.mmidSendMoneyForm.value.mmidRemark : "";
      this.dataService.transactionReceiptObj.date = new Date().toISOString();

      this.dataService.request = mmidReqParam;
      console.log(mmidReqParam)
    }
    this.dataService.screenDetails = {
      FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
      MMID: this.dataService.transactionReceiptObj.to_acc,
      PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
      MOBILE_NUMBER: this.dataService.transactionReceiptObj.mobileNo,
      AMOUNT: this.dataService.transactionReceiptObj.amount,
      REMARKS: this.dataService.transactionReceiptObj.remarks,
      TRANSACTION_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
      TRANSACTION_MODE: this.paymentType
    }
    if (this.isScheduleChecked) {
      this.dataService.screenDetails = {
        FROM_ACCOUNT: this.dataService.transactionReceiptObj.from_acc,
        MMID: this.dataService.transactionReceiptObj.to_acc,
        PAYEE_NAME: this.dataService.transactionReceiptObj.payee_name,
        MOBILE_NUMBER: this.dataService.transactionReceiptObj.mobileNo,
        AMOUNT: this.dataService.transactionReceiptObj.amount,
        REMARKS: this.dataService.transactionReceiptObj.remarks,
        TRANSACTION_INITIATED_DATE: this.datepipe.transform(new Date(), this.dataService.dateFormat),
        SCHEDULED_DATE: this.datepipe.transform(this.dataService.transactionReceiptObj.scheduledDate, this.dataService.dateFormat),
        FREQUENCY: this.dataService.transactionReceiptObj.scheduledType,
        TRANSACTION_MODE: this.paymentType
      }
    }
    this.dataService.transactionReceiptObj.paymentType = this.paymentType;
    this.dataService.transactionReceiptObj.payee_id = this.selBenificiary.ID;
    this.dataService.recentTransData = {};
    this.router.navigate(['/otpsession']);
  }


      /**
   * This function called to schedule payment on payment submit
   */
  setSchedulePayment(formDtl, selBenef, selectedAccount, type, payeeAccountNo) {

    var toDate = new Date(formDtl.datepicker1);
    if(this.typeOfFrequency == 'RECURRING'){
      switch(formDtl.frequencyType ){
        case 'DAILY':
          toDate.setDate(toDate.getDate()+parseInt(formDtl.installmentNumber));
          break;
        case 'MONTHLY':
          toDate.setDate(toDate.getDate()+(30*parseInt(formDtl.installmentNumber)));
          break;
        case 'QUARTERLY':
          toDate.setDate(toDate.getDate()+(90*parseInt(formDtl.installmentNumber)));
          break;
        case 'HALFYEARLY':
          toDate.setDate(toDate.getDate()+(180*parseInt(formDtl.installmentNumber)));
          break;
        case 'YEARLY':
          toDate.setDate(toDate.getDate()+(365 * parseInt(formDtl.installmentNumber)));
          break;
      }
    }


    var param = this.sendMoneyService.schedulePaymentListParam(formDtl, selBenef, selectedAccount, type, payeeAccountNo,toDate,this.soleId);
    this.dataService.request = param;
    this.dataService.endPoint = this.constant.serviceName_SCHEDULARTRANSMASTER;

    this.dataService.transactionReceiptObj.from_acc = this.selectedAccount;
    this.dataService.transactionReceiptObj.to_acc = this.payeeAccountNo;
    this.dataService.transactionReceiptObj.payee_name = this.dataService.userDetails?.customerName;

    switch (this.paymentType) {
      case "self":
        this.dataService.transactionReceiptObj.amount = this.selfForm.value.amount;
        this.dataService.transactionReceiptObj.remarks = this.selfForm.value.remark;
        this.dataService.transactionReceiptObj.date = new Date(this.selfForm.value.datepicker1).toISOString();
        break;
      case "within":
        this.dataService.transactionReceiptObj.amount = this.withinBankForm.value.amount;
        this.dataService.transactionReceiptObj.remarks = this.withinBankForm.value.remark;
        this.dataService.transactionReceiptObj.date = new Date(this.withinBankForm.value.datepicker1).toISOString();
        break;
      case "outside":
        this.dataService.transactionReceiptObj.amount = this.outsideBankForm.value.amount;
        this.dataService.transactionReceiptObj.remarks = this.outsideBankForm.value.remark;
        this.dataService.transactionReceiptObj.date = new Date(this.outsideBankForm.value.datepicker1).toISOString();
        break;
      case "mmid":
        this.dataService.transactionReceiptObj.amount = this.mmidSendMoneyForm.value.amount;
        this.dataService.transactionReceiptObj.remarks = this.mmidSendMoneyForm.value.remark;
        this.dataService.transactionReceiptObj.date = new Date(this.mmidSendMoneyForm.value.datepicker1).toISOString();
        break;
      default:
    }

  }

  /**
   * Form Validation
   */
  validateForm() {
    this.isFormValid = false;
    //New Code
    switch (this.paymentType) {
      case "self":
        if (this.selfForm.invalid) {
          this.selfForm.get('sendTo').markAsTouched();
          this.selfForm.get('amount').markAsTouched();
          this.selfForm.get('remark').markAsTouched();
          this.selfForm.get('datepicker1').markAsTouched();
          this.selfForm.get('paymentType').markAsTouched();
          this.selfForm.get('frequencyType').markAsTouched();
          this.selfForm.get('installmentNumber').markAsTouched();
          return;
        }
        else {
          this.isFormValid = true;
        }
        break;
      case "within":
        if (this.withinBankForm.invalid) {
          this.withinBankForm.get('sendTo').markAsTouched();
          this.withinBankForm.get('amount').markAsTouched();
          this.withinBankForm.get('remark').markAsTouched();
          this.withinBankForm.get('datepicker1').markAsTouched();
          this.withinBankForm.get('paymentType').markAsTouched();
          this.withinBankForm.get('frequencyType').markAsTouched();
          this.withinBankForm.get('installmentNumber').markAsTouched();
          return;
        }
        else { this.isFormValid = true; }
        break;
      case "outside":
        if (this.outsideBankForm.invalid) {
          this.outsideBankForm.get('sendTo').markAsTouched();
          this.outsideBankForm.get('amount').markAsTouched();
          this.outsideBankForm.get('remark').markAsTouched();
          this.outsideBankForm.get('paymentMethod').markAsTouched();
          this.outsideBankForm.get('datepicker1').markAsTouched();
          this.outsideBankForm.get('paymentType').markAsTouched();
          this.outsideBankForm.get('frequencyType').markAsTouched();
          this.outsideBankForm.get('installmentNumber').markAsTouched();
          return;
        }
        else { this.isFormValid = true; }
        break;
      case "mmid":
        if (this.mmidSendMoneyForm.invalid) {
          this.mmidSendMoneyForm.get('sendTo').markAsTouched();
          this.mmidSendMoneyForm.get('amount').markAsTouched();
          // this.mmidSendMoneyForm.get('radioboxdemo').markAsTouched();
          // this.mmidSendMoneyForm.get('mmidRemark').markAsTouched();
          this.mmidSendMoneyForm.get('datepicker1').markAsTouched();
          this.mmidSendMoneyForm.get('paymentType').markAsTouched();
          this.mmidSendMoneyForm.get('frequencyType').markAsTouched();
          this.mmidSendMoneyForm.get('installmentNumber').markAsTouched();
          return;
        }
        else { this.isFormValid = true; }
        break;

    }
  }

  /**
   * Function to be called when to account is selected
   * @value
   */
  getToAccValue(value) {
    console.log(value);
    $('#mmidbankselect').parent().removeClass('active');
    // this.selBenificiary = value;
    this.searchPayeeSection = !this.searchPayeeSection;
    if (value.beneficiary_account_no != undefined) {
      this.selAccOfBenificiary = value.benefName + "," + value.beneficiary_account_no
      this.mmidSendMoneyForm.patchValue({ sendTo: value.beneficiary_account_no });
      this.payeeAccountNo = value.beneficiary_account_no;
      this.selBenificiary = value;
      // to close the option box
      $('#mmidbankselect').slideUp();
      //  $('#mmidbankselect').parent().removeClass('active');

    }
    else {
      this.selAccOfBenificiary = value.benefName + "," + value.MMID
      this.mmidSendMoneyForm.patchValue({ sendTo: value.MMID });
      this.payeeAccountNo = value.MMID;
      this.selBenificiary = value;
      // to close the option box
      $('#mmidbankselect').slideUp();
    }
  }

  sendMoneySubmit(formValue, formType) {
    this.dataService.feedbackType = "fundTransfer";
    switch (formType) {
      case "selfAccount":
        if (this.selfForm.valid) {
          console.log("Self Form --> ", formValue)
        }
        else {
          this.validateForm()
        }
        break;
      case "withinBankAccount":
        if (this.withinBankForm.valid) {
          console.log("Within Bank Form --> ", formValue)
        }
        else {
          this.validateForm()
        }
        break;
      case "outsideBankAccount":
        if (this.outsideBankForm.valid) {
          console.log("Within Bank Form --> ", formValue)
        }
        else {
          this.validateForm()
        }
        break;
      case "mmid":
        if (this.mmidSendMoneyForm.valid) {
          console.log("MMID --> ", this.mmidSendMoneyForm.value);
          if (this.openSection == false)
            this.onFundTransfer();
          else {
            // alert(this.installType + this.frequencyType + this.payType)
          }
        }
        else {
          console.log(this.openSection)
          this.validateForm()
        }
    }
  }

  closePopup() {
    this.commonMethod.closeAllPopup();
  }

  _closePopup(popup){
    this.commonMethod.closePopup(popup);
  }
  
  ngOnDestroy(){
    this.dataService.isFromAccountDetails = false;
    this.dataService.recentTransData = '';
    this.dataService.fundTransferTabType = 'self';
  }
  

}
