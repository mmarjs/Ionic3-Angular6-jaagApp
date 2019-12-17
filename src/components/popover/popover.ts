import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  toggleItem: any;
  radItem: any;
  elzm: any;
  elzmAR: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.toggleItem = this.navParams.data.toggleItem;
    this.radItem = this.navParams.data.radItem ? this.navParams.data.radItem : '';
    this.elzm = this.navParams.data.elzm ? this.navParams.data.elzm: '';
    this.elzmAR = this.navParams.data.elzmAR ? this.navParams.data.elzmAR : '';
  }
  setZoom(zoom: any) {
    this.elzm = zoom;
    if (this.elzmAR !== ''){
      this.elzmAR = zoom + 'AR';
    }
    var retdata = {toggleItem: this.toggleItem, radItem: this.radItem, elzm: this.elzm, elzmAR: this.elzmAR};
    this.viewCtrl.dismiss(retdata);
  }
  itemClick = (event: string, item: any): void =>{
    if (event === 'onSelect') {
      this.radItem.selectedItem = item.id;
    } else {
      if (item.isChecked){
        item.isChecked = false;
      } else {
        item.isChecked = true;
      }
      if (item.id == 2 && (!item.isChecked)){
        this.radItem.selectedItem = 1;
      }
    }
    var retdata = {toggleItem: this.toggleItem, radItem: this.radItem, elzm: this.elzm, elzmAR: this.elzmAR};
    this.viewCtrl.dismiss(retdata);
  }

}
