import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegistroComponent } from "./components/registro/registro.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { CrearAspirantesComponent } from "./components/crear-aspirantes/crear-aspirantes.component";
import { MainComponent } from "./components/main/main.component";
import { GruposComponent } from "./components/grupos/grupos.component";
import { ExplorarCodigosComponent } from "./components/explorar-codigos/explorar-codigos.component";

const AppRoutes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'panel', component: MainComponent, children: [
        { path: 'nuevo-aspirante/:id', component: CrearAspirantesComponent },
        { path: 'nuevo-grupo', component: GruposComponent }
    ]},
    { path: 'explorar-codigos', component: ExplorarCodigosComponent },
   
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(AppRoutes);