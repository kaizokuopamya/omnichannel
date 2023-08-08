import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-inward-cheque-inquiry-details',
  templateUrl: './inward-cheque-inquiry-details.component.html',
  styleUrls: ['./inward-cheque-inquiry-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InwardChequeInquiryDetailsComponent {
  @Output() inwardCheckDetails:EventEmitter<string> = new EventEmitter();
  newinwardDetail:any;

  constructor(
    public dataService: DataService
  ) { 
    this.newinwardDetail= this.dataService.inwardCheckDetails;
  }

  cancel(){
    this.inwardCheckDetails.emit('list');
  }
}
