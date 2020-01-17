import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graphdb-tutorial';
  events: Subject<any> = new Subject<any>();

  onSelect(event: any) {
    // console.log('app component received event: ', event);
    this.events.next(event);
  }
}
