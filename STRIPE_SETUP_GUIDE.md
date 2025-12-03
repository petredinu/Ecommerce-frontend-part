# 🔐 Stripe Payment Integration - Setup Guide

## 📋 Overview

Această aplicație integrează **Stripe** pentru procesarea plăților reale. Sistemul include:
- ✅ Payment Intent API (backend)
- ✅ Stripe Elements (frontend)
- ✅ Webhook handling pentru confirmări
- ✅ Suport pentru refunds
- ✅ Test mode și Production mode

---

## 🚀 Quick Start

### 1. Creează Cont Stripe

1. Mergi la [https://stripe.com](https://stripe.com)
2. Înregistrează-te gratuit
3. Activează **Test Mode** (switch în colțul stânga-sus)

### 2. Obține API Keys

#### Test Mode Keys (pentru development):

1. Dashboard → **Developers** → **API keys**
2. Copiază următoarele keys:
   - **Publishable key** (începe cu `pk_test_...`)
   - **Secret key** (începe cu `sk_test_...`)

#### Live Mode Keys (pentru production):

1. Completează informațiile de business în Dashboard
2. Activează **Live Mode**
3. Obține keys similare (vor începe cu `pk_live_` și `sk_live_`)

---

## ⚙️ Configurare Backend

### Pas 1: Editează `application.properties`

Deschide fișierul:
```
Ecommerce-backend/spring-boot-ecommerce/src/main/resources/application.properties
```

Actualizează următoarele proprietăți:

```properties
# Stripe API Keys (Test Mode)
stripe.api.key=sk_test_YOUR_SECRET_KEY_HERE
stripe.api.publishable-key=pk_test_YOUR_PUBLISHABLE_KEY_HERE
stripe.webhook.secret=whsec_YOUR_WEBHOOK_SECRET_HERE

# Stripe Configuration
stripe.currency=ron
stripe.success-url=https://localhost:4200/payment-success
stripe.cancel-url=https://localhost:4200/payment-cancel
```

**⚠️ IMPORTANT**: 
- **NU** commite fișierul cu keys-urile reale în Git!
- Pentru production, folosește environment variables sau un secret manager
- Webhook secret-ul se configurează ulterior (vezi Pas 3)

### Pas 2: Repornește Backend-ul

```bash
cd Ecommerce-backend/spring-boot-ecommerce
./mvnw spring-boot:run
```

Backend-ul va rula pe: `https://localhost:8443`

### Pas 3: Configurează Webhooks (IMPORTANT!)

Webhooks-urile permit Stripe să notifice aplicația ta când o plată este confirmată.

#### Opțiunea A: Stripe CLI (Recomandat pentru testing)

1. Instalează Stripe CLI:
   ```bash
   # Windows (Chocolatey)
   choco install stripe-cli
   
   # macOS (Homebrew)
   brew install stripe/stripe-cli/stripe
   ```

2. Login în Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks către localhost:
   ```bash
   stripe listen --forward-to https://localhost:8443/api/webhook/stripe
   ```

4. CLI-ul va afișa un **webhook signing secret** (începe cu `whsec_`):
   ```
   > Ready! Your webhook signing secret is whsec_1234567890abcdef
   ```

5. Copiază acest secret în `application.properties`:
   ```properties
   stripe.webhook.secret=whsec_1234567890abcdef
   ```

#### Opțiunea B: Stripe Dashboard (Pentru production)

1. Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR_DOMAIN.com/api/webhook/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Copiază **Signing secret** în `application.properties`

---

## 🎨 Configurare Frontend

### Pas 1: Editează Environment File

Deschide fișierul:
```
Ecommerce-frontend-part/src/environments/environment.ts
```

Adaugă configurația Stripe:

```typescript
export const environment = {
  production: false,
  luv2shopApiUrl: 'https://localhost:8443/api',
  stripePublishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE'
};
```

**Repetă pentru** `environment.development.ts` și `environment.qa.ts`.

### Pas 2: Repornește Frontend-ul

```bash
cd Ecommerce-frontend-part
npm start
```

Frontend-ul va rula pe: `https://localhost:4200`

---

## 🧪 Testing

### Test Cards (Stripe)

Stripe oferă carduri de test pentru diferite scenarii:

#### ✅ Success - Plată reușită:
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34 (orice dată viitoare)
CVC: 123 (orice 3 cifre)
ZIP: 12345 (orice ZIP)
```

#### ❌ Card Declined:
```
Card Number: 4000 0000 0000 0002
```

#### ⏱️ Requires Authentication (3D Secure):
```
Card Number: 4000 0027 6000 3184
```

#### 💳 Alte test cards:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- **Discover**: 6011 1111 1111 1117

**Vezi toate test cards**: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

### Flow Complet de Test

1. **Adaugă produse în coș**
2. **Mergi la Checkout**
3. **Completează formularul** cu date de test
4. **Introdu card de test**: 4242 4242 4242 4242
5. **Confirmă plata**
6. **Verifică în Stripe Dashboard**:
   - Dashboard → Payments
   - Ar trebui să vezi plata marcată ca "Succeeded"

7. **Verifică Webhook Events**:
   - Dashboard → Developers → Webhooks
   - Click pe endpoint-ul tău
   - Vezi evenimente precum `payment_intent.succeeded`

8. **Verifică Backend Logs**:
   ```
   Payment intent created successfully. ID: pi_xxxx
   Payment succeeded for PaymentIntent: pi_xxxx
   Order ABC123 marked as PAID
   ```

---

## 🔐 Security Best Practices

### ✅ DO:

1. **Folosește HTTPS** (backend și frontend)
2. **Validează amount-urile** pe backend (nu te baza doar pe frontend)
3. **Verifică webhook signatures** (deja implementat)
4. **Păstrează secret keys în siguranță** (environment variables)
5. **Log-uiește toate tranzacțiile** (pentru audit trail)
6. **Implementează idempotency** (prevent duplicate charges)

### ❌ DON'T:

1. **NU expune Secret Key** în frontend sau Git
2. **NU procesezi plăți fără HTTPS**
3. **NU ignori webhook-urile** (acestea sunt sursa de adevăr)
4. **NU salvezi card details** (Stripe se ocupă de asta)
5. **NU verifici doar în frontend** (backend validation e CRITICĂ)

---

## 📊 Monitoring & Production

### Stripe Dashboard Features:

1. **Payments** - Vezi toate tranzacțiile
2. **Customers** - Gestionează clienții
3. **Balance** - Track revenue-ul tău
4. **Radar** - Fraud detection (automat)
5. **Reports** - Export CSV pentru accounting

### Production Checklist:

- [ ] Activează **Live Mode** în Stripe Dashboard
- [ ] Înlocuiește test keys cu live keys
- [ ] Configurează webhook URL pentru domeniul production
- [ ] Activează **Stripe Radar** (fraud detection)
- [ ] Setup **email notifications** pentru payments
- [ ] Configurează **payment methods** (card, Apple Pay, Google Pay)
- [ ] Testează end-to-end cu un card real (sumă mică)
- [ ] Setup **monitoring** (Sentry, DataDog)
- [ ] Configurează **alerts** pentru failed payments

---

## 🆘 Troubleshooting

### Eroare: "Invalid API Key"

**Soluție**: Verifică că ai copiat corect secret key-ul în `application.properties`. Key-ul trebuie să înceapă cu `sk_test_` (test mode) sau `sk_live_` (live mode).

### Eroare: "Webhook signature verification failed"

**Soluție**: 
1. Verifică că webhook secret din `application.properties` corespunde cu cel din Stripe Dashboard/CLI
2. Asigură-te că endpoint-ul primește header-ul `Stripe-Signature`
3. Pentru localhost testing, folosește Stripe CLI cu `--forward-to`

### Payment Intent nu se creează

**Soluție**:
1. Check backend logs pentru erori
2. Verifică că amount-ul este > 0 (în cents, nu RON)
3. Verifică că backend-ul rulează pe HTTPS
4. Test cu Postman/curl:
   ```bash
   curl -X POST https://localhost:8443/api/payment/create-payment-intent \
     -H "Content-Type: application/json" \
     -d '{"amount":10000,"currency":"ron","receiptEmail":"test@example.com","description":"Test Order"}'
   ```

### Frontend nu se conectează la backend

**Soluție**:
1. Verifică că backend rulează pe `https://localhost:8443`
2. Check CORS configuration în `application.properties`:
   ```properties
   allowed.origins=https://localhost:4200,http://localhost:4200
   ```
3. Verifică browser console pentru erori CORS

### Order status nu se actualizează după plată

**Soluție**:
1. Verifică că webhook-urile sunt configurate corect
2. Check backend logs pentru evenimente webhook
3. Verifică că `orderTrackingNumber` este salvat în Payment Intent metadata
4. Test webhook manual în Stripe Dashboard → Webhooks → Send test webhook

---

## 📚 Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Payment Intents API**: https://stripe.com/docs/payments/payment-intents
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Security Best Practices**: https://stripe.com/docs/security

---

## 💰 Stripe Pricing

### Test Mode:
- **100% GRATUIT** (unlimited transactions)

### Live Mode:
- **2.9% + $0.30** per successful card charge (în SUA)
- **1.5% + 1.80 RON** per successful charge (în România/Europa)
- **NU există** monthly fees sau setup fees
- **NU se plătește** pentru failed transactions

### Extra Features (optional):
- **Stripe Radar** (fraud detection): Inclus gratuit pentru primele 1,000 tx/month
- **Stripe Billing** (subscriptions): Același pricing
- **Stripe Connect** (marketplace): 0.25% additional fee

**Vezi pricing complet**: https://stripe.com/pricing

---

## 🎉 Next Steps

După integrarea Stripe, poți adăuga:

1. **Apple Pay / Google Pay** (1 zi) - One-click checkout
2. **Subscriptions** (3 zile) - Recurring payments
3. **Refund Portal** (2 zile) - Admin poate face refunds
4. **Invoice Generation** (2 zile) - PDF invoices pentru customers
5. **Payment Analytics** (2 zile) - Revenue tracking în admin dashboard

---

**Ultima actualizare**: 3 Decembrie 2025  
**Status**: ✅ Backend implementat, Frontend în progres  
**Next**: Creează Stripe Payment Component în Angular
