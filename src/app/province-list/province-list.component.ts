import { Component, OnInit, Input } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from '../service/selecteditems.service';

@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html',
  styleUrls: ['./province-list.component.css']
})
export class ProvinceListComponent extends AbstractBaseComponent implements OnInit {

  @Input() provinces: RDFData[];

  constructor(protected sparqlService: SparqlService, protected selectedItemsService: SelecteditemsService) {
    super(sparqlService, selectedItemsService);
  }

  ngOnInit() {
    const p = this.sparqlService.getProvinces().subscribe((data) => {
      this.onProvincesLoaded(data);
    }, () => {
      p.unsubscribe();
    }, () => {
      p.unsubscribe();
    });
  }

  onProvincesLoaded(data: Array<RDFData>): void {
    this.provinces = data;
    if (this.provinces.length > 0) {
      this.selectedItemsService.$selectedProvince.subscribe((province) => {
        this.onItemSelected(province);
      });
      this.onClick(this.provinces[0]);
    }
  }

  onClick(province: RDFData): void {
    if (this.selectedItemsService.selectedProvince !== province) {
      if (this.selectedItemsService.selectedProvince) {
            this.selectedItemsService.selectedProvince.selected = false;
      }
      province.selected = true;
      this.selectedItemsService.selectedProvince = province;
    }
  }
}
