import { IService } from './IService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings';

@Injectable()
export class MenuService implements IService {

  constructor(public af: AngularFireDatabase) {}

    getId = ():string => 'menu';

    getTitle = ():string => 'UIAppTemplate';

    getAllThemes = (): Array<any> => {
      return [
        {"title" : "Home", "theme"  : "HomePage",  "icon" : "ios-home-outline", "listView" : false, "component": "", "singlePage":true},
        {"title" : "Qur'an", "theme"  : "AlbayHomePage",  "icon" : "ios-easel-outline", "listView" : false, "component": "", "singlePage":true},
        {"title" : "Mizan", "theme"  : "MizanhomePage",  "icon" : "ios-book-outline", "listView" : false, "component": "", "singlePage":true},
        {"title" : "Other Books", "theme"  : "BooksPage",  "icon" : "ios-bonfire-outline", "id": 3, "listView" : false, "component": "", "singlePage":true},
        {"title" : "Videos", "theme"  : "VidhomePage",  "icon" : "ios-videocam-outline", "listView" : false, "component": "", "singlePage":true},
        {"title" : "Audios", "theme"  : "AudiohomePage",  "icon" : "ios-radio-outline", "listView" : false, "component": "", "singlePage":true},
        {"title" : "Other Authors", "theme"  : "BooksPage",  "icon" : "ios-albums-outline", "id": 4, "listView" : false, "component": "", "singlePage":true},
        {"title" : "Notifications", "theme"  : "NotifiMsgPage",  "icon" : "ios-megaphone-outline", "listView" : false, "component": "", "singlePage":true},
      ];
    };

    getDataForTheme = () => {
      return {
        "background": "assets/images/background/background.jpg",
        "image": "assets/images/logo/g_logo.png",
        "title": "This is offical App based on Javed Ahmad Ghamidi's work"
      };
    };

    getEventsForTheme = (menuItem: any): any => {
      return {};
    };

    prepareParams = (item: any) => {
      return {
        title: item.title,
        data: {},
        events: this.getEventsForTheme(item)
      };
    };

    load(item: any): Observable<any> {
      if (AppSettings.IS_FIREBASE_ENABLED) {
        return new Observable(observer => {
          this.af
            .object('menu')
            .valueChanges()
            .subscribe(snapshot => {
              observer.next(snapshot);
              observer.complete();
            }, err => {
              observer.error([]);
              observer.complete();
            });
        });
      } else {
        return new Observable(observer => {
          observer.next(this.getDataForTheme());
          observer.complete();
        });
      }
    }
}
