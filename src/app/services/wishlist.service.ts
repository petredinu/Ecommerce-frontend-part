import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WishlistItem } from '../common/wishlist-item';
import { Product } from '../common/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject: BehaviorSubject<WishlistItem[]> = new BehaviorSubject<WishlistItem[]>([]);
  public wishlist$: Observable<WishlistItem[]> = this.wishlistSubject.asObservable();
  
  private baseUrl = `${environment.luv2shopApiUrl}/wishlist`;
  private storage: Storage = localStorage;

  constructor(private httpClient: HttpClient) {
    this.loadWishlistFromStorage();
  }

  // Load wishlist from localStorage on init
  private loadWishlistFromStorage(): void {
    const data = this.storage.getItem('wishlistItems');
    if (data) {
      try {
        this.wishlistItems = JSON.parse(data);
        this.wishlistSubject.next(this.wishlistItems);
      } catch (e) {
        console.error('Error loading wishlist from storage:', e);
        this.wishlistItems = [];
      }
    }
  }

  // Save wishlist to localStorage
  private saveWishlistToStorage(): void {
    this.storage.setItem('wishlistItems', JSON.stringify(this.wishlistItems));
    this.wishlistSubject.next(this.wishlistItems);
  }

  // Get all wishlist items
  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems;
  }

  // Add product to wishlist
  addToWishlist(product: Product): void {
    // Check if product already in wishlist
    const existingItem = this.wishlistItems.find(item => item.product.id === product.id);
    
    if (!existingItem) {
      const wishlistItem = new WishlistItem(
        this.wishlistItems.length + 1,
        product,
        new Date()
      );
      this.wishlistItems.push(wishlistItem);
      this.saveWishlistToStorage();
      
      // Optionally sync with backend if user is authenticated
      this.syncWithBackend();
    }
  }

  // Remove product from wishlist
  removeFromWishlist(productId: number): void {
    const index = this.wishlistItems.findIndex(item => item.product.id === productId);
    
    if (index > -1) {
      this.wishlistItems.splice(index, 1);
      this.saveWishlistToStorage();
      
      // Optionally sync with backend
      this.syncWithBackend();
    }
  }

  // Check if product is in wishlist
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.product.id === productId);
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  // Clear entire wishlist
  clearWishlist(): void {
    this.wishlistItems = [];
    this.storage.removeItem('wishlistItems');
    this.wishlistSubject.next(this.wishlistItems);
  }

  // Sync with backend (for authenticated users)
  private syncWithBackend(): void {
    // This method can be implemented to sync with backend
    // when user is authenticated
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      // Send wishlist to backend
      this.httpClient.post(`${this.baseUrl}/sync`, this.wishlistItems).pipe(
        catchError(error => {
          console.error('Error syncing wishlist with backend:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Load wishlist from backend (for authenticated users)
  loadWishlistFromBackend(): Observable<WishlistItem[]> {
    return this.httpClient.get<WishlistItem[]>(this.baseUrl).pipe(
      map(items => {
        this.wishlistItems = items;
        this.saveWishlistToStorage();
        return items;
      }),
      catchError(error => {
        console.error('Error loading wishlist from backend:', error);
        return of(this.wishlistItems);
      })
    );
  }
}
