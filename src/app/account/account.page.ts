import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { User } from 'src/Types/SupabaseService';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profile: User = {
    name: '',
    email: '',
    password: '', 
    user_type: {type: "user"},
    avatar_url: '', 
    location_id: 0,
    address: '',
    is_available: true,
  }

  email = ''
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getEmail()
    this.getProfile()
  }

  async getEmail() {
    this.email = await this.supabase.user.then((user) => user?.email || '')
  }

  async getProfile() {
    try {
      const { data: profile, error, status } = await this.supabase.profile
      // const profile = await this.supabase.user
      
      if(error && status !== 406) {
        throw error
      }
      if (profile !== null) {
        this.profile = profile
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  async updateProfile(avatar_url: string = '') {
    const loader = await this.supabase.createLoader()
    await loader.present()
    try {
      const {error} = await this.supabase.updateProfile({ ...this.profile, avatar_url })
      if (error) {
        throw error
      }
      await loader.dismiss()
      await this.supabase.createNotice('Perfil actualizado!')
    } catch (error: any) {
      await loader.dismiss()
      await this.supabase.createNotice(error.message)
    }
  }

  async signOut() {
    await this.supabase.signOut()
    this.router.navigate(['/'], { replaceUrl: true })
  }

}
