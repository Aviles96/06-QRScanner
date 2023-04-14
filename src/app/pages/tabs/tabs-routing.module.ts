import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { MapaPageModule } from '../mapa/mapa.module';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },

      {
        path: 'tab2',
        children: [
        { 
          path: '',
          loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
        },
        {
          path: 'mapa/:geo',
          loadChildren: ()=> import( '../mapa/mapa.module').then(m => m.MapaPageModule)
        },
        ]
      },

      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
