import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, MenuController, ToastController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MizanService } from '../../services/mizan';
import { LoadingService } from '../../services/loading-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppSettings } from '../../services/app-settings';
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage({
  segment: 'mizanview/:chapNr',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-mizanview',
  templateUrl: 'mizanview.html',
  providers: [MizanService, LoadingService],
})
export class MizanviewPage {
  @ViewChild(Content) content: Content;
  backtotop: boolean;
  chName: any;
  chNo: any;
  lang: any;
  Pcontent: any;
  daylight: boolean = true;
  toggleItem: any;
  scrollLoc: any;
  bookmark: any;
  mainbkmark: any;
  elzm: any;

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    private socialSharing: SocialSharing,
    private storage: Storage,  
    private mzService: MizanService,
    private loadingService: LoadingService,
    public navParams: NavParams) {
      this.loadingService.show();
      this.menuCtrl.enable(false, 'mySideMenu');
      this.backtotop = true;
      this.lang = navParams.get('lang');
      this.chNo = navParams.get('chapNr');
      this.chName = navParams.get('componentName');
      this.mainbkmark = '';
      if (navParams.get('boookmarkloc')){
        this.bookmark = navParams.get('boookmarkloc');
      } else {
        this.storage.get('mizan').then((dat) => {
          var chapNr = dat.data.bookmark ? dat.data.bookmark.chapterNr : 0;
          var lang = dat.data.bookmark ? dat.data.bookmark.lang : '';
          if (this.chNo === chapNr && this.lang === lang){
            this.mainbkmark = dat.data.bookmark;
          }
        });
      }
      this.Pcontent = this.chName;
      this.toggleItem = [
        { id: 3, title: "Night / Day", isChecked: true}
      ];
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'mySideMenu');
  }
  ionViewDidEnter() {
    this.storage.get('mz'+this.chNo.toString()).then((dat) => {
      if (!dat) {
        this.mzService.Mzdownload(this.chName, this.chNo).subscribe(result => {
          let continterm = {content: {en: result[0].content.content.en.replace(/=(\d+)=/g, ''), ur:result[0].content.content.ur.replace(/=(\d+)=/g, '')}};
          continterm.content = {en: continterm.content.en.replace(/@(\d+):@(\d+)/g, ''), ur:continterm.content.ur.replace(/@(\d+):@(\d+)/g, '')};
          this.Pcontent.content = continterm;
          if (this.Pcontent.subchapters.length > 0) {
            this.Pcontent.subchapters.forEach((element, i) =>{
              let continterm = {content: {en: result[1][i].content.content.en.replace(/=(\d+)=/g, ''), ur:result[1][i].content.content.ur.replace(/=(\d+)=/g, '')}};
              continterm.content = {en: continterm.content.en.replace(/@(\d+):@(\d+)/g, ''), ur:continterm.content.ur.replace(/@(\d+):@(\d+)/g, '')};
              element.content = continterm;
              if(element.subchapters.length > 0) {
                this.mzService.MzSubsecdownload(element, this.chNo, i).subscribe(res => {
                  element.subchapters.forEach((el, d) => {
                    let continterm = {content: {en: res[d].content.content.en.replace(/=(\d+)=/g, ''), ur:res[d].content.content.ur.replace(/=(\d+)=/g, '')}};
                    continterm.content = {en: continterm.content.en.replace(/@(\d+):@(\d+)/g, ''), ur:continterm.content.ur.replace(/@(\d+):@(\d+)/g, '')};
                    el.content = continterm;
                    this.storage.set('mz'+this.chNo.toString(), {data: this.Pcontent});
                  });
                });
              }
            });
          }
          this.storage.set('mz'+this.chNo.toString(), {data: this.Pcontent});
          this.loadingService.hide();
        });
      } else {
        this.Pcontent = dat.data;
        if (this.bookmark) {
          this.scrollTobookmark();
        }
        if (this.mainbkmark){
          this.bookmark = this.mainbkmark.bookmarkloc;
        }
        this.loadingService.hide();
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MizanviewPage');
    this.subscribeToIonScroll();
  }
  setZoom(zoom: any) {
    this.elzm = zoom;
  }
  dayLight () {
    if (this.daylight){
      this.daylight = false;
    } else {
      this.daylight = true;
    }
  }
  setBookmark() {
    this.bookmark = this.scrollLoc;
    this.storage.get('mizan').then((dat) => {
      dat.data.bookmark = {chapterNr:  this.chNo, chapterName: this.chName, bookmarkloc: this.bookmark, lang: this.lang};
      this.storage.set('mizan', {data: dat.data});
    });
    let toast = this.toastCtrl.create({
      message: 'Your location is bookmarked',
      duration: 5000
    });
    toast.present();
  }
  subscribeToIonScroll() {
    if (this.content != null && this.content.ionScroll != null) {
      this.content.ionScroll.subscribe((d) => {
        this.scrollLoc = d.scrollTop;
      });
    }
  }
  scrollTobookmark() {
    this.content.scrollTo(0, this.bookmark, 2000);
  }
  scrollToAbove(){
    this.content.scrollToTop();
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent, {
      toggleItem: this.toggleItem,
      elzm: this.elzm ? this.elzm: ''
    });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(popoverData => {
      if (popoverData){
        this.toggleItem = popoverData.toggleItem;
        this.elzm = popoverData.elzm;
      }
    });
  }
  scrollToElement(elementId){
    let yOffset = document.getElementById(elementId).offsetTop;
    this.content.scrollTo(0, yOffset, 2000);
  }
  listShare() {
    var options = {
      message: this.chName.title[this.lang],
      subject: this.chName.title[this.lang],
      url: AppSettings.JAAG.srcurl + '/#!/mizan/' + AppSettings.JAAG.mz + '?chapterNo=' + this.chNo + '&lang=' +this.lang,
      chooserTitle: this.chName.title[this.lang]
    }
    this.socialSharing.shareWithOptions(options).then((succ) => {
      console.log("shareWithOptions: Success" + JSON.stringify(succ));
    }).catch((err) => {
      console.error("shareWithOptions: failed" + JSON.stringify(err));
    });
  }
}
