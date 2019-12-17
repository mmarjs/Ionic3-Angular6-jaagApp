import { Component, Input, OnChanges } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'spinner',
    templateUrl: 'spinner.html'
})

export class Spinner implements OnChanges {
  @Input('data') data: any;
  path : string;

  constructor() {}

  ngOnChanges(changes: {[propKey: string]: any}) {
    this.path = "assets/svg/" +  changes['data'].currentValue.icon + ".svg";
  }

  getData = ():any => {
    return this.data;
  }
}
