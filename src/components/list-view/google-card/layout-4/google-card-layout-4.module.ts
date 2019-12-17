import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleCardLayout4 } from './google-card-layout-4';

@NgModule({
    declarations: [
        GoogleCardLayout4,
    ],
    imports: [
        IonicPageModule.forChild(GoogleCardLayout4),
    ],
    exports: [
        GoogleCardLayout4
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class GoogleCardLayout4Module { }
