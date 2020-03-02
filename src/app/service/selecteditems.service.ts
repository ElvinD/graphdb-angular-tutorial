import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RDFData } from './sparqlservice.service';

@Injectable({
  providedIn: 'root'
})
export class SelecteditemsService {

  constructor() { }

  private readonly _selectedProvince = new BehaviorSubject<RDFData>(null);
  private readonly _selectedPlace = new BehaviorSubject<RDFData>(null);
  private readonly _selectedPerson = new BehaviorSubject<RDFData>(null);

  readonly $selectedProvince = this._selectedProvince.asObservable();
  readonly $selectedPlace = this._selectedPlace.asObservable();
  readonly $selectedPerson = this._selectedPerson.asObservable();

  get selectedProvince():RDFData {
    return this._selectedProvince.getValue();
  }

  set selectedProvince(val:RDFData) {
    this._selectedProvince.next(val);
  }

  get selectedPlace():RDFData {
    return this._selectedPlace.getValue();
  }

  set selectedPlace(val:RDFData) {
    this._selectedPlace.next(val);
  }

  get selectedPerson():RDFData {
    return this._selectedPerson.getValue();
  }

  set selectedPerson(val:RDFData) {
    this._selectedPerson.next(val);
  }
}
