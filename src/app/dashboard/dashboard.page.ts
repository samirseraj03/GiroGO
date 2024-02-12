import { Component, OnInit } from '@angular/core';
import * as atlas from 'azure-maps-control'; // Or the correct path if different





declare const Microsoft: any; // Declaración para permitir el acceso a la API de Microsoft Maps
//declare const atlas : any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements  OnInit {

  title = 'azure-maps-web-sdk-test'
  map : any



  constructor() { }

  ngOnInit(): void {
    this.map = new atlas.Map('myMap', {
      zoom : 11,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: 'qbTL3CFdHbknZkT8RdqkemI1AY3oIM21Uci4G02bLHU'
      }
    });
    
  }

  ngAfterViewInit() {
  //  this.loadMap();

    //this.getMap();
    // this.initializeMap(); // Llama a la función initializeMap() en ngOnInit()
  }




  GetMap() {

    try {
     this.map = new atlas.Map('map', {
      center: [-118.270293, 34.039737], // Coordenadas para centrar el mapa (Longitud, Latitud)
      zoom: 12, // Nivel de zoom inicial
      view: 'Auto',
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: 'qbTL3CFdHbknZkT8RdqkemI1AY3oIM21Uci4G02bLHU' // También puedes pasar la clave de API aquí
      }
    });
    console.log(this.map);

  }
  catch (error) {
    console.error('Error al cargar Azure Maps:', error);
  }

}


  getGeolocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log("Latitude: " + latitude);
            console.log("Longitude: " + longitude);
            resolve({ latitude, longitude });
          },
          error => {
            console.log("Error al obtener la ubicación: " + error.message);
            reject(error);
          }
        );
      } else {
        console.log("El navegador no soporta la geolocalización");
        reject("Geolocalización no soportada");
      }
    });
  }

  getRoute(): void {
    this.map = new Microsoft.Maps.Map('#map', {});

    // Definir las ubicaciones de origen y destino
    const origen = new Microsoft.Maps.Location(40.7128, -74.006); // Girona
    const destino = new Microsoft.Maps.Location(40.5475, -2.7722222); // aeropuerto de girona

    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
      const directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.map);
      const seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: origen });
      directionsManager.addWaypoint(seattleWaypoint);
      const workWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: destino });
      directionsManager.addWaypoint(workWaypoint);
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });
      directionsManager.calculateDirections();
    });
  }

  initializeMap(): void {




    const locations = [
      { "name": "Ubicación 1", "latitude": 40.7128, "longitude": -74.0060 },
      { "name": "Ubicación 2", "latitude": 34.0522, "longitude": -118.2437 },
      { "name": "Ubicación 3", "latitude": 51.5074, "longitude": -0.1278 }
    ];

    this.getGeolocation().then(({ latitude, longitude }) => {
      const map = new Microsoft.Maps.Map('#map');
      const currentLocation = new Microsoft.Maps.Location(latitude, longitude);
      map.setView({ center: currentLocation, zoom: 15 });
      const currentMarker = new Microsoft.Maps.Pushpin(currentLocation, { title: 'Ubicación Actual' });
      map.entities.push(currentMarker);
      for (const location of locations) {
        const markerLocation = new Microsoft.Maps.Location(location.latitude, location.longitude);
        const marker = new Microsoft.Maps.Pushpin(markerLocation, { title: location.name });
        map.entities.push(marker);
      }
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  geocodeQuery(query: string): void {
    let searchManager: any;
    if (!searchManager) {
      Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
        searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
        this.geocodeQuery(query);
      });
    } else {
      const searchRequest = {
        where: query,
        callback: (r: any) => {
          if (r && r.results && r.results.length > 0) {
            const pin = new Microsoft.Maps.Pushpin(r.results[0].location);
            this.map.entities.push(pin);
            this.map.setView({ bounds: r.results[0].bestView });
          };
        },
        errorCallback: (e: any) => {
          alert("No results found.");
        }
      };
      searchManager.geocode(searchRequest);
    };
   }
  }
