import { IService } from './IService';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings';
import { LoadingService } from './loading-service';

@Injectable()
export class SplashScreenService implements IService {

    constructor(private loadingService: LoadingService) { }

    getId = (): string => 'splashScreens';

    getTitle = (): string => 'Splash screens';

    getAllThemes = (): Array<any> => {
        return [
            { "title": "Animation Logo + Ken Burns", "theme": "layout1" },
            { "title": "Logo + fade in + Ken Burns", "theme": "layout2" },
            { "title": "Logo + Title + Ken Burns", "theme": "layout3" }
        ];
    };

    getDataForTheme = (menuItem: any): Array<any> => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    };

    // SPLASH-SCREEN - Animation Logo + Ken Burns data
    getDataForLayout1 = (): any => {
        return {
            "duration": 10000,
            "backgroundImage": "assets/images/background/17.jpg",
            "logo": "assets/images/logo/1.png",
            "title": ""
        };
    }

    // SPLASH-SCREEN - Logo + fade in + Ken Burns data
    getDataForLayout2 = (): any => {
        return {
            "duration": 10000,
            "backgroundImage": "assets/images/background/42.jpg",
            "logo": "assets/images/logo/1.png",
            "title": ""
        };
    };

    // SPLASH-SCREEN - Logo + Title + Ken Burns data
    getDataForLayout3 = (): any => {
        return {
            "duration": 10000,
            "backgroundImage": "assets/images/background/41.jpg",
            "logo": "assets/images/logo/1.png",
            "title": "Welcome to the moon"
        };
    };

    getEventsForTheme = (menuItem: any, navCtrl: NavController): any => {
        return {
            "onRedirect": function () {
                navCtrl.pop();
            }
        };
    };

    getShowItemId = (item: any): string => {
        return this.getId() + item.theme.charAt(0).toUpperCase() + "" + item.theme.slice(1);
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

    load(item: any): Observable<any> {
        var that = this;
        that.loadingService.show();
        return new Observable(observer => {
            that.loadingService.hide();
            observer.next(this.getDataForTheme(item));
            observer.complete();
        });
    }
}
