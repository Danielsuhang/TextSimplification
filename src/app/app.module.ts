import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';


import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';

import {TextService} from './text.service';




const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'settings', component: SettingsComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatSliderModule, MatCardModule,
    MatButtonModule, MatIconModule,FormsModule,MatToolbarModule, RouterModule,
    RouterModule.forRoot(routes), MatInputModule, HttpClientModule,
    
  ],
  providers: [TextService],
  bootstrap: [AppComponent]
})
export class AppModule { }
