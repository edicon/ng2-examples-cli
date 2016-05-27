import { Component, provide, ElementRef } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes } from '@angular/router';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { Default } from './shared/views/default.component';
import { About } from './shared/views/about.component';
import { MusicPlayer } from './shared/views/music-player.component';
import { UIComponentTest } from './shared/views/ui-test.component';
import { DataChannelClient } from './shared/views/rtc-client.component';
import { RemoteUIDemo } from './shared/views/remote-ui-demo.component';
import { GlobalNav } from './shared/components/nav.component';

declare let module: any;

// console.log(About);

@Component({
  selector: 'synth-app',
  template:`
    <global-nav></global-nav>
    <div class="outer-outlet">
      <router-outlet></router-outlet>
    </div>
   `,
   directives : [ROUTER_DIRECTIVES, GlobalNav],
   moduleId: module.id,
   styleUrls: ['synth.component.css']
})

@Routes([
  {path:'/', component: Default},
  {path:'/music', component: MusicPlayer},
  {path:'/ui', component: UIComponentTest},
  {path:'/about', component: About},
  {path:'/remote', component: RemoteUIDemo},
  {path:'/webrtc/client', component: DataChannelClient}
])

export class SynthAppComponent {
  constructor(router: Router) {
    //console.log(router);
  }
}