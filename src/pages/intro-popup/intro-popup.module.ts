import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroPopupPage } from './intro-popup';

@NgModule({
  declarations: [
    IntroPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroPopupPage),
  ],
})
export class IntroPopupPageModule {}
