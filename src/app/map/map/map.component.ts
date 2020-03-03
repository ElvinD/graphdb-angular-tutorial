import { Component, OnInit } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { Map, tileLayer, latLng } from 'leaflet';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from 'src/app/service/selecteditems.service';
import { SearchService } from 'src/app/service/search.service';


declare let L;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent extends AbstractBaseComponent implements OnInit {

  map: Map;
  province: string = null;
  place: string = null;

  protected mapServiceURL = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // protected mapServiceURL = 'http://localhost:32768/styles/osm-bright/{z}/{x}/{y}.png';

  maps = tileLayer(this.mapServiceURL,
    {
      detectRetina: false
    });

  options = {
    layers: [
      this.maps
    ],
    zoom: 8,
    preferCanvas: true,
    center: latLng([52.08095165, 5.12768031549829])
  };

  constructor(protected sparqlService: SparqlService, 
    protected selectedItemsService: SelecteditemsService,
    protected searchService: SearchService) {
    super(sparqlService, selectedItemsService);
  }

  ngOnInit() {
    this.selectedItemsService.$selectedProvince.subscribe((province) => {
      this.onItemSelected(province);
    });
    this.selectedItemsService.$selectedPlace.subscribe((province) => {
      this.onItemSelected(province);
    });
  }

  protected onItemSelected(item:RDFData):void {
    if (item) {
      if (item.type === "http://rdf.histograph.io/PlaceInTime") {
        switch (item.dctype) {
          case "http://rdf.histograph.io/Place":
            this.place = item.label;
            break;
          case "http://rdf.histograph.io/Province":
            this.province = item.label;
            break;
        }
      }
      if (this.place && this.province) {
        this.search(`${this.place}, ${this.province}`);
      }
    }
  }

  ngAfterViewChecked() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  search(query: string) {
    // console.log('search query: ', query);
    this.searchService.search(query).subscribe(data => {
      if (data.length) {
        const coords = data[0];
        if (coords['lat'] && coords['lon']) {
          const lat: number = coords['lat'];
          const lon: number = coords['lon'];
          // console.log('retreived cords: ', lon , lat);
          let zoom = 10;
          if (this.place) {
            zoom = 12;
          }
          // this.map.panTo([lat, lon], {animate: true, duration: 1});
          this.map.flyTo([lat, lon], zoom, {animate: true, duration: 2});
        }
      }
    });
  }

}
