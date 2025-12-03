# 🌐 TRADUCERI LIPSĂ - LISTĂ COMPLETĂ FIȘIERE DE ACTUALIZAT

## ✅ FINALIZAT
- `language.service.ts` - Actualizat cu toate traducerile (ro + en)
- `wishlist.component.html` - Actualizat complet

## 🔴 PRIORITATE MARE - Componente Vizibile Utilizatorilor

### 1. product-details.component.html
**Texte de tradus:**
- "Adaugă în Coș" → `{{ 'products.add-to-cart' | translate }}`
- "Înapoi la Lista de Produse" → `{{ 'products.back-to-list' | translate }}`
- "Se încarcă detaliile produsului..." → `{{ 'product-form.loading' | translate }}`
- "Anulează" → `{{ 'common.cancel' | translate }}`

### 2. product-form.component.html
**Texte de tradus:**
- "Editare Produs" → `{{ 'product-form.edit' | translate }}`
- "Adaugă Produs Nou" → `{{ 'product-form.add-new' | translate }}`
- "Se încarcă datele produsului..." → `{{ 'product-form.loading' | translate }}`
- "Produsele inactive nu vor fi vizibile în magazin" → `{{ 'products.inactive-notice' | translate }}`
- "Anulează" → `{{ 'common.cancel' | translate }}`
- "Salvează" → `{{ 'common.save' | translate }}`

### 3. product-filter.component.html
**Texte de tradus:**
- "Filtrare Produse" → `{{ 'products.filter' | translate }}`

### 4. payment-success.component.html
**Texte de tradus:**
- "Se încarcă..." → `{{ 'common.loading' | translate }}`
- "Plată Reușită!" → `{{ 'payment.success-title' | translate }}`
- "Comanda ta a fost plasată cu succes!" → `{{ 'payment.success-message' | translate }}`
- "Comanda ta va fi procesată în cel mai scurt timp posibil. Vei primi un email când produsele vor fi expediate." → `{{ 'payment.processing-info' | translate }}`
- "Înapoi la Magazine" → `{{ 'payment.back-to-store' | translate }}`

### 5. payment-cancel.component.html
**Texte de tradus:**
- "Înapoi la Checkout" → `{{ 'payment.back-to-checkout' | translate }}`
- "Revizuiește produsele din coș sau modifică cantitățile înainte de a plasa comanda." → `{{ 'payment.cart-review' | translate }}`
- "Înapoi la Magazine" → `{{ 'payment.back-to-store' | translate }}`
- "Eroare de rețea?" → `{{ 'payment.network-error' | translate }}`
- "Verifică conexiunea la internet și încearcă din nou." → `{{ 'payment.network-check' | translate }}`

### 6. orders-by-date.component.html
**Texte de tradus:**
- "Finalizat" → `{{ 'orders.completed' | translate }}`
- "Produse Comandate" → `{{ 'products.ordered' | translate }}`

### 7. my-price-alerts.component.html
**Texte de tradus:**
- "Se încarcă alertele tale..." → `{{ 'alerts.loading' | translate }}`
- "Explorează Produsele" → `{{ 'products.explore' | translate }}`

### 8. delete-product.component.html
**Texte de tradus:**
- "Eroare!" → `{{ 'common.error-title' | translate }}`
- "Veți fi redirecționat automat către lista de produse..." → `{{ 'common.redirect' | translate }}`

### 9. product-reviews.component.html
**Texte de tradus:**
- "Editează Review-ul Tău" → `{{ 'reviews.edit-your-review' | translate }}`
- "Scrie un Review" → `{{ 'reviews.write-review' | translate }}`
- "Actualizează Review" → `{{ 'reviews.update' | translate }}`
- "Trimite Review" → `{{ 'reviews.submit' | translate }}`
- "Se trimite..." → `{{ 'reviews.submitting' | translate }}`
- "Anulează" → `{{ 'common.cancel' | translate }}`

### 10. stock-alerts.component.html
**Texte de tradus:**
- "Se încarcă..." → `{{ 'common.loading' | translate }}`
- "Editează Produs" → `{{ 'common.edit' | translate }}`

## 🟡 PRIORITATE MEDIE - Componente Admin

### 11. admin-products.component.html
**Texte de tradus:**
- "Management Produse" → `{{ 'products.management' | translate }}`

### 12. admin-promo-codes.component.html
**Texte de tradus:**
- "Adaugă Cod Nou" → `{{ 'admin.add-new' | translate }}`
- "Închide" → `{{ 'admin.close' | translate }}`
- "Editează Cod" → `{{ 'admin.edit-code' | translate }}`
- "Cod Nou" → `{{ 'admin.new-code' | translate }}`
- "Adaugă cod" → `{{ 'admin.add-code' | translate }}`

### 13. admin-promo-banner.component.html
**Texte de tradus:**
- "Anulează" → `{{ 'common.cancel' | translate }}`
- "Adaugă Banner Nou" → `{{ 'admin.add-banner' | translate }}`
- "Editează Banner" → `{{ 'admin.edit-banner' | translate }}`
- "Banner Nou" → `{{ 'admin.new-banner' | translate }}`
- "Editează" → `{{ 'common.edit' | translate }}`

### 14. info-page.component.html
**Texte de tradus:**
- "Editează Pagina (Admin)" → `{{ 'admin.edit-page' | translate }}`
- "Editează conținutul pentru:" → `{{ 'admin.edit-content' | translate }}`
- "Salvează" → `{{ 'common.save' | translate }}`
- "Anulează" → `{{ 'common.cancel' | translate }}`

## 📝 INSTRUCȚIUNI PENTRU ACTUALIZARE

Pentru fiecare fișier HTML, înlocuiește textele hardcodate cu:
```html
<!-- ÎNAINTE -->
<button>Salvează</button>

<!-- DUPĂ -->
<button>{{ 'common.save' | translate }}</button>
```

## 🔍 COMENZI PENTRU VERIFICARE

După actualizare, verifică că toate traducerile funcționează:

```bash
# Caută texte românești rămase hardcodate (exclus comentarii HTML)
grep -r "Adaug\|Sterge\|Editeaz\|Salvare\|Anulare" src/app/components --include="*.html" | grep -v "<!--"

# Verifică pipe-ul translate
grep -r "| translate" src/app/components --include="*.html" | wc -l
```

## ✅ CHECKLIST FINAL

După ce actualizezi toate fișierele:
- [ ] Toate textele vizibile folosesc `| translate`
- [ ] Testează comutarea limbii în aplicație (Română ↔ Engleză)
- [ ] Verifică că nu există texte hardcodate rămase
- [ ] Testează fiecare componentă în ambele limbi
- [ ] Verifică că nu s-au introdus erori de compilare

## 🚀 URMĂTORII PAȘI

1. Actualizează toate fișierele HTML din lista de mai sus
2. Testează aplicația în ambele limbi
3. Adaugă traduceri noi în `language.service.ts` dacă găsești texte noi
4. Commit schimbările: `git commit -m "feat: Complete i18n support for all components"`

---

**Data creare:** 3 Decembrie 2025  
**Status:** În progress - 2/14 componente completate
