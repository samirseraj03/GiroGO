import { Component, OnInit  } from '@angular/core';
import SupabaseService from "../../Types/SupabaseService";
import { Location, User, UserType, cars, carType , Travel , Rating} from '../../Types/SupabaseService';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';



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
  latitude : any 
  longitude : any
  id_user : any
  is_available : boolean = false 
  user : any
  map : any
  markers : any = []





  // para obtener los id del usuario para poder interctauar con el mapa
  async ngOnInit() {
    (mapboxgl as any).accessToken = environment.accessToken;
    await this.getGeolocation()
    this.user =  this.SupaBaseGet()
    this.getMapBox();
  }
  

  // inicilizamos el mapa
  getMapBox() {
    // desplegar el map
     this.map = new mapboxgl.Map({
        container: 'Mapa-de-box',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [this.longitude, this.latitude],
        zoom: 15.15,
    });

    // añadir el marcador del usuario 
    const marker = new mapboxgl.Marker()
      .setLngLat([this.longitude, this.latitude])
      .addTo(this.map);

      // añadimos el buscador 
      this.map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
        );

      // añadimos el popup del usuario para mostrar su informacion actual.
      this.map.on('click', () => {
        const popup = new mapboxgl.Popup({ offset: [0, 0] , className : 'stylepopup' , closeOnClick : true  ,  maxWidth : '300px'})
        .setLngLat([this.longitude , this.latitude])
        .setHTML(
        `<h3 class="stylepopup text text-dark" >hola</h3><p class="stylepopup text text-dark" >hola</p><button class="stylepopup"> eligir </button>`
         )
        .addTo(this.map);
      })


   

    


  }


  initializeMap(): void {

    this.map.flyTo({
      center: [this.longitude, this.latitude], // Establece las coordenadas a las que quieres que la cámara se mueva
      zoom: 13, // Opcional: Establece el nivel de zoom
      pitch: 60, // Opcional: Establece el ángulo de inclinación de la cámara
      bearing: -20 // Opcional: Establece la rotación de la cámara
    });

    const locations = [
      { "name": "Ubicación 1", "latitude": 40.7128, "longitude": -74.0060 },
      { "name": "Ubicación 2", "latitude": 34.0522, "longitude": -118.2437 },
      { "name": "Ubicación 3", "latitude": 51.5074, "longitude": -0.1278 }
    ];

    for (const location of locations) {
      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(this.map);

      // Almacena la referencia del marcador en el arreglo
      this.markers.push(marker);
    }
  }







  // hacemos para que el usuario pueda encender el mapa y desplegar los conductores disponibles tambien 
  asyncUser(){

    this.markers.forEach((marker: { remove: () => any; }) => marker.remove());
    this.markers = []; // Limpia el arreglo después de eliminar los marcadores


    if (this.is_available === false){
      this.is_available = true
      supabaseService.UpdateUser( this.id_user, {'is_available' : this.is_available})
    }
    else {
      this.is_available = false
      supabaseService.UpdateUser( this.id_user, {'is_available' : this.is_available})
    }
  }
 

  // para obtener nuestra localizacion acutal
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


    // obtener el usuario
    async SupaBaseGet(){
      let user = await supabaseService.getUser(1)
      this.id_user = user.id
      return user
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
                longitude: this.longitude,
                latitude: this.latitude,
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
 
  }
