import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { AuthGuard, AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrdersByDateComponent } from './components/orders-by-date/orders-by-date.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { environment } from '../environments/environment';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';




const routes: Routes =[

  // Rute noi pentru vizualizare comenzii după dată
  { path: 'search-orders-by-date', component: OrdersByDateComponent, canActivate:[AuthGuard] },

  // Ruta noua pentru paginile din footer
  { path: 'info/:type', component: InfoPageComponent },
  
  // Rute Admin pentru gestionare produse
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard] }, // Management produse
  { path: 'admin/product-form', component: ProductFormComponent }, // Adăugare produs nou
  { path: 'admin/product-form/:id', component: ProductFormComponent }, // Editare produs
  { path: 'admin/delete-product/:id', component: DeleteProductComponent }, // Ștergere produs
  
  // Rute vechi pentru backward compatibility (redirectează către rute admin)
  { path: 'add-product', redirectTo: 'admin/product-form', pathMatch: 'full' },
  { path: 'edit-product/:id', redirectTo: 'admin/product-form/:id', pathMatch: 'full' },

  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: 'members', component: MembersPageComponent,  canActivate: [AuthGuard] },

  {path:'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component:ProductDetailsComponent},
  {path: 'search/:keyword', component:ProductListComponent},
  {path:'category/:id', component:ProductListComponent},
  {path:'category', component:ProductListComponent},
  {path:'products', component:ProductListComponent},
  {path:'', redirectTo:'/products', pathMatch:'full'},
  {path:'**', redirectTo:'/products', pathMatch:'full'},

];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    ProductFormComponent,
    OrdersByDateComponent,
    InfoPageComponent,
    DeleteProductComponent,
    AdminProductsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPaginationModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    LoginStatusComponent,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
        allowedList: [
          `${environment.luv2shopApiUrl}/page-contents/*`
        ] 
      },
    }),
  ],
  providers: [ProductService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
