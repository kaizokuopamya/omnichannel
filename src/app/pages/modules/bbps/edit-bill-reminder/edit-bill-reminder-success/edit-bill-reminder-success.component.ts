import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-edit-bill-reminder-success',
  templateUrl: './edit-bill-reminder-success.component.html',
  styleUrls: ['./edit-bill-reminder-success.component.scss']
})
export class EditBillReminderSuccessComponent implements OnInit , OnDestroy {
  todayDateTime:any
  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,
    private datepipe: DatePipe) { }

  ngOnInit(): void {

    this.DataService.isbbpsPage = true
    this.todayDateTime = this.datepipe.transform(new Date(), 'dd MMM yyyy hh:mm a');
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(routeName) {
    this.router.navigateByUrl('/' + routeName);
  }
}
