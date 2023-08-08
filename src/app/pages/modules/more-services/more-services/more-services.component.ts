import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { CommonMethods } from 'src/app/services/common-methods';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { MoreServicesService } from './more-services.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TermsConditonsComponent } from '../terms-conditions/terms-conditions.component';


declare var showToastMessage: any;
declare var window: any;



@Component({
  selector: 'app-more-services',
  templateUrl: './more-services.component.html',
  styleUrls: ['./more-services.component.scss']
})

export class MoreServicesComponent implements OnInit { 
  

  constructor(
    private router:Router, 
    public dataService: DataService,
    private constant: AppConstants,
    public commonMethods: CommonMethods,
    public datePipe: DatePipe,
    private moreService: MoreServicesService,
    private http: HttpRestApiService,
  ) { }
  

  termsConditionRegistration = "termsConditionRegistration"
  isPSBCustomer:boolean = false;
  resultmsg
  errormsg
  loanForm: FormGroup;
  loantype=["Retail" , "Corporate"]
  LeadSubCategory=["Savings (Digital)" , "NRE", "NRO", "Others" ]
  CategoryList=["Savings" , "Current", "CC", "OD"]
  todayDate: any;
  fromSubmitFlag:boolean =false;

  termsConditionType : any ='';
  moreServiceList : any;
  moreServiceSubList:any;
  subMenuTitle:string;

  @ViewChild(TermsConditonsComponent) childTermsReg: TermsConditonsComponent;

  loanEnquiryMsgBody
  ngOnInit(): void {
    this.dataService.gotpage= "";
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.getMoreServiceList();
    
  }
  openLoanLeadpopup(){
    this.commonMethods.openPopup('div.loanLead')

  }
  closePopup(){
    this.commonMethods.closeAllPopup() ;
    this.fromSubmitFlag = false;
    this.subMenuTitle = "";
    this.loanForm.reset();
   
  }
  goto(route){
    //BBPS, Block & Unblock Card, Freeze account, donation,  Send money
    //retailRechargeBillPay, reissueCard , freezeAccount , donations, sendMoney
    this.dataService.gotpage =  route
    if(this.constant.getPlatform() == "web"){
      this.router.navigateByUrl('/login');
    }
    else{
      this.router.navigateByUrl('/loginMobile');
    }
    
  }

  gotoPage(e){
    if(e.redirectionUrl){
      this.dataService.gotpage = e.redirectionUrl;
    }
    this.router.navigateByUrl('/'+ e.appRedirctLink);
  }
  

  holidayList(){
   
    this.router.navigateByUrl('/holidayList');
  }
  onTypeChange(type){
   
    if(type == "Yes"){
      this.isPSBCustomer= true
      this.loanForm.get('AccountNumber').setValidators([Validators.required]);
    }else{
      this.loanForm.get('AccountNumber').clearValidators();
      this.isPSBCustomer= false
      
    }
    this.loanForm.get('AccountNumber').updateValueAndValidity();
  }
  closeService(){
    if(this.constant.getPlatform() == "web"){
      if(this.dataService.isnliMoreService){
        this.router.navigateByUrl("/nliLanding");
      }else{
        this.router.navigateByUrl('/login');
      }
    }
    else{
      if(this.dataService.isnliMoreService){
        this.router.navigateByUrl("/LandingPage");
      }else{
        this.router.navigateByUrl("/loginMobile");
      }
      
    }
}

  comingSoon(){
    showToastMessage("Coming Soon",  "success");
  }

  openTermsCondition(){
    this.termsConditionType = 'termsConditionMoreServices'
    this.childTermsReg.openPopupTerms() ;
  }

  getMoreServiceList(){
    var param = this.moreService.getMoreServicesList();
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_EASE5_MORE_LIST).subscribe(data => {
      var resp = data.responseParameter;
      if(resp.opstatus == "00"){
        this.moreServiceList = data.set?.records;
      }
    })
  }

  inviteAndRefer(){
    var details = 'You are invited to download and register in PSB UnIC app to enjoy seamless banking services on your fingertips Click on below link to download the app.For Android use - https://play.google.com/store/apps/details?id=com.psb.omniretail For iOS use - https://apps.apple.com/in/app/psb-unic/id1597657276';
    if (this.constant.getPlatform() != "web") {
      window.plugins.socialsharing.share(details);
    }
    else {
      window.open('mailto:?subject=Invite And Refer&body=' + details);
    }
  }

  openInterestRate(id,name){
    this.subMenuTitle = name;
    var param = this.moreService.getSubmenu(id);
    this.http.callBankingAPIService(param, this.constant.deviceID, this.constant.serviceName_EASE5_MORE_SUB_LIST).subscribe(data => {
      var resp = data.responseParameter;
      if(resp.opstatus == "00"){
        this.moreServiceSubList = data.set?.records;
        this.commonMethods.openPopup('div.subcategory-popup'); 
      }
    })
  }

  OpenServicePopup(menuList){
    switch (menuList.appRedirctLink) {
      case 'termsandcondition':
        this.openTermsCondition();
        break;
      case 'interestrate':
        this.openInterestRate(menuList.seqNumber,menuList.optionName);
        break;
      case 'SUBMENU':
        this.openInterestRate(menuList.seqNumber,menuList.optionName);
      break;
      case 'INVITE-REFER':
        this.inviteAndRefer()
    }
  }

}

