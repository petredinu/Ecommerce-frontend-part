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
import { StockAlertsComponent } from './components/stock-alerts/stock-alerts.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { EmailTestComponent } from './components/email-test/email-test.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { AdminPromoBannerComponent } from './components/admin-promo-banner/admin-promo-banner.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { AdminPromoCodesComponent } from './components/admin-promo-codes/admin-promo-codes.component';
import { MyPriceAlertsComponent } from './components/my-price-alerts/my-price-alerts.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';




const routes: Routes =[

  // Rute noi pentru vizualizare comenzii după dată
  { path: 'search-orders-by-date', component: OrdersByDateComponent, canActivate:[AuthGuard] },

  // Ruta noua pentru paginile din footer
  { path: 'info/:type', component: InfoPageComponent },
  
  // Ruta pentru Wishlist
  { path: 'wishlist', component: WishlistComponent },
  
  // Ruta pentru My Price Alerts
  { path: 'my-price-alerts', component: MyPriceAlertsComponent, canActivate: [AuthGuard] },
  
  // Ruta pentru Email Testing (dev only)
  { path: 'email-test', component: EmailTestComponent },
  
  // Rute Admin
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] }, // Admin Dashboard
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard] }, // Management produse
  { path: 'admin/stock-alerts', component: StockAlertsComponent, canActivate: [AuthGuard] }, // Alerte stoc
  { path: 'admin/promo-banners', component: AdminPromoBannerComponent, canActivate: [AuthGuard] }, // Bannere promoționale
  { path: 'admin/promo-codes', component: AdminPromoCodesComponent, canActivate: [AuthGuard] }, // Coduri promoționale
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
    AdminProductsComponent,
    StockAlertsComponent,
    StarRatingComponent,
    ProductReviewsComponent,
    WishlistComponent,
    EmailTestComponent,
    PromoBannerComponent,
    AdminPromoBannerComponent,
    ProductFilterComponent,
    AdminPromoCodesComponent,
    MyPriceAlertsComponent,
    LanguageSwitcherComponent,
    ClickOutsideDirective
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
    AdminDashboardComponent,
    TranslatePipe,
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
  providers: [
    ProductService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
