import { IService } from './IService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings'
import { ToastService } from './toast-service'
import { LoadingService } from './loading-service'


@Injectable()
export class SelectService implements IService {

    constructor(public af: AngularFireDatabase, private loadingService: LoadingService, private toastCtrl: ToastService) { }

    getId = (): string => 'select';

    getTitle = (): string => 'Select';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Single Select", "theme"  : "layout1"},
          {"title" : "Multi Select", "theme"  : "layout2"}
        ];
    };
    // Select - Basic dialog data
    getDataForTheme = (menuItem: any): any => {
        return {
            "title": "Select",
            "layout1": {
                "title": "City",
                "selectedItem": 12,
                "header": "Basic dialog",
                "items": [
                    {
                        "id": 12,
                        "title": "New York"
                    },
                    {
                        "id": 14,
                        "title": "Paris"
                    },
                    {
                        "id": 13,
                        "title": "Amsterdam"
                    },
                    {
                        "id": 15,
                        "title": "Gotham City"
                    }
                ]
            },

            // Select - One touch dialog
            "layout2": {
                "title": "Country",
                "header": "One touch dialog",
                "selectedItem": 22,
                "items": [
                    {
                        "id": 22,
                        "title": "USA"
                    },
                    {
                        "id": 24,
                        "title": "France"
                    },
                    {
                        "id": 23,
                        "title": "Netherland"
                    },
                    {
                        "id": 25,
                        "title": "Gothamland"
                    }
                ]
            },

            // Select - With Action sheet
            "layout3": {
                "title": "Address",
                "header": "With Action sheet",
                "selectedItem": 31,
                "items": [
                    {
                        "id": 31,
                        "title": "Choose address"
                    },
                    {
                        "id": 32,
                        "title": "222 Duffield Street"
                    },
                    {
                        "id": 34,
                        "title": "198 Clark Street"
                    },
                    {
                        "id": 33,
                        "title": "588 Kenmore Terrace"
                    }
                ]
            },

            // Select - Two option select
            "layout4": {
                "title": "Date",
                "header": "Two option select",
                "selectedItemMonth": 38,
                "selectedItemYear": 50,
                "itemsMonth": [
                    {
                        "id": 38,
                        "title": "January"
                    },
                    {
                        "id": 39,
                        "title": "February"
                    },
                    {
                        "id": 40,
                        "title": "March"
                    },
                    {
                        "id": 41,
                        "title": "April"
                    },
                    {
                        "id": 42,
                        "title": "May"
                    },
                    {
                        "id": 43,
                        "title": "June"
                    },
                    {
                        "id": 44,
                        "title": "July"
                    },
                    {
                        "id": 45,
                        "title": "August"
                    },
                    {
                        "id": 46,
                        "title": "September"
                    },
                    {
                        "id": 47,
                        "title": "October"
                    },
                    {
                        "id": 48,
                        "title": "November"
                    },
                    {
                        "id": 49,
                        "title": "December"
                    }
                ],
                "itemsYears": [
                    {
                        "id": 50,
                        "title": "2009"
                    },
                    {
                        "id": 51,
                        "title": "2010"
                    },
                    {
                        "id": 52,
                        "title": "2011"
                    },
                    {
                        "id": 53,
                        "title": "2012"
                    },
                    {
                        "id": 54,
                        "title": "2013"
                    },
                    {
                        "id": 55,
                        "title": "2014"
                    },
                    {
                        "id": 56,
                        "title": "2015"
                    },
                    {
                        "id": 57,
                        "title": "2016"
                    },
                    {
                        "id": 58,
                        "title": "2017"
                    }
                ]
            },

            // Muliti Select - One touch dialog
            "layout5": {
                "title": "Country",
                "header": "One touch dialog",
                "selectedItem": 22,
                "items": [
                    {
                        "id": 22,
                        "title": "USA"
                    },
                    {
                        "id": 24,
                        "title": "France"
                    },
                    {
                        "id": 23,
                        "title": "Netherland"
                    },
                    {
                        "id": 25,
                        "title": "Gothamland"
                    }
                ]
            },

            // Muliti Select -Two option selec
            "layout6": {
                "title": "Date",
                "header": "Two option select",
                "selectedItemMonth": 38,
                "selectedItemYear": 50,
                "itemsMonth": [
                    {
                        "id": 38,
                        "title": "January"
                    },
                    {
                        "id": 39,
                        "title": "February"
                    },
                    {
                        "id": 40,
                        "title": "March"
                    },
                    {
                        "id": 41,
                        "title": "April"
                    },
                    {
                        "id": 42,
                        "title": "May"
                    },
                    {
                        "id": 43,
                        "title": "June"
                    },
                    {
                        "id": 44,
                        "title": "July"
                    },
                    {
                        "id": 45,
                        "title": "August"
                    },
                    {
                        "id": 46,
                        "title": "September"
                    },
                    {
                        "id": 47,
                        "title": "October"
                    },
                    {
                        "id": 48,
                        "title": "November"
                    },
                    {
                        "id": 49,
                        "title": "December"
                    }
                ],
                "itemsYears": [
                    {
                        "id": 50,
                        "title": "2009"
                    },
                    {
                        "id": 51,
                        "title": "2010"
                    },
                    {
                        "id": 52,
                        "title": "2011"
                    },
                    {
                        "id": 53,
                        "title": "2012"
                    },
                    {
                        "id": 54,
                        "title": "2013"
                    },
                    {
                        "id": 55,
                        "title": "2014"
                    },
                    {
                        "id": 56,
                        "title": "2015"
                    },
                    {
                        "id": 57,
                        "title": "2016"
                    },
                    {
                        "id": 58,
                        "title": "2017"
                    }
                ]
            }
        };
    };

     getEventsForTheme = (menuItem: any): any => {
       var that = this;
        return {
            'onSelect': function(item: any) {
                  that.toastCtrl.presentToast(JSON.stringify(item));
            },
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
    };

    load(item: any): Observable<any> {
        var that = this;
        that.loadingService.show();
        if (AppSettings.IS_FIREBASE_ENABLED) {
            return new Observable(observer => {
                this.af
                    .object('select')
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
