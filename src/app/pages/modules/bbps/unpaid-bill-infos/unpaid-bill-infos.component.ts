import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../services/common-methods';
import {UpaidBillInfosService} from './upaid-bill-infos.service'
import {  Location } from '@angular/common';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { AppConstants } from '../../../../app.constant';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
@Component({
  selector: 'app-unpaid-bill-infos',
  templateUrl: './unpaid-bill-infos.component.html',
  styleUrls: ['./unpaid-bill-infos.component.scss']
})
export class UnpaidBillInfosComponent implements OnInit {

  constructor(private router: Router,
    public DataService: DataService,
    public location : Location,
    public commonMethod: CommonMethods,
    private upaidBillInfosService: UpaidBillInfosService,
    private storage : LocalStorageService,
    private http : HttpRestApiService,
    private constant: AppConstants
    ) { }
    billdetails:any
    apiErrorMsg:any;
    renderableData:any
    updateShortname : FormGroup
    platformtype =""
    
  ngOnInit(): void {

    this.billdetails = this.DataService.unpaidbilldetail;
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : this.DataService.breadcrumblist[this.DataService.breadcrumblist.length - 2].routeName
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.buildForm();
    this.renderData();
    console.log("DataService.breadcrumblist" + JSON.stringify(this.DataService.breadcrumblist))
    if (this.constant.getPlatform() == "web") {
      this.platformtype = 'InternetBanking'
    }else{
      this.platformtype = 'MobileBanking'
    }
  }
renderData(){
    this.renderableData={
      'shortName' :  this.billdetails.billeraccount.short_name,
      'logo' : this.billdetails.moreDetails.biller_logo,
      'billerName': this.billdetails.moreDetails.biller_name,
      'leftDays': this.billdetails.daysLeft,
      'amt': this.billdetails.hasOwnProperty('billlist') ? this.billdetails.billlist[0].net_billamount : "No Due Pending",
      'dueDate':this.billdetails.hasOwnProperty('billlist') ? this.billdetails.billlist[0].billduedate: "",
      'loopingData': [
        
        {
          'label':'Bill Category',
          'field':this.billdetails.moreDetails.biller_category
        },
        
      ]
    }


    for(var i = 0 ; i < this.billdetails.billeraccount.authenticators.length; i++){
      this.renderableData.loopingData.push(
        {
          'label': this.billdetails.billeraccount.authenticators[i].parameter_name,
          'field' : this.billdetails.billeraccount.authenticators[i].value 
        }
      )
    }


    console.log(" this.renderableData" +  this.renderableData)
}
buildForm(){
  this.updateShortname = new FormGroup({
    shortName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9_ ]*$")]),
  });
}
validateForm(){
  if(this.updateShortname.invalid){
  
    this.updateShortname.get('shortName').markAsTouched();
    return;
   }
}
onModifyClick(){
  this.updateShortname.patchValue({"shortName": this.renderableData.shortName})
  this.commonMethod.openPopup('.modifyBiller')

}

updateShortnameSubmit(){
  if(this.updateShortname.valid){
    this.commonMethod.closeAllPopup()
    console.log(this.updateShortname.value)
  var param = this.upaidBillInfosService.modifybillerparam(this.billdetails.billeraccount.billeraccountid, this.platformtype , this.updateShortname.value);
  console.log("reqData" + JSON.stringify(param))
  this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    console.log(data);
    var resp = data.responseParameter
    console.log("deteleBiller ===> " + JSON.stringify(resp))
    if (resp.opstatus == "00") {
      this.commonMethod.openPopup('.successMsgupdateshortname')
      this.renderableData.shortName = this.updateShortname.value.shortName
      this.DataService.allregisteredBillerList = []
      this.updateShortname.reset()
      }
      else if (resp.opstatus == "01") {
      
        this.updateShortname.reset()
        let errorMsg = JSON.parse(resp.bbpsResponse)
            this.apiErrorMsg = errorMsg.msg
           
            this.commonMethod.openPopup('.errorMSg')
           
      }
      else {
        this.commonMethod.closeAllPopup()
        this.updateShortname.patchValue({"shortName": ''})
        // this.errorCallBack(data.subActionId, resp);
    }
  });
  }
  else{
    this.validateForm() ;
  }
}
removeBiller(){
 
  var param = this.upaidBillInfosService.deletebillerparam(this.billdetails.billeraccount.billeraccountid);
  console.log("reqData" + JSON.stringify(param))
  this.http.callBankingAPIService(param, this.storage.getLocalStorage("deviceId"), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    console.log(data);
    var resp = data.responseParameter
    console.log("deteleBiller ===> " + JSON.stringify(resp))
    if (resp.opstatus == "00") {
      this.DataService.allregisteredBillerList = []
      this.commonMethod.openPopup('.successMsg')
      }
      else if (resp.opstatus == "01") {
        let errorMsg = JSON.parse(resp.bbpsResponse)
            this.apiErrorMsg = errorMsg.msg
            this.commonMethod.openPopup('.errorMSg')
      }
      else {
        // this.errorCallBack(data.subActionId, resp);
    }
  });
}
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  onOkclick(routeName){
    this.commonMethod.closeAllPopup();
    this.goToPage(routeName)
    
  }
  goToPageCustom(routeNames){
    this.router.navigateByUrl(routeNames);
  }

  errorCallBack(){

  }

}