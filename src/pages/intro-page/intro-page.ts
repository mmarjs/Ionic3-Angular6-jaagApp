import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpService } from '../../services/HttpService';
import { AppSettings } from '../../services/app-settings';
import { IntroService } from '../../services/intro-service';
import { AlbayService } from '../../services/albay-service';

@IonicPage()
@Component({
  selector: 'page-intro-page',
  templateUrl: 'intro-page.html',
  providers: [AlbayService, IntroService, File, FileTransfer, HttpService]
})
export class IntroPage {
  apidata: any;
  params: any = null;
  storageUse: boolean;
  dataloading: boolean;
  msgshow: boolean;
  myDate: String = new Date().toISOString();
  private fileTransfer: FileTransferObject;  
  //here injecting  file transfer  and file class to our component part as object 
  constructor(public viewCtrl: ViewController, 
    private introService: IntroService, 
    private albayService: AlbayService,
    private storage: Storage, 
    private file: File,
    private transfer: FileTransfer,
    private httpService: HttpService) {
    var that = this;
    this.storageUse = false;
    //this.dataloading = true;
    this.dataloading = false;
    this.introService.load().subscribe(snapshot => {
      setTimeout(function () {
        that.params = {
          'events': {
            'onFinish': function (event: any) {
              if (that.dataloading) {
                that.msgshow = true;
              } else {
                that.viewCtrl.dismiss();
              }
            }
          },
          'data': snapshot
        };
      })
    });
    this.mizan();
    this.albay();
    this.books();
  } 
  ionViewDidLoad() {
    console.log('Intro-Page');
  } 
  download(fileName: string, filePath: string, lnth: number, nr: number) {  
    let url = encodeURI(filePath);  
    this.fileTransfer = this.transfer.create();  
    return this.fileTransfer.download(url, this.file.dataDirectory + fileName, true).then((entry) => {  
        if (lnth == nr) {
          this.msgshow = false;
          this.dataloading = false;
          if (this.storageUse){
            this.storage.set('inuse', true);
          }
          console.log('here it is now last item');
        }
        return this.file.readAsDataURL(this.file.dataDirectory, fileName).then(dataurl => {
            return dataurl;
          },(error) =>{
            console.log('This is error : '+ error);
          });
      }, (error) => {  
        console.log('Download failed: ' + JSON.stringify(error));  
      });  
  }
  books() {
    this.httpService.getJaag('/api/books?book='+AppSettings.JAAG.aid).subscribe(
      (data: any) => {
        data.data = data.data.filter(e => e._id !== AppSettings.JAAG.mz);
        this.storage.set('bksGhamidi', {data: data.data});
        data.data.forEach((element, i) => {
          setTimeout(() => {
            this.download(element.thumbnail, AppSettings.JAAG.srcurl+"/m/thumb/book/"+element.thumbnail, 1, 0).then(daturl => {
              element.image = daturl;
              this.storage.set('bksGhamidi', {data: data.data});
            });
            if (element.author.thumbnail) {
              this.download(element.author.thumbnail, AppSettings.JAAG.srcurl+"/m/thumb/users/"+element.author.thumbnail, 1, 0).then(daturl => {
                element.author.image = daturl;
                this.storage.set('bksGhamidi', {data: data.data});
              });
            }
          }, 1000 * i );
        });
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null);
    this.httpService.getJaag('/api/books?limit=200').subscribe(
      (data: any) => {
        this.storage.set('bksOthers', {data: data.data});
        data.data.forEach((element, i) => {
          setTimeout(() => {
            this.download(element.thumbnail, AppSettings.JAAG.srcurl+"/m/thumb/book/"+element.thumbnail, (data.data.length - 1), i).then(daturl => {
              element.image = daturl;
              this.storage.set('bksOthers', {data: data.data});
            });
            if (element.author.thumbnail) {
              this.download(element.author.thumbnail, AppSettings.JAAG.srcurl+"/m/thumb/users/"+element.author.thumbnail, 1, 0).then(daturl => {
                element.author.image = daturl;
                this.storage.set('bksOthers', {data: data.data});
              });
            }
          }, 700 * i );
        });
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null);  
  }
  mizan() {
    this.httpService.getJaag('/api/books/'+AppSettings.JAAG.mz).subscribe(
      (data: any) => {
        this.storage.set('mizan', {data: data});
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null); 
  }
  albay () {
    this.httpService.getJaag('/api/albay/filter?chapter=0&section=0').subscribe(
      (data: any) => {
        this.storage.set('albayHed', {data:data});
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null);
    this.httpService.getJaag('/api/albay?chapter=0&paragraph=1&type=Alb').subscribe(
      (data: any) => {
        this.storage.set('albayGroup', {data:data});
        data.forEach((element, i) => {
          setTimeout(() => {
            this.download(element.bodyImage, AppSettings.JAAG.srcurl+"/m/thumb/albay/"+element.bodyImage, 1, 0).then(daturl => {
              element.imgurl = daturl;
              this.storage.set('albayGroup', {data: data});
            });
          }, 700 * i );
        });
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null);
    this.storage.set('lastupdate', {albay: this.myDate});
    this.httpService.getJaag('/api/albay/getparabychap?chapter=1').subscribe(
      (data: any) => {
        this.storage.set('albayCh1_aya', {data: data});
        this.albayService.Suradownload(data).subscribe(result => {
          let despara = [];
          result.forEach((element, i) => {
            if (element.albParagraph !== 0){
              despara.push(element);
            }
            if (result.length === i+1) {
              this.storage.set('albayCh1_0', {data: despara});
            }
          });
        }, err => {
          this.storageUse = false;
          alert(err.message);
        }, null);
      }, err => {
          alert(err.message);
      }, null);
    this.httpService.getJaag('/api/albay/getchapsec0').subscribe(
      (data:any) => {
        this.storage.set('albayHList', {data:data});
        this.storageUse = true;
      }, err => {
        this.storageUse = false;
        alert(err.message);
      }, null);  
  }
}