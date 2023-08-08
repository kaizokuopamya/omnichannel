import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '../../../../../app.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';

import {RechargeBillpayService} from '../../recharge-billpay/recharge-billpay.service'
import { LocalStorageService } from '../../../../../services/local-storage.service';
@Component({
  selector: 'app-pending-bill-reminder',
  templateUrl: './pending-bill-reminder.component.html',
  styleUrls: ['./pending-bill-reminder.component.scss']
})
export class PendingBillReminderComponent implements OnInit {

  constructor(
    private router: Router,
    public DataService: DataService,
    public constant: AppConstants,
    private rechargeBillpayService : RechargeBillpayService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    public commonMethod: CommonMethods) { }
    pendingbillList:any = []
    recentTrans:any
    existingBillerDetails:any
    pendingBillerLogoList:any
    finalUnpaidBillerDetails = [];
    upaidBillerWithLogo:any;
    leftDate:any
    cou_conv_fee:any = "0.00";
    bou_conv_fee:any ="0.00";
    totalHandlingCharge:any
    apiErrorMsg:any
    logoUrl:any
    partialPay:any;
    validatePay:any;
    validatedillerRes:any
    billerdetailsDataPass:any;
  ngOnInit(): void {

    this.pendingbillList = this.DataService.allUnpaidBillerList
    if( this.pendingbillList ){
         this.pendingbillList = this.DataService.allUnpaidBillerList
      }else{
        this.getAllRegisteredBillers()
      }

  }
  getAllRegisteredBillers() {
   
    let billerListparam = this.rechargeBillpayService.getBillDetails();
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
    
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        var fiveBillerId = ''
          this.existingBillerDetails =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.result
     //     this.existingBillerDetails = JSON.parse(this.existingBillerDetails)
          console.log('this.existingBillerDetails ===> ' +  this.existingBillerDetails )
         
          // this.getUnpaidbills(this.existingBillerDetails)
          
       //   console.log(" this.finalExistingBillerDetails" +  JSON.stringify(this.finalExistingBillerDetails))
         for(var i = 0;  i < this.existingBillerDetails.length ; i++){
               fiveBillerId = fiveBillerId +  this.existingBillerDetails[i].billeraccount.billerid + ','
          }
         this.getbillersLogoDetials(this.existingBillerDetails ,fiveBillerId)
      }
      else {
    
      }
    });
  }
  getbillersLogoDetials(billerlist , idList) {
    this.pendingbillList = []
    console.log("idListsss " + idList)
 
    let billerListparam = this.rechargeBillpayService.getLogoDetials(idList);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES).subscribe(data => {
      console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(data.responseParameter);
        
          this.pendingBillerLogoList = JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
          console.log("this.pendingBillerLogoList " + JSON.stringify(this.pendingBillerLogoList.billerData) )
          console.log("this.billerlist " + JSON.stringify(billerlist) )
          for(var i= 0; i < billerlist.length; i++){
            for(var j= 0; j < this.pendingBillerLogoList.length ; j++){
                if(billerlist[i].billeraccount.billerid == this.pendingBillerLogoList[j].billerId){
                 
                   billerlist[i].moreDetails = JSON.parse(this.pendingBillerLogoList[j].billerData)
                  if(billerlist[i].billlist?.length){
                      var duedate =  billerlist[i].billlist[0].billduedate.split("-");
                      var formatedDuedate = duedate[1] +'/'+ duedate[0]+ '/' + duedate[2]
                      console.log("formatedDuedate ==>" + formatedDuedate)
                  
                      var finaldue = new Date(formatedDuedate)
                      var currentDate = new Date()
                      this.leftDate = finaldue.getDate() - currentDate.getDate()  
                      this.leftDate = parseInt( this.leftDate , 10)
                      billerlist[i].daysLeft =  this.leftDate 
                      console.log("this.leftDate" + this.leftDate);  
                    }
                  }
               
              }
          }
          console.log("FinalbillerlistSANAL " + JSON.stringify(billerlist))
         
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
      
         
      for(var i = 0 ; i < billerlist.length ;i++){
            if(billerlist[i].billlist?.length > 0){
              console.log("billerlist[i].billlist" + JSON.stringify(billerlist[i].billlist))
              for(var j = 0 ; j < billerlist[i].billlist.length; j++ ){
                console.log("STATUS " + billerlist[i].billlist[j].billstatus)
                if(billerlist[i].billlist[j].billstatus == "UNPAID"){
                  this.pendingbillList.push(billerlist[i])
                }
               
              }
              
          }
        }
        console.log("all FinalbillerlistSANAL2" + JSON.stringify(billerlist))
      
    });
    
  }



  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }

  billpayment(item){
    console.log("itemitem" + JSON.stringify(item))
    let billerdetailsList = {
      billerName:item.moreDetails.biller_name,
      billerId: item.moreDetails.billerid,
      authenticators: item.billlist[0].authenticators,
      
    }
    this.logoUrl =item.moreDetails.biller_logo,
    this.partialPay = item.moreDetails.partial_pay;
    this.validatePay =item.moreDetails.online_validation;
    if(item.moreDetails.customer_conv_fee?.length > 0 ){
    item.moreDetails.customer_conv_fee.forEach(el => {
        if (el.payment_channel == "Internet") {
          
          this.cou_conv_fee = el.cou_conv_fee
          this.bou_conv_fee = el.bou_conv_fee

          }
       })
    }else{
      this.cou_conv_fee = "0.00"
      this.bou_conv_fee = "0.00"
    }
    this.totalHandlingCharge = (parseFloat(this.cou_conv_fee) + parseFloat( this.bou_conv_fee)).toFixed(2)
   // alert(item.moreDetails.online_validation)
    //  if(item.moreDetails.online_validation == "Y"){
    //     this.validatePaymentDetails(billerdetailsList)
    // }
    this.billerdetailsDataPass = {
      'billerName' :item.moreDetails.biller_name,
      'billamt':  (parseFloat(item.billlist[0].billamount) + parseFloat(this.totalHandlingCharge) ).toFixed(2),
      'billCategory': item.moreDetails.biller_category,
      'logourl' :item.moreDetails.biller_logo,
      'billerId' :item.moreDetails.billerid,
      'dueDate': item.billlist[0].billduedate,
      'paymentType': item.biller_type,
      'cou_conv_fee' : this.cou_conv_fee,
      'bou_conv_fee' : this.bou_conv_fee,
      'auth': item.billlist[0].authenticators,
      'partialPay' : item.moreDetails.partial_pay,
      'displayData':[
        {
          "label":  'Short Name',
          'field' : item.billeraccount.short_name
        },
       
        {
          "label":  'Bill Amount',
          'field' : "₹" +  parseFloat(item.billlist[0].billamount),
        },
        {
          "label":  'Handling Fees',
          'field' : "₹" + this.totalHandlingCharge,
        },
        {
          "label":  'Bill Date',
          'field' : item.billlist[0].billdate
        },
        {
          "label":  'Bill Status',
          'field' :  item.billlist[0].billstatus,
        },
      ]
    }
    this.DataService.billerdata =   this.billerdetailsDataPass
    console.log("itemitemitemitem" + JSON.stringify(item))  
    this.goToPage('existingBillPayment') ;
  }
  moreDetails(item){
    this.DataService.unpaidbilldetail = item
    this.router.navigateByUrl('/unpaidBill');
  }
}
