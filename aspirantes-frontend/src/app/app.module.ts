import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa BrowserAnimationsModule


import { AppComponent } from './app.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';

import { FormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { HomeComponent } from './components/home/home.component';



import { routing, appRoutingProviders } from './router';
import { CrearAspirantesComponent } from './components/crear-aspirantes/crear-aspirantes.component';
import { MainComponent } from './components/main/main.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { ExplorarCodigosComponent } from './components/explorar-codigos/explorar-codigos.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    HomeComponent,
    CrearAspirantesComponent,
    MainComponent,
    GruposComponent,
    ExplorarCodigosComponent
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFileUploaderModule,
    routing,
    NgxChartsModule,
    BrowserAnimationsModule
  
    
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
