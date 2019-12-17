import { Component, Input } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'alert-layout-3',
    templateUrl: 'alert.html'
})
export class AlertLayout3 {
    @Input('data') data: any;
    @Input('events') events: any;

    constructor(private alertCtrl: AlertController) { }

    ngOnChanges(changes: { [propKey: string]: any }) {
        this.data = changes['data'].currentValue;
    }

    presentAlert(item):void {
        let alert = this.alertCtrl.create({
          title:  "DIALOG SUBSCRIBE" ,
          subTitle: "Subscribe for more!",
          inputs: [
            {
              name: 'Email',
              placeholder: 'Email'
            },
          ],
          cssClass : "alert-subscribe",
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Ok clicked');
              }
            }
          ]
        });
        alert.present();
    }
}
