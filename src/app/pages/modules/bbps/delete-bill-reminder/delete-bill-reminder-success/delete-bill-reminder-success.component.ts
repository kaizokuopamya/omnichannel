import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-delete-bill-reminder-success',
  templateUrl: './delete-bill-reminder-success.component.html',
  styleUrls: ['./delete-bill-reminder-success.component.scss']
})
export class DeleteBillReminderSuccessComponent implements OnInit {

  todayDateTime:any
  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,  private datepipe: DatePipe) { }

  ngOnInit(): void {

   
    this.todayDateTime = this.datepipe.transform(new Date(), 'dd MMM yyyy hh:mm a');
  }

  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
}
