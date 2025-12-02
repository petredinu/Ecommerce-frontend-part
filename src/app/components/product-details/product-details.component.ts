import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { Location } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private seoService: SeoService,
              public wishlistService: WishlistService){}

   ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        this.handleProductDetails();
      })     
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

   goBack() {
     this.location.back();
   }
}
