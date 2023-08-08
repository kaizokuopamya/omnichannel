import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-inward-cheque-inquiry-list',
  templateUrl: './inward-cheque-inquiry-list.component.html',
  styleUrls: ['./inward-cheque-inquiry-list.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class InwardChequeInquiryListComponent {
  @Output() inwardCheckList: EventEmitter<string> = new EventEmitter();
  inwardchecks:any;
  inwardcheckssort:any;

  constructor(
    public dataService: DataService
  ) { 
    this.inwardchecks= this.dataService.inwardchecklistvalue;
  }

  ngOnInit(): void  {
    this.inwardchecks.sort(function(a, b) {
      var dateA = a.dateOfPassing.split('-').reverse().join('');
      var dateB = b.dateOfPassing.split('-').reverse().join('');
      if (dateA < dateB ) {
        return -1;
      }
      if (dateA > dateB ) {
        return 1;
      }
      return 0;
    });
  }
  goToPage() {
    this.inwardCheckList.emit('inquiry');
  }

  gotoInwardcheckDetail(inwardchecks){
    this.dataService.inwardCheckDetails=inwardchecks;
    this.inwardCheckList.emit('details');
  }
}
