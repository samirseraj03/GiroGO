import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { User } from 'src/Types/SupabaseService';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
   }

   get user() {
    return this.supabase.auth.getUser().then(({data}) => data?.user)
   }

   get session() {
    return this.supabase.auth.getSession().then(({ data }) => data?.session)
   }

   get profile() {
    return this.user
      .then((user) => user?.id)
      .then((id) => this.supabase.from('profiles').select(`name,email,password,user_type,location_id,address,is_available`).eq('id', id).single())
   }

   authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
   }

    signIn(email: string) {
    console.log(email)
    return  this.supabase.auth.signInWithOtp({email: email})
   }

   signOut() {
    return this.supabase.auth.signOut()
   }

   async updateProfile(profile: User) {
    const user = await this.user
    const update = {
      ...profile,
      id: user?.id,
      update_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
   }

   downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
   }

   uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
   }

   async createNotice(message:string) {
    const toast = await this.toastCtrl.create({message, duration: 5000})
    await toast.present()
   }

   createLoader() {
    return this.loadingCtrl.create()
   }
}
