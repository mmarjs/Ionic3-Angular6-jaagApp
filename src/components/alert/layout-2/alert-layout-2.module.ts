import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertLayout2 } from './alert-layout-2';

@NgModule({
    declarations: [
        AlertLayout2,
    ],
    imports: [
        IonicPageModule.forChild(AlertLayout2),
    ],
    exports: [
        AlertLayout2
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AlertLayout2Module { }
