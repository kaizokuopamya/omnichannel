import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BbpsService } from 'src/app/services/bbps.service';
import { CustomCurrencyPipe } from '../../../../pipes/custom-currency.pipe';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { AppConstants } from 'src/app/app.constant';
import { DatePipe , Location} from '@angular/common';
import { CommonMethods } from '../../../../services/common-methods';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
@Component({
  selector: 'app-mob-biller-list',
  templateUrl: './mob-biller-list.component.html',
  styleUrls: ['./mob-biller-list.component.scss']
})
export class MobBillerListComponent implements OnInit {

  constructor   ( private router: Router,
  public DataService: DataService,
  public commonMethod: CommonMethods,
  private location: Location,
  private http:HttpRestApiService,
  private constant:AppConstants,
  private customCurrencyPipe: CustomCurrencyPipe,
  private storage :LocalStorageService,

  private bbpsService: BbpsService,
  ) { }
  filteredBillerList:any []
  finalBillerList:any []
  repsonseMsg
  finalRecentrans:any =[]
  ngOnInit(): void {

    this.DataService.getBreadcrumb(this.DataService.billcategory, this.router.url)
    this.DataService.isbbpsPage = true
    var backUrl = this.constant.getPlatform() == 'web' ? 'dashboard' : "retailRechargeBillPay"
    history.pushState({}, backUrl, this.location.prepareExternalUrl(backUrl));
    history.pushState({}, 'self', this.location.prepareExternalUrl(this.router.url));
    this.getAllBillerlist()
    this.filterTrascations()


    
  }

  filterTrascations(){
  
  this.finalRecentrans =[]
    console.log("this.DataService.finalRecentTransList" , this.DataService.finalRecentTransList)
    console.log("this.DataService.billcategory" , this.DataService.billcategory)
    for(var i = 0; i < this.DataService.finalRecentTransList.length; i++){
      console.log(this.DataService.finalRecentTransList[i]?.biller_category == this.DataService.billcategory)
      if(this.DataService.finalRecentTransList[i]?.biller_category == this.DataService.billcategory){
          this.finalRecentrans.push(this.DataService.finalRecentTransList[i])
      }

    }
    console.log(" this.finalRecentrans" ,  this.finalRecentrans)
  }
  getAllBillerlist(){
    this.finalBillerList = []
    let billerParamList = this.bbpsService.getbillerListforCategory(this.DataService.billcategory);
    this.http.callBankingAPIService(billerParamList, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES, {showErrorPopup:false}).subscribe(data => {
     
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        console.log(JSON.parse(data.responseParameter.bbpsResponse));
        console.log(data.responseParameter);
     
          var billerList =JSON.parse(data.responseParameter.bbpsResponse).responseParameter.billerList
           console.log("BillerList : " + JSON.stringify( billerList))
           for(var i= 0; i < billerList.length; i++){
            this.finalBillerList.push(JSON.parse(billerList[i].billerData))

           }
          
           this.filteredBillerList = this.finalBillerList
      }
      else {
        var msg ="Due to downtime Unable to retrieve Billers" 
        this.errorCallBack(msg, resp);
      }
    });


  }

  onSeachResultClick(value){
    console.log("value : " + JSON.stringify(value))
    this.DataService.searchProviderData =value
    this.DataService.billtype = value.biller_category
    this.DataService.billcategory = value.biller_category

      this.goToPage('retailBillPayment')
    
  }
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
  filterBiller(value){
    
  
    //  console.log(value)
      if(value.length > 0){
        // $('#board-name').show();
       
        this.filteredBillerList = this.finalBillerList.filter(function (el) {
       //   console.log(el.biller_legal_name.toLowerCase()  + " " +  value.toLowerCase())
  
           if(el.biller_name.toLowerCase().includes(value.toLowerCase())){
            return el
           }
                
        });
        //console.log(" this.filteredBillerList " +  this.filteredBillerList )

      }else{
       // $('#board-name').hide();
       this.filteredBillerList = this.finalBillerList
       // $('#board-name').hide();
       
      }
  
     
  
    }
  errorCallBack(msg, resp) {
    this.repsonseMsg = msg
    this.commonMethod.openPopup('.billerrorMsg')
  }
}
