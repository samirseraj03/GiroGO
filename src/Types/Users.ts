import * as supabase from '@supabase/supabase-js';

class SupabaseService {
    private supabase: supabase.SupabaseClient;

    constructor(private supabaseUrl: string, private supabaseKey: string) {
        this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    }

    async getUsers() {
        const { data, error } = await this.supabase
            .from('users')
            .select('*');
        
        if (error)
            console.error('Error al obtener usuarios:', error);
        else
            console.log('Usuarios:', data);
    }

    async insertUser(newUser: { name: string; email: string }) {
        const { data, error } = await this.supabase
            .from('users')
            .insert([newUser]);

        if (error)
            console.error('Error al insertar usuario:', error);
        else
            console.log('Usuario insertado:', data);
    }
}

export default SupabaseService;
