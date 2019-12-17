import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ModalController, ToastController, AlertController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Storage } from '@ionic/storage';
import { MenuService } from '../services/menu-service';
import { AppSettings } from '../services/app-settings';
import { IService } from '../services/IService';
import { HttpService } from '../services/HttpService';
  
@Component({
  templateUrl: 'app.html',
  providers: [MenuService, Deeplinks, HttpService]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  //rootPage = "SplashJaagPage";
  myDate: String = new Date().toISOString();
  rootPage = "HomePage";
  pages: any;
  params:any;
  leftMenuTitle: string;

  constructor(public platform: Platform,
    private firebase: Firebase,
    public toastCtrl: ToastController,
    private deeplinks: Deeplinks,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController,
    private menuService: MenuService,
    private storage: Storage,
    public modalCtrl: ModalController) {
    this.initializeApp();
    this.statusBar.backgroundColorByHexString('#6cd4ca');
    this.pages = menuService.getAllThemes();
    this.leftMenuTitle = menuService.getTitle();
    this.menuService.load(null).subscribe( snapshot => {
        this.params = snapshot;
    });
    this.storage.get('inuse').then((val) => {
      if (!val) {
        this.presentProfileModal();
      }
    });
    if (AppSettings.SHOW_START_WIZARD) {
      this.presentProfileModal();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available. Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      localStorage.setItem("mailChimpLocal", "true");
      this.initializeFirebase();
      this.deeplinks.routeWithNavController(this.nav, {
          '/albay-home': 'AlbayHomePage',
          '/audiohome/:audioId': 'AudiohomePage'
        }).subscribe((match) => {
          console.log("44444444")
          console.log('Successfully routed: '+JSON.stringify(match));
          if (match.$link.fragment.indexOf('!/audio/') > -1){
            this.nav.push('AudiohomePage', {
              audioId: match.$link.fragment.replace('!/audio/','')
            });
          } else if (match.$link.fragment.indexOf('!/video/') > -1){
            this.nav.push('VidhomePage', {
              videoId: match.$link.fragment.replace('!/video/','')
            });
          } else if (match.$link.fragment.indexOf('!/quran?chapter=') > -1){
            var item;
            var query = match.$link.fragment.replace('!/quran?','');
            item = this.parseQuery(query);
            this.httpService.getJaag('/api/albay/filter?chapter='+item.chapter.toString()+'&section=0').subscribe(
              (data: any) => {
                this.nav.push('AlbaysuraPage', {
                  componentName: item.chapter,
                  itemInfo: {title: data.body, para: item.paragraph},
                });
              }, err => {
                alert(err.message);
              }, null);
          } else if (match.$link.fragment.indexOf('!/mizan/'+AppSettings.JAAG.mz+'?') > -1){
            var item;
            var query = match.$link.fragment.replace('!/mizan/'+AppSettings.JAAG.mz+'?','');
            item = this.parseQuery(query);
            var chapNumber = parseInt(item.chapterNo);
            this.storage.get('mizan').then((dat: any) => {
              this.nav.push('MizanviewPage', {
                componentName: dat.data.tableOfContents[chapNumber],
                lang: item.lang,
                chapNr: chapNumber
              });
            });
          } else {
            const urlModal = this.modalCtrl.create("IntroModalPage", { data: match.$link.url });
            urlModal.present();
          }
        }, (nomatch) => {
          console.log('Unmatched Route: '+JSON.stringify(nomatch));
        });
    });
  }
  parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }
  initializeFirebase() {
      //if(!this.platform.is("core")) {
        this.firebase.subscribe("all");
        this.platform.is('android') ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS();
      //}
    }
  initializeFirebaseAndroid() {
      this.firebase.getToken().then(token => {});
      this.firebase.onTokenRefresh().subscribe(token => {})
      this.subscribeToPushNotifications();
    }
  initializeFirebaseIOS() {
      this.firebase.grantPermission()
      .then(() => {
        this.firebase.getToken().then(token => {});
        this.firebase.onTokenRefresh().subscribe(token => {})
        this.subscribeToPushNotifications();
      })
      .catch((error) => {
        this.firebase.logError(error);
      });
    }
  subscribeToPushNotifications() {
      this.firebase.onNotificationOpen().subscribe((response) => {
        if(response.tap){
          let alert = this.alertCtrl.create({
            title: response.heading,
            message: response.content,
            cssClass: response.lang ? 'cnt-rtl cnt-ur': '',
            buttons: ['Ok']
          });
          alert.present();
          this.nav.push("NotifiMsgPage", {
            response: response
          });
        }else{
          let notifiD = {
            title: response.heading, 
            content: response.content, 
            adurl: response.adurl  ? response.adurl : '', 
            vdurl: response.vdurl  ? response.vdurl : '', 
            date: this.myDate, 
            lang: response.lang ? response.lang : 'en' 
          };
          this.storage.get('notifi').then((dat) => {
            if (dat){
              dat.data.push(notifiD);
              this.storage.set('notifi', {data: dat.data});
            } else {
              let firstnotifi = [];
              firstnotifi.push(notifiD);
              this.storage.set('notifi', {data: firstnotifi});
            }
          });
          let alert = this.alertCtrl.create({
            title: notifiD.title,
            message: notifiD.content,
            cssClass: response.lang ? 'cnt-rtl cnt-ur': '',
            buttons: ['Ok']
          });
          alert.present();
        }
      });
  }

  presentProfileModal() {
    const profileModal = this.modalCtrl.create("IntroPage", { data: '' }, { enableBackdropDismiss: false });
    profileModal.present();
  }

  openPage(page) {
    if (page.singlePage) {
      this.menu.open();
      this.nav.push(page.theme, {
        page: page
      });
    } else {
      this.nav.setRoot("ItemsPage", {
        componentName: page.theme
      });
    }
  }

  getPageForOpen(value: string): any {
    return null;
  }

  getServiceForPage(value: string): IService {
    return null;
  }
}
