import { Component, OnInit } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData, PersonData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from 'src/app/service/selecteditems.service';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent extends AbstractBaseComponent implements OnInit {

  persondata: PersonData;

  constructor(protected sparqlService: SparqlService, protected selectedItemsService: SelecteditemsService) {
    super(sparqlService, selectedItemsService);
  }

  ngOnInit() {
    this.selectedItemsService.$selectedPerson.subscribe((person) => {
      this.onItemSelected(person);
    });
  }

  protected onItemSelected(person: RDFData): void {
    if (!person) {
      return;
    }
    const p = this.sparqlService.getPersonDetails(person).subscribe((data) => {
        this.onPersonLoaded(data);
      }, () => {
        p.unsubscribe();
      }, () => {
        p.unsubscribe();
      });
  }

  onPersonLoaded(data: PersonData): void {
    // console.log("retrieved person details:", data);
    this.persondata = data;
  }
}
