import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { CommonMethods } from '../../../../../services/common-methods';

@Component({
  selector: 'app-pending-bill-more-details',
  templateUrl: './pending-bill-more-details.component.html',
  styleUrls: ['./pending-bill-more-details.component.scss']
})
export class PendingBillMoreDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    public DataService: DataService,
    public commonMethod: CommonMethods,) { }


  ngOnInit(): void {

    this.DataService.getBreadcrumb('PENDING_BILL_REMINDER' , this.router.url)
    this.DataService.isbbpsPage = true
  }
  ngOnDestroy() {
    this.DataService.isbbpsPage = false
  }
  goToPage(routeName){
    this.router.navigateByUrl('/'+routeName);
  }
}
