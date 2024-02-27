import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/tabs/dashboard', {replaceUrl: true})
      }
    })
   }

   get email() {
    return this.credentials.controls.email
   }

   get password() {
    return this.credentials.controls.password
   }

   async login() {
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss()

      if (data.error) {
        this.showAlert('Error en el login', data.error.message)
      }
    })
   }

   async showAlert(title:string, msg:string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })

    await alert.present()
   }

   async forgotPassword() {
    const alert = await this.alertController.create({
      header: "Recibir nueva contraseña",
      message: "Porfavor, escribe tu correo electrónico",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {text: "Cancelar", role: "cancel",
        },
        {
          text: "Resetear contraseña",
          handler: async(result) =>{
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.sendPwReset(result.email);
            await loading.dismiss();

            if(error) {
              this.showAlert("Fallo", error.message);
            }else {
              this.showAlert(
                "Exito!",
                "Por favor, revisa tu correo para más instrucciones!"
              );
            }
          },
        },
      ],
    });

    await alert.present();

   }

   async getMagicLink() {
    const alert = await this.alertController.create({
      header: "Obtener magic link",
      message: "Te enviaremos un link para que puedas hacer el login magicamente!",
      inputs: [
        {
          type: "email",
          name:"email",
        },
      ],
      buttons: [
        { text: "Cancelar", role: "cancel"},
        {
          text: "Obtener Magic Link",
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail( result.email)
            await loading.dismiss();

            if(error) {
              this.showAlert("Fallo", error.message);
            }else {
              this.showAlert(
                "Exito!",
                "Por favor, revisa tu correo para más instrucciones!"
              );
            }
          },
        },
      ],
    });

    await alert.present();

   }

}
