import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistItem } from '../../common/wishlist-item';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(wishlistItem: WishlistItem): void {
    const cartItem = new CartItem(wishlistItem.product);
    this.cartService.addToCart(cartItem);
  }

  moveToCart(wishlistItem: WishlistItem): void {
    this.addToCart(wishlistItem);
    this.removeFromWishlist(wishlistItem.product.id);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  clearWishlist(): void {
    if (confirm('Sigur vrei să golești întreaga listă de dorințe?')) {
      this.wishlistService.clearWishlist();
    }
  }

}
