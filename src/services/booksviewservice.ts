import { IService } from './IService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { HttpService } from './HttpService';
import { ToastService } from './toast-service';
import { LoadingService } from './loading-service';

@Injectable()
export class BooksviewService implements IService {
    page: any;

    constructor(public storage: Storage,
        public httpService: HttpService,
        private file: File,
        private loadingService: LoadingService, 
        private toastCtrl: ToastService) { }

    getId = (): string => 'actionSheet';

    getTitle = (): string => 'Action Sheet';

    getAllThemes = (): Array<any> => {
        return [
            { "title": "Basic", "theme": "layout1" },
            { "title": "News", "theme": "layout2" },
            { "title": "With Text Header", "theme": "layout3" }
        ];
    };

    getDataForTheme = (menuItem: any): any => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    };

    // ACTION-SHEET - Basic data
    getDataForLayout1 = (): any => {
        return {}
    };

    // ACTION-SHEET - News data
    getDataForLayout2 = (): any => {       
        let interm = {
            "_id": "",
            "headerTitle": "News",
            "ur": true,
            "multilang": false,
            "headerImage": "assets/images/background/25.jpg",
            "title": "Infinit bridge made in China.",
            "subtitle": "by Victoria Kuijpers",
            //"category": "ENGINEERING",
            "avatar": "assets/images/avatar/20.jpg",
            "shareIcon": "more",
            "actionSheet": {
                "cssClass": "",
                "buttons": [
                    {
                        "text": "Mark as read",
                        "role": "destructive"
                    }
                ]
            },
            "items": [
                {
                    "id": 1,
                    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                }
            ]
        };
        if (this.page.tableOfContents) {
            this.page.tableOfContents.forEach((element, i) => {
                var titlechap = "";
                if (element.title.en) {
                    titlechap = element.title.en;
                    interm.ur = false;
                }
                if (element.title.ur) {
                    titlechap = titlechap + element.title.ur;
                    interm.actionSheet.cssClass = 'cnt-rtl cnt-ur';
                }
                if (element.title.en && element.title.ur) {
                    interm.multilang = true;
                    titlechap = element.title.ur;
                }
                if (interm.actionSheet.buttons[i]) {
                    interm.actionSheet.buttons[i].text = titlechap;
                } else {
                    interm.actionSheet.buttons.push({text: titlechap, role: ""});
                }
            });
        }
        
        interm.items = this.page.tableOfContents;
        interm._id = this.page._id;
        interm.headerTitle = (this.page.title.en ? this.page.title.en : "" ) + (this.page.title.ur ? this.page.title.ur : "" );
        interm.subtitle = 'by '+this.page.author.displayName;
        interm.title = (this.page.description.en ? this.page.description.en : "" ) + (this.page.description.ur ? this.page.description.ur : "" );
        //interm.headerImage = this.page.imgurl;
        interm.headerImage = "assets/images/core/other/bkshed.jpg";
        interm.avatar = this.page.author.image;
        return interm;
    };

    // ACTION-SHEET - With Text Header data
    getDataForLayout3 = (): any => {
        return {};
    }

    getEventsForTheme = (menuItem: any): any => {
      var that = this;
        return {
            'onItemClick': function (item: any) {
                  that.toastCtrl.presentToast(item.title);
            },
            'onItemClickActionSheet': function (item: any) {
                var elmnt = document.getElementById(item.button.text);
                elmnt.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                that.toastCtrl.presentToast(item.button.text);
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
    }
 
    load(item: any): Observable<any> {
        this.page = item;
        var that = this;
        //that.loadingService.show();
        return new Observable(observer => {
            //that.loadingService.hide();
            this.file.readAsDataURL(this.file.dataDirectory, this.page.thumbnail).then(dataurl => {
                this.page.imgurl = dataurl;
                observer.next(this.getDataForTheme(item));
                observer.complete();
              },(error) =>{
                console.log('This is error : '+ error);
                this.page.imgurl = "";
                observer.next(this.getDataForTheme(item));
                observer.complete();
              }); 
        });
    }
}
