import { Component, OnInit } from '@angular/core';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';


@Component({
  selector: 'app-cart-status',
  standalone: false,
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {
  faCartShopping=faCartShopping;
  faHeart=faHeart;
  totalPrice: number=0.00;
  totalQuantity: number=0;
  wishlistCount: number=0;

  constructor(private cartService: CartService,
              private wishlistService: WishlistService){ }

  ngOnInit(): void {
    this.updateCartStatus();
    this.updateWishlistCount();
  }
  updateCartStatus() {

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  updateWishlistCount() {
    this.wishlistService.wishlist$.subscribe(
      items => this.wishlistCount = items.length
    );
  }

}
