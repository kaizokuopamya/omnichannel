import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { MyChequeBookService } from './my-cheque-book.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { CommonMethods } from 'src/app/services/common-methods';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-cheque-book',
  templateUrl: './my-cheque-book.component.html',
  styleUrls: ['./my-cheque-book.component.scss']
})
export class MyChequeBookComponent {
  accList:any;
  chequeNo:any;
  noofleaves:any;
  sessionDecryptKey: any;
  myChequeBookForm:FormGroup;
  formDate:any;
  toDate:any;
  selectedAccount:any = '';
  chequeHistory:any;
  chequeEndNumber:any;
  maxTo : Date = new Date();
  accountValue : any = '';
  minTo :Date = new Date();
  platfrom:any;
  selectedAccountDisplay:any;
  
  constructor(private router: Router,
    public dataService: DataService,
    public myChequeBookService: MyChequeBookService,
    private localStorage: LocalStorageService,
    private http: HttpRestApiService,
    private constant: AppConstants,
    private encryptDecryptService: EncryptDecryptService,
    public datePipe: DatePipe,
    private location: Location,
    public commonMethod: CommonMethods,) { }

  ngOnInit(): void {
    this.platfrom = this.constant.getPlatform();
    this.buildForm();
    this.dataService.customerOperativeAccList.forEach(el => {
      if (el.accountType != "CAPPI" && el.Status?.toLowerCase()=='active') {
        el.accountFlag == "P" ? this.accList.splice(0, 0, el) : this.accList.push(el);
      }
    })
    this.selectedAccount = this.accList[0].accountNo;
    this.selectedAccountDisplay = this.accList[0].SchemeCode + " " + this.accList[0].sbAccount
    var backUrl;
    if (this.dataService.previousPageUrl == "mobQuickAccessLanding") {
      backUrl = this.dataService.previousPageUrl;
    }
    else {
      backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : 'dashboardMobile';
    }

  }
  buildForm() {
    this.myChequeBookForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
    });
  }


submit(){
  if(this.myChequeBookForm.valid){
    console.log("form value and to value::::::::",this.myChequeBookForm.value);
    this. getAccountList();
   }
    else{
      this.validateForm();
    }
}
validateForm() {
    if (this.myChequeBookForm.invalid) {
      this.myChequeBookForm.get('fromDate').markAsTouched();
      this.myChequeBookForm.get('toDate').markAsTouched();
      return;
    }
  }


  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }

  onFromAccountSelect(event){
    this.selectedAccount = "";
    console.log(this.selectedAccount);
    this.selectedAccount = event;

    var SchemeCode = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].SchemeCode;
    var accountNo = this.dataService.customerOperativeAccList.filter(obj => (obj.accountNo == this.selectedAccount))[0].sbAccount;
    var userDtl = SchemeCode +" "+accountNo; 
    this.selectedAccountDisplay = userDtl;
  }
 
  getAccountList() {
    let param = this.myChequeBookService.getchekbookList(this.dataService.userDetails.cifNumber, this.selectedAccount,this.myChequeBookForm.value);
    //let deviceID=this.localStorage.getLocalStorage("deviceId");
    if(this.selectedAccount)
    this.getAccountListApiCall(param);
  }

  getAccountListApiCall(param){
    this.http.callBankingAPIService(param,this.localStorage.getLocalStorage("deviceId"),this.constant.serviceName_CHEQUEHISTORYDETAILS).subscribe(data=>{
      console.log(data);
      var resp = data.responseParameter
        if (resp.opstatus == "00") {
          console.log(data.responseParameter);
          this.chequeHistory=data.set.records
          this.chequeEndNumber= this.chequeHistory.cheque_Number;
          console.log("ChequeHistory::",this.chequeEndNumber);
          var sessionKey = this.encryptDecryptService.decryptText(this.sessionDecryptKey,resp.Session);
          console.log('sessionKey', sessionKey);

        }else{
          this.chequeHistory = [];
          this.errorCallBack(data.subActionId, resp);
        }
      
      });
    }

  onAccountSelectType() {
    if (window.innerWidth < 767) {
      this.commonMethod.openPopup('div.popup-bottom.sel-account');
    }
  }


  getToAccValue( accountNo){
    this.accountValue = accountNo
   }

   closePopup(){
     this.commonMethod.closeAllPopup() ;
   }

   errorCallBack(subActionId, resp) {
    this.dataService.information = resp.Result;
    this.dataService.informationLabel = 'INFORMATION';
    this.dataService.primaryBtnText = 'OK';
    this.commonMethod.openPopup('div.popup-bottom.show-common-info');
  }

   onCancel() {
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/dashboard');
    }
    else{
      this.location.back();
    }
  }
}
