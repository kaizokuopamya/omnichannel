import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constant';
import { DataService } from 'src/app/services/data.service';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RecentPayeeService } from './recent-payee.service';

@Component({
  selector: 'app-recent-payee',
  templateUrl: './recent-payee.component.html',
  styleUrls: ['./recent-payee.component.scss']
})
export class RecentPayeeComponent {
  @Input() type ="";
  @Input() favoritePayee = true;
  @Output() payeeUpdate = new EventEmitter<any>();

  favoriteList: any = [];
  recentTransactionList = [];
  constructor(
    private router: Router,
    public dataService: DataService,
    private http: HttpRestApiService,
    private storage: LocalStorageService,
    private constant: AppConstants,
    private recentPayeeService:RecentPayeeService
  ){

  }
  ngOnInit(): void {
    this.dataService.isPayeeSelected = false;
    this.favorite();
    this.getFrequentTransaction();
  }

  favorite() {
    var param = this.recentPayeeService.getFavouritePayee();
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceNmae_GETFAVORITETRANSACTIONS).subscribe((data) => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
          this.favoriteList = this.dataService.getContactListColour(data.set['records']);
      }
      else {
       //this.errorCallBack(data.subActionId, resp);
      }
    },(error)=>{
      console.log(error)
    })
  }

  getFrequentTransaction() {
    let isMPIN = this.dataService.loginType == 'mpin';
    var frequentTransacParam = this.recentPayeeService.getFrequentTransacParam(isMPIN);
    this.http.callBankingAPIService(frequentTransacParam, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_FREQUENTTRANS).subscribe(data => {
      console.log(data);
      var resp = data.responseParameter;
      if (resp.opstatus == "00") {
        var newArray = data.listofDataset[0].records.map( x => {
          if(x.actionType == undefined) x.actionType = "";
          return x
          })

        var fabList = newArray.filter(e => e.actionType.toLowerCase() != "quick" && e.actionType.toLowerCase() != "donation" && e.actionType.toLowerCase() != "aggregators")
        this.recentTransactionList = this.dataService.getContactListColour(fabList);
        if(this.constant.getPlatform() != "web"){
          this.recentTransactionList = this.recentTransactionList.slice(0, 7);
        }
      }
      else {
        //this.errorCallBack(data.subActionId, resp);
      }
    },(error)=>{
      console.log(error)
    });
  }

  viewMoreDtl(type){
    if(type == "favorite"){
      this.dataService.omniAllRecentPayeeList = this.favoriteList;
    }
    else{
      this.dataService.omniAllRecentPayeeList = this.recentTransactionList;
    }
    this.router.navigateByUrl('/omniAllRecentPayeeMob')
  }

  payeeSelection(value,payeeType){
    console.log("value====>",value);
      this.payeeUpdate.emit({"output": value,"payeeType" : payeeType});
  }


}
