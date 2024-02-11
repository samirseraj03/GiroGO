import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    // for rotuing to antoher page
    private navCtrl: NavController
  ) {

  }

  // // para ir al dashbord
  // navigateToPage() {
  //   console.log("hola , he entrado")
  //   this.navCtrl.navigateForward('DashbordPage');
  // }


}
