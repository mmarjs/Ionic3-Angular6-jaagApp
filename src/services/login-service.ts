import { IService } from './IService';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings'
import { ToastService } from './toast-service'
import { LoadingService } from './loading-service'

@Injectable()
export class LoginService implements IService {

    constructor(public af: AngularFireDatabase, private loadingService: LoadingService, private toastCtrl: ToastService) { }

    getId = (): string => 'login';

    getTitle = (): string => 'Login pages';

    getAllThemes = (): Array<any> => {
        return [
          {"title" : "Login + logo 1", "theme"  : "layout1"},
          {"title" : "Login + logo 2", "theme"  : "layout2"}
        ];
    };

    getDataForTheme = (menuItem: any): Array<any> => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    };

    // LOGIN - Login + logo 1 data
    getDataForLayout1 = (): any => {
      return {
        "segmentLogin"    : "Login",
        "segmentRegister" : "Register",
        "background"      : "assets/images/background/39.jpg",
        "skip"            : "Skip",
        "logo"            : "assets/images/logo/2.png",
          "login" : {

            "username"        : "Enter your username",
            "password"        : "Enter your password",
            "labelUsername"   : "USERNAME",
            "labelPassword"   : "PASSWORD",
            "forgotPassword"  : "Forgot password?",
            "facebookLogin"   : "Login with",
            "login"           : "Login",
            "title"           : "Login to your account",
            "errorUser"       : "Field can't be empty",
            "errorPassword"   : "Field can't be empty"
          },
          "register": {
            "title"               : "Register",
            "username"            : "Enter your username",
            "city"                : "Your home town",
            "country"             : "Where are you from?",
            "password"            : "Enter your password",
            "email"               : "Your e-mail address",
            "register"            : "register",
            "lableUsername"       : "USERNAME",
            "lablePassword"       : "PASSWORD",
            "lableEmail"          : "E-MAIL",
            "lableCountry"        : "COUNTRY",
            "lableCity"           : "CITY",
            "errorUser"           : "Field can't be empty",
            "errorPassword"       : "Field can't be empty",
            "errorEmail"          : "Invalid email address",
            "errorCountry"        : "Field can't be empty",
            "errorCity"           : "Field can't be empty"
          }
      };
    };

    // LOGIN - Login + logo 2 data
    getDataForLayout2 = (): any => {
      return {
        "background"     : "assets/images/background/39.jpg",
        "forgotPassword" : "Forgot password?",
        "labelUsername"   : "USERNAME",
        "labelPassword"   : "PASSWORD",
        "title"          : "Login to your account",
        "username"       : "Enter your username",
        "password"       : "Enter your password",
        "register"       : "Register",
        "login"          : "Log In",
        "logo"           : "assets/images/logo/2.png",
        "errorUser"       : "Field can't be empty",
        "errorPassword"   : "Field can't be empty"
      };
    };


    getEventsForTheme = (menuItem: any): any => {
      var that = this
        return {
            onLogin: function(params) {
                that.toastCtrl.presentToast('onLogin');
            },
            onForgot: function() {
                that.toastCtrl.presentToast('onForgot');
            },
            onRegister: function(params) {
                  that.toastCtrl.presentToast('onRegister');
            },
            onSkip: function(params) {
                  that.toastCtrl.presentToast('onSkip');
            },
            onFacebook: function(params) {
                that.toastCtrl.presentToast('onFacebook');
            },
            onTwitter: function(params) {
                  that.toastCtrl.presentToast('onTwitter');
            },
            onGoogle: function(params) {
                that.toastCtrl.presentToast('onGoogle');
            },
            onPinterest: function(params) {
                that.toastCtrl.presentToast('onPinterest');
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
        var that = this;
        that.loadingService.show();
        if (AppSettings.IS_FIREBASE_ENABLED) {
            return new Observable(observer => {
                this.af
                    .object('login/' + item.theme)
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
