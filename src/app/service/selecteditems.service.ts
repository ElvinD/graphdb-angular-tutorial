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

  isItemSelected(selectedItem:RDFData):boolean {
    return this.selectedItems.filter(item => item === selectedItem ).length > 0;
  }

  resetPlaces():void {
    this.selectedItems = this.selectedItems.filter(item => item.dctype !==  "http://rdf.histograph.io/Place");
  }

  resetPeople():void {
    this.selectedItems = this.selectedItems.filter(item => item.type !==  "https://w3id.org/pnv#Person");
  }

  addSelectedItem(selectedItem:RDFData):void {
    // console.log("add selected item? ",  selectedItem);
    
    this.selectedItems.map(item => item.selected = false);
    //if there are no matching items based on URI, add this item to the list of selected items
    if (this.selectedItems.filter(item => item.uri === selectedItem.uri).length === 0) {
      let items = this.selectedItems;
      // no more than 1 province, if we there is a province still selected, remove it
      items = items.filter (item => item.dctype !== selectedItem.dctype);
      items.push(selectedItem);
      this.selectedItems =  items;
    } else {
      // console.log("not adding item because already selected:" , selectedItem);
    }
    this.selectedItems.map(item => item.selected = true);
  }
}
