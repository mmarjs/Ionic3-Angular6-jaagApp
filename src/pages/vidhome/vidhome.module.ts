import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VidhomePage } from './vidhome';
import { SanitizeHtmlModule } from '../../pipes/sanitizehtml.module';

@NgModule({
  declarations: [
    VidhomePage,
  ],
  imports: [
    IonicPageModule.forChild(VidhomePage),
    SanitizeHtmlModule,
  ],
})
export class VidhomePageModule {}
