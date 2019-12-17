import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'page-albay-home',
  templateUrl: 'albay-home.html',
  providers: [LoadingService],
})
export class AlbayHomePage {
  @ViewChild(Content) content:Content;
  backtotop: boolean;
  
  dataL: any;
  dataH: any;
  dataG: any;
  lastupdate: any;
  bookmark: boolean;

  constructor(public navCtrl: NavController,
    private storage: Storage, 
    private loadingService: LoadingService,
    public modalCtrl: ModalController,
    public navParams: NavParams) {
      this.loadingService.show();
      this.backtotop = true;
    }
  scrollToAbove(){
    this.content.scrollToTop();
  }
  onEvent(item: any, e: any) {
    let title = item.body;
    this.navCtrl.push('AlbaysuraPage', {
      componentName: item.chapter,
      itemInfo: {title: title},
      page: 'AlbaysuraPage'
    });
  };
  scrollTobookmark() {
    this.navCtrl.push('AlbaysuraPage', {
      componentName: this.dataH.bookmark.chapter,
      itemInfo: {title: this.dataH.bookmark.title, para: this.dataH.bookmark.para, boookmarkloc: this.dataH.bookmark.bookmarkloc},
    });
  };
  openPopup(item: any, e: any, sel: any) {
    console.log('here is item', item);
    if (sel === 'preface' ){
      item.title = { en: "Author's Forward"};
      item.content = {en: item.albTraEn, ur: item.albTraUr};
    } else if (sel === 'intro') {
      item.title = { en: "Preamble"};
      item.content = {en: item.albComEn, ur: item.albComUr};
    } else if (sel === 'gIntro') {
      item.title = { en: "Group Introduction"};
      item.content = {en: item.albComEn, ur: item.albComUr};
    } else if (sel === 'gTopic') {
      item.title = { en: "Group Topics"};
      item.content = {en: item.albTraEn, ur: item.albTraUr};
    } else if (sel === 'chIntro') {
      item.title = { en: "Sura Group Introduction"};
      item.content = {en: item.albComEn, ur: item.albComUr};
    }
    const profileModal = this.modalCtrl.create("IntroPopupPage", {item: item});
    profileModal.present();
  };
  ionViewWillEnter() {
    this.storage.get('lastupdate').then((dat) => {
      this.lastupdate = dat.albay;
    });
    this.storage.get('albayHed').then((dat) => {
      this.dataH = dat ? dat.data : [];
      this.bookmark = this.dataH.bookmark ? true: false;
    });
    this.storage.get('albayGroup').then((dat) => {
      this.dataG = dat ? dat.data : [];
    });
    this.storage.get('albayHList').then((dat) => {
      let newL = dat ? dat.data : [];
      newL.forEach(element => {
        element.notstored = true;
        this.storage.get('albayCh'+element.chapter.toString()+'_0').then((dat) => {
          if (dat) {
            element.notstored = false;
          }
        }); 
      });
      newL.splice(1, 0, '');
      newL.splice(3, 0, '');
      newL.splice(27, 0, '');
      newL.splice(37, 0, '');
      newL.splice(41, 0, '');
      newL.splice(55, 0, '');
      newL.splice(63, 0, '');
      let intrm = [];
      for(var i = 0; i < (newL.length / 2); i++){
        intrm.push([newL[i*2], newL[(i*2)+1]]);
      }
      this.dataL = intrm;
      this.loadingService.hide();
    });
  }
}
