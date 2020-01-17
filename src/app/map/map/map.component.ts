import { Component, OnInit } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent extends AbstractBaseComponent implements OnInit {

  constructor(protected sparqlService: SparqlService) {
    super(sparqlService);
  }

  ngOnInit() {
  }

}
