import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../../../app.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {BillReminderListService} from './bill-reminder-list.service'
import {RechargeBillpayService} from '../../recharge-billpay/recharge-billpay.service'
import { LocalStorageService } from '../../../../../services/local-storage.service';
import {  Location } from '@angular/common';
@Component({
  selector: 'app-bill-reminder-list',
  templateUrl: './bill-reminder-list.component.html',
  styleUrls: ['./bill-reminder-list.component.scss']
})
export class BillReminderListComponent implements OnInit , OnDestroy{

  constructor(  private router: Router,
    public DataService: DataService,
    public location :Location,
    public constant: AppConstants,
    private rechargeBillpayService : RechargeBillpayService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private billReminderListService: BillReminderListService,
  
    public commonMethod: CommonMethods) { }
    p = 1;
    itemsPerPage = 10;
    currentPage = 1
    billReminderList:any =[]
  ngOnInit(): void {
  
    this.DataService.isbbpsPage = true
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : this.DataService.breadcrumblist[this.DataService.breadcrumblist.length - 2].routeName
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
  this.getreminderList();
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }

  getreminderList(){

   let param = this.billReminderListService.addBillReminderparam()
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_GETBBPSREMINDERSLIST).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      console.log("GetBillerSERVIVE " +  JSON.stringify(resp))
      if (resp.opstatus == "00") {
       var reminderlist = data.set.records
        console.log("reminderlistreminderlist " , reminderlist)
     //   reminderlist.splice(2, 1);
        for(var i =0 ; i< reminderlist.length; i++){
          if(reminderlist[i].statusId != '10'){
              var parsedata = JSON.parse(reminderlist[i].consumerDetails)
    
              reminderlist[i].consumerDetails = parsedata
           
              this.billReminderList.push(reminderlist[i])
            }
        }
      
        console.log( " this.billReminderList" +  JSON.stringify(this.billReminderList)  )
        
      }
      else {
    
      }
    })


  }
  moreDetails(value){
    this.DataService.billReminderValues = value
    this.goToPage('pendingBillMoreDetails')
  }
  billpayment(value){
    this.DataService.payNowReminderData =value
    this.DataService.isComingFromReminderPayNow = true
    this.DataService.billcategory = value.consumerDetails.billDetails.billerCategory
    this.DataService.billtype = value.consumerDetails.billDetails.billerCategory
    this.goToPage('retailBillPayment')
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
}
