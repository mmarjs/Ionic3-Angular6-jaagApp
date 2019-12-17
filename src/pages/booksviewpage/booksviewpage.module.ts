import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BooksviewpagePage } from './booksviewpage';

import { ActionSheetLayout2Module } from '../../components/action-sheet/layout-2/action-sheet-layout-2.module';

@NgModule({
  declarations: [
    BooksviewpagePage,
  ],
  imports: [
    IonicPageModule.forChild(BooksviewpagePage),
    ActionSheetLayout2Module
  ],
})
export class BooksviewpagePageModule {}
