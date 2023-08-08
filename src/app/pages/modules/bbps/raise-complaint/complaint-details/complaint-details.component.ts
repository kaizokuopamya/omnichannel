import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { pageLoaderService } from 'src/app/services/pageloader.service';
import { AppConstants } from 'src/app/app.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { DatePipe, Location } from '@angular/common';
import { CommonMethods } from '../../../../../services/common-methods';
@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.scss']
})
export class ComplaintDetailsComponent implements OnInit {


  renderableData:any = []
  constructor(private router: Router,private loader: pageLoaderService, 
    public DataService: DataService,public constant : AppConstants,private datepipe: DatePipe,
    public commonMethod: CommonMethods) { }

  ngOnInit(): void {

    this.DataService.getBreadcrumb('Complaint info' , this.router.url)
    this.renderableData = this.DataService.Complaintdetails
console.log("    this.renderableData.complaint_date " +     this.renderableData.complaint_date)
  //  this.renderableData.complaint_date = moment(this.renderableData.complaint_date).format(' Do MMM YYYY, h:mm:ss a');

    console.log(" this.renderableData" ,  this.renderableData)
    this.DataService.isbbpsPage = true
  }
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
}
