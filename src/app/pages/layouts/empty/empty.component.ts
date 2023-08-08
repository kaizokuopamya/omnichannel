import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'empty-layout',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  notify : any;
  constructor(
    private dataService : DataService
  ) { }

  ngOnInit(): void {
  }

  addItem(newItem: boolean) {
    console.log(newItem)
    this.notify = newItem;
    this.emitEventToChild()
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

}
