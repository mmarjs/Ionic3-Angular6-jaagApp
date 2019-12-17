import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IService } from '../../services/IService';
import { LoadingService } from '../../services/loading-service';
import { ListBookService } from '../../services/books';

@IonicPage()
@Component({
  selector: 'page-books',
  templateUrl: 'books.html',
  providers: [ListBookService, LoadingService]
})
export class BooksPage {
  page: any;
  service: IService;
  params: any = {};

  constructor(public navCtrl: NavController,
    public listbooksrv: ListBookService,
    private loadingService: LoadingService,
    public navParams: NavParams) {
      this.loadingService.show();
      // If we navigated to this page, we will have an item available as a nav param
      this.page = navParams.get('page');
      //this.service = navParams.get('service');
      this.service = this.listbooksrv;
  }

  ionViewWillEnter() {
    if (this.service) {
      this.params = this.service.prepareParams(this.page, this.navCtrl);
      this.params.data = this.service.load(this.page);
      this.loadingService.hide();
    } else {
      this.navCtrl.setRoot("HomePage");
    }	
    console.log('ionViewDidLoad BooksPage');
  }
}
