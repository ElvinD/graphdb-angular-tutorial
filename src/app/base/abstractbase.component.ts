import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-list',
  templateUrl: './abstractbase.component.html',
  styleUrls: ['./abstractbase.component.css']
})
export class AbstractBaseComponent implements OnInit {

  @Input() dataChanged: Observable<any>;
  @Output() select: EventEmitter<RDFData[]> = new EventEmitter();

  
  constructor(protected sparqlService: SparqlService) { }

  ngOnInit() {
  }

  onClick(item: RDFData): void {
  }

  private emitSelection(): void {
  }

}
