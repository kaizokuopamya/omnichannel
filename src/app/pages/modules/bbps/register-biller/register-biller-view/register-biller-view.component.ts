import { Component, OnInit , OnDestroy } from '@angular/core';
import { AppConstants } from '../../../../../app.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import {BbpsService} from 'src/app/services/bbps.service'
import {RechargeBillpayService} from '../../recharge-billpay/recharge-billpay.service'
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { Router } from '@angular/router';
import { DatePipe , Location} from '@angular/common';
@Component({
  selector: 'app-register-biller-view',
  templateUrl: './register-biller-view.component.html',
  styleUrls: ['./register-biller-view.component.scss']
})
export class RegisterBillerViewComponent implements OnInit , OnDestroy{

  constructor(private router: Router,
    public DataService: DataService,
    public constant: AppConstants,
    public location : Location,
    private rechargeBillpayService : RechargeBillpayService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private datepipe: DatePipe,
    private bbpsService : BbpsService,
    public commonMethod: CommonMethods) { }
    renderDataList:any =[];
    pendingbillList:any;
    renderValue:any;
    billerdetailsDataPass:any;
    cou_conv_fee = "0.00";
    bou_conv_fee ='0.00'
    totalHandlingCharge:any;
    recentTrans:any
    itemsPerPage = 10;
    currentPage = 1
    partialPay:any;
    validatedillerRes:any;
    logoUrl:any
    validatePay:any;
    existingBillerDetails:any
    pendingBillerLogoList:any
    finalUnpaidBillerDetails = [];
    upaidBillerWithLogo:any;
    leftDate:any
    p = 1;
    apiErrorMsg:any;
  ngOnInit(): void {
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : "retailRechargeBillPay"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.DataService.isbbpsPage = true
    console.log(" this.renderDataList" + JSON.stringify( this.renderDataList))
    if( this.DataService.allregisteredBillerList.length > 0){
      this.renderDataList =  this.DataService.allregisteredBillerList;
   }else{
     this.getAllRegisteredBillers()
    
   }

  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
   getAllRegisteredBillers() {
    // alert(this.DataService.customerID)
    let billerListparam = this.rechargeBillpayService.getBillDetails();
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES,  {showErrorPopup:false}).subscribe(data => {
    
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
          if(this.existingBillerDetails.length > 0){
             this.getbillersLogoDetials(this.existingBillerDetails ,fiveBillerId)
          }
      }
      else {
    
      }
    });
  }
  getbillersLogoDetials(billerlist , idList) {
    console.log("idListsss " + idList)
 
    let billerListparam = this.rechargeBillpayService.getLogoDetials(idList);
    this.http.callBankingAPIService(billerListparam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES ,{showErrorPopup:false}).subscribe(data => {
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
                    this.leftDate = finaldue.getTime() - currentDate.getTime() 
                    this.leftDate =  this.leftDate / (1000 * 3600 * 24);
                    console.log("finaldue.getDate() : " + finaldue.getTime()) 
                    console.log("currentDate.getDate() : " + currentDate.getTime()) 
                    console.log("leftDate() : " + this.leftDate) 
                    this.leftDate = parseInt( this.leftDate , 10)
                    billerlist[i].daysLeft =  this.leftDate 
                    billerlist[i].formatedDuedate =  this.datepipe.transform(finaldue, 'dd MMM yy')
                      console.log("this.leftDate" + this.leftDate);  
                      console.log("this.formatedDuedate" + billerlist[i].formatedDuedate); 
                      this.renderDataList.unshift(billerlist[i])
                    }else{
                      this.renderDataList.push(billerlist[i])
                    }
                  }
               
              }
          }
          console.log("FinalbillerlistSANAL " + JSON.stringify(billerlist))
        // this.renderDataList = billerlist
      }
      else {
      ///  this.errorCallBack(data.subActionId, resp);
      }
      
    });
        console.log("all FinalbillerlistSANAL2" + JSON.stringify(billerlist))
      
  }

  
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  moreDetails(item){
    this.DataService.unpaidbilldetail = item
    this.router.navigateByUrl('/unpaidBill');
  }

    payPendingBill(item){
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
          if (el.payment_channel == "Internet" && el.payment_method == "BankAccount") {
            if( el.cou_conv_fee != undefined){
              alert()
              this.cou_conv_fee = el?.cou_conv_fee
            }else{
              this.cou_conv_fee = "0.00"
            }
  
            if( el.bou_conv_fee != undefined){
              this.bou_conv_fee = el?.bou_conv_fee
            }else{
              this.bou_conv_fee = "0.00"
            }
            }
         })
         console.log("this.cou_conv_fee : " + this.cou_conv_fee)
         console.log("this.bou_conv_fee : " + this.bou_conv_fee)
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
      'billId': item.billlist[0].billid,
      'consumerNo': item.billeraccount.authenticators[0].value,
      'paymentType': "billpay",
      'cou_conv_fee' : this.cou_conv_fee,
      'bou_conv_fee' : this.bou_conv_fee,
      'auth': item.billlist[0].authenticators,
      'partialPay' : item.moreDetails.partial_pay,
        "formatedDuedate":item.formatedDuedate,
  
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
      console.log("itemitemitemitem" + JSON.stringify(this.billerdetailsDataPass))  
      this.goToPage('existingBillPayment') ;
    }

    errorCallBack( actid , resp){

    }
}
