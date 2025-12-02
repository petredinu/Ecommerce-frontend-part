import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { Location } from '@angular/common';

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
              private location: Location){}

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
      },
      error: (err) => {
        console.error('Eroare la încărcarea produsului:', err);
        alert('Produsul nu a fost găsit sau a fost șters.');
        this.router.navigate(['/products']);
      }
    });
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

   goBack() {
     this.location.back();
   }
}
