import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertLayout3 } from './alert-layout-3';

@NgModule({
    declarations: [
        AlertLayout3,
    ],
    imports: [
        IonicPageModule.forChild(AlertLayout3),
    ],
    exports: [
        AlertLayout3
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AlertLayout3Module { }
