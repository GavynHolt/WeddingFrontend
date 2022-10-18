import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
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
    canActivate: [AuthGuard],
  }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
