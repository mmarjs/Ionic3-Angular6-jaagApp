import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpService } from '../../services/HttpService';
import { ValidationService } from '../../services/validation';
import { MailChimpService } from '../../services/mail-chimp-service';

import { IService } from '../../services/IService';

import { AppSettings } from '../../services/app-settings';
import { SpinnerService } from '../../services/spinner-service';
import { SplashScreenService } from '../../services/splash-screen-service';
import { SearchBarService } from '../../services/search-bar-service';
import { LoginService } from '../../services/login-service';
import { ListViewService } from '../../services/list-view-service';
import { SelectService } from '../../services/select-service';
import { AlertService } from '../../services/alert-service';
import { AlbayService } from '../../services/albay-service';

@IonicPage()
@Component({
  templateUrl: 'items.html',
  providers: [
    MailChimpService, SpinnerService,
    SplashScreenService, LoginService, SearchBarService,
    ListViewService, HttpService, ValidationService, 
    SelectService, AlertService, AlbayService]
})

export class ItemsPage {
  title: string;
  componentName: string;
  pages: any;
  listServices: { [key: string]: IService; } = {};
  service: IService;

  // services: array
  constructor(public navCtrl: NavController,
    private spinnerService: SpinnerService,
    private searchBarService: SearchBarService,
    private listViewService: ListViewService,
    private loginService: LoginService,
    private splashScreenService: SplashScreenService,
    private httpService: HttpService,
    private validationService: ValidationService,
    private mailChimpService: MailChimpService,
    private selectService: SelectService,
    public alertCtrl: AlertController,
    private alertService: AlertService,
    private albayService: AlbayService,
    navParams: NavParams) {

    this.listServices = {
      'albay': this.albayService,
      'login': this.loginService,
      'spinner': this.spinnerService,
      'searchBars': this.searchBarService,
      'listViews': this.listViewService,
      'splashScreens': this.splashScreenService,
      'select': this.selectService,
      'alert': this.alertService
    };

    this.componentName = navParams.get('componentName');
    this.service = this.listServices[this.componentName];

    if (this.service) {
      this.pages = this.service.getAllThemes();
      this.title = this.service.getTitle();
    } else {
      navCtrl.setRoot("HomePage");
      return;
    }
  }

  selectPageForOpen(value: string): any {
    let page;

    switch (value) {
      case "albay":
        page = "AlbayHomePage";
        break;
      case "spinner":
        page = "ItemDetailsPageSpinner";
        break;
      case "splashScreens":
        page = "ItemDetailsPageSplashScreen";
        break;
      case "searchBars":
        page = "ItemDetailsPageSearchBar";
        break;
      case "login":
        page = "ItemDetailsPageLogin";
        break;
      case "select":
        page = "ItemDetailsPageSelect";
        break;
      case "alert":
        page = "ItemDetailsPageAlert";
        break;
      default:
        page = "ItemDetailsPage";
    }

    return page;
  }

  openPage(page: any) {

    if (AppSettings.SUBSCRIBE) {
      if (this.mailChimpService.showMailChimpForm()) {
        this.mailChimpService.setMailChimpForm(false);
        this.showPrompt();
      } else {
        this.navigation(page);
      }
    } else {
      this.navigation(page);
    }
  }

  navigation(page: any) {

    if (page.listView) {
      this.navCtrl.push(ItemsPage, {
        componentName: page.theme
      });
    } else {
      this.navCtrl.push(this.selectPageForOpen(this.componentName), {
        service: this.service,
        page: page
      });

    }
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'STAY TUNED FOR NEW <br> THEMES AND FREEBIES',
      message: "SUBSCRIBE TO <br> OUR NEWSLETTER",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your e-mail'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Send',
          handler: data => {
            if (data) {
              if (this.validationService.isMail(data.email)) {
                this.httpService.sendData(data.email).subscribe(
                  data => {
                    this.mailChimpService.hideMailChimp();
                  }, err => {
                    alert(err);
                  }, null);
              } else {
                return false;
              }
            } else {
              return false
            }
          }
        }
      ]
    });
    prompt.present();
  };
}
