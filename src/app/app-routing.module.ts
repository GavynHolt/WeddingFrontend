import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RsvpComponent } from './rsvp/rsvp.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'rsvp',
    component: RsvpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
