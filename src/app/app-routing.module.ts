import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { MainContentOperatorsComponent } from './main-content-operators/main-content-operators.component';
import { MainContentAdministratorsPanelComponent } from './main-content-administrators/main-content-administrators.component';
import { MainContentRegistryComponent } from './main-content-registry/main-content-registry.component';
import { AppComponent } from './app.component';
import { ConfigurationPanelComponent } from './configuration-panel/configuration-panel.component';

const routes: Routes = [
  {path: 'operarios', component: MainContentOperatorsComponent},
  {path: 'administradores', component: MainContentAdministratorsPanelComponent},
  {path: 'configuracion', component: ConfigurationPanelComponent},
  // {path: 'historial', component: MainContentRegistryComponent},
  {path: '', redirectTo: '/operarios', pathMatch: 'full'},
  {path: '**', component: MainContentOperatorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
