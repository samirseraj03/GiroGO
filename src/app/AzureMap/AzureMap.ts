import { Component, OnInit, Type } from '@angular/core';
import * as atlas from 'azure-maps-control'; // Or the correct path if different
import { Location, User, UserType, cars, carType , Travel , Rating} from '../../Types/SupabaseService';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Route } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';



declare const Microsoft: any; // Declaración para permitir el acceso a la API de Microsoft Maps




@Component({
    selector: 'app-dashboard',
    templateUrl: './AzureMap.page.html',
    styleUrls: ['./AzureMap.page.scss'],
    styles: [],
  })
  
  export class AzureMapPage  {
  
    constructor (
      private navCtrl: NavController,
      private router: ActivatedRoute,
  
      
      ) {}

      title = 'azure-maps-web-sdk-test'
      map : any
      latitude : any 
      longitude : any
      id_user : any
      is_available : boolean = false 
      user : any
    
    
    




      GetMap() {

        console.log(this.latitude);
        console.log(this.longitude);
    
        try {
         this.map = new atlas.Map('myMap', {
          center: new atlas.data.Position(this.longitude, this.latitude),
          zoom: 20, // Nivel de zoom inicial
          showLogo : false,
          showFeedback: false ,
          showFeedbackLink : false,
          showTileBoundaries : false,
          language : 'es-ES' ,
          showBuildingModels : true,
          style : 'night',
          authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: 'qbTL3CFdHbknZkT8RdqkemI1AY3oIM21Uci4G02bLHU' // También puedes pasar la clave de API aquí
          }
        
        });
    
        this.map.controls.add([
          new atlas.control.ZoomControl(),
          new atlas.control.CompassControl(),
          new atlas.control.PitchControl(),
          new atlas.control.StyleControl()
        ] , {
          position : atlas.ControlPosition.TopRight
        })
    
        
        this.map.events.add('ready' , () =>{
    
          var dataSoruce = new atlas.source.DataSource();
          this.map.sources.add(dataSoruce);
    
          var layer  = new atlas.layer.SymbolLayer(dataSoruce);
          this.map.layers.add(layer)
          dataSoruce.add(new atlas.data.Point([this.longitude, this.latitude]))
    
        })
        console.log(this.map);
    
      }
      catch (error) {
        console.error('Error al cargar Azure Maps:', error);
      }
    
    }






      getGeolocation(): Promise<{ latitude_2: number, longitude_2: number }> {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            let latitude_2
            let longitude_2
            navigator.geolocation.getCurrentPosition(
              position => {
                latitude_2 = position.coords.latitude
                longitude_2 = position.coords.longitude
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                console.log("Latitude: " + this.latitude);
                console.log("Longitude: " + this.longitude);
                resolve({ latitude_2, longitude_2 });
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
    
        this.getGeolocation().then(({ latitude_2, longitude_2 }) => {
          //const map = new Microsoft.Maps.Map('#mymap');
          const currentLocation = new atlas.data.Position(longitude_2, latitude_2);
          this.map.setCamera({ center: currentLocation, zoom: 25 });
          //const currentMarker = new Microsoft.Maps.Pushpin(currentLocation, { title: 'Ubicación Actual' });
          //map.entities.push(currentMarker);
          for (const location of locations) {
            this.map.events.add('ready' , () =>{
              var dataSoruce = new atlas.source.DataSource();
              this.map.sources.add(dataSoruce);
              var layer  = new atlas.layer.SymbolLayer(dataSoruce);
              this.map.layers.add(layer)
              dataSoruce.add(new atlas.data.Point([location.longitude, location.latitude  ]))
        
            })
          }
        }).catch(error => {
          console.error("Error:", error);
        });
      }


    }