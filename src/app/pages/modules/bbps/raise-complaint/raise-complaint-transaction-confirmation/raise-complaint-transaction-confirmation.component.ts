import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import {RaiseComplainService} from '../raise-complaint/raise-complain.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';

import { AppConstants } from '../../../../../app.constant';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
@Component({
  selector: 'app-raise-complaint-transaction-confirmation',
  templateUrl: './raise-complaint-transaction-confirmation.component.html',
  styleUrls: ['./raise-complaint-transaction-confirmation.component.scss']
})
export class RaiseComplaintTransactionConfirmationComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    public raiseComplainService: RaiseComplainService,
    private http : HttpRestApiService,
    public storage : LocalStorageService,
    public constant :AppConstants,) { }
    complainComf : any
    complainResponse:any
    ngOnInit(): void {

      this.complainComf = this.DataService.complaintData
      this.DataService.isbbpsPage = true
    }
  
    ngOnDestroy() {
      this.DataService.isBillerBBPs = false
      this.DataService.isbbpsPage = false
      this.DataService.complaintbbpsrefNumber =''
    }
    goToPage(routeName) {
      this.router.navigateByUrl('/' + routeName);
    }
    raiseComplain(){


      let param = this.raiseComplainService.raisecomplain(this.complainComf);
      this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSSERVICES , {showErrorPopup:false}).subscribe(data => {
         console.log(JSON.parse(data.responseParameter.bbpsResponse));
        var resp = data.responseParameter;
        this.complainResponse = JSON.parse(data.responseParameter.bbpsResponse);

        this.DataService.complainResponse =  resp
        console.log(" this.complainResponse" + JSON.stringify( this.complainResponse))
        // if (resp.opstatus == "00") {
         
        //   }
        // else {
          
        // }
        this.goToPage('retailRaiseComplaintTransactionSuccess')
      });
     
    }
}
