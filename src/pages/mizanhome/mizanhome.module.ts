import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MizanhomePage } from './mizanhome';

@NgModule({
  declarations: [
    MizanhomePage,
  ],
  imports: [
    IonicPageModule.forChild(MizanhomePage),
  ],
})
export class MizanhomePageModule {}
