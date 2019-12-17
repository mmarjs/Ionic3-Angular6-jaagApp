import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SplashJaagPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash-jaag',
  templateUrl: 'splash-jaag.html',
})
export class SplashJaagPage {
  params: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params.data = {
      "duration": 10000,
      "backgroundImage": "assets/images/background/splash.jpg",
      "logo": "assets/images/logo/g_logo.png",
      "title": "This is offical Mobile app for Javed Ahmad Ghamidi"
    };
    this.params.events = {
      "onRedirect": function () {
        navCtrl.setRoot("HomePage");
      }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashJaagPage');
  }

}
