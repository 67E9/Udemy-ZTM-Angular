import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipsComponent } from './clips/clips.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipService } from './services/clip.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'clip/:id',
    component: ClipsComponent,
    resolve: {
      clip: ClipService
    }
  },
  {
    path: '', //base path for all children below
    loadChildren: async () => (await import('./video/video.module')).VideoModule
    //lazily load video-module to enhance performance for users, who only watch but do not upload videos
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
//RouterModule.forRoot --> initializes router, should only be called once, other routing modules should use .forChild(), use: ng g m name --routing
export class AppRoutingModule { }

//also see video-routing.module.ts