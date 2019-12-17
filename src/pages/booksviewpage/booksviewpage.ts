import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpService } from '../../services/HttpService';
import { IService } from '../../services/IService';
import { BooksviewService } from '../../services/booksviewservice';
import { LoadingService } from '../../services/loading-service';


@IonicPage()
@Component({
  selector: 'page-booksviewpage',
  templateUrl: 'booksviewpage.html',
  providers: [BooksviewService, HttpService, LoadingService]
})
export class BooksviewpagePage {
  
  page: any;
  service: IService;
  params: any = {};

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public booksvservice: BooksviewService,
    public storage: Storage,
    public httpService: HttpService,
    private loadingService: LoadingService,
    public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.loadingService.show();
    this.menuCtrl.enable(false, 'mySideMenu');
    this.page = navParams.get('page');
    this.page.theme = "layout2";
    this.service = this.booksvservice;
    if (this.service) {
      this.params = this.service.prepareParams(this.page, this.navCtrl);
      this.params.data = this.service.load(this.page);
    } else {
      this.navCtrl.setRoot("HomePage");
    }
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'mySideMenu');
  }
  ionViewWillEnter() {
    this.storage.get(this.page._id).then((dat) => {
      if (!dat) {
        this.Bookdownload(this.page._id);
      } else {
        this.page = dat.data;
        this.feeddata();   
      }
    });
  }
  feeddata (){
    this.page.theme = "layout2";
    this.params.data = this.service.load(this.page);
  }
  Bookdownload(bookID) {
    this.httpService.getJaag('/api/books/'+bookID).subscribe(
      (data: any) => {
      data.author = this.page.author;
      data.notstored = false;
      data.tableOfContents.forEach((element, i) => {
        this.httpService.getJaag('/api/books/'+bookID+'?chapterNo='+i).subscribe(
          (dt: any) => {
            element.content = dt.content;
            if (i === (data.tableOfContents.length -1)) {
              this.storage.set(this.page._id, {data: data});
            }
          }, err => {
            alert(err.message);
        }, null);
      });
      this.page = data;
      this.feeddata();
    }, err => {
        alert(err.message);
    }, null);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BooksviewpagePage');
    this.loadingService.hide();
  }
}
