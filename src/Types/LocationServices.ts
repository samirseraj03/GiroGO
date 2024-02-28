import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { GeolocationPosition } from '@capacitor/geolocation';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  async checkLocationPermission() {
    try {
      // Solicitar permiso de ubicación
      const permissionResult = await Geolocation['requestPermissions']();
      
      if (permissionResult && permissionResult.location === 'granted') {
        // Permiso de ubicación otorgado, puedes realizar operaciones de geolocalización
        this.getCurrentPosition();
      } else {
        // Permiso de ubicación denegado
        console.log('El permiso de ubicación ha sido denegado');
      }
    } catch (error) {
      console.error('Error al solicitar permiso de ubicación:', error);
    }
  }
  
  async getCurrentPosition() {
    try {
      // Obtener la posición actual del dispositivo
      const position = await Geolocation['getCurrentPosition']();
      
      // Manejar la posición obtenida
      this.handlePosition(position);
    } catch (error) {
      console.error('Error al obtener la posición actual:', error);
    }
  }
  
  handlePosition(position: GeolocationPosition) {
    // Manejar la posición actual aquí
    console.log('Posición actual:', position);
  }
}