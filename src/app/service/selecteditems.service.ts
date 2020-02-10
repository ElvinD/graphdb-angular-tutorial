import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RDFData } from './sparqlservice.service';

@Injectable({
  providedIn: 'root'
})
export class SelecteditemsService {

  constructor() { }

  private readonly _selectedItems = new BehaviorSubject<RDFData[]>([]);
  readonly $selectedItems = this._selectedItems.asObservable();

  get selectedItems(): RDFData[] {
    return this._selectedItems.getValue();
  }

  set selectedItems(val: RDFData[]) {
    this._selectedItems.next(val);
  }

  addSelectedItem(selectedItem:RDFData):void {
    this.selectedItems.map(item => item.selected = false);
    //if there are no matching items based on URI, add this item to the list of selected items
    if (this.selectedItems.filter(item => item.uri === selectedItem.uri).length === 0) {
      let items = this.selectedItems;
      // no more than 1 province, if we there is a province still selected, remove it
      items = items.filter (item => item.dctype === selectedItem.dctype && item.type === "http://rdf.histograph.io/Province");
      items.push(selectedItem);
      this.selectedItems =  items;
      // console.log("add selected item: ",  this.selectedItems);
    } else {
      // console.log("not adding item because already selected:" , selectedItem);
    }
    this.selectedItems.map(item => item.selected = true);
  }
}
