import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IntroModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro-modal',
  templateUrl: 'intro-modal.html',
})
export class IntroModalPage {
  urldata: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('data'));
    this.urldata = navParams.get('data');
  }
  onEvent(event: string) {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroModalPage');
  }
  openURL(urlString){
    let url = encodeURI(urlString);
    window.open(url, '_system', 'location=yes');
    this.navCtrl.pop();
  }
}
