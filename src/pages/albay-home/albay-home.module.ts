import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlbayHomePage } from './albay-home';

@NgModule({
  declarations: [
    AlbayHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AlbayHomePage),
  ],
})
export class AlbayHomePageModule {}
