import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailsPageAlert } from './item-details-alert';

import { AlertLayout1Module } from '../../components/alert/layout-1/alert-layout-1.module';
import { AlertLayout2Module } from '../../components/alert/layout-2/alert-layout-2.module';
import { AlertLayout3Module } from '../../components/alert/layout-3/alert-layout-3.module';

@NgModule({
  declarations: [
    ItemDetailsPageAlert,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsPageAlert),
    AlertLayout1Module, AlertLayout2Module, AlertLayout3Module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ItemDetailsPageAlertModule {}
