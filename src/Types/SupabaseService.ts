import { createClient, SupabaseClient } from '@supabase/supabase-js';


// importamos los interfaces :
export interface Location {
    id?: number;
    longitude: number;
    latitude: number;
  }
  
  export  interface User {
    name: string;
    email: string;
    user_type: UserType;
    location_id?: number;
    address?: string;
    is_available?: boolean;
  }
  
  export  interface UserType {
    type: 'user' | 'driver' | 'both';
  }
  
  // Definimos las interfaces para los datos de vehículo
  export interface cars {
    user_id: number;
    type: carType;
    photo?: string;
  }
  
  export interface carType {
    type: 'car' | 'motorcycle';
  }
  



export default class SupabaseService {
    public supabase: SupabaseClient;

    private SUPABASE_URL= 'https://gkkbzksbxpaxhqvzswrp.supabase.co'
    private SUPABASE_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2J6a3NieHBheGhxdnpzd3JwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjg4NDA5NSwiZXhwIjoyMDIyNDYwMDk1fQ.7no588OrI-WpXuNXADKbp81_XFLC8G-J87b0TLzgVBg'

   
    constructor() {
        const supabaseUrl = this.SUPABASE_URL;
        const supabaseKey = this.SUPABASE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_KEY deben estar definidas en el archivo .env');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async  insertUser(newUser: User, location: Location): Promise<void> {
        try {
          // Insertamos la ubicación primero
          const { data: insertedLocation, error: locationError } = await this.supabase
            .from('locations')
            .insert(location)
            .single() as { data: Location | null, error: any };
      
          if (locationError) {
            throw locationError;
          }
          else {
             newUser.location_id = insertedLocation!.id;
          }     
          // Insertamos el nuevo usuario
          const { data: insertedUser, error: userError } = await this.supabase
            .from('users')
            .insert(newUser)
            .single();
      
          if (userError) {
            throw userError;
          }
      
          console.log('User inserted:', insertedUser);
        } catch (error) {
          console.error('Error inserting user:', error);
        }
      }
      
      // Función para insertar un nuevo vehículo en la base de datos
      async insertCar(newCar: cars): Promise<void> {
        try {
          // Insertamos el nuevo vehículo
          const { data: insertedVehicle, error: vehicleError } = await this.supabase
            .from('cars')
            .insert(newCar);
      
          if (vehicleError) {
            throw vehicleError;
          }
      
          console.log('Vehicle inserted:', insertedVehicle);
        } catch (error) {
          console.error('Error inserting vehicle:', error);
        }
}

}


