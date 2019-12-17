import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'google-card-layout-1',
    templateUrl: 'google-card.html'
})
export class GoogleCardLayout1 {
    @Input() data: any;
    @Input() events: any;
    @ViewChild(Content)
    content: Content;
    slider = {};

    constructor() { }

    slideHasChanged(slider, index): void {
        this.slider[index] = slider;
        if (2 == slider._activeIndex) {
            if (this.data.items) {
                this.data.items.splice(index, 1);
            } else {
                this.data.splice(index, 1);
            }
        }
    }

    onStarClass(items: any, index: number, e: any) {
      if (e) {
        e.stopPropagation();
      }
      for (var i = 0; i < items.length; i++) {
        items[i].isActive = i <= index;
      }
      this.onEvent("onRates", index, e);
    };

    onClickEvent(index): void {
        if (this.slider[index]) {
            this.slider[index].slidePrev(300);
        }
    }

    onEvent(event: string, item: any, e: any) {
        if (e) {
            e.stopPropagation();
        }
        if (this.events[event]) {
            this.events[event](item);
        }
    }
}
