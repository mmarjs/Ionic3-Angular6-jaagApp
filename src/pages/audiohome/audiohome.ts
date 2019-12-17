import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Media, MediaObject } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HttpService } from '../../services/HttpService';
import { AppSettings } from '../../services/app-settings';
import { LoadingService } from '../../services/loading-service';

@IonicPage({
  segment: 'audiohome/:audioId',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-audiohome',
  templateUrl: 'audiohome.html',
  providers: [HttpService, MusicControls, LoadingService],
})
export class AudiohomePage {
  private fileTransfer: FileTransferObject; 
  private pfile: MediaObject;
  audioId: string;
  aRfile: any;
  aLfile: any;
  data: any;
  categories: any;
  selectcat: any;
  selecthead: any;
  showList: boolean;
  vidList: any;
  aFile: any;
  apause: any;
  selectedAdio: any;
  adPlayer: boolean;
  downlo: boolean;
  adstored: boolean;
  searchText: any;
  thumbURL: any;

  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    private storage: Storage,
    private media: Media,
    private musicControls: MusicControls,
    private socialSharing: SocialSharing,
    private httpService: HttpService,
    private loadingService: LoadingService,
    private file: File,
    private transfer: FileTransfer,
    public navParams: NavParams) {
      this.loadingService.show(); 
      this.audioId = navParams.get('audioId');
      this.adPlayer = false;
      this.downlo = false;
      this.adstored = true;
      this.apause = true;
      this.thumbURL = AppSettings.JAAG.srcurl;
      this.musicControls.destroy(); // it's the same with or without the destroy 
      this.storage.get('audiostore').then((dat) => {
        if(!dat) {
          this.adstored = false;
        } else if(dat.data.length === 0) {
          this.adstored = false;
        }
      });
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
        data.data.forEach(element => {
          element.stored = false;
          if(element.embed.afile) {
            let filename = element.embed.afile.substring(element.embed.afile.lastIndexOf("/")).replace('/', '');
            this.file.checkFile(this.file.dataDirectory, filename).then(fcheck => {
              element.stored = fcheck;
            },(error) =>{
              console.log('This is error : '+ JSON.stringify(error));
            });
          }
        });
        this.vidList = data.data; 
        if (this.audioId !== '' && this.audioId){
          this.httpService.getJaag('/api/videos/'+this.audioId).subscribe(
            (data: any) => { 
              this.openAudio(data);
              this.loadingService.hide();
            }, err => {
                alert('Content is not accessible : '+err.message);
            }, null);  
        } else {
          this.loadingService.hide();
        }       
      }, err => {
          alert(err.message);
      }, null);
  }
  ionViewWillLeave() {
    console.log('ionViewWillLeave AudiohomePage');
    if (this.pfile){
      this.pfile.stop();
    }
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.adPlayer = false;
  }
  openAudio = (adio: any): void => {
    this.closeAdplay();
    setTimeout(() => {
      this.aLfile = '';
      this.aRfile = '';
      this.selectedAdio = adio;
      this.apause = true;
      this.aFile = adio.embed.afile;
      this.data = {
        "title": {en: adio.title.en, ur: adio.title.ur},
        "author": adio.author,
        "categories": adio.categories,
        "embed": adio.embed,
        "iconPause": "pause",
        "iconPlay": "play",
        "min": "0",
        "max": adio.lnth,
        "value": 0
      }
      if (adio.stored){
        this.aLfile = this.file.dataDirectory + this.aFile.substring(this.aFile.lastIndexOf("/")).replace('/', '');
        this.pfile = this.media.create(this.aLfile.replace(/^file:\/\//, ''));
        let self = this;
        setInterval(function () {
          self.pfile.getCurrentPosition().then((position) => {
            if (!self.apause) {
              self.data.value = Math.round(position);
            }
          });
          }, 500);
        this.musicControls.create({
          track       : this.data.title.en +  ' / ' + this.data.title.ur,        // optional, default : ''
          artist      : this.data.author.displayName,                       // optional, default : ''
          cover       : AppSettings.JAAG.srcmediaurl + '/m/thumb/video/' + this.data.embed.thumb,      // optional, default : nothing
          isPlaying   : true,                         // optional, default : true
          //dismissable : true,                         // optional, default : false
          hasPrev   : false,      // show previous button, optional, default: true
          hasNext   : false,      // show next button, optional, default: true
        // iOS only, optional
          album       : this.data.categories[0] + ' / ' + this.data.categories[1] ? this.data.categories[1] : '',     // optional, default: ''
          duration : this.data.max, // optional, default: 0
          elapsed : this.data.value, // optional, default: 0
          hasSkipForward : false,  // show skip forward button, optional, default: false
          hasSkipBackward : false, // show skip backward button, optional, default: false
          // Android
          ticker    : this.data.title.en +  ' / ' + this.data.title.ur,
          playIcon: 'media_play',
          pauseIcon: 'media_pause',
          notificationIcon: 'notification'
        }).then((value) => {
          console.log('createMusicControls.value' + JSON.stringify(value));
          this.musicControls.listen();
        }).catch((error) => {
          console.log('createMusicControls.error' + JSON.stringify(error));
        });
        this.musicControls.updateElapsed({
          elapsed: this.data.value, // seconds
          isPlaying: false
        });
        this.musicControls.listen();
        this.musicControls.subscribe().subscribe(action => {
          console.log('Here is may be for IOS ::::::: '+ action);
          const message = JSON.parse(action).message;
            switch(message) {
              case 'music-controls-pause':
                  // Do something
                  console.log('musc pause');
                  this.stopAudio();
                  break;
              case 'music-controls-play':
                  // Do something
                  console.log('music play');
                  this.startAudio();
                  break;
              case 'music-controls-destroy':
                  // Do something
                  break;
              // External controls (iOS only)
              case 'music-controls-toggle-play-pause' :
                console.log('music-controls-toggle-play-pause');
                // Do something
                break;
              case 'music-controls-seek-to':
                // Do something
                break;
              default:
                  break;
            }
        });
        this.adPlayer = true;
      } else {
        this.aRfile = AppSettings.JAAG.srcmediaurl + this.aFile;
        this.adPlayer = true;
      }
    }, 500 );
  }
  onEvent = (event: string, item: any): void => {
    this.pfile.seekTo(parseInt(item) * 1000 );
  }
  startAudio() {
    this.apause = false;
    this.pfile.play();
    this.musicControls.updateIsPlaying(true);
    this.musicControls.updateElapsed({
      elapsed: this.data.value, // seconds
      isPlaying: true
    });
    this.musicControls.listen();  
  }
  stopAudio() {
    this.apause = true;
    this.pfile.pause();
    this.musicControls.updateIsPlaying(false);
    this.musicControls.updateElapsed({
      elapsed: this.data.value, // seconds
      isPlaying: false
    });
    this.musicControls.listen();
  }
  closeAdplay(){
    if (this.pfile){
      this.pfile.stop();
    }
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.adPlayer = false;
  }
  searchVideo() {
    this.loadingService.show();
    this.vidList = [];
    this.showList = true;
    this.selecthead = " ";
    this.httpService.getJaag('/api/videos?q='+this.searchText+'&limit=500&sortBy=created').subscribe(
      (data: any) => {
        data.data.forEach(element => {
          element.stored = false;
          if(element.embed.afile) {
            let filename = element.embed.afile.substring(element.embed.afile.lastIndexOf("/")).replace('/', '');
            this.file.checkFile(this.file.dataDirectory, filename).then(fcheck => {
              element.stored = fcheck;
            },(error) =>{
              console.log('This is error : '+ JSON.stringify(error));
            });
          }
        });
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
        data.data.forEach(element => {
          element.stored = false;
          if(element.embed.afile) {
            let filename = element.embed.afile.substring(element.embed.afile.lastIndexOf("/")).replace('/', '');
            this.file.checkFile(this.file.dataDirectory, filename).then(fcheck => {
              element.stored = fcheck;
            },(error) =>{
              console.log('This is error : '+ JSON.stringify(error));
            });
          }
        });
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
        this.showList = false;
        this.loadingService.hide();
      }, err => {
          alert(err.message);
      }, null);
  }
  toggleGroup(group: any) {
    group.show = !group.show;
  }
  isGroupShown(group: any) {
    return group.show;
  }
  ngOnChanges(changes: { [propKey: string]: any }) {
    this.data = changes['data'].currentValue;
  }
  downloadAudio() {
    let toast = this.toastCtrl.create({
      message: 'Audio is being downloaded in the background',
      duration: 5000
    });
    toast.present();
    this.downlo = true;
    let url = encodeURI(this.aRfile);  
    this.fileTransfer = this.transfer.create();
    let filename = this.aFile.substring(this.aFile.lastIndexOf("/")).replace('/', '');  
    this.fileTransfer.download(url, this.file.dataDirectory + filename, true).then((entry) => {  
      this.aLfile = this.file.dataDirectory + filename;
      this.pfile = this.media.create(this.aLfile.replace(/^file:\/\//, ''));
      this.selectedAdio.stored = true;
      this.storage.get('audiostore').then((dat) => {
        if (dat) {
          dat.data.push(this.selectedAdio);
          this.storage.set('audiostore', dat);
        } else {
          this.storage.set('audiostore', {data: [this.selectedAdio]});
        }
      });
      this.adstored = true;
      this.downlo = false;
    }, (error) => {  
      console.log('Download failed: ' + JSON.stringify(error));  
    });
  }
  audiostored() {
    this.storage.get('audiostore').then((dat) => {
      this.showList = true;
      this.vidList = dat.data;
    });
  }
  audioDelete= (adio: any): void => {
    let filename = adio.embed.afile.substring(adio.embed.afile.lastIndexOf("/")).replace('/', '');
    this.file.removeFile(this.file.dataDirectory, filename).then(result => {
      this.aLfile = '';
      this.showList = false;
      this.storage.get('audiostore').then((dat) => {
        dat.data.splice(dat.data.indexOf(adio), 1);
        this.storage.set('audiostore', dat);
        if(dat.data.length === 0) {
          this.adstored = false;
        }
      });
    },(error) =>{
      console.log('This is error : '+ JSON.stringify(error));
    });
  }

  listShare(item) {
    console.log('here it is with in share with options');
    console.log(item);
    var options = {
      message: item.title.en,
      subject: item.title.en + '  ' + item.title.ur,
      url: AppSettings.JAAG.srcurl + '/#!/audio/' + item._id,
      image: AppSettings.JAAG.srcurl + '/m/thumb/video/' + item.embed.thumb,
      chooserTitle: item.title.en
//      appPackageName: 'com.apple.social.facebook'   
    }
    this.socialSharing.shareWithOptions(options).then((succ) => {
      console.log("shareWithOptions: Success" + JSON.stringify(succ));
    }).catch((err) => {
      console.error("shareWithOptions: failed" + JSON.stringify(err));
    });
  }
}