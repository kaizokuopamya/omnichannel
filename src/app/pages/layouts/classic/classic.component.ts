import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'classic-layout',
  templateUrl: './classic.component.html',
  styleUrls: ['./classic.component.scss']
})
export class ClassicComponent implements OnInit {
  @Input() item = false;
  notify : any;
  constructor() { }

  ngOnInit(): void {
  }
  
  addItem(newItem: any) {
    console.log(newItem)
    this.notify = newItem;
    this.emitEventToChild(newItem)
  }

eventsSubject: Subject<any> = new Subject<any>();

emitEventToChild(item:any) {
  this.eventsSubject.next(item);
}

  

}
