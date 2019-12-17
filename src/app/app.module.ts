import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { Media } from '@ionic-native/media';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { SocialSharing } from '@ionic-native/social-sharing';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SecToTimeModule } from '../pipes/secondstotime.module';
import { SanitizeHtmlModule } from '../pipes/sanitizehtml.module';
import { AppSettings } from '../services/app-settings';
import { ToastService } from '../services/toast-service';
import { LoadingService } from '../services/loading-service';
import { Firebase } from '@ionic-native/firebase';
import { PopoverComponent } from '../components/popover/popover';

@NgModule({
  declarations: [
    MyApp,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SecToTimeModule,
    SanitizeHtmlModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(AppSettings.FIREBASE_CONFIG),
    AngularFireDatabaseModule, AngularFireAuthModule, AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, PopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar, SplashScreen, Media, Firebase, SocialSharing,
    ToastService, LoadingService, File, FileTransfer, FileTransferObject,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {
}
