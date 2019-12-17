 import { IService } from './IService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app-settings'
import { ToastService } from './toast-service'
import { LoadingService } from './loading-service'

@Injectable()
export class AlertService implements IService {

    constructor(public af: AngularFireDatabase, private loadingService: LoadingService, private toastCtrl: ToastService) { }

    getId = (): string => 'alert';

    getTitle = (): string => 'Alert';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Alert Info", "theme"  : "layout1"},
          {"title" : "Alert Warning", "theme"  : "layout2"},
          {"title" : "Alert Subscribe", "theme"  : "layout3"}
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
            onButton: function(item: any) {
                that.toastCtrl.presentToast(item.title);
            }
        };
    };

    getDataForLayout1 = (): any => {
        return {
          "items": [
              {
                "id": 1,
                "image": "assets/images/background/9.jpg",
                "title": "Romantic masters",
                "subtitle": "Speaking of romance, the bedroom in 2017 is all about romance. Bedroom design is..",
              },
              {
                "id": 2,
                "image": "assets/images/background/8.jpg",
                "title": "Moody moments",
                "subtitle": "f you’re seeking something extra special this year, start setting the mood at home",
              },
              {
                "id": 3,
                "image": "assets/images/background/7.jpg",
                "title": "Butterfly Amour",
                "subtitle": "Butterflies may be a symbol of femininity, but that no longer means they have to be relegated to a girl’s",
              },
              {
                "id": 4,
                "image": "assets/images/background/6.jpg",
                "title": "Photo Editor",
                "subtitle": "This free iPhone App boasts 120 million users and picked up Apple's App",
              },
              {
                "id": 4,
                "image": "assets/images/background/5.jpg",
                "title": "Staying at Hotel Post Bezaus",
                "subtitle": "Hotel Post Bezau has 58 rooms and suites with each room uniquely decorated",
              }
          ]
      };
    };

    getDataForLayout2 = (): any => {
        return {
          "items": [
              {
                  "id": 1,
                  "category": "Prisma Labs",
                  "image": "assets/images/background/4.jpg",
                  "title": "Prisma Photo Editor",
                  "iconLike": "thumbs-up",
                  "iconComment": "ios-chatbubbles",
                  "numberLike": "12",
                  "numberCommnet": "4",
              },
              {
                  "id": 2,
                  "category": "apple watch",
                  "image": "assets/images/background/3.jpg",
                  "title": "Built with your heart in mind",
                  "iconLike": "thumbs-up",
                  "iconComment": "ios-chatbubbles",
                  "numberLike": "12",
                  "numberCommnet": "4",
              },
              {
                  "id": 3,
                  "category": "interior design trends",
                  "image": "assets/images/background/2.jpg",
                  "title": "Work It Baby: 14 Interior Design",
                  "iconLike": "thumbs-up",
                  "iconComment": "ios-chatbubbles",
                  "numberLike": "12",
                  "numberCommnet": "4",
              }
          ]
      };
    };

    getDataForLayout3 = (): any => {
      return {
        "items": [
            {
                "id": 1,
                "image": "assets/images/background/0.jpg",
                "time": "MARCH 14, 2017",
                "title": "Liberate Your Creativity",
                "description": "FOur Graphic Designer templates empower you to design like never before. Liberate yourself",
                "iconLike": "thumbs-up",
                "iconComment": "ios-chatbubbles",
                "numberLike": "12",
                "numberCommnet": "4",
            },
            {
                "id": 2,
                "image": "assets/images/background/1.jpg",
                "time": "MARCH 14, 2017",
                "title": "Revolutionary Design",
                "description": "The innovative BeFunky Graphic Designer Toolset makes it simple to design however you want",
                "iconLike": "thumbs-up",
                "iconComment": "ios-chatbubbles",
                "numberLike": "12",
                "numberCommnet": "4",
            },
            {
                "id": 3,
                "image": "assets/images/background/9.jpg",
                "time": "MARCH 14, 2017",
                "title": "Freedom To Create",
                "description": "Our partnership with Pixabay provides the support you need to declare independence",
                "iconLike": "thumbs-up",
                "iconComment": "ios-chatbubbles",
                "numberLike": "12",
                "numberCommnet": "4",
            },
            {
                "id": 4,
                "image": "assets/images/background/7.jpg",
                "time": "MARCH 14, 2017",
                "title": "What Is Graphic Design?",
                "description": "Graphic design is the art of visual communication through the use of text, photos",
                "iconLike": "thumbs-up",
                "iconComment": "ios-chatbubbles",
                "numberLike": "12",
                "numberCommnet": "4",
            }
        ]
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
                    .object('alert/' + item.theme)
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
}
