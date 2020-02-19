import { Component, OnInit, Input } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from 'src/app/service/selecteditems.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent extends AbstractBaseComponent implements OnInit {

  @Input() people: RDFData[];

  constructor(protected sparqlService: SparqlService, protected selectedItemsService: SelecteditemsService) {
    super(sparqlService, selectedItemsService);
  }

  ngOnInit() {
    this.selectedItemsService.$selectedItems.subscribe((items) => {
      this.onItemSelected(items);  
    }, () => {
      console.log("error selecting people");
    }, () => {
      console.log("completed selecting items for people");    
    })
  }

  protected onItemSelected(items: RDFData[]): void {
    if (!items.length) {
      console.log ("not loading people, no items found");
      return;
    }
    if (this.sparqlService.itemsContainProvinces(items) && this.sparqlService.itemsContainPlaces(items) && !this.sparqlService.itemsContainPeople(items)) {
      this.sparqlService.getPeople(items).subscribe((data) => {
        this.onPeopleLoaded(data);
      }, () => {
        console.log("error loading people");
      }, () => {
        // console.log("completed loading people");
      });
    }
  }

  onPeopleLoaded(data: Array<RDFData>): void {
    this.people = data;
    console.log("received people: " , this.people);
  }

  onClick(item: RDFData): void {
    this.selectedItemsService.addSelectedItem(item);
  }
}
