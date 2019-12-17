import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudiohomePage } from './audiohome';
import { SecToTimeModule } from '../../pipes/secondstotime.module';

@NgModule({
  declarations: [
    AudiohomePage,
  ],
  imports: [
    IonicPageModule.forChild(AudiohomePage),
    SecToTimeModule,
  ],
})
export class AudiohomePageModule {}
