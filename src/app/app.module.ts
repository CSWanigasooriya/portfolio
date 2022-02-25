import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FinalModule } from './modules/final/final.module';
import { HomeModule } from './modules/home/home.module';
import { SecondModule } from './modules/second/second.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    SecondModule,
    FinalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
