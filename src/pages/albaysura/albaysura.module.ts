import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlbaysuraPage } from './albaysura';
import { SanitizeHtmlModule } from '../../pipes/sanitizehtml.module';

@NgModule({
  declarations: [
    AlbaysuraPage,
  ],
  imports: [
    IonicPageModule.forChild(AlbaysuraPage),
    SanitizeHtmlModule,
  ],
})
export class AlbaysuraPageModule {}
