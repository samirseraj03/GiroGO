import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { data } from 'azure-maps-control';


// importamos los interfaces :
export interface Location {
    id?: number;
    longitude: number;
    latitude: number;
  }
  
  export  interface User {
    name: string;
    email: string;
    password : string;
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

  export interface Travel {
    created_at : Date
    finalized_at : number
    driver_id : number
    user_id : number
    Total : number
    distance_km : number
    initial_lat : number
    initial_lon : number
    finalized_lat : number
    finalized_lon : number
    initial_address : string
    finalized_address : string
  }

  export interface Rating {
    travel_id : number
    driver_id : number
    user_id : number
    rating : number
    comments : string
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

    async  insertUser(newUser: User, location: Location): Promise<any> {
      try {
        // Insertamos la ubicación primero
        const { data: insertedLocation, error: locationError } = await this.supabase
            .from('locations')
            .insert(location)
            .select('*');
    
        if (locationError) {
            throw locationError;
        } else {
            // Acceder al ID del registro insertado en la ubicación
            // Asignamos la ID de la ubicación al nuevo usuario
              newUser.location_id = insertedLocation[0].id;
            // Insertamos el nuevo usuario
            const { data: insertedUser, error: userError } = await this.supabase
                .from('users')
                .insert(newUser)
                .select();
    
            if (userError) {
                throw userError;
            }
    
            console.log('User inserted:', insertedUser);
            return insertedUser[0].id
        }
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

      async InsertTravel( newTravel : Travel) : Promise<void>{
        try {
          // Insertamos el nuevo vehículo
          const { data: insertedTravel, error: travelerror } = await this.supabase
            .from('travels')
            .insert(newTravel);
      
          if (travelerror) {
            throw travelerror;
          }
      
          console.log('travel inserted:', insertedTravel);
        } catch (error) {
          console.error('Error inserting travel:', error);
        }
      }

      async InsertRating( newTravel : Travel) : Promise<void>{
        try {
          // Insertamos el nuevo vehículo
          const { data: InsertedRating, error: Ratingerror } = await this.supabase
            .from('travels')
            .insert(newTravel);
      
          if (Ratingerror) {
            throw Ratingerror;
          }
      
          console.log('Inserted Rating:', InsertedRating);
        } catch (error) {
          console.error('Error inserting rating:', error);
        }
      }


      async getUserWithEmail(user: User): Promise<void> {
        try {
            // Obtenemos el usuario según el objeto proporcionado
            const { data: fetchedUser, error: userError } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', user.email) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
                .single();
    
            if (userError) {
                throw userError;
            }
    
            console.log('User fetched:', fetchedUser);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    async getUser(id: any): Promise<any> {
      try {
          // Obtenemos el usuario según el objeto proporcionado
          const { data: fetchedUser, error: userError } = await this.supabase
              .from('users')
              .select('*')
              .eq('id', id) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
              .single();
  
          if (userError) {
              throw userError;
          }
          console.log('User fetched:', fetchedUser);
          return fetchedUser
      } catch (error) {
          console.error('Error fetching user:', error);
    }
  }

    async getTravel(id: any): Promise<void> {
      try {
          // Obtenemos el usuario según el objeto proporcionado
          const { data: fetchedUser, error: userError } = await this.supabase
              .from('travels')
              .select('*')
              .eq('id', id) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
              .single();
  
          if (userError) {
              throw userError;
          }
          console.log('travels fetched:', fetchedUser);
      } catch (error) {
          console.error('Error fetching user:', error);
    }
  }
    // obtener travels del usuario para mostrarlos en la seccion de travels
    async getTravels(user_id: any): Promise<void> {
      try {
          // Obtenemos el usuario según el objeto proporcionado
          const { data: fetchedUser, error: userError } = await this.supabase
              .from('travels')
              .select('*')
              .eq('user_id', user_id) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
              .single();
  
          if (userError) {
              throw userError;
          }
          console.log('travels fetched:', fetchedUser);
      } catch (error) {
          console.error('Error fetching user:', error);
    }
}


async getRating(id: any): Promise<void> {
  try {
      // Obtenemos el usuario según el objeto proporcionado
      const { data: fetchedUser, error: userError } = await this.supabase
          .from('ratings')
          .select('*')
          .eq('id', id) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
          .single();

      if (userError) {
          throw userError;
      }
      console.log('ratings fetched:', fetchedUser);
  } catch (error) {
      console.error('Error fetching user:', error);
}
}
// obtener travels del usuario para mostrarlos en la seccion de travels
async getRatings(user_id: any): Promise<void> {
  try {
      // Obtenemos el usuario según el objeto proporcionado
      const { data: fetchedUser, error: userError } = await this.supabase
          .from('ratings')
          .select('*')
          .eq('user_id', user_id) // Filtro por nombre, puedes cambiar el campo de filtro según tus necesidades
          .single();

      if (userError) {
          throw userError;
      }
      console.log('ratings fetched:', fetchedUser);
  } catch (error) {
      console.error('Error fetching user:', error);
}
}
  // juntamos las tablas de user y location para enviarlos a donde se deben desplegar
  async getUsersWithLocations(): Promise<void> {
    try {
        // Consulta para obtener usuarios con ubicaciones
        const { data: users, error: usersError } = await this.supabase
            .from('users')
            .select('*');

        if (usersError) {
            throw usersError;
        }

        // Consulta para obtener las ubicaciones de los usuarios
        const { data: locations, error: locationsError } = await this.supabase
            .from('locations')
            .select('*');

        if (locationsError) {
            throw locationsError;
        }

        // Combinar los resultados de las dos consultas
        const usersWithLocations = users.map(user => {
            const location = locations.find(loc => loc.id === user.location_id);
            return { ...user, location };
        });

        console.log('Users with locations:', usersWithLocations);
    } catch (error) {
        console.error('Error fetching users with locations:', error);
    }
}

  async UpdateUser(userIdToUpdate: any , updatedUserData: any){
    try {
    
      // Realizar la operación de actualización
      const { data: updatedUser, error: updateError } = await this.supabase
          .from('users')
          .update(updatedUserData)
          .match({ id: userIdToUpdate })
          .single();
      if (updateError) {
          throw updateError;
      }
  
      console.log('User updated:', updatedUser);
  } catch (error) {
      console.error('Error updating user:', error);
  }
}




}



