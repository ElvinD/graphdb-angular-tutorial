import { Component, OnInit } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/base/abstractbase.component';
import { SparqlService } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent extends AbstractBaseComponent implements OnInit {

  constructor(protected sparqlService: SparqlService) {
    super(sparqlService);
  }

  ngOnInit() {
  }

}
