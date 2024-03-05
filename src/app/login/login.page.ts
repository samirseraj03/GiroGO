import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

// import { FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = ''

  // credentials = this.fb.nonNullable.group({
  //   email: ['', Validators.required],
  //   password: ['', Validators.required],
  // })

  constructor(private readonly supabase: SupabaseService) {}

  async handleLogin(event: any) {
    event.preventDefault()
    const loader = await this.supabase.createLoader()
    await loader.present()

    try{
      const {error} = await this.supabase.signIn(this.email)
      if (error) {
        throw error
      }

      await loader.dismiss()
      await this.supabase.createNotice('Revisa tu correo para confirmar el login!')
    } catch (error: any) {
      await loader.dismiss()
      await this.supabase.createNotice(error.error_description || error.message)
    }
  }

}
