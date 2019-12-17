import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'page-mizanhome',
  templateUrl: 'mizanhome.html',
  providers: [LoadingService],
})
export class MizanhomePage {
  @ViewChild(Content) content: Content;
  backtotop: boolean;
  mizan: any;
  lang: any;
  bookmark: boolean;

  constructor(public navCtrl: NavController, 
    private storage: Storage, 
    private loadingService: LoadingService,
    public navParams: NavParams) {
      this.loadingService.show();
      this.lang = 'ur'
  }
  onNavEvent(item: any, e: any) {
    this.navCtrl.push('MizanviewPage', {
      componentName: item,
      lang: this.lang,
      chapNr: e,
      page: 'MizanviewPage'
    });
  };
  scrollTobookmark() {
    this.navCtrl.push('MizanviewPage', {
      componentName: this.mizan.bookmark.chapterName,
      lang: this.mizan.bookmark.lang,
      chapNr: this.mizan.bookmark.chapterNr,
      boookmarkloc: this.mizan.bookmark.bookmarkloc,
      page: 'MizanviewPage'
    });
  };
  ionViewWillEnter() {
    this.storage.get('mizan').then((dat: any) => {
      let newL = dat ? dat.data : [];
      newL.tableOfContents.forEach((element, i) => {
        element.notstored = true;
        this.storage.get('mz'+i.toString()).then((dat) => {
          if (dat) {
            element.notstored = false;
          }
        }); 
      });
      this.mizan = newL;
      this.bookmark = this.mizan.bookmark ? true: false;
      this.loadingService.hide();
    });
  }
  scrollToAbove(){
    this.content.scrollToTop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MizanhomePage');
  }
  onEvent = (): void => {
    if (this.lang === 'ur'){
      this.lang = 'en';
    } else {
      this.lang = 'ur';
    }  
  }
}
