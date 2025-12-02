import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { Location } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { WishlistService } from '../../services/wishlist.service';
import { PriceAlertService } from '../../services/price-alert.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;
  showPriceAlertModal: boolean = false;
  targetPrice: number = 0;
  userEmail: string = '';
  isAuthenticated: boolean = false;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private seoService: SeoService,
              public wishlistService: WishlistService,
              private priceAlertService: PriceAlertService,
              private authService: AuthService){}

   ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        this.handleProductDetails();
      });
      
      // Check authentication
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });
      
      this.authService.user$.subscribe(user => {
        if (user?.email) {
          this.userEmail = user.email;
        }
      });
   }           
  handleProductDetails() {
    // get the "id" param string. convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    console.log('=== DETALII PRODUS ===');
    console.log('ID extras din rută:', theProductId);
    console.log('Tip:', typeof theProductId);
    console.log('Este NaN?', isNaN(theProductId));
    console.log('======================');

    if (!theProductId || theProductId <= 0 || isNaN(theProductId)) {
      console.error('ID produs invalid:', theProductId);
      alert('ID produs invalid!');
      this.router.navigate(['/products']);
      return;
    }

    this.productService.getProduct(theProductId).subscribe({
      next: (data) => {
        console.log('Produs încărcat cu succes:', data.name);
        this.product = data;
        
        // SEO: Update meta tags and structured data
        this.updateSEO(data);
      },
      error: (err) => {
        console.error('Eroare la încărcarea produsului:', err);
        alert('Produsul nu a fost găsit sau a fost șters.');
        this.router.navigate(['/products']);
      }
    });
  }

  private updateSEO(product: Product) {
    // Update canonical URL
    const canonicalUrl = `https://localhost:4200/products/${product.id}`;
    this.seoService.updateCanonicalUrl(canonicalUrl);

    // Update meta tags
    this.seoService.updateMetaTags({
      title: `${product.name} - Best Price | Your Shop`,
      description: `${product.description || product.name}. Only $${product.unitPrice}. ${product.unitsInStock > 0 ? 'In stock' : 'Out of stock'}. Fast delivery!`,
      keywords: `${product.name}, ${product.category?.categoryName}, buy online, ecommerce`,
      ogTitle: product.name,
      ogDescription: product.description || product.name,
      ogImage: product.imageUrl,
      ogUrl: canonicalUrl
    });

    // Create structured data for product
    this.seoService.createProductStructuredData(product);

    // Create breadcrumb structured data
    this.seoService.createBreadcrumbStructuredData([
      { name: 'Home', url: 'https://localhost:4200/' },
      { name: product.category?.categoryName || 'Products', url: `https://localhost:4200/category/${product.category?.id}` },
      { name: product.name, url: window.location.href }
    ]);
  }

   addToCart(){
    if (!this.product) {
      alert('Eroare: Produsul nu este disponibil.');
      return;
    }

    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    
    const theCartItem = new CartItem(this.product);

    this.cartService.addToCart(theCartItem);
   }

   toggleWishlist(): void {
    if (!this.product) return;
    
    if (this.wishlistService.isInWishlist(this.product.id)) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
   }

   openPriceAlertModal(): void {
    if (!this.isAuthenticated) {
      alert('Trebuie să fii autentificat pentru a seta o alertă de preț.');
      return;
    }
    
    if (!this.product) return;
    
    // Set default target price to 90% of current price
    this.targetPrice = Math.floor(this.product.unitPrice * 0.9 * 100) / 100;
    this.showPriceAlertModal = true;
   }

   closePriceAlertModal(): void {
    this.showPriceAlertModal = false;
   }

   createPriceAlert(): void {
    if (!this.product) return;
    
    if (this.targetPrice <= 0) {
      alert('Prețul țintă trebuie să fie mai mare decât 0.');
      return;
    }
    
    if (this.targetPrice >= this.product.unitPrice) {
      alert('Prețul țintă trebuie să fie mai mic decât prețul actual.');
      return;
    }
    
    this.priceAlertService.createAlert(this.userEmail, this.product.id, this.targetPrice)
      .subscribe({
        next: (response) => {
          alert('Alertă de preț creată cu succes! Vei primi un email când prețul scade.');
          this.closePriceAlertModal();
        },
        error: (error) => {
          console.error('Eroare la crearea alertei:', error);
          alert('Eroare la crearea alertei de preț. Te rugăm să încerci din nou.');
        }
      });
   }

   goBack() {
     this.location.back();
   }
}
