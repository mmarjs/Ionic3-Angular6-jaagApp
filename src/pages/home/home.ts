import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { HomeService } from '../../services/home-service';
import { AppSettings } from '../../services/app-settings';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeService]
})
export class HomePage {
  page: any;
  data:any = {};
  params: any = {};

  constructor(public navCtrl: NavController, 
    public service:HomeService, 
    public modalCtrl: ModalController) {
    this.page = {title: "Styled cards", theme: "layout3"};
    
    this.params = this.service.prepareParams(this.page, navCtrl);
    this.params.data = this.service.load(this.page);
    if (AppSettings.SHOW_START_WIZARD) {
      this.presentProfileModal();
    }
  }

   presentProfileModal() {
    const profileModal = this.modalCtrl.create("IntroPage");
    profileModal.present();
  }

}
