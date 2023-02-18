import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
const routes: Routes = [
  {
    path: 'categories/:posId',
    component: CategoriesComponent
  },
  {
    path: ':posId',
    component: CategoriesComponent
  },
  {
    path: 'products/:categoryId',
    component: ProductsComponent
  },
  {
    path: 'product-details/:productId',
    component: ProductDetailsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
