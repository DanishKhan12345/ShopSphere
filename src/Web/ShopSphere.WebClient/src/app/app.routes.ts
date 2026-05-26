import { Routes } from '@angular/router';

import { ProductsComponent }
  from './features/products/products';

import { OrdersComponent }
  from './features/orders/orders';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  }
];