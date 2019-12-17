import { IService } from './IService';
import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs';
import { ToastService } from './toast-service';
import { LoadingService } from './loading-service';

@Injectable()
export class ListBookService implements IService {
    bkslist: any;
    constructor(private loadingService: LoadingService,
        public storage: Storage,
        private file: File, 
        private toastCtrl: ToastService) {
        }

    getId = (): string => 'booksection';
    getTitle = (): string => 'Books Section';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Full image cards", "theme"  : "layout1"},
          {"title" : "Styled cards 2", "theme"  : "layout2"},
          {"title" : "Styled cards", "theme"  : "layout3"},
          {"title" : "Cards with slider", "theme"  : "layout4"}
        ];
    };

    // GOOGLE CARD - Full image cards data
    getDataForLayout1 = (): any => {
        return {};
    };

    getDataForLayout2 = (): any => {
        return {};
    };

    getDataForLayout3 = (): any => {
        this.bkslist.forEach((element, i) => {
            element.ur = element.title.en ? false: true;
            element._id = this.bkslist[i]._id;
            element.description = (this.bkslist[i].description.en ? this.bkslist[i].description.en : "") + (this.bkslist[i].description.ur ? this.bkslist[i].description.ur : "");
            element.title = (this.bkslist[i].title.en ? this.bkslist[i].title.en : "") + (this.bkslist[i].title.ur ? this.bkslist[i].title.ur: "");
            element.iconText = " Read";
            element.icon = "ios-arrow-dropright";
            element.notstored = true;
            element.bookmark = false;
            this.storage.get(element._id).then((dat) => {
                if (dat) {
                  element.notstored = false;
                  if (dat.data.bookmark){
                    element.bookmark = true;
                  }
                }
              });
            //this.file.readAsDataURL(this.file.dataDirectory, element.thumbnail).then(dataurl => {
            //    element.image = dataurl;
            //  },(error) =>{
            //    console.log('This is error : '+ error);
            //  });
        });
        let intdat = {
            "items": this.bkslist
        }
        return intdat;
    }

    getDataForLayout4 = (): any => {
        return {};
    };

    getDataForTheme = (menuItem: any): Array<any> => {
        return this[
            'getDataForLayout3'
        ]();
    };

    getEventsForTheme = (menuItem: any, nav: any): any => {
        var that = this;
        return {
            'onItemClick': function (item: any) {
                  that.toastCtrl.presentToast(item.title);
                  if (item){
                    nav.push('BooksviewpagePage', {
                        page: item
                      });
                }
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

    prepareParams = (item: any, nav: any) => {
        if (item.id == 3){
            this.storage.get('bksGhamidi').then((dat) => {
                this.bkslist = dat ? dat.data : [];
            });
        } else if (item.id == 6){
            this.storage.get('bksOthers').then((dat) => {
                this.bkslist = dat.data;
            });
        }
        let result = {
            title: item.title,
            data: [],
            events: this.getEventsForTheme(item, nav)
        };
        result[this.getShowItemId(item)] = true;
        return result;
    };

    getShowItemId = (item: any): string => {
        return this.getId();
    };

    load(item: any): Observable<any> {
        var that = this;
        //that.loadingService.show();
        return new Observable(observer => {
            //that.loadingService.hide();
            this.storage.get('lastupdate').then((dat) => {
                observer.next(this.getDataForTheme(item));
                observer.complete();
            });
        });
    }
}
