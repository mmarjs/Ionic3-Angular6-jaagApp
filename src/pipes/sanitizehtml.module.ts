import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { SanitizeHtmlPipe } from "./sanitizehtml";

@NgModule({
  declarations: [SanitizeHtmlPipe],
  imports: [IonicModule],
  exports: [SanitizeHtmlPipe]
})
export class SanitizeHtmlModule {}