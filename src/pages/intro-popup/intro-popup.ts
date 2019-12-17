import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IntroPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro-popup',
  templateUrl: 'intro-popup.html',
})
export class IntroPopupPage {
  data: any;
  toggleItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('item'));
    this.data = navParams.get('item');
    this.toggleItem = [
      { id: 2, title: "English", titleB: "Urdu", isChecked: true}
    ];
  }
  onToggleEvent = (event: string, item: any): void => {
    if (item.isChecked){
      item.isChecked = false;
    } else {
      item.isChecked = true;
    }   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPopupPage');
  }
  onEvent(event: string) {
    this.navCtrl.pop();
  }
}
