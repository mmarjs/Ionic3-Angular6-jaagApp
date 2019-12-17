import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content, Slides } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'google-card-layout-4',
    templateUrl: 'google-card.html'
})
export class GoogleCardLayout4 {
    @Input() data: any;
    @Input() events: any;
    @ViewChild(Content) content: Content;
    @ViewChild('wizardSlider') slider: Slides;

    constructor() { }

    onStarClass(items: any, index: number, e: any) {
      if (e) {
        e.stopPropagation();
      }
      for (var i = 0; i < items.length; i++) {
        items[i].isActive = i <= index;
      }
      this.onEvent("onRates", index, e);
    };

    changeSlide(index: number): void {
        if (index > 0) {
            this.slider.slideNext(300);
        } else {
            this.slider.slidePrev(300);
        }
    }

    onEvent(event: string, item: any, e: any) {
        if (this.events[event]) {
            this.events[event](item);
        }
    }
}
