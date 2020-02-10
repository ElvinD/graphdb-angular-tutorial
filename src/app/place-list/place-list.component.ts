import { Component, OnInit, Input } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from '../service/selecteditems.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent extends AbstractBaseComponent implements OnInit {

  @Input() places: RDFData[];
  
  constructor(protected sparqlService: SparqlService, protected selectedItemsService: SelecteditemsService) {
    super(sparqlService, selectedItemsService);
  }

  ngOnInit() {
    this.selectedItemsService.$selectedItems.subscribe((items) => {
      this.onItemSelected(items);  
    }, () => {
      console.log("error selecting places");
    }, () => {
      console.log("completed selecting items for places");    
    })
  }
  
  protected onItemSelected(selectedProvinces: RDFData[]): void {
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
