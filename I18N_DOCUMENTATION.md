# Multi-Language Support (i18n) - Documentație

## 📋 Prezentare Generală

Sistemul de multi-limbaj implementat permite utilizatorilor să comute între **Română** (limba implicită) și **Engleză** folosind un language switcher elegant în header.

## 🎯 Caracteristici

- ✅ **Română** ca limbă implicită (neschimbată)
- ✅ **Engleză** ca limbă secundară
- ✅ Language Switcher în header cu steaguri 🇷🇴 🇬🇧
- ✅ Persistență în localStorage
- ✅ Reactive updates (BehaviorSubject)
- ✅ TranslatePipe pentru utilizare ușoară în template-uri
- ✅ 100+ stringuri traduse

## 📁 Structura Fișierelor

```
src/app/
├── services/
│   └── language.service.ts          # Service principal cu traduceri
├── components/
│   └── language-switcher/
│       ├── language-switcher.component.ts     # Logica dropdown
│       ├── language-switcher.component.html   # UI dropdown
│       └── language-switcher.component.css    # Styling
├── pipes/
│   └── translate.pipe.ts            # Pipe pentru traduceri
└── directives/
    └── click-outside.directive.ts   # Directivă pentru închidere dropdown
```

## 🚀 Utilizare

### 1. În Template HTML (cu Pipe)

```html
<!-- Metodă recomandată: folosind pipe -->
<button>{{ 'common.save' | translate }}</button>
<!-- Output RO: "Salvează" -->
<!-- Output EN: "Save" -->

<h2>{{ 'cart.title' | translate }}</h2>
<!-- Output RO: "Coșul Meu" -->
<!-- Output EN: "My Cart" -->
```

### 2. În Component TypeScript

```typescript
import { LanguageService } from '../../services/language.service';

export class MyComponent {
  constructor(private languageService: LanguageService) {}
  
  getTranslation() {
    const text = this.languageService.translate('common.loading');
    // Returns: "Se încarcă..." (RO) sau "Loading..." (EN)
  }
  
  getCurrentLanguage() {
    const lang = this.languageService.getCurrentLanguage();
    // Returns: 'ro' sau 'en'
  }
  
  changeLanguage() {
    this.languageService.setLanguage('en');
    // Schimbă limba la engleză
  }
}
```

### 3. Subscribe la Schimbări de Limbă

```typescript
ngOnInit() {
  this.languageService.currentLanguage$.subscribe((lang: string) => {
    console.log('Limba curentă:', lang);
    // Reacționează la schimbarea limbii
  });
}
```

## 🔑 Translation Keys Disponibile

### Header
- `header.search.placeholder` - "Caută produse..." / "Search products..."
- `header.search.button` - "Caută" / "Search"
- `header.cart` - "Coș" / "Cart"
- `header.wishlist` - "Dorințe" / "Wishlist"
- `header.login` - "Autentificare" / "Login"
- `header.logout` - "Deconectare" / "Logout"
- `header.profile` - "Profil" / "Profile"
- `header.orders` - "Comenzi" / "Orders"
- `header.welcome` - "Bine ai revenit" / "Welcome back"

### Products
- `products.add-to-cart` - "Adaugă în Coș" / "Add to Cart"
- `products.save` - "Salvează" / "Save"
- `products.delete` - "Șterge" / "Delete"
- `products.add-to-favorites` - "Adaugă la Favorite" / "Add to Favorites"
- `products.remove-from-favorites` - "Elimină din Favorite" / "Remove from Favorites"
- `products.no-products` - "Niciun produs găsit" / "No products found"
- `products.in-stock` - "În Stoc" / "In Stock"
- `products.out-of-stock` - "Stoc Epuizat" / "Out of Stock"

### Cart
- `cart.title` - "Coșul Meu" / "My Cart"
- `cart.empty` - "Coșul tău de cumpărături este gol" / "Your shopping cart is empty"
- `cart.quantity` - "Cantitate" / "Quantity"
- `cart.subtotal` - "Subtotal" / "Subtotal"
- `cart.total` - "Preț Total" / "Total Price"
- `cart.total-quantity` - "Cantitate Totală" / "Total Quantity"
- `cart.shipping` - "Livrare" / "Shipping"
- `cart.free-shipping` - "Gratuit" / "Free"
- `cart.checkout` - "Finalizează Comanda" / "Checkout"
- `cart.continue-shopping` - "Continuă Cumpărăturile" / "Continue Shopping"

### Checkout
- `checkout.title` - "Finalizare Comandă" / "Checkout"
- `checkout.customer-info` - "Date Client" / "Customer Information"
- `checkout.first-name` - "Prenume" / "First Name"
- `checkout.last-name` - "Nume" / "Last Name"
- `checkout.email` - "Email" / "Email"
- `checkout.shipping-address` - "Adresă Livrare" / "Shipping Address"
- `checkout.billing-address` - "Adresă Facturare" / "Billing Address"
- `checkout.country` - "Țară" / "Country"
- `checkout.street` - "Stradă" / "Street"
- `checkout.city` - "Oraș" / "City"
- `checkout.state` - "Județ" / "State"
- `checkout.zipcode` - "Cod Poștal" / "Zip Code"
- `checkout.same-address` - "Adresa de facturare este aceiași cu adresa de livrare" / "Billing address same as shipping address"
- `checkout.payment-method` - "Metodă de Plată" / "Payment Method"
- `checkout.cash-on-delivery` - "Plata la livrare (Numerar / Cash)" / "Cash on Delivery"
- `checkout.credit-card` - "Card de Credit" / "Credit Card"
- `checkout.shipping-method` - "Metodă de Livrare" / "Shipping Method"
- `checkout.promo-code` - "Cod Promoțional" / "Promo Code"
- `checkout.apply` - "Aplică" / "Apply"
- `checkout.remove` - "Elimină" / "Remove"
- `checkout.order-review` - "Verificare Comandă" / "Order Review"
- `checkout.discount` - "Reducere" / "Discount"
- `checkout.place-order` - "Finalizează Comanda" / "Place Order"

### Wishlist
- `wishlist.title` - "Lista Mea de Dorințe" / "My Wishlist"
- `wishlist.empty` - "Nu ai produse salvate" / "You have no saved products"
- `wishlist.view-details` - "Vezi Detalii" / "View Details"
- `wishlist.move-to-cart` - "Mută în Coș" / "Move to Cart"
- `wishlist.clear-all` - "Golește Wishlist" / "Clear Wishlist"

### Common
- `common.loading` - "Se încarcă..." / "Loading..."
- `common.error` - "A apărut o eroare" / "An error occurred"
- `common.success` - "Succes" / "Success"
- `common.cancel` - "Anulează" / "Cancel"
- `common.save` - "Salvează" / "Save"
- `common.delete` - "Șterge" / "Delete"
- `common.edit` - "Editează" / "Edit"
- `common.back` - "Înapoi" / "Back"
- `common.yes` - "Da" / "Yes"
- `common.no` - "Nu" / "No"

## ➕ Adăugare Traduceri Noi

### 1. În LanguageService

```typescript
// În metoda getRomanianText()
private getRomanianText(key: string): string {
  const translations: { [key: string]: string } = {
    // ... traduceri existente
    'my.new.key': 'Textul meu în română',
  };
  return translations[key] || key;
}

// În metoda getEnglishText()
private getEnglishText(key: string): string {
  const translations: { [key: string]: string } = {
    // ... traduceri existente
    'my.new.key': 'My text in English',
  };
  return translations[key] || key;
}
```

### 2. Utilizare în Template

```html
<p>{{ 'my.new.key' | translate }}</p>
```

## 🌍 Adăugare Limbi Noi

Pentru a adăuga o limbă nouă (ex: Germană 🇩🇪):

### 1. Actualizează LanguageService

```typescript
// Adaugă limba în array
public readonly languages: Language[] = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }  // NOU
];

// Adaugă metoda de traducere
private getGermanText(key: string): string {
  const translations: { [key: string]: string } = {
    'header.cart': 'Warenkorb',
    'common.save': 'Speichern',
    // ... alte traduceri
  };
  return translations[key] || key;
}

// Actualizează metoda translate()
translate(key: string): string {
  const lang = this.getCurrentLanguage();
  
  if (lang === 'ro') return this.getRomanianText(key);
  if (lang === 'en') return this.getEnglishText(key);
  if (lang === 'de') return this.getGermanText(key);  // NOU
  
  return key;
}
```

## 🎨 Customizare UI

### Stiluri Language Switcher

Fișier: `language-switcher.component.css`

```css
/* Culoare buton */
.language-btn {
  background: rgba(255, 255, 255, 0.1);  /* Modifică aici */
  border-color: rgba(255, 255, 255, 0.2);
}

/* Culoare dropdown limba activă */
.language-option.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* Gradient personalizat */
}
```

## 📊 Performance

- **Bundle size impact**: +27 kB (de la 850 kB la 877 kB)
- **Runtime overhead**: Minim (BehaviorSubject + map lookup)
- **Memory**: ~50 KB pentru toate traducerile
- **Loading time**: Instant (no external files)

## 🔒 Best Practices

1. **Folosește pipe-ul în template-uri** în loc de service direct:
   ```html
   <!-- ✅ Bun -->
   {{ 'common.save' | translate }}
   
   <!-- ❌ Evită -->
   {{ getSaveText() }}
   ```

2. **Grupează translation keys logic**:
   ```typescript
   'header.cart'          // ✅ Bun
   'header.wishlist'      // ✅ Bun
   'saveButton'           // ❌ Evită (lipsă namespace)
   ```

3. **Păstrează consistență în naming**:
   - Folosește lowercase cu puncte: `section.subsection.key`
   - Evită camelCase sau snake_case

4. **Fallback**: Dacă un key nu există, va returna cheia însuși:
   ```typescript
   translate('nonexistent.key') // Returns: "nonexistent.key"
   ```

## 🐛 Troubleshooting

### Problema: Traducerile nu se actualizează

**Soluție**: Asigură-te că pipe-ul este `pure: false`:
```typescript
@Pipe({
  name: 'translate',
  pure: false  // Important!
})
```

### Problema: Dropdown nu se închide la click outside

**Soluție**: Verifică că `ClickOutsideDirective` este declarată în `app.module.ts`:
```typescript
declarations: [
  // ...
  ClickOutsideDirective
]
```

### Problema: Limba nu persistă după refresh

**Soluție**: Verifică că localStorage funcționează:
```typescript
// În browser console:
localStorage.getItem('selectedLanguage')  // Ar trebui să returneze 'ro' sau 'en'
```

## 📝 Notă Importantă

**Limba română rămâne neschimbată!** Toate textele din interfață sunt deja în română și vor rămâne așa când limba selectată este RO. Sistemul i18n adaugă **doar** suport pentru engleză ca opțiune secundară.

## 🎯 Roadmap Viitor

- [ ] Adăugare Germană (🇩🇪)
- [ ] Adăugare Franceză (🇫🇷)
- [ ] Import traduceri din fișiere JSON externe
- [ ] Traducere automată cu Google Translate API
- [ ] Admin panel pentru management traduceri

## 📞 Support

Pentru întrebări sau probleme, consultă:
- `language.service.ts` - Logica de traducere
- `FEATURES_TODO.md` - Documentație completă features
- GitHub Issues

---

**Implementat**: 3 Decembrie 2025  
**Versiune**: 1.0.0  
**Status**: ✅ Production Ready
