import { Component, OnInit } from '@angular/core';
import { SelecteditemsService } from './service/selecteditems.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'graphdb-tutorial';

  constructor(protected selectedItemsService: SelecteditemsService) {}

  ngOnInit() {
  }
}
