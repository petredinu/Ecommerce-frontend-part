import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  
  private readonly STORAGE_KEY = 'selectedLanguage';
  
  // Limbile disponibile
  public readonly languages: Language[] = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];
  
  // Limba curentă (default: română)
  private currentLanguageSubject: BehaviorSubject<string>;
  public currentLanguage$: Observable<string>;
  
  constructor() {
    // Încarcă limba salvată sau folosește română ca default
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY) || 'ro';
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }
  
  /**
   * Obține limba curentă
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
  
  /**
   * Setează o nouă limbă
   */
  setLanguage(languageCode: string): void {
    if (this.languages.some(lang => lang.code === languageCode)) {
      this.currentLanguageSubject.next(languageCode);
      localStorage.setItem(this.STORAGE_KEY, languageCode);
    }
  }
  
  /**
   * Obține traducerea pentru un key dat
   */
  translate(key: string): string {
    const lang = this.getCurrentLanguage();
    
    // Dacă e română, returnează textul din interfață (default)
    if (lang === 'ro') {
      return this.getRomanianText(key);
    }
    
    // Pentru engleză, returnează traducerea
    return this.getEnglishText(key);
  }
  
  /**
   * Textele în română (default - neschimbate)
   */
  private getRomanianText(key: string): string {
    const translations: { [key: string]: string } = {
      // Header
      'header.search.placeholder': 'Caută produse...',
      'header.search.button': 'Caută',
      'header.cart': 'Coș',
      'header.wishlist': 'Dorințe',
      'header.login': 'Autentificare',
      'header.logout': 'Deconectare',
      'header.profile': 'Profil',
      'header.orders': 'Comenzi',
      'header.welcome': 'Bine ai revenit',
      
      // Product List
      'products.add-to-cart': 'Adaugă în Coș',
      'products.save': 'Salvează',
      'products.delete': 'Șterge',
      'products.add-to-favorites': 'Adaugă la Favorite',
      'products.remove-from-favorites': 'Elimină din Favorite',
      'products.no-products': 'Niciun produs găsit',
      'products.in-stock': 'În Stoc',
      'products.out-of-stock': 'Stoc Epuizat',
      
      // Cart
      'cart.title': 'Coșul Meu',
      'cart.empty': 'Coșul tău de cumpărături este gol',
      'cart.quantity': 'Cantitate',
      'cart.subtotal': 'Subtotal',
      'cart.total': 'Preț Total',
      'cart.total-quantity': 'Cantitate Totală',
      'cart.shipping': 'Livrare',
      'cart.free-shipping': 'Gratuit',
      'cart.checkout': 'Finalizează Comanda',
      'cart.continue-shopping': 'Continuă Cumpărăturile',
      
      // Checkout
      'checkout.title': 'Finalizare Comandă',
      'checkout.customer-info': 'Date Client',
      'checkout.first-name': 'Prenume',
      'checkout.last-name': 'Nume',
      'checkout.email': 'Email',
      'checkout.shipping-address': 'Adresă Livrare',
      'checkout.billing-address': 'Adresă Facturare',
      'checkout.country': 'Țară',
      'checkout.street': 'Stradă',
      'checkout.city': 'Oraș',
      'checkout.state': 'Județ',
      'checkout.zipcode': 'Cod Poștal',
      'checkout.same-address': 'Adresa de facturare este aceiași cu adresa de livrare',
      'checkout.payment-method': 'Metodă de Plată',
      'checkout.cash-on-delivery': 'Plata la livrare (Numerar / Cash)',
      'checkout.credit-card': 'Card de Credit',
      'checkout.shipping-method': 'Metodă de Livrare',
      'checkout.promo-code': 'Cod Promoțional',
      'checkout.apply': 'Aplică',
      'checkout.remove': 'Elimină',
      'checkout.order-review': 'Verificare Comandă',
      'checkout.discount': 'Reducere',
      'checkout.place-order': 'Finalizează Comanda',
      
      // Wishlist
      'wishlist.title': 'Lista Mea de Dorințe',
      'wishlist.empty': 'Nu ai produse salvate',
      'wishlist.view-details': 'Vezi Detalii',
      'wishlist.move-to-cart': 'Mută în Coș',
      'wishlist.clear-all': 'Golește Wishlist',
      
      // Common
      'common.loading': 'Se încarcă...',
      'common.error': 'A apărut o eroare',
      'common.success': 'Succes',
      'common.cancel': 'Anulează',
      'common.save': 'Salvează',
      'common.delete': 'Șterge',
      'common.edit': 'Editează',
      'common.back': 'Înapoi',
      'common.yes': 'Da',
      'common.no': 'Nu',
    };
    
    return translations[key] || key;
  }
  
  /**
   * Textele în engleză (traduceri)
   */
  private getEnglishText(key: string): string {
    const translations: { [key: string]: string } = {
      // Header
      'header.search.placeholder': 'Search products...',
      'header.search.button': 'Search',
      'header.cart': 'Cart',
      'header.wishlist': 'Wishlist',
      'header.login': 'Login',
      'header.logout': 'Logout',
      'header.profile': 'Profile',
      'header.orders': 'Orders',
      'header.welcome': 'Welcome back',
      
      // Product List
      'products.add-to-cart': 'Add to Cart',
      'products.save': 'Save',
      'products.delete': 'Delete',
      'products.add-to-favorites': 'Add to Favorites',
      'products.remove-from-favorites': 'Remove from Favorites',
      'products.no-products': 'No products found',
      'products.in-stock': 'In Stock',
      'products.out-of-stock': 'Out of Stock',
      
      // Cart
      'cart.title': 'My Cart',
      'cart.empty': 'Your shopping cart is empty',
      'cart.quantity': 'Quantity',
      'cart.subtotal': 'Subtotal',
      'cart.total': 'Total Price',
      'cart.total-quantity': 'Total Quantity',
      'cart.shipping': 'Shipping',
      'cart.free-shipping': 'Free',
      'cart.checkout': 'Checkout',
      'cart.continue-shopping': 'Continue Shopping',
      
      // Checkout
      'checkout.title': 'Checkout',
      'checkout.customer-info': 'Customer Information',
      'checkout.first-name': 'First Name',
      'checkout.last-name': 'Last Name',
      'checkout.email': 'Email',
      'checkout.shipping-address': 'Shipping Address',
      'checkout.billing-address': 'Billing Address',
      'checkout.country': 'Country',
      'checkout.street': 'Street',
      'checkout.city': 'City',
      'checkout.state': 'State',
      'checkout.zipcode': 'Zip Code',
      'checkout.same-address': 'Billing address same as shipping address',
      'checkout.payment-method': 'Payment Method',
      'checkout.cash-on-delivery': 'Cash on Delivery',
      'checkout.credit-card': 'Credit Card',
      'checkout.shipping-method': 'Shipping Method',
      'checkout.promo-code': 'Promo Code',
      'checkout.apply': 'Apply',
      'checkout.remove': 'Remove',
      'checkout.order-review': 'Order Review',
      'checkout.discount': 'Discount',
      'checkout.place-order': 'Place Order',
      
      // Wishlist
      'wishlist.title': 'My Wishlist',
      'wishlist.empty': 'You have no saved products',
      'wishlist.view-details': 'View Details',
      'wishlist.move-to-cart': 'Move to Cart',
      'wishlist.clear-all': 'Clear Wishlist',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.back': 'Back',
      'common.yes': 'Yes',
      'common.no': 'No',
    };
    
    return translations[key] || key;
  }
}
