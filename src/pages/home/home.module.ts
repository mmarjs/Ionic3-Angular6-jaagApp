import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { GoogleCardLayout3Module } from '../../components/list-view/google-card/layout-3/google-card-layout-3.module';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        GoogleCardLayout3Module
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePageModule { }
