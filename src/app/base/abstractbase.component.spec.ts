import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractBaseComponent } from './abstractbase.component';

describe('ListComponent', () => {
  let component: AbstractBaseComponent;
  let fixture: ComponentFixture<AbstractBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
