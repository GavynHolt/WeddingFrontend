import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  apiLoaded$: Observable<boolean>;

  homeMarker: google.maps.LatLngLiteral = { lat: 43.6242808, lng: -79.5034614 };
  restaurantMarker: google.maps.LatLngLiteral = {
    lat: 43.62592,
    lng: -79.50358,
  };
  ceremonyMarkerIcon!: google.maps.Icon;
  receptionMarkerIcon!: google.maps.Icon;
  mapOptions: google.maps.MapOptions = {
    mapId: '4d1b8026e200cc76',
    zoom: 17,
    minZoom: 9,
  };

  constructor(private httpClient: HttpClient) {
    this.apiLoaded$ = this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApi}`,
        'callback'
      )
      .pipe(
        tap(() => {
          this.ceremonyMarkerIcon = {
            url: '/assets/reception.svg',
            size: new google.maps.Size(50, 50),
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(30, 30),
          };
          this.receptionMarkerIcon = {
            url: '/assets/ceremony.svg',
            size: new google.maps.Size(50, 50),
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(30, 30),
          };
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit(): void {}

  onMapReady(map: google.maps.Map): void {
    const mapBounds = new google.maps.LatLngBounds();
    mapBounds.extend(this.homeMarker);
    mapBounds.extend(this.restaurantMarker);
    map.fitBounds(mapBounds);
  }
}
