import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AbstractBaseComponent } from './base/abstractbase.component';
import { ProvinceListComponent } from './province/province-list/province-list.component';
import { PlaceListComponent } from './province/place-list/place-list.component';
import { PersonListComponent } from './person/person-list/person-list.component';
import { PersonDetailComponent } from './person/person-detail/person-detail.component';
import { MapComponent } from './map/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    AbstractBaseComponent,
    ProvinceListComponent,
    PlaceListComponent,
    PersonListComponent,
    PersonDetailComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
