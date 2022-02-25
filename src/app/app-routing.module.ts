import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalComponent } from './modules/final/final.component';
import { HomeComponent } from './modules/home/home.component';
import { SecondComponent } from './modules/second/second.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'second', component: SecondComponent },
  { path: 'final', component: FinalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
