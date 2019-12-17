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
export class MizanService implements IService {
    mz: any;
    mzMain: any;

    constructor(public af: AngularFireDatabase,
        private httpService: HttpService, 
        private loadingService: LoadingService, 
        private toastCtrl: ToastService) { }

    getId = (): string => 'mizansection';

    getTitle = (): string => 'Mizan Section';

    getAllThemes = (): Array<any> => {
        return [];
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
        return {};
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
        return new Observable(observer => {
            that.loadingService.hide();
            observer.next(this.getDataForTheme(item));
            observer.complete();
        });
    }
    MzSubsecdownload(item: any, chNr: any, subchNr: any): Observable<any> {
        console.log('here is item informaiton in service', item, chNr, subchNr);
        this.mz = [];
        item.subchapters.forEach((element, i) =>{
            this.mz[i] = this.httpService.getJaag('/api/books/'+AppSettings.JAAG.mz+'?chapterNo='+chNr.toString()+'&subChapterNo='+subchNr.toString()+'&subChsecNo='+i.toString());
        });
        return Observable.forkJoin(this.mz);
    }
    Mzdownload(item: any, chNr: any): Observable<any> {
        let interm;
        this.mz = [];
        this.mzMain = this.httpService.getJaag('/api/books/'+AppSettings.JAAG.mz+'?chapterNo='+chNr.toString()); 
        if (item.subchapters.length > 0) {
            item.subchapters.forEach((element, i) =>{
              this.mz[i] = this.httpService.getJaag('/api/books/'+AppSettings.JAAG.mz+'?chapterNo='+chNr.toString()+'&subChapterNo='+i.toString());
            });
            interm = Observable.forkJoin(this.mz);
        } else {
            interm = [];
            interm[0] = '';
        }
        
        return Observable.forkJoin([this.mzMain, interm]);
    }
}
