import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SparqlService } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-list',
  templateUrl: './abstractbase.component.html',
  styleUrls: ['./abstractbase.component.css']
})
export class AbstractBaseComponent implements OnInit {

  @Input() dataChanged: Observable<any>;

  constructor(protected sparqlService: SparqlService) { }

  ngOnInit() {
  }

}
