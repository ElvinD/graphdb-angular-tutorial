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
    this.type = "https://w3id.org/pnv#Person";
    this.dctype = "undefined";
  }

  ngOnInit() {
    this.selectedItemsService.$selectedPlace.subscribe((place) => {
      this.onItemSelected(place);
    });
  }

  protected onItemSelected(place: RDFData): void {
    if (!place) {
      return;
    }
     const p = this.sparqlService.getPeople([place]).subscribe((data) => {
        this.onPeopleLoaded(data);
      }, () => {
        p.unsubscribe();
      }, () => {
        p.unsubscribe();
      });
  }

  onPeopleLoaded(data: Array<RDFData>): void {
    this.people = data;
    if (this.people.length)
      this.onClick(this.people[0]);
  }

  onClick(person: RDFData): void {
    if (this.selectedItemsService.selectedPerson !== person) {
      if (this.selectedItemsService.selectedPerson)
        this.selectedItemsService.selectedPerson.selected = false;
      person.selected = true;
      this.selectedItemsService.selectedPerson = person;
    }
  }
}
