import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertLayout1 } from './alert-layout-1';

@NgModule({
    declarations: [
        AlertLayout1,
    ],
    imports: [
        IonicPageModule.forChild(AlertLayout1),
    ],
    exports: [
        AlertLayout1
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class AlertLayout1Module { }
