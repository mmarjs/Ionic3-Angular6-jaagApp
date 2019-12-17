import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashJaagPage } from './splash-jaag';
import { SplashScreenLayout3Module } from '../../components/splash-screen/layout-3/splash-screen-layout-3.module';

@NgModule({
  declarations: [
    SplashJaagPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashJaagPage),
    SplashScreenLayout3Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplashJaagPageModule {}
