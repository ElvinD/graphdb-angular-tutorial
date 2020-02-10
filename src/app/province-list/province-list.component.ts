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
    this.selectedItemsService.$selectedItems.subscribe(items => {
      this.onItemSelected(items);
    })
    this.sparqlService.getProvinces().subscribe((data) => {
      this.onProvincesLoaded(data);
    }, () => {
      console.log("error loading provinces");
    }, () => {
      console.log("completed loading provinces");
    });
  }
  
  onProvincesLoaded(data: Array<RDFData>): void {
    this.provinces = data;
    console.log("received provinces: " , this.provinces);
    
  }

  protected onItemSelected(items:RDFData[]):void {
    console.log("provinces component. Items selected: ", items);
  }

}
