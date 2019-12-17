import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroModalPage } from './intro-modal';

@NgModule({
  declarations: [
    IntroModalPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroModalPage),
  ],
})
export class IntroModalPageModule {}
