import { Component, OnInit, Input } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html',
  styleUrls: ['./province-list.component.css']
})
export class ProvinceListComponent extends AbstractBaseComponent implements OnInit {

  @Input() provinces: RDFData[];
  
  constructor(protected sparqlService: SparqlService) {
    super(sparqlService);
  }

  ngOnInit() {
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
    console.log("received: " , this.provinces);
  }

}
