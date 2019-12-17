import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifiMsgPage } from './notifi-msg';

@NgModule({
  declarations: [
    NotifiMsgPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifiMsgPage),
  ],
})
export class NotifiMsgPageModule {}
