import { Component, Input, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { IonicPage, Content, ActionSheetController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'action-sheet-layout-2',
  templateUrl: 'action-sheet.html'
})
export class ActionSheetLayout2 implements OnChanges, AfterViewInit {
  @Input() data: any;
  @Input() events: any;
  @ViewChild(Content)
  content: Content;

  backtotop: boolean;
  active: boolean;
  multiur: boolean;
  headerImage: any = "";
  daylight: boolean = true;
  scrollLoc: any;
  bookmark: any;
  elzm: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private storage: Storage, 
    ) {
    this.backtotop = false;
    this.multiur = true;
  }

  scrollToAbove(){
    this.content.scrollToTop();
  }
  onEvent(event: string, item: any, e: any) {
    if (this.multiur){
      this.multiur = false;
    } else {
      this.multiur = true;
    }
    if (e) {
      e.stopPropagation();
    }
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  onStarClass(items: any, index: number, e: any) {
    for (var i = 0; i < items.length; i++) {
      items[i].isActive = i <= index;
    }
    this.onEvent("onRates", index, e);
  }

  ngAfterViewInit() {
    this.subscribeToIonScroll();
  }

  isClassActive() {
    return this.active;
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    if (changes.data && changes.data.currentValue) {
      this.headerImage = changes.data.currentValue.headerImage;
      this.storage.get(this.data._id).then((dat) => {
        if (dat) {
          if (dat.data.bookmark){
            this.bookmark = dat.data.bookmark.bookmarkloc;
            this.scrollTobookmark();
          }
        }
      });
    }
    this.subscribeToIonScroll();
  }
  setZoom(zoom: any) {
    this.elzm = zoom;
  }
  setBookmark() {
    this.bookmark = this.scrollLoc;
    this.storage.get(this.data._id).then((dat) => {
      dat.data.bookmark = {bookmarkloc: this.bookmark};
      this.storage.set(this.data._id, {data: dat.data});
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
        if (d.scrollTop > 200) {
          this.backtotop = true;
        }
        if (d.scrollTop < 200) {
          this.active = false;
          this.backtotop = false;
          return;
        }
        this.active = true;
      });
    }
  }
  scrollTobookmark() {
    this.content.scrollTo(0, this.bookmark, 2000);
  }
  dayLight () {
    if (this.daylight){
      this.daylight = false;
    } else {
      this.daylight = true;
    }
  }
  presentActionSheet(item, index) {
    var that = this;
    this.data.actionSheet.buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    if (this.data.multilang) {
      var checklang = this.multiur ? 'ur': 'en';
      if (checklang === 'ur') {
        this.data.actionSheet.cssClass = 'cnt-rtl cnt-ur';
      } else {
        this.data.actionSheet.cssClass = '';
      }
      this.data.items.forEach((element, i) => {
        this.data.actionSheet.buttons[i].text = element.title[checklang];
      });
    }
    this.data.actionSheet.buttons.forEach(element => {
      element["handler"] = function () {
        var elmnt = document.getElementById(element.text);
        if (elmnt){
          elmnt.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
        }
      }
    });
    const actionSheet = this.actionSheetCtrl.create(this.data.actionSheet);
    actionSheet.present();
  }
}
