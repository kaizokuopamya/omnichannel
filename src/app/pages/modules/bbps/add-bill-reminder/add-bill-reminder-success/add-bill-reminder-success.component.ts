import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { DatePipe, Location } from '@angular/common';
@Component({
  selector: 'app-add-bill-reminder-success',
  templateUrl: './add-bill-reminder-success.component.html',
  styleUrls: ['./add-bill-reminder-success.component.scss']
})
export class AddBillReminderSuccessComponent implements OnInit, OnDestroy {
  constructor( private router:Router, public DataService: DataService,    private datepipe: DatePipe,) { }
  remiderResult:any;
  authArray:any;
  reminderDetails:any;
  billerLogo:any;
  todayDateTime:any;
  ngOnInit(): void {

   this.remiderResult= this.DataService.addbillerConfirmation 
   this.todayDateTime = this.datepipe.transform(new Date(), 'dd MMM yyyy hh:mm a');
   this.initialize()
  }
  initialize(){
    console.log("this.DataService.addbillerConfirmation.responseParameter.consumerDetails : " + JSON.stringify(this.DataService.addbillerConfirmation))
    if(this.DataService.addbillerConfirmation.responseParameter.opstatus == '00'){
    
    var parseResponse= JSON.parse(this.DataService.addbillerConfirmation.responseParameter.consumerDetails)
  
    
    console.log("parseResponse" + JSON.stringify(parseResponse))
    
    this.authArray = parseResponse.authArray
    this.reminderDetails = parseResponse.billDetails
    this.billerLogo =parseResponse.billerLogo

      console.log("this.authArray" ,this.authArray)
      console.log("this.reminderDetails" , this.reminderDetails)
      console.log("this.billerLogo" , this.billerLogo)
    }

  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
  ngOnDestroy(){
    this.DataService.addbillerConfirmation =''
    this.DataService.isbbpsPage = false
    this.DataService.isComingfromRecept = false
  }

}
