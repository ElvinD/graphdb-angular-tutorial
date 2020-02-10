import { TestBed } from '@angular/core/testing';

import { SelecteditemsService } from './selecteditems.service';

describe('SelecteditemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelecteditemsService = TestBed.get(SelecteditemsService);
    expect(service).toBeTruthy();
  });
});
