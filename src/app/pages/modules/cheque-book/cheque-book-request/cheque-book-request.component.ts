import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FORMERRORSALTERNATEADD, FORMERRORSCOMMON, FORMERRORSCOMMUNICATIONADD } from './cheque-book-request.model';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { FormValidationService } from 'src/app/services/form-validation.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ChequeBookRequestService } from './cheque-book-request.service';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
declare var $ ;

@Component({
  selector: 'app-cheque-book-request',
  templateUrl: './cheque-book-request.component.html',
  styleUrls: ['./cheque-book-request.component.scss']
})
export class ChequeBookRequestComponent {
  accountList = [];
  cityList = [];
  stateList = [];
  accNo: string = "";
  noOfLeave = [];
  addressType : any ;
  SchemeCode:any;
  selectedAccount:any;
  selectedAccName:any;
  selAccNo:any;
  selectedState: any;
  CommunicationAdd: FormGroup;
  AlternateAdd: FormGroup;
  commonForm: FormGroup;
  address :any;
  isCheckbox = false;
  platform:any;
  addresstype: any;
  formErrorsCommunicationAdd = FORMERRORSCOMMUNICATIONADD;
  formErrorsAlternateAdd = FORMERRORSALTERNATEADD;
  formErrorsCommon = FORMERRORSCOMMON;

  constructor(
    private router: Router,
    public dataService: DataService,
    private http: HttpRestApiService,
    private commonMethod:CommonMethods,
    private formValidation: FormValidationService,
    private chequeBookRequestService: ChequeBookRequestService,
    private storage: LocalStorageService,
    private constant: AppConstants
  ) { }

  ngOnInit(): void {
    this.platform = this.constant.getPlatform();
    this.buildForm();
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status?.toLowerCase()=='active') {
        el.accountFlag == "P" ? this.accountList.splice(0, 0, el) : this.accountList.push(el);
      }
    })
    this.dataService.otpSessionPreviousPage = '/chequeBookRequest';
  }

  buildForm() {
    this.CommunicationAdd = new FormGroup({
      addressLine1: new FormControl('', [Validators.required,]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      confirmation: new FormControl('', [Validators.required]),
      accountNo: new FormControl('')
    });
    this.CommunicationAdd.get('addressLine1')?.disable();
    this.CommunicationAdd.get('addressLine2')?.disable();
    this.CommunicationAdd.valueChanges.subscribe((data) => {
      this.formErrorsCommunicationAdd = this.formValidation.validateForm(this.CommunicationAdd, this.formErrorsCommunicationAdd, true);
    });
    this.AlternateAdd = new FormGroup({
      addressLocation: new FormControl('', [Validators.required,]),
      addressLine1: new FormControl('', [Validators.required,]),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      iAgree: new FormControl('', [Validators.required]),
    });

    this.AlternateAdd.valueChanges.subscribe((data) => {
      this.formErrorsAlternateAdd = this.formValidation.validateForm(this.AlternateAdd, this.formErrorsAlternateAdd, true);
    });

    this.commonForm = new FormGroup({
      savingAcc: new FormControl('', [Validators.required]),
      checkPageNo: new FormControl('', [Validators.required]),
      commAddress: new FormControl('', [Validators.required]),
      accountNo: new FormControl(''),
    });

    this.commonForm.valueChanges.subscribe((data) => {
      this.formErrorsCommon = this.formValidation.validateForm(this.commonForm, this.formErrorsCommon, true);
    });
  }

  validatesForm(type) {
    if (type == 'communication') {
      if (this.CommunicationAdd.invalid) {
        this.formValidation.markFormGroupTouched(this.CommunicationAdd);
        return;
      }
    } else if (type == 'alternate') {
      if (this.AlternateAdd.invalid) {
        this.formValidation.markFormGroupTouched(this.AlternateAdd);
        return;
      }
    } else {
      if (this.commonForm.invalid) {
        this.formValidation.markFormGroupTouched(this.commonForm);
        return;
      }
    }
  }

  openchargespopup(){
    this.commonMethod.openPopup('div.popup-bottom.chargesPopup');
  }
  closePoup(){
    this.commonMethod.closePopup('div.popup-bottom');
  }
  /**
   *Submit function  when communication address
   */
  CommunicationSubmit() {
    this.validatesForm('communication');
    console.log('Communication Submit', this.CommunicationAdd.value);

    if (this.CommunicationAdd.valid) {
      if (this.CommunicationAdd.get('confirmation').value == 'Yes') {
        this.issueChequeBook('C');
      } else {
        // showToastMessage("Please select correct address");
      }
    } else {
      this.formErrorsCommunicationAdd = this.formValidation.validateForm(this.CommunicationAdd, this.formErrorsCommunicationAdd, true);
    }
  }


  commonFormSubmit() {
    this.validatesForm('')
    if (this.commonForm.valid) {

      if(!this.isCheckbox){
        return
      }

      this.issueChequeBook()
    }
    else{
      this.formErrorsCommon = this.formValidation.validateForm(this.commonForm, this.formErrorsCommon, true);
    }
  }

   /**
   * Issue cheque api call based on the type this function is called
   * @param type
   */
   issueChequeBook(type?:any) {
    let reqParam, accNo;
    let custId = this.dataService.userDetails.cifNumber;
    var address :any;
    if(this.addressType == 'communication'){
      address = this.address.communicationAdd;
    } else {
      address = this.address.permenantAdd1;
    }
    this.dataService.resetTransactionObj();
    //navigating to Otp page
    reqParam = this.chequeBookRequestService.getIssueChequebookRequest(this.commonForm.value.savingAcc, custId, address , this.commonForm.value.checkPageNo);
    this.dataService.request = reqParam
    this.dataService.endPoint = this.constant.serviceName_ISSUECHEQUEBOOK;
    this.dataService.authorizeHeader = "Cheque Book Request";
    this.dataService.screenType = 'chequeBookRequest';
    this.dataService.commonOtpServiceType = this.constant.val_CHEQUEBOOKREQUEST;
    this.dataService.otpSessionPreviousPage = "/chequeBookRequest";

    var chequeaddress
    if(this.addressType == 'communication'){
      chequeaddress = this.address.communicationAdd == "" ? "-" : this.address.communicationAdd 
    }
    else if(this.addressType == 'permanent'){
      chequeaddress = this.address.permenantAdd1 == "" ? "-" : this.address.permenantAdd1 
    }

    this.dataService.transactionReceiptObj.accNumber = this.commonForm.value.savingAcc;
    this.dataService.transactionReceiptObj.checkPageNo = this.commonForm.value.checkPageNo;
    this.dataService.transactionReceiptObj.commAddress =  chequeaddress;
    this.dataService.screenDetails = {
      ACCOUNT_NUMBER : this.dataService.transactionReceiptObj.accNumber,
      NUMBER_OF_LEAVES: this.dataService.transactionReceiptObj.checkPageNo,
      DELIVERY_ADDRESS: this.dataService.transactionReceiptObj.commAddress
    }

    this.router.navigate(['/otpsession']);
  }

  /**
   * submit function for alternative address
   */
  AlternateSubmit() {
    this.validatesForm('alternate')
    if (this.AlternateAdd.valid) {
      this.issueChequeBook('A');
    } else {
      this.formErrorsAlternateAdd = this.formValidation.validateForm(this.AlternateAdd, this.formErrorsAlternateAdd, true);
    }
  }

  getState(){
    let stateListParams = this.chequeBookRequestService.getStateListParams();
    this.http.callBankingAPIService(stateListParams, this.constant.deviceID, this.constant.serviceName_GETSTATES).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        if (data.hasOwnProperty('set')) {
          this.stateList = data.set.records;
          console.log("statelist:::::::",this.stateList);
          // this.dataService.stateList=this.stateList;
        }
      }
      else {
        this.errorCallBack(data.subActionId, resp);

      }
    },(error)=>{
      console.log(error);
    });
  }

  getCitiesListByStateId(stateId,type?:any){

  this.cityList = [];
   let cityListParams = this.chequeBookRequestService.getCityListParams(stateId);
      this.http.callBankingAPIService(cityListParams, this.constant.deviceID, this.constant.serviceName_GETCITIES).subscribe(data => {
        console.log(data);
        var resp = data.responseParameter;
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
          if (data.hasOwnProperty('set')) {
            this.cityList = data.set.records;

          }
        }
        else {
          this.errorCallBack(data.subActionId, resp);
        }
      },(error)=>{
        console.log(error);
      });
  }

  selectAccount(){
    let accNo =  this.commonForm.value.savingAcc;
    var accDtl = this.accountList.filter(obj => obj.accountNo == accNo)[0];
    if(accDtl.SchemeCode == "SBA"){
      this.noOfLeave =[
        {"No": 20},
        {"No": 40},
        {"No": 60},
      ]
    }
    else{
      this.noOfLeave =[
        {"No": 25},
        {"No": 50},
        {"No": 100},
      ]
    }
    this.addressSelection();

  }


  gatCheckBookAddress(param){
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETADDRESSOFCHQBOOK).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log("Address :: ",data.responseParameter);
        if (data.hasOwnProperty("set")) {
          this.address = data.set.records[0];
          //data.set.records[0].permenantAdd1 //communicationAdd
        }
      }
      else {

      }
    },(error)=>{
      console.log(error);
    });
  }

  addressTypeChange(addressVal) {
    this.addresstype = addressVal
    console.log(this.addresstype)
    $('.box').slideUp();
    $('body').find('#' + addressVal).slideDown();
    this.AlternateAdd.reset();
    this.CommunicationAdd.reset();
    this.resetSelect();
    this.CommunicationAdd.patchValue({confirmation:'Yes'})
  }

  cancel() {
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.router.navigateByUrl('/dashboardMobile');
    }
  }

  errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

  resetSelect() {
    this.AlternateAdd.get('state').reset('');
    this.AlternateAdd.get('city').reset('');
    this.CommunicationAdd.get('state').reset('');
    this.CommunicationAdd.get('city').reset('');
    this.cityList = [];
  }

  submit() {
    this.commonFormSubmit();
  }

  addressSelection(){
    let accNo =  this.commonForm.value.savingAcc;
    var param = this.chequeBookRequestService.getAddressOfCheckBook(accNo);
    this.gatCheckBookAddress(param);
  }

  openPopUp(){
  
    this.commonMethod.openPopup("div.termscondition-popup")
  }
  closepopup(){
    this.commonMethod.closePopup("div.termscondition-popup")
  }


  onAccountSelectType(){
    if(window.innerWidth < 767) {
      this.commonMethod.openPopup('div.popup-bottom.sel-account');
    }
  }

  _closePopup(){
    this.commonMethod.closePopup('div.popup-bottom.sel-account');
  }


  onFromAccountSelect(accountNumber){
    this.selectedAccount = "";
    
    this.selectedAccount = accountNumber;
    this.selectedAccName = this.dataService.userDetails?.customerName;
    this.selAccNo = accountNumber;
    this.SchemeCode = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == accountNumber))[0].SchemeCode;
    var accountNo = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == accountNumber))[0].sbAccount;
    var userDtl = this.SchemeCode +" "+accountNo; 
    this.commonForm.patchValue({ accountNo: userDtl });
    console.log(userDtl);
    this.commonForm.patchValue({ savingAcc: this.selectedAccount });
    this.selectAccount();
  }

}
