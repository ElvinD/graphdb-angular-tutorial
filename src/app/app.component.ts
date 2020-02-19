import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SelecteditemsService } from './service/selecteditems.service';
import { RDFData } from './service/sparqlservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graphdb-tutorial';

  constructor(protected selectedItemsService: SelecteditemsService) {}

  ngOnInit() {
    this.selectedItemsService.$selectedItems.subscribe(items => {
      this.onItemSelected(items);
    })
  }

  protected onItemSelected(items:RDFData[]):void {
  }
}
