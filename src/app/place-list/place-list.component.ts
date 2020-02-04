import { Component, OnInit, Input } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent extends AbstractBaseComponent implements OnInit {

  @Input() places: RDFData[];
  
  constructor(protected sparqlService: SparqlService) {
    super(sparqlService);
  }

  ngOnInit() {
  }
  
  onSelect(selectedProvinces: RDFData[]): void {
    this.sparqlService.getPlaces(selectedProvinces).subscribe((data) => {
      this.onPlacesLoaded(data);
    }, () => {
      console.log("error loading places");
    }, () => {
      console.log("completed loading places");
    });
    
  }
  
  onPlacesLoaded(data: Array<RDFData>): void {
    this.places = data;
    console.log("received places: " , this.places);
  }

}
