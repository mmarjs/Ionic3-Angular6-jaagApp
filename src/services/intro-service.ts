import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app-settings';
import { LoadingService } from './loading-service';

@Injectable()
export class IntroService {

    constructor(public af: AngularFireDatabase, 
        private loadingService: LoadingService) {}

    // INTRO WIZARD
    getData = (): any => {
        return {
          "backgroundImage": "assets/images/background/background.jpg",
           "btnPrev": "Previous",
           "btnNext": "Next",
           "btnFinish": "Finish",
            "items": [
                {
                   "avatarImage": "assets/images/core/other/tile1.jpg",
                    "logo": "assets/images/core/other/slide-1.jpg",
                    "title": "Javed Ahmad Ghamidi",
                    "description": "Muslim theologian, Quran scholar, Islamic Modernist, exegete and educationist"
                },
                {
                   "avatarImage": "assets/images/core/other/tile2.jpg",
                    "logo": "assets/images/core/other/slide-2.jpg",
                    "title": "Al-Bayan . Mizan . Books . Videos . Audios",
                    "description": "Please update offline content on regular basis"
                },
                {
                   "avatarImage": "assets/images/core/other/tile3.jpg",
                    "logo": "assets/images/core/other/slide-3.jpg",
                    "title": "Unbiased Source of Learning",
                    "description": "Religion is the guidance which was first inspired bny the Almighty in human nature and after that it was given by Him with all essential details to mankind through His Prophets."
                }
            ]
        };
    }

    load(): Observable<any> {
        var that = this;
        that.loadingService.show();
        if (AppSettings.IS_FIREBASE_ENABLED) {
            return new Observable(observer => {
                this.af
                    .object('intro')
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
                observer.next(this.getData());
                observer.complete();
            });
        }
    };
}
