import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { GeolocationPosition } from '@capacitor/geolocation';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

onUbicacionConcedida : any
onErrorDeUbicacion : any
opcionesDeSolicitud : any


  async checkLocationPermission() : Promise<void> {
   return navigator.geolocation.getCurrentPosition(this.onUbicacionConcedida, this.onErrorDeUbicacion, this.opcionesDeSolicitud);
  }
}