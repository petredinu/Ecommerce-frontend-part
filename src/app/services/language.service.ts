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
      'products.filter': 'Filtrare Produse',
      'products.back-to-list': 'Înapoi la Lista de Produse',
      'products.management': 'Management Produse',
      'products.ordered': 'Produse Comandate',
      'products.inactive-notice': 'Produsele inactive nu vor fi vizibile în magazin',
      'products.explore': 'Explorează Produsele',
      'products.loading-info': 'Se încarcă informațiile produsului...',
      'products.delete-confirmation': 'Confirmare Ștergere',
      'products.warning': 'Atenție!',
      'products.delete-warning': 'Această acțiune va șterge permanent produsul și nu poate fi anulată.',
      'products.delete-permanent': 'Șterge Definitiv',
      'products.deleting': 'Se șterge...',
      
      // Product Form
      'product-form.add-new': 'Adaugă Produs Nou',
      'product-form.edit': 'Editare Produs',
      'product-form.loading': 'Se încarcă datele produsului...',
      
      // Cart
      'cart.title': 'Coșul Meu',
      'cart.empty': 'Coșul tău de cumpărături este gol',
      'cart.view': 'Vezi Coșul',
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
      'wishlist.empty-message': 'Începe să adaugi produsele pe care le iubești!',
      'wishlist.view-details': 'Vezi Detalii',
      'wishlist.move-to-cart': 'Mută în Coș',
      'wishlist.clear-all': 'Golește Wishlist',
      
      // Admin
      'admin.add-new': 'Adaugă Cod Nou',
      'admin.add-banner': 'Adaugă Banner Nou',
      'admin.edit-banner': 'Editează Banner',
      'admin.new-banner': 'Banner Nou',
      'admin.edit-code': 'Editează Cod',
      'admin.new-code': 'Cod Nou',
      'admin.close': 'Închide',
      'admin.edit-page': 'Editează Pagina (Admin)',
      'admin.edit-content': 'Editează conținutul pentru',
      'admin.add-code': 'Adaugă cod',
      'admin.loading-products': 'Se încarcă produsele...',
      'admin.category': 'Categorie',
      'admin.price': 'Preț',
      'admin.stock': 'Stoc',
      'admin.status': 'Status',
      'admin.actions': 'Acțiuni',
      'admin.active': 'Activ',
      'admin.inactive': 'Inactiv',
      'admin.activate': 'Activează',
      'admin.no-products': 'Nu există produse în baza de date.',
      'admin.total-products': 'Total Produse',
      'admin.active-products': 'Produse Active',
      'admin.inactive-products': 'Produse Inactive',
      
      // Stock
      'stock.management': 'Gestionare Stoc',
      'stock.alerts': 'Alerte Stoc',
      'stock.movements': 'Mișcări Stoc',
      'stock.no-alerts': 'Nu există alerte de stoc active.',
      'stock.current': 'Stoc Curent',
      'stock.minimum': 'Stoc Minim',
      'stock.level': 'Nivel',
      'stock.date': 'Data',
      'stock.edit-product': 'Editează Produs',
      'stock.no-movements': 'Nu există mișcări de stoc înregistrate.',
      'stock.type': 'Tip',
      'stock.previous-stock': 'Stoc Anterior',
      'stock.new-stock': 'Stoc Nou',
      'stock.reason': 'Motiv',
      'stock.performed-by': 'Executat De',
      
      // Promo Codes
      'promo.codes-title': 'Coduri Promoționale',
      'promo.code': 'Cod',
      'promo.type': 'Tip',
      'promo.value': 'Valoare',
      'promo.min-order': 'Comandă Min',
      'promo.expires': 'Expiră',
      'promo.limit': 'Limită',
      'promo.no-codes': 'Nu există coduri',
      
      // Banner
      'banner.management': 'Gestionare Bannere Promoționale',
      'banner.title': 'Titlu Banner',
      'banner.title-error': 'Titlul trebuie să aibă minim 3 caractere',
      'banner.description': 'Descriere',
      'banner.description-error': 'Descrierea trebuie să aibă minim 10 caractere',
      'banner.image-url': 'URL Imagine Produs',
      'banner.image-info': 'URL-ul imaginii produsului în ofertă',
      'banner.link-url': 'Link Destinație',
      'banner.link-info': 'Ex: /category/1, /products, /search/keyword',
      'banner.button-text': 'Text Buton',
      'banner.bg-color': 'Culoare Fundal',
      'banner.text-color': 'Culoare Text',
      'banner.active': 'Banner Activ',
      'banner.active-info': 'Doar un banner activ va fi afișat pe homepage',
      'banner.reset': 'Resetează',
      'banner.saving': 'Se salvează...',
      'banner.update': 'Actualizează',
      'banner.create': 'Creează Banner',
      'banner.existing': 'Bannere Existente',
      'banner.no-banners': 'Nu există bannere create încă',
      'banner.create-first': 'Creează Primul Banner',
      'banner.active-badge': 'ACTIV',
      'banner.link': 'Link',
      'banner.button': 'Buton',
      'banner.deactivate': 'Dezactivează',
      
      // Info Page
      'info.html-content': 'Conținut HTML (poți folosi <p>, <b>, <br>)',
      
      // Reviews
      'reviews.edit-your-review': 'Editează Review-ul Tău',
      'reviews.write-review': 'Scrie un Review',
      'reviews.update': 'Actualizează Review',
      'reviews.submit': 'Trimite Review',
      'reviews.submitting': 'Se trimite...',
      'reviews.customer-reviews': 'Review-uri Clienți',
      'reviews.reviews': 'review-uri',
      'reviews.must-purchase': 'Trebuie să cumperi acest produs pentru a scrie un review.',
      'reviews.rating': 'Rating',
      'reviews.title': 'Title',
      'reviews.title-placeholder': 'Rezumă experiența ta',
      'reviews.review': 'Review',
      'reviews.comment-placeholder': 'Spune-ne despre experiența ta cu acest produs',
      'reviews.no-reviews': 'Niciun review încă. Fii primul care scrie un review pentru acest produs!',
      'reviews.verified-purchase': 'Verified Purchase',
      'reviews.helpful': 'Util',
      'reviews.previous': 'Anterior',
      'reviews.next': 'Următorul',
      'reviews.page': 'Pagina',
      'reviews.of': 'din',
      
      // Orders
      'orders.completed': 'Finalizat',
      'orders.report-by-date': 'Raport Comenzi după Dată',
      'orders.date': 'Data Comanda',
      'orders.tracking-number': 'Nr. Tracking',
      'orders.status': 'Status',
      'orders.payment-method': 'Metoda Plată',
      'orders.card': 'Card Bancar',
      'orders.cash': 'Ramburs',
      'orders.total': 'Total Comandă',
      'orders.customer-details': 'Detalii Client',
      'orders.name': 'Nume',
      'orders.shipping-address': 'Adresă Livrare',
      'orders.billing-address': 'Adresă Facturare',
      'orders.image': 'Imagine',
      'orders.product': 'Produs',
      'orders.unit-price': 'Preț Unitar',
      'orders.no-orders-found': 'Nu au fost găsite comenzi pentru data selectată:',
      
      // Payment
      'payment.success-title': 'Plată Reușită!',
      'payment.success-message': 'Comanda ta a fost plasată cu succes!',
      'payment.email-confirmation': 'Vei primi un email de confirmare în scurt timp.',
      'payment.verifying-payment': 'Se verifică plata...',
      'payment.order-details': 'Detalii Comandă',
      'payment.tracking-number': 'Număr Tracking',
      'payment.payment-id': 'ID Plată',
      'payment.amount-paid': 'Sumă Plătită',
      'payment.receipt-email': 'Email Confirmare',
      'payment.whats-next': 'Ce urmează?',
      'payment.processing-info': 'Comanda ta va fi procesată în cel mai scurt timp posibil. Vei primi un email când produsele vor fi expediate.',
      'payment.confirmation-email': 'Email de Confirmare',
      'payment.email-sent-info': 'Am trimis un email de confirmare cu detaliile comenzii tale. Verifică și folderul spam.',
      'payment.view-orders': 'Vezi Comenzile Mele',
      'payment.back-to-shop': 'Înapoi la Magazine',
      'payment.back-to-store': 'Înapoi la Magazine',
      'payment.back-to-checkout': 'Înapoi la Checkout',
      'payment.cancelled-title': 'Plată Anulată',
      'payment.not-processed': 'Plata ta nu a fost procesată.',
      'payment.what-can-do': 'Ce poți face acum?',
      'payment.try-again': 'Încearcă Din Nou',
      'payment.try-again-info': 'Poți încerca să finalizezi comanda din nou cu același card sau cu un card diferit.',
      'payment.modify-order': 'Modifică comanda',
      'payment.need-help': 'Ai nevoie de ajutor?',
      'payment.contact-support': 'Contactează Suportul',
      'payment.contact-support-info': 'Dacă problema persistă, te rugăm să contactezi suportul clienți.',
      'payment.common-issues': 'Probleme Comune',
      'payment.card-declined': 'Card refuzat?',
      'payment.card-declined-info': 'Verifică dacă ai suficiente fonduri sau contactează banca ta.',
      'payment.card-expired': 'Card expirat?',
      'payment.card-expired-info': 'Folosește un card cu o dată de expirare validă.',
      'payment.auth-failed': 'Autentificare eșuată?',
      'payment.auth-failed-info': 'Asigură-te că ai activat 3D Secure pe cardul tău.',
      'payment.cart-review': 'Revizuiește produsele din coș sau modifică cantitățile înainte de a plasa comanda.',
      'payment.network-error': 'Eroare de rețea?',
      'payment.network-check': 'Verifică conexiunea la internet și încearcă din nou.',
      
      // Alerts
      'alerts.loading': 'Se încarcă alertele tale...',
      'alerts.my-alerts': 'Alertele Mele de Preț',
      'alerts.manage-info': 'Gestionează alertele tale de preț și primește notificări automate',
      'alerts.no-active': 'Nu ai alerte de preț active',
      'alerts.set-alert-info': 'Setează o alertă de preț pe un produs și vei fi notificat automat când prețul scade!',
      'alerts.current-price': 'Preț Curent',
      'alerts.target-price': 'Preț Țintă',
      'alerts.created': 'Creat',
      'alerts.notified': 'Notificat',
      'alerts.view-product': 'Vezi Produs',
      
      // Common
      'common.loading': 'Se încarcă...',
      'common.error': 'A apărut o eroare',
      'common.error-title': 'Eroare!',
      'common.success': 'Succes',
      'common.cancel': 'Anulează',
      'common.save': 'Salvează',
      'common.delete': 'Șterge',
      'common.edit': 'Editează',
      'common.back': 'Înapoi',
      'common.yes': 'Da',
      'common.no': 'Nu',
      'common.close': 'Închide',
      'common.confirm': 'Confirmă',
      'common.continue': 'Continuă',
      'common.send': 'Trimite',
      'common.redirect': 'Veți fi redirecționat automat către lista de produse...',
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
      'products.filter': 'Filter Products',
      'products.back-to-list': 'Back to Product List',
      'products.management': 'Product Management',
      'products.ordered': 'Ordered Products',
      'products.inactive-notice': 'Inactive products will not be visible in the store',
      'products.explore': 'Explore Products',
      'products.loading-info': 'Loading product information...',
      'products.delete-confirmation': 'Delete Confirmation',
      'products.warning': 'Warning!',
      'products.delete-warning': 'This action will permanently delete the product and cannot be undone.',
      'products.delete-permanent': 'Delete Permanently',
      'products.deleting': 'Deleting...',
      
      // Product Form
      'product-form.add-new': 'Add New Product',
      'product-form.edit': 'Edit Product',
      'product-form.loading': 'Loading product data...',
      
      // Cart
      'cart.title': 'My Cart',
      'cart.empty': 'Your shopping cart is empty',
      'cart.view': 'View Cart',
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
      'wishlist.empty-message': 'Start adding products you love!',
      'wishlist.view-details': 'View Details',
      'wishlist.move-to-cart': 'Move to Cart',
      'wishlist.clear-all': 'Clear Wishlist',
      
      // Admin
      'admin.add-new': 'Add New Code',
      'admin.add-banner': 'Add New Banner',
      'admin.edit-banner': 'Edit Banner',
      'admin.new-banner': 'New Banner',
      'admin.edit-code': 'Edit Code',
      'admin.new-code': 'New Code',
      'admin.close': 'Close',
      'admin.edit-page': 'Edit Page (Admin)',
      'admin.edit-content': 'Edit content for',
      'admin.add-code': 'Add code',
      'admin.loading-products': 'Loading products...',
      'admin.category': 'Category',
      'admin.price': 'Price',
      'admin.stock': 'Stock',
      'admin.status': 'Status',
      'admin.actions': 'Actions',
      'admin.active': 'Active',
      'admin.inactive': 'Inactive',
      'admin.activate': 'Activate',
      'admin.no-products': 'No products in database.',
      'admin.total-products': 'Total Products',
      'admin.active-products': 'Active Products',
      'admin.inactive-products': 'Inactive Products',
      
      // Stock
      'stock.management': 'Stock Management',
      'stock.alerts': 'Stock Alerts',
      'stock.movements': 'Stock Movements',
      'stock.no-alerts': 'No active stock alerts.',
      'stock.current': 'Current Stock',
      'stock.minimum': 'Minimum Stock',
      'stock.level': 'Level',
      'stock.date': 'Date',
      'stock.edit-product': 'Edit Product',
      'stock.no-movements': 'No stock movements recorded.',
      'stock.type': 'Type',
      'stock.previous-stock': 'Previous Stock',
      'stock.new-stock': 'New Stock',
      'stock.reason': 'Reason',
      'stock.performed-by': 'Performed By',
      
      // Promo Codes
      'promo.codes-title': 'Promotional Codes',
      'promo.code': 'Code',
      'promo.type': 'Type',
      'promo.value': 'Value',
      'promo.min-order': 'Min Order',
      'promo.expires': 'Expires',
      'promo.limit': 'Limit',
      'promo.no-codes': 'No codes available',
      
      // Banner
      'banner.management': 'Promotional Banners Management',
      'banner.title': 'Banner Title',
      'banner.title-error': 'Title must have at least 3 characters',
      'banner.description': 'Description',
      'banner.description-error': 'Description must have at least 10 characters',
      'banner.image-url': 'Product Image URL',
      'banner.image-info': 'URL of the product image in the offer',
      'banner.link-url': 'Destination Link',
      'banner.link-info': 'Ex: /category/1, /products, /search/keyword',
      'banner.button-text': 'Button Text',
      'banner.bg-color': 'Background Color',
      'banner.text-color': 'Text Color',
      'banner.active': 'Active Banner',
      'banner.active-info': 'Only one active banner will be displayed on homepage',
      'banner.reset': 'Reset',
      'banner.saving': 'Saving...',
      'banner.update': 'Update',
      'banner.create': 'Create Banner',
      'banner.existing': 'Existing Banners',
      'banner.no-banners': 'No banners created yet',
      'banner.create-first': 'Create First Banner',
      'banner.active-badge': 'ACTIVE',
      'banner.link': 'Link',
      'banner.button': 'Button',
      'banner.deactivate': 'Deactivate',
      
      // Info Page
      'info.html-content': 'HTML Content (you can use <p>, <b>, <br>)',
      
      // Reviews
      'reviews.edit-your-review': 'Edit Your Review',
      'reviews.write-review': 'Write a Review',
      'reviews.update': 'Update Review',
      'reviews.submit': 'Submit Review',
      'reviews.submitting': 'Submitting...',
      'reviews.customer-reviews': 'Customer Reviews',
      'reviews.reviews': 'reviews',
      'reviews.must-purchase': 'You must purchase this product to write a review.',
      'reviews.rating': 'Rating',
      'reviews.title': 'Title',
      'reviews.title-placeholder': 'Summarize your experience',
      'reviews.review': 'Review',
      'reviews.comment-placeholder': 'Tell us about your experience with this product',
      'reviews.no-reviews': 'No reviews yet. Be the first to write a review for this product!',
      'reviews.verified-purchase': 'Verified Purchase',
      'reviews.helpful': 'Helpful',
      'reviews.previous': 'Previous',
      'reviews.next': 'Next',
      'reviews.page': 'Page',
      'reviews.of': 'of',
      
      // Orders
      'orders.completed': 'Completed',
      'orders.report-by-date': 'Orders Report by Date',
      'orders.date': 'Order Date',
      'orders.tracking-number': 'Tracking No.',
      'orders.status': 'Status',
      'orders.payment-method': 'Payment Method',
      'orders.card': 'Credit Card',
      'orders.cash': 'Cash on Delivery',
      'orders.total': 'Order Total',
      'orders.customer-details': 'Customer Details',
      'orders.name': 'Name',
      'orders.shipping-address': 'Shipping Address',
      'orders.billing-address': 'Billing Address',
      'orders.image': 'Image',
      'orders.product': 'Product',
      'orders.unit-price': 'Unit Price',
      'orders.no-orders-found': 'No orders found for selected date:',
      
      // Payment
      'payment.success-title': 'Payment Successful!',
      'payment.success-message': 'Your order has been placed successfully!',
      'payment.email-confirmation': 'You will receive a confirmation email shortly.',
      'payment.verifying-payment': 'Verifying payment...',
      'payment.order-details': 'Order Details',
      'payment.tracking-number': 'Tracking Number',
      'payment.payment-id': 'Payment ID',
      'payment.amount-paid': 'Amount Paid',
      'payment.receipt-email': 'Receipt Email',
      'payment.whats-next': 'What\'s next?',
      'payment.processing-info': 'Your order will be processed as soon as possible. You will receive an email when the products are shipped.',
      'payment.confirmation-email': 'Confirmation Email',
      'payment.email-sent-info': 'We sent a confirmation email with your order details. Check your spam folder too.',
      'payment.view-orders': 'View My Orders',
      'payment.back-to-shop': 'Back to Shop',
      'payment.back-to-store': 'Back to Store',
      'payment.back-to-checkout': 'Back to Checkout',
      'payment.cancelled-title': 'Payment Cancelled',
      'payment.not-processed': 'Your payment was not processed.',
      'payment.what-can-do': 'What can you do now?',
      'payment.try-again': 'Try Again',
      'payment.try-again-info': 'You can try to complete the order again with the same card or with a different card.',
      'payment.modify-order': 'Modify Order',
      'payment.need-help': 'Need help?',
      'payment.contact-support': 'Contact Support',
      'payment.contact-support-info': 'If the problem persists, please contact customer support.',
      'payment.common-issues': 'Common Issues',
      'payment.card-declined': 'Card declined?',
      'payment.card-declined-info': 'Check if you have sufficient funds or contact your bank.',
      'payment.card-expired': 'Card expired?',
      'payment.card-expired-info': 'Use a card with a valid expiration date.',
      'payment.auth-failed': 'Authentication failed?',
      'payment.auth-failed-info': 'Make sure you have 3D Secure enabled on your card.',
      'payment.cart-review': 'Review the products in your cart or modify quantities before placing the order.',
      'payment.network-error': 'Network error?',
      'payment.network-check': 'Check your internet connection and try again.',
      
      // Alerts
      'alerts.loading': 'Loading your alerts...',
      'alerts.my-alerts': 'My Price Alerts',
      'alerts.manage-info': 'Manage your price alerts and receive automatic notifications',
      'alerts.no-active': 'No active price alerts',
      'alerts.set-alert-info': 'Set a price alert on a product and you will be automatically notified when the price drops!',
      'alerts.current-price': 'Current Price',
      'alerts.target-price': 'Target Price',
      'alerts.created': 'Created',
      'alerts.notified': 'Notified',
      'alerts.view-product': 'View Product',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.error-title': 'Error!',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.back': 'Back',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.close': 'Close',
      'common.confirm': 'Confirm',
      'common.continue': 'Continue',
      'common.send': 'Send',
      'common.redirect': 'You will be automatically redirected to the product list...',
    };
    
    return translations[key] || key;
  }
}
