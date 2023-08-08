import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import {EditBillReminderConfirmationService} from './edit-bill-reminder-confirmation.service'
import { AppConstants } from 'src/app/app.constant';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpRestApiService } from 'src/app/services/http-rest-api.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';

@Component({
  selector: 'app-edit-bill-reminder-confirmation',
  templateUrl: './edit-bill-reminder-confirmation.component.html',
  styleUrls: ['./edit-bill-reminder-confirmation.component.scss']
})
export class EditBillReminderConfirmationComponent implements OnInit , OnDestroy {

  constructor(
    private router: Router,
    private http: HttpRestApiService, 
    public DataService: DataService , 
    private constant:AppConstants,
    private storage :LocalStorageService,
    public commonMethod: CommonMethods, 
    private editBillReminderConfirmationService :EditBillReminderConfirmationService) { }

  ngOnInit(): void {
  
    this.DataService.isbbpsPage = true
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
  onConfirmClick(){
    let param = this.editBillReminderConfirmationService.editBillReminderparam(this.DataService.billReminderValues)
    this.http.callBankingAPIService(param, this.storage.getLocalStorage(this.constant.storage_deviceId), this.constant.serviceName_BBPSUPDATEREMINDER).subscribe(data => {
      // console.log(JSON.parse(data.responseParameter.bbpsResponse));
      var resp = data;
      console.log("AddBillerSERVIVE " +  JSON.stringify(resp))
      this.DataService.updatebillerConfirmation = resp
       this.goToPage("editBillReminderSuccess")
    })

  }
}
