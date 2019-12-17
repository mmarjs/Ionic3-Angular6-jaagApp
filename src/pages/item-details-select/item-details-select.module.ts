import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemDetailsPageSelect } from './item-details-select';

import { SelectLayout1Module } from '../../components/select/layout-1/select-layout-1.module';
import { SelectLayout2Module } from '../../components/select/layout-2/select-layout-2.module';
import { SelectLayout3Module } from '../../components/select/layout-3/select-layout-3.module';
import { SelectLayout4Module } from '../../components/select/layout-4/select-layout-4.module';
import { SelectLayout5Module } from '../../components/select/layout-5/select-layout-5.module';
import { SelectLayout6Module } from '../../components/select/layout-6/select-layout-6.module';

@NgModule({
  declarations: [
    ItemDetailsPageSelect,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailsPageSelect),
    SelectLayout1Module, SelectLayout2Module, SelectLayout3Module,
    SelectLayout4Module, SelectLayout5Module, SelectLayout6Module
  ],
  exports: [
    ItemDetailsPageSelect
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ItemDetailsPageSelectModule {}
