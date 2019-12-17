import { IService } from './IService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { HttpService } from './HttpService';
import { AppSettings } from './app-settings';
import { ToastService } from './toast-service';
import { LoadingService } from './loading-service';

@Injectable()
export class AlbayService implements IService {
    sura: any;

    constructor(public af: AngularFireDatabase,
        private httpService: HttpService, 
        private loadingService: LoadingService, 
        private toastCtrl: ToastService) { }

    getId = (): string => 'payment';

    getTitle = (): string => 'Payment';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Payment", "theme"  : "layout1"}
        ];
    };

    getDataForTheme = (menuItem: any): any => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    };

    getEventsForTheme = (menuItem: any): any => {
        var that = this;
        return {
            onPay: function(item: any) {
                that.toastCtrl.presentToast(JSON.stringify(item));
            }
        };
    };

    getDataForLayout1 = (): any => {
        return {
          "title":"Payment",
          "images": "assets/images/background/43.jpg",
          "cardNumber":"Card Number",
          "cardHolder": "Card Holder",
          "experienceDate": "Experience Date",
          "code": "CVC Code",
          "button": "Continue"
      };
    };

    prepareParams = (item: any) => {
        let result = {
            title: item.title,
            data: [],
            events: this.getEventsForTheme(item)
        };
        result[this.getShowItemId(item)] = true;
        return result;
    };

    getShowItemId = (item: any): string => {
        return this.getId() + item.theme.charAt(0).toUpperCase() + "" + item.theme.slice(1);
    }

    load(item: any): Observable<any> {
        var that = this;
        that.loadingService.show();
        if (AppSettings.IS_FIREBASE_ENABLED) {
            return new Observable(observer => {
                this.af
                    .object('payment/' + item.theme)
                    .valueChanges()
                    .subscribe(snapshot => {
                        that.loadingService.hide();
                        observer.next(snapshot);
                        observer.complete();
                    }, err => {
                        that.loadingService.hide();
                        observer.error([]);
                        observer.complete();
                    });
            });
        } else {
            return new Observable(observer => {
                that.loadingService.hide();
                observer.next(this.getDataForTheme(item));
                observer.complete();
            });
        }
    }

    Suradownload(item: any): Observable<any> {
        this.sura = [];
        item.forEach(element =>{
            this.sura[element.section] = this.httpService.getJaag('/api/albay/filter?chapter='+element.chapter.toString()+'&section='+element.section.toString());
        });
        return Observable.forkJoin(this.sura);
    }
}
