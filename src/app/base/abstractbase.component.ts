import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SparqlService, RDFData } from 'src/app/service/sparqlservice.service';
import { SelecteditemsService } from '../service/selecteditems.service';

@Component({
  selector: 'app-list',
  templateUrl: './abstractbase.component.html',
  styleUrls: ['./abstractbase.component.css']
})
export class AbstractBaseComponent implements OnInit {

  @Input() dataChanged: Observable<any>;
  @Output() select: EventEmitter<RDFData[]> = new EventEmitter();

  constructor(protected sparqlService: SparqlService, protected selectedItemsService: SelecteditemsService) { }

  ngOnInit() {}

  protected onItemSelected(item:RDFData):void {
     
  }

  onClick(item: RDFData): void {
  }
}
