import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpService } from '../../services/HttpService';
import { AppSettings } from '../../services/app-settings';
import { LoadingService } from '../../services/loading-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage({
  segment: 'videohome/:videoId',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-vidhome',
  templateUrl: 'vidhome.html',
  providers: [HttpService, LoadingService],
})
export class VidhomePage {
  videoId: string;
  categories: any;
  selectcat: any;
  selecthead: any;
  showList: boolean;
  vidList: any;
  vdPlayer: boolean;
  videocontent: any;
  fullVidData: any;
  searchText: any;
  thumbURL: any;

  constructor(public navCtrl: NavController, 
    private httpService: HttpService,
    public toastCtrl: ToastController,
    private socialSharing: SocialSharing,
    private loadingService: LoadingService,
    public navParams: NavParams) {
      this.loadingService.show();
      this.videoId = navParams.get('videoId');
      this.vdPlayer = false;
      this.thumbURL = AppSettings.JAAG.srcurl;
      this.httpService.getJaag('/api/videos/categories').subscribe(
        (data: any) => {
          data.forEach(element => {
            element.catindex = AppSettings.JAAG.Media.indexOf(element._id);
          });
          this.categories = data.sort(function (a, b) {
            return a.catindex - b.catindex;
          });
        }, err => {
            alert(err.message);
        }, null);
      this.vidList = [];
      this.showList = true; 
  }
  ionViewWillEnter() {
    this.httpService.getJaag('/api/videos?limit=10&sortBy=created&sortDir=desc').subscribe(
      (data: any) => {
        this.vidList = data.data;
        this.loadingService.hide();
        if (this.videoId !== '' && this.videoId){
          this.httpService.getJaag('/api/videos/'+this.videoId).subscribe(
            (data: any) => { 
              this.openVideo(data);
            }, err => {
                alert('Content is not accessible : '+err.message);
            }, null);  
        }
      }, err => {
          alert(err.message);
      }, null); 
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad VidhomePage');
  }
  openVideo = (vid: any): void => {
    this.videocontent = vid;
    this.vdPlayer = true;
    this.httpService.getJaag('/api/videos/'+ vid._id).subscribe(
      (data: any) => { 
        this.fullVidData = data;
      }, err => {
          alert('Content is not accessible : '+err.message);
      }, null); 
  }
  searchVideo() {
    this.loadingService.show();
    this.vdPlayer = false;
    this.vidList = [];
    this.showList = true;
    this.selecthead = " ";
    this.httpService.getJaag('/api/videos?q='+this.searchText+'&limit=500&sortBy=created').subscribe(
      (data: any) => {
        this.vidList = data.data;
        this.loadingService.hide();
        if (this.vidList.length < 1){
          let toast = this.toastCtrl.create({
            message: 'No content available for ... < '+ this.searchText+' >',
            duration: 5000
          });
          toast.present();
        }
      }, err => {
          alert(err.message);
      }, null);
  }
  getVid = (cat: string, subcat: string, sscat: string): void => {
    this.loadingService.show();
    this.vdPlayer = false;
    let catli = cat;
    if (subcat !== '') {
      catli = catli +'&sc='+subcat;
    }
    if (sscat !== '') {
      catli = catli + '&scc='+sscat;
    }
    if (cat === 'Quran' || cat === 'Mizan') {
      catli = catli + '&sortDir=asc';
    } else {
      catli = catli + '&sortDir=desc';
    }
    this.vidList = [];
    this.showList = true;
    this.httpService.getJaag('/api/videos?category='+catli+'&limit=500&sortBy=created').subscribe(
      (data: any) => {
        this.vidList = data.data;
        this.loadingService.hide();
      }, err => {
          alert(err.message);
      }, null);
  }
  pickCat = (cat: any): void => {
    this.loadingService.show();
    this.selecthead = cat._id;
    this.httpService.getJaag('/api/videos/categories?c='+cat._id).subscribe(
      (data: any) => {
        this.selectcat = data.sort(function (a, b) {
          return a._id.localeCompare( b._id );
        });
        this.vdPlayer = false;
        this.showList = false;
        this.loadingService.hide();
      }, err => {
          alert(err.message);
      }, null);
  }
  seriesBro (vidID) {
    if (vidID) {
      this.navCtrl.push('VidhomePage', {
        videoId: vidID
      });
    }
  }
  toggleGroup(group: any) {
    group.show = !group.show;
  }
  isGroupShown(group: any) {
    return group.show;
  }
  listShare(item) {
    var options = {
      message: item.title.en,
      subject: item.title.en + '  ' + item.title.ur,
      url: AppSettings.JAAG.srcurl + '/#!/video/' + item._id,
      image: AppSettings.JAAG.srcurl + '/m/thumb/video/' + item.embed.thumb,
      chooserTitle: item.title.en
    }
    this.socialSharing.shareWithOptions(options).then((succ) => {
      console.log("shareWithOptions: Success" + JSON.stringify(succ));
    }).catch((err) => {
      console.error("shareWithOptions: failed" + JSON.stringify(err));
    });
  }
}
