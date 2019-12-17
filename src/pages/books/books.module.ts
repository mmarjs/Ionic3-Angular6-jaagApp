import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BooksPage } from './books';

import { GoogleCardLayout1Module } from '../../components/list-view/google-card/layout-1/google-card-layout-1.module';

@NgModule({
  declarations: [
    BooksPage,
  ],
  imports: [
    IonicPageModule.forChild(BooksPage),
    GoogleCardLayout1Module
  ],
})
export class BooksPageModule {}
