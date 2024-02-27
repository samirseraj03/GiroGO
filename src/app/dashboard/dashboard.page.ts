import { Component, OnInit, Type } from '@angular/core';
import * as atlas from 'azure-maps-control'; // Or the correct path if different
import SupabaseService from "../../Types/SupabaseService";
import { Location, User, UserType, cars, carType , Travel , Rating} from '../../Types/SupabaseService';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Route } from '@angular/router';

declare const Microsoft: any; // Declaración para permitir el acceso a la API de Microsoft Maps
//declare const atlas : any
const supabaseService = new SupabaseService;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit  {

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


  // para obtener los id del usuario para poder interctauar con el mapa
  ngOnInit(): void {
   this.user =  this.SupaBaseGet()
  }
  
    // primera funcion de supa base para desplegar los primeros usuarios y dejarlo como ejemplo
    async supabase() {
      try {
        var user: User = {
          name: 'samir',
          email: 'samirseraj03@gmail.com',
          password : 'aref1310',
          user_type: { type: 'both' }, // Asignando el tipo de usuario como 'user'
          address: '', // Dirección opcional
          is_available: true, // Disponibilidad opcional
      };
          // Ejemplo de ubicación
          var location: Location = {
              longitude: -74.0059,
              latitude: 40.7128,
          };

      
          // Insertar usuario y ubicación

          // obtenemos la id del user: 
          this.id_user = await supabaseService.insertUser(user, location);

          var car : cars = {
            user_id : this.id_user ,
            type: { type : 'car'},
            photo : "",
          }
          await supabaseService.insertCar(car)
      } catch (error) {
          console.error('Error in supabase function:', error);
      }
  }

  async SupaBaseGet(){
    let user = await supabaseService.getUser(1)
    this.id_user = user.id
    return user
  }

  // hacemos para que el usuario pueda encender el mapa y desplegar los conductores disponibles tambien 
  asyncUser(){

    if (this.is_available === false){
      this.is_available = true
      supabaseService.UpdateUser( this.id_user, {'is_available' : this.is_available})
    }
    else {
      this.is_available = false
      supabaseService.UpdateUser( this.id_user, {'is_available' : this.is_available})
    }
  }
 
  

  

 async ngAfterViewInit() {
  
    await this.getGeolocation()
    this.GetMap()
    await this.initializeMap()
  }

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
