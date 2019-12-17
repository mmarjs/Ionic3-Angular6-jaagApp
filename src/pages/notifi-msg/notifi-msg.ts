import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-notifi-msg',
  templateUrl: 'notifi-msg.html',
})
export class NotifiMsgPage {
  @ViewChild(Content) content:Content;
  backtotop: boolean;

  notifiList: any;
  items: any;
  myDate: String = new Date().toISOString();

  constructor(public navCtrl: NavController, 
    private storage: Storage, 
    public navParams: NavParams) {
      this.notifiList = [];
      this.items = {vdurl: '5ca075fadf25cde54fbad568'};
      var notifinew = navParams.get('response');
      if (notifinew){
        let notifiD = {
          title: notifinew.heading, 
          content: notifinew.content, 
          adurl: notifinew.adurl ? notifinew.adurl : '', 
          vdurl: notifinew.vdurl ? notifinew.vdurl : '',
          date: this.myDate, 
          lang: notifinew.lang  ? notifinew.lang : 'en'
        };
        this.dataStoredlocally(notifiD);
      } else {
        this.dataStoredlocally('');
      }
  }
  clickTopage(page, url) {
    if (page === 'VidhomePage'){
      this.navCtrl.push('VidhomePage', {
        videoId: url
      });
    } else {
      this.navCtrl.push('AudiohomePage', {
        audioId: url
      });
    }
  }
  scrollToAbove(){
    this.content.scrollToTop();
  }
  dataStoredlocally (notifiD) {
    this.storage.get('notifi').then((dat) => {
      if (dat){
        if (notifiD !== '') {
          dat.data.push(notifiD);
          this.storage.set('notifi', {data: dat.data});
        }
        this.notifiList = dat.data;
      } else {
        if (notifiD !== '') {
          let firstnotifi = [];
          firstnotifi.push(notifiD);
          this.storage.set('notifi', {data: firstnotifi});
          this.notifiList.push(notifiD);
        }
      }
      //console.log('here is the full date: ' + JSON.stringify(this.notifiList));
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifiMsgPage');
  }

}
