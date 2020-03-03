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
    this.selectedItemsService.$selectedProvince.subscribe((province) => {
      this.onItemSelected(province);
    });
  }

  protected onItemSelected(province: RDFData): void {
    if (!province) {
      console.log("no province to load", province);
      return;
    }
    const p = this.sparqlService.getPlaces([province]).subscribe((data) => {
      this.onPlacesLoaded(data);
    }, () => {
      p.unsubscribe();
    }, () => {
      p.unsubscribe();
    });
  }

  onPlacesLoaded(data: Array<RDFData>): void {
    this.places = data;
    if (this.places.length)
      this.onClick(this.places[0]);
  }

  onClick(place: RDFData): void {
    if (this.selectedItemsService.selectedPlace !== place) {
      if (this.selectedItemsService.selectedPlace)
        this.selectedItemsService.selectedPlace.selected = false;
      place.selected = true;
      this.selectedItemsService.selectedPlace = place;
    }
  }
}
