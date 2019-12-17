import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, MenuController, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpService } from '../../services/HttpService';
import { AlbayService } from '../../services/albay-service';
import { AppSettings } from '../../services/app-settings';
import { LoadingService } from '../../services/loading-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage({
  segment: 'albaysura/:componentName',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-albaysura',
  templateUrl: 'albaysura.html',
  providers: [HttpService, AlbayService, LoadingService],
})
export class AlbaysuraPage{
  @ViewChild(Content) content:Content;
  backtotop: boolean;

  componentName: any;
  itemInfo: any;
  intrm: any;
  para: any;
  paraTran: any;
  toggleItem: any;
  radItem: any;
  notstored: boolean;
  paraNextdata: any;
  paraPrevdata: any;
  paracurrdata: any;
  paraNext: boolean;
  paraPrev: boolean;
  paraPage: any;
  totalAya: any;
  ayanr: any;
  suraLoading: boolean;
  daylight: boolean = true;
  elzm: any;
  elzmAR: any;
  scrollLoc: any;
  bookmark: any;
  mainbkmark: any;
  thisTafseer: any;

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private storage: Storage, 
    private albayService: AlbayService,
    private httpService: HttpService,
    private socialSharing: SocialSharing,
    private loadingService: LoadingService, 
    public navParams: NavParams) {
    this.loadingService.show(); 
    this.menuCtrl.enable(false, 'mySideMenu');
    this.backtotop = true;
    this.paraNext = false;
    this.suraLoading = true;
    this.paraPrev = false;
    this.paraPage = 0;
    this.mainbkmark = '';
    this.componentName = navParams.get('componentName');
    this.itemInfo = navParams.get('itemInfo');
    if (this.itemInfo.boookmarkloc){
      this.bookmark = this.itemInfo.boookmarkloc;
    } else {
      this.storage.get('albayHed').then((dat) => {
        var chapNr = dat.data.bookmark ? dat.data.bookmark.chapter : 0;
        if (this.componentName === chapNr){
          this.mainbkmark = dat.data.bookmark;
        }
      });
    }
    this.radItem = {
      title : "Author",
      selectedItem: 1,
      items : [
        {id : 1, title: "Ghamidi"},
        {id : 2, title: "Islahi"},
        {id : 3, title: "Both"}
      ]
    };
    this.toggleItem = [
      { id: 0, title: "Arabic", isChecked: true },
      { id: 1, title: "Tafseer", isChecked: true },
      { id: 2, title: "EN / UR", isChecked: true},
      { id: 3, title: "Night / Day", isChecked: true}
    ];
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'mySideMenu');
  }
  activeItem(tafnr) {
    if (this.thisTafseer === tafnr){
      this.thisTafseer = undefined;
    } else {
      this.thisTafseer = tafnr;
    }    
  }
  ionViewDidEnter() {
    this.storage.get('albayCh'+this.componentName.toString()+'_0').then((dat) => {
      if (!dat) {
        this.notstored = true;
        this.httpService.getJaag('/api/albay/getparabychap?chapter='+this.componentName.toString()).subscribe(
          (data: any) => {
            this.storage.set('albayCh'+this.componentName.toString()+'_aya', {data: data});
            this.albayService.Suradownload(data).subscribe(result => {
              let despara = [];
              let b = 0;
              result.forEach((element, i) => {
                if (Math.trunc(element.albParagraph / 10) === b) {
                  if (element.albParagraph !== 0){
                    despara.push(element);
                  }
                } else {
                  this.storage.set('albayCh'+this.componentName.toString()+'_'+b.toString(), {data: despara});
                  if (b === 1){
                    this.paraNext = true;
                    this.paraNextdata = despara;
                  }
                  if (b === 0){
                    this.loadData(despara);
                    this.paracurrdata = despara;
                  }  
                  despara = [];
                  despara.push(element);
                }
                b = Math.trunc(element.albParagraph / 10);
                if (result.length === i+1) {
                  this.storage.set('albayCh'+this.componentName.toString()+'_'+b.toString(), {data: despara});
                  if (b === 0){ 
                    this.loadData(despara);
                  }
                }
              });
            }, err => {
              alert(err.message);
              this.loadingService.hide();
            }, null);
          }, err => {
              alert(err.message);
              this.loadingService.hide();
          }, null);
      } else {
        this.notstored = false;
        this.loadData(dat.data);
        this.paracurrdata = dat.data;
        this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage + 1).toString()).then((datnext) => {
          if (datnext) {
            this.paraNext = true;
            this.paraNextdata = (datnext.data);
          }
        });
      }
    });
    this.subscribeToIonScroll();
  }
  getprevPara() {
    this.loadingService.show();
    this.paraNextdata = this.paracurrdata;
    this.paracurrdata = this.paraPrevdata;
    this.paraNext = true;
    this.paraPage = this.paraPage - 1;
    this.loadData(this.paraPrevdata);
    this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage -1).toString()).then((dat) => {
      if (dat) {
        this.paraPrev = true;
        this.paraPrevdata = dat.data;
      } else {
        this.paraPrev = false;
      }
    });
  }
  getnextPara() {
    this.loadingService.show();
    this.paraPrevdata = this.paracurrdata;
    this.paracurrdata = this.paraNextdata;
    this.paraPrev = true;
    this.paraPage = this.paraPage + 1;
    this.loadData(this.paraNextdata);
    this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage + 1).toString()).then((dat) => {
      if (dat) {
        this.paraNext = true;
        this.paraNextdata = dat.data;
      } else {
        this.paraNext = false;
      }
    });
    this.content.scrollToTop();
  }
  searchAya() {
    this.storage.get('albayCh'+this.componentName.toString()+'_aya').then((dat) => {
      if (this.ayanr < 1 || this.ayanr > dat.data[dat.data.length-1].section) {
        alert('Aya Number must be between 1 and ' + dat.data[dat.data.length-1].section.toString());
      } else {
        let findaya = dat.data.findIndex(obj => obj.section === parseInt(this.ayanr));
        let b = Math.trunc(dat.data[findaya].albParagraph / 10);
        this.paraPage = b;
        this.storage.get('albayCh'+this.componentName.toString()+'_'+ b.toString()).then((pidat) => {
          if (dat) {
            this.loadData(pidat.data);
            this.paracurrdata = pidat.data;
            var ChDOM = setInterval(function(){
              var elmnt = document.getElementById('paranr_'+dat.data[findaya].albParagraph.toString());
              if (elmnt) {
                elmnt.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest'
                });
                clearInterval(ChDOM);
              }
            }, 1000);
          }
        });
        this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage -1).toString()).then((pidat) => {
          if (pidat) {
            this.paraPrev = true;
            this.paraPrevdata = pidat.data;
          } else {
            this.paraPrev = false;
          }
        });
        this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage + 1).toString()).then((pidat) => {
          if (pidat) {
            this.paraNext = true;
            this.paraNextdata = pidat.data;
          } else {
            this.paraNext = false;
          }
        });
      }
    });
  }
  searchPara() {
    this.storage.get('albayCh'+this.componentName.toString()+'_aya').then((dat) => {
      if (this.itemInfo.para < 1 || this.itemInfo.para > dat.data[dat.data.length-1].albParagraph) {
        alert('Paragraph Number must be between 1 and ' + dat.data[dat.data.length-1].albParagraph.toString());
        this.loadingService.hide();
      } else {
        let b = Math.trunc(this.itemInfo.para / 10);
        this.paraPage = b;
        if (this.paraPage === 0){
          if (this.itemInfo.boookmarkloc){
            this.scrollTobookmark();
            this.loadingService.hide();
          } else {
            var elmnt = document.getElementById('paranr_'+this.itemInfo.para.toString());
            if (elmnt) {
              setTimeout(() => {
                elmnt.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest'
                });
                this.loadingService.hide();
              }, 2000);
            }  
          }
        }else {
          this.storage.get('albayCh'+this.componentName.toString()+'_'+ b.toString()).then((pidat) => {
            if (dat) {
              this.suraLoading = false;
              this.loadData(pidat.data);
              this.paracurrdata = pidat.data;
              if (this.itemInfo.boookmarkloc){
                this.scrollTobookmark();
              } else {
                let par_nr = this.itemInfo.para.toString();
                var ChDOM = setInterval(function(){
                  var elmnt = document.getElementById('paranr_'+par_nr);
                  if (elmnt) {
                    elmnt.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                      inline: 'nearest'
                    });
                    clearInterval(ChDOM);
                  }
                }, 1000);
              }
            }
          });
          this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage -1).toString()).then((pidat) => {
            if (pidat) {
              this.paraPrev = true;
              this.paraPrevdata = pidat.data;
            } else {
              this.paraPrev = false;
            }
          });
          this.storage.get('albayCh'+this.componentName.toString()+'_'+ (this.paraPage + 1).toString()).then((pidat) => {
            if (pidat) {
              this.paraNext = true;
              this.paraNextdata = pidat.data;
            } else {
              this.paraNext = false;
            }
          });
        }
      }
    });
  }
  ngAfterViewInit() {
    /*this.content.ionScroll.subscribe((event)=>{
      if (event.scrollTop > 200) {
        this.backtotop = true;
      } else {
        this.backtotop = false;
      }
    });*/
  }
  scrollToAbove(){
    this.content.scrollToTop();
  }
  loadingFinished() {
    if ((typeof this.itemInfo.para !== 'undefined') && this.suraLoading){
      this.searchPara();
    } else {
      this.loadingService.hide();
    }
  }
  loadData(sura: any) {
    this.para = [];
    this.paraTran = [];
    sura.forEach(element => {
      if (element.albComEn) {
        element.albComEn = this.createFN(element.albComEn, 'jb');
      }
      if (element.albComUr ) {
        element.albComUr = this.createFN(element.albComUr, 'jb');
      }
      if (element.tadComEn){
        element.tadComEn = element.tadComEn.replace(/=(\d+)=/g, '');
      }
      if (element.tadComUr){
        element.tadComUr = element.tadComUr.replace(/=(\d+)=/g, '');
      }
      if (!this.para[element.albParagraph]){
        this.para[element.albParagraph] = [];
        this.paraTran[element.albParagraph] = { albTraEn: "", albTraUr: "", tadTraEn: "", tadTraUr: "", ayatNr: ""};
      }
      this.para[element.albParagraph].push(element);
      if (element.albTraEn){
        this.paraTran[element.albParagraph].albTraEn += this.createFN(element.albTraEn, 'fn');
      }
      if (element.albTraUr){
        this.paraTran[element.albParagraph].albTraUr += this.createFN(element.albTraUr, 'fn');
      }
      if (element.tadTraEn){
        this.paraTran[element.albParagraph].tadTraEn += element.tadTraEn.replace(/=(\d+)=/g, '');
      }
      if (element.tadTraUr){
        this.paraTran[element.albParagraph].tadTraUr += element.tadTraUr.replace(/=(\d+)=/g, '');
      }
      this.paraTran[element.albParagraph].ayatNr += element.section + ', ';
    });
    this.loadingFinished();
    if (this.mainbkmark !== ''){  
      let b = Math.trunc(this.mainbkmark.para / 10);
      if (b === this.paraPage){
        this.bookmark = this.mainbkmark.bookmarkloc;
      } else {
        this.bookmark = undefined;
      }
    }
  }
  createFN(contT: any, b: any){
    let rcount = contT;
    var regExp_fn = /=(\d+)=/g;
    var matches_fn, i, str;
    matches_fn = contT.match(regExp_fn);
    if (matches_fn){
      for (i = 0; i < matches_fn.length; i++) {
        str = matches_fn[i].replace(/=/g,'');
        if (b === 'fn'){
          rcount = rcount.replace(matches_fn[i],'<a><sup id="'+b+'_'+str+'">['+str+']</sup></a>');
        } else {
          rcount = rcount.replace(matches_fn[i],'<a><i id="'+b+'_'+str+'" class="icon ion-ios-arrow-dropup-circle"></i></a>');
        }
      }
    }
    return rcount;
  }
  setBookmark() {
    this.bookmark = this.scrollLoc;
    this.storage.get('albayHed').then((dat) => {
      let paranumber;
      if (this.paraPage === 0){
        paranumber = 1;
      }else {
        paranumber = this.paraPage * 10;
      }
      dat.data.bookmark = {para: paranumber, chapter:  this.componentName, title: this.itemInfo.title, bookmarkloc: this.bookmark};
      this.storage.set('albayHed', {data: dat.data});
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
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent, {
      toggleItem: this.toggleItem,
      radItem: this.radItem,
      elzm: this.elzm ? this.elzm: '',
      elzmAR: this.elzmAR ? this.elzmAR: ''
    });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(popoverData => {
      if (popoverData){
        this.toggleItem = popoverData.toggleItem;
        this.radItem = popoverData.radItem;
        this.elzm = popoverData.elzm;
        this.elzmAR = popoverData.elzmAR;
      }
    });
  }
  scrollToElement(event){
    let idAttr = event.target.attributes.id  || '';
    let value = idAttr.nodeValue || '';
    if (value.indexOf('fn') > -1) {
      value = value.replace('fn', 'jb');
      var elmnt = document.getElementById(value);
      elmnt.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else if (value.indexOf('jb') > -1) {
      value = value.replace('jb', 'fn');
      var elmnt = document.getElementById(value);
      elmnt.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }
  listShare(para) {
    var options = {
      message: this.itemInfo.title.en + ' - ' + this.itemInfo.title.ur,
      subject: this.itemInfo.title.en + ' - ' + this.itemInfo.title.ur,
      url: AppSettings.JAAG.srcurl + '/#!/quran?chapter=' + this.componentName.toString() + '&paragraph=' + para + '&type=Ghamidi',
      chooserTitle: this.itemInfo.title.en + ' - ' + this.itemInfo.title.ur
    }
    this.socialSharing.shareWithOptions(options).then((succ) => {
      console.log("shareWithOptions: Success" + JSON.stringify(succ));
    }).catch((err) => {
      console.error("shareWithOptions: failed" + JSON.stringify(err));
    });
  }
}
