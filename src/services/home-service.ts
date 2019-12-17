import { IService } from './IService';
import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { ToastService } from './toast-service'
import { LoadingService } from './loading-service'

@Injectable()
export class HomeService implements IService {
    lastupdatealbay: any;
    constructor(private loadingService: LoadingService,
        public storage: Storage, 
        private toastCtrl: ToastService) {
        }

    getId = (): string => 'homeCards';

    getTitle = (): string => 'Home Page';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Full image cards", "theme"  : "layout1"},
          {"title" : "Styled cards 2", "theme"  : "layout2"},
          {"title" : "Styled cards", "theme"  : "layout3"},
          {"title" : "Cards with slider", "theme"  : "layout4"}
        ];
    };

    getDataForLayout1 = (): any => {
        return {};
    };

    getDataForLayout2 = (): any => {
        return {};
    };

    // GOOGLE CARD - Styled cards data
    getDataForLayout3 = (): any => {
        return {
            "items": [
                {
                    "id": 1,
                    "category": "Albay Book",
                    "image": "assets/images/core/albay/albay.jpg",
                    "title": "Qur'an",
                    "subtitle": "Last Updated: " + this.lastupdatealbay,
                    "button": "Read more",
                    "page": "AlbayHomePage",
                },
                {
                    "id": 2,
                    "category": "Mizan",
                    "image": "assets/images/core/mizan/mz.jpg",
                    "title": "Mizan",
                    "subtitle": "Book",
                    "button": "Read More",
                    "page": "MizanhomePage",
                },
                {
                    "id": 3,
                    "category": "Books",
                    "image": "assets/images/core/other/jagbks.jpg",
                    "title": "Other Books",
                    "subtitle": "Books",
                    "button": "Read More",
                    "page": "BooksPage",
                },
                {
                    "id": 4,
                    "category": "Video Page",
                    "image": "assets/images/core/other/video.jpg",
                    "title": "Videos",
                    "subtitle": "Video Programs list",
                    "button": "VidhomePage",
                    "page": "VidhomePage",
                },
                {
                    "id": 5,
                    "category": "Audio",
                    "image": "assets/images/core/other/audio.jpg",
                    "title": "Audios",
                    "subtitle": "Programs Audio playbacks",
                    "button": "AudiohomePage",
                    "page": "AudiohomePage",
                },
                {
                    "id": 6,
                    "category": "Books",
                    "image": "assets/images/core/other/bks.jpg",
                    "title": "Other Authors",
                    "subtitle": "Books",
                    "button": "Read More",
                    "page": "BooksPage",
                }
            ]
        };
    }

    getDataForLayout4 = (): any => {
        return {};
    };

    getDataForTheme = (menuItem: any): Array<any> => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    };

    getEventsForTheme = (menuItem: any, navCtrl: NavController): any => {
        var that = this;
        return {
            'onItemClick': function (item: any) {
                that.toastCtrl.presentToast(item.title);
                if (item.page){
                    navCtrl.push(item.page, {
                        page: item
                      });
                }
            },
            'onNotifiClick': function (item: any) {
                navCtrl.push("NotifiMsgPage", {});
            },
            'onShare': function (item: any) {
                that.toastCtrl.presentToast(item.title);
            },
            'onRates': function (index: number) {
                  that.toastCtrl.presentToast("Rates " + (index + 1));
            },
            'onCheckBoxClick': function (item: any) {
                  that.toastCtrl.presentToast(item.title);
            },
            'onButtonClick': function (item: any) {
                  that.toastCtrl.presentToast("Refine");
            }
        };
    };

    prepareParams = (item: any, navCtrl: NavController) => {
        let result = {
            title: item.title,
            data: [],
            events: this.getEventsForTheme(item, navCtrl)
        };
        result[this.getShowItemId(item)] = true;
        return result;
    };

    getShowItemId = (item: any): string => {
        return this.getId() + item.theme.charAt(0).toUpperCase() + "" + item.theme.slice(1);
    };

    load(item: any): Observable<any> {
        var that = this;
        that.loadingService.show();
        return new Observable(observer => {
            that.loadingService.hide();
            this.storage.get('lastupdate').then((dat) => {
                if (dat) {
                    if (dat.albay){
                        this.lastupdatealbay = dat.albay;
                    }
                }
                observer.next(this.getDataForTheme(item));
                observer.complete();
            });
        });
    }
}