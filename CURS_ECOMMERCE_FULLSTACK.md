# 🛒 CURS COMPLET: DEZVOLTAREA UNEI PLATFORME E-COMMERCE FULL-STACK

## Ghid Practic pentru Elevi - De la Zero la Producție

---

**Autor:** Curriculum dezvoltat pentru elevi de liceu (clasa a XI-a)  
**Durată:** 20 lecții interactive  
**Nivel:** Începător (fără cunoștințe prealabile)  
**Data:** Decembrie 2025

---

# 📚 CUPRINS

## MODUL 1: FUNDAMENTE (Lecțiile 1-3)
1. [Introducere în Dezvoltarea Web & Arhitectura Full-Stack](#lectia-1)
2. [Pregătirea Mediului de Dezvoltare](#lectia-2)
3. [Concepte de Bază: HTTP, REST API, JSON](#lectia-3)

## MODUL 2: BACKEND - PRIMII PAȘI (Lecțiile 4-7)
4. [Introducere în Spring Boot - Primul API](#lectia-4)
5. [Baza de Date MySQL - Tabele și Relații](#lectia-5)
6. [Spring Data REST - Operațiuni CRUD](#lectia-6)
7. [Testarea API-ului cu Postman](#lectia-7)

## MODUL 3: FRONTEND - PRIMII PAȘI (Lecțiile 8-11)
8. [Introducere în Angular - Primul Component](#lectia-8)
9. [Routing și Navigare în Angular](#lectia-9)
10. [Services și HTTP Requests](#lectia-10)
11. [Afișarea Produselor - Listă și Detalii](#lectia-11)

## MODUL 4: FUNCȚIONALITĂȚI PRINCIPALE (Lecțiile 12-15)
12. [Shopping Cart - Coșul de Cumpărături](#lectia-12)
13. [Checkout - Procesul de Comandă](#lectia-13)
14. [Autentificare cu Auth0](#lectia-14)
15. [Gestionarea Comenzilor Utilizatorilor](#lectia-15)

## MODUL 5: PANOUL ADMIN (Lecțiile 16-18)
16. [CRUD Produse - Adăugare, Editare, Ștergere](#lectia-16)
17. [Dashboard Analytics cu Chart.js](#lectia-17)
18. [Gestionarea Stocului și Alertelor](#lectia-18)

## MODUL 6: CONCEPTE AVANSATE & DEPLOYMENT (Lecțiile 19-20)
19. [Integrarea Stripe pentru Plăți Online](#lectia-19)
20. [Deployment în Producție + Best Practices](#lectia-20)

---

# 🎯 CE VEI ÎNVĂȚA ÎN ACEST CURS

La finalul acestui curs, vei fi capabil să:

✅ **Înțelegi arhitectura** unei aplicații full-stack moderne  
✅ **Construiești** propria ta platformă e-commerce funcțională  
✅ **Lucrezi cu** REST API, baze de date relaționale, și framework-uri moderne  
✅ **Implementezi** funcționalități avansate: autentificare, plăți online, analytics  
✅ **Deployezi** aplicația în producție pe un server real

---

# 📋 TEHNOLOGII FOLOSITE

## Backend
- **Java 17** - Limbajul de programare
- **Spring Boot 3.4.4** - Framework pentru dezvoltare rapidă
- **MySQL 8.0** - Baza de date relațională
- **Maven** - Gestiunea dependințelor

## Frontend
- **Angular 19** - Framework JavaScript modern
- **TypeScript** - Limbaj tipizat pentru JavaScript
- **Bootstrap 5** - Framework CSS pentru design
- **Chart.js** - Librărie pentru grafice

## Servicii Externe
- **Auth0** - Autentificare securizată
- **Stripe** - Procesare plăți online
- **JWT** - Tokenuri pentru securitate

## Tools & Deployment
- **VS Code** - Editor de cod
- **Postman** - Testare API
- **Git** - Control versiune
- **Docker** - Containerizare (opțional)

---

<div style="page-break-after: always;"></div>

# MODUL 1: FUNDAMENTE

---

# <a name="lectia-1"></a>📘 LECȚIA 1: Introducere în Dezvoltarea Web & Arhitectura Full-Stack

**Durata:** 2 ore  
**Obiective:** Să înțelegi cum funcționează o aplicație web modernă și ce înseamnă "full-stack"

---

## 🎓 1.1 Ce este o Aplicație Web?

Hai să începem cu ceva simplu. Când intri pe YouTube, Facebook sau Amazon, folosești o **aplicație web**. Dar ce se întâmplă în spate?

### Componentele de bază:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  FRONTEND   │ ◄────► │   BACKEND   │ ◄────► │  DATABASE   │
│             │         │             │         │             │
│ (Ce vezi tu)│         │ (Logica)    │         │ (Datele)    │
└─────────────┘         └─────────────┘         └─────────────┘
    Angular                Spring Boot              MySQL
```

**Să explicăm fiecare parte:**

### 🖥️ **FRONTEND** (Interfața Vizuală)
- Este tot ce **vezi și cu ce interacționezi** în browser
- Butoane, imagini, formulare, meniuri
- Scris în: **HTML** (structura), **CSS** (aspect), **JavaScript/TypeScript** (interactivitate)
- **Exemplu:** Când dai click pe "Adaugă în coș", frontend trimite o cerere către backend

### ⚙️ **BACKEND** (Logica de Business)
- Este "creierul" aplicației - partea care **gândește**
- Procesează cereri, verifică reguli, face calcule
- Scris în: **Java** (în cazul nostru, folosind Spring Boot)
- **Exemplu:** Verifică dacă produsul este în stoc, calculează prețul total cu taxe

### 🗄️ **DATABASE** (Baza de Date)
- Aici sunt **stocate toate datele**: produse, utilizatori, comenzi
- Organizate în tabele (ca în Excel, dar mult mai puternic)
- Folosim: **MySQL** (un sistem de management al bazelor de date)
- **Exemplu:** Tabelul "produse" cu coloane: id, nume, preț, descriere, stoc

---

## 🏗️ 1.2 Arhitectura Full-Stack a Platformei Noastre

Platforma noastră e-commerce va avea această structură:

```
┌────────────────────────────────────────────────────────────┐
│                    UTILIZATOR (Browser)                     │
└────────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────┐
│               FRONTEND - Angular (Port 4200)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Pagina principală cu produse                      │  │
│  │  - Coș de cumpărături                                │  │
│  │  - Checkout (finalizare comandă)                     │  │
│  │  - Panou admin (gestionare produse)                  │  │
│  │  - Dashboard analytics (grafice, statistici)         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                            ▼ HTTP Requests
┌────────────────────────────────────────────────────────────┐
│              BACKEND - Spring Boot (Port 8443)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints:                                 │  │
│  │  - GET /api/products - Lista produse                 │  │
│  │  - POST /api/orders - Creează comandă                │  │
│  │  - GET /api/analytics - Statistici vânzări           │  │
│  │  - Authentication (Auth0 + JWT tokens)               │  │
│  │  - Payment Processing (Stripe integration)           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                            ▼ SQL Queries
┌────────────────────────────────────────────────────────────┐
│                DATABASE - MySQL (Port 3306)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tabele:                                             │  │
│  │  - product (id, name, price, stock, category_id)    │  │
│  │  - product_category (id, category_name)             │  │
│  │  - customer (id, email, first_name, last_name)      │  │
│  │  - orders (id, customer_id, total_price, date)      │  │
│  │  - order_item (id, order_id, product_id, quantity)  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 1.3 Cum Comunică Componentele?

Hai să vedem un **exemplu concret**: Un client dorește să cumpere o carte.

### **Pasul 1:** Utilizatorul vede produsul
```
Frontend (Angular) → Afișează pagina cu produse
                   → Cartea "Harry Potter" - 45 Lei
```

### **Pasul 2:** Click pe "Adaugă în coș"
```
Frontend → Trimite cerere HTTP la Backend
Request: POST http://localhost:8443/api/cart/add
Body: {
  "productId": 123,
  "quantity": 1
}
```

### **Pasul 3:** Backend procesează cererea
```
Backend (Spring Boot):
1. Primește cererea
2. Verifică: "Există produsul cu id=123?"
3. Verifică: "Este în stoc?"
4. Salvează în baza de date: "Coș pentru user123, produs 123, cantitate 1"
5. Returnează răspuns: {"success": true, "message": "Produs adăugat"}
```

### **Pasul 4:** Database operațiuni
```
MySQL execută:
SELECT * FROM product WHERE id = 123;
-- Returnează: id=123, name="Harry Potter", price=45, stock=10

UPDATE cart_items 
SET quantity = quantity + 1 
WHERE user_id = 123 AND product_id = 123;
```

### **Pasul 5:** Frontend primește răspunsul
```
Frontend (Angular):
- Primește răspunsul de la backend
- Afișează mesaj: "✓ Produs adăugat în coș!"
- Actualizează iconița coșului: "🛒 1"
```

---

## 📊 1.4 Ce Înseamnă "REST API"?

**REST** = **RE**presentational **S**tate **T**ransfer

Este un **set de reguli** pentru cum comunică frontend cu backend prin internet.

### Metodele HTTP (cum vorbim cu serverul):

| Metodă | Scop | Exemplu |
|--------|------|---------|
| **GET** | Obține date | `GET /api/products` - Lista produse |
| **POST** | Creează ceva nou | `POST /api/orders` - Comandă nouă |
| **PUT** | Actualizează complet | `PUT /api/products/123` - Editează produs |
| **PATCH** | Actualizează parțial | `PATCH /api/products/123/stock` - Doar stocul |
| **DELETE** | Șterge | `DELETE /api/products/123` - Șterge produs |

### Exemplu concret de endpoint REST:

```
URL: https://localhost:8443/api/products

GET /api/products               → Lista toate produsele
GET /api/products/123           → Detalii produs cu id=123
GET /api/products?category=5    → Produse din categoria 5
POST /api/products              → Adaugă produs nou
PUT /api/products/123           → Editează produsul 123
DELETE /api/products/123        → Șterge produsul 123
```

---

## 💾 1.5 Baza de Date Relațională

Datele sunt organizate în **tabele** legate între ele prin **relații**.

### Exemplu: Schema bazei noastre

```sql
┌─────────────────────────────────────┐
│      product_category               │
├─────────────┬───────────────────────┤
│ id (PK)     │ category_name         │
├─────────────┼───────────────────────┤
│ 1           │ Books                 │
│ 2           │ Electronics           │
│ 3           │ Clothes               │
└─────────────┴───────────────────────┘
           ▲
           │ (relație: category_id)
           │
┌──────────────────────────────────────────────────────┐
│                    product                           │
├─────┬──────────┬───────┬────────────┬───────────────┤
│ id  │ name     │ price │ stock      │ category_id   │
│(PK) │          │       │            │ (FK)          │
├─────┼──────────┼───────┼────────────┼───────────────┤
│ 123 │ HP Book  │ 45.00 │ 10         │ 1             │
│ 124 │ Laptop   │ 2500  │ 5          │ 2             │
│ 125 │ T-Shirt  │ 80    │ 50         │ 3             │
└─────┴──────────┴───────┴────────────┴───────────────┘
```

**Terminologie:**
- **PK (Primary Key)** = Cheie primară (identificator unic al rândului)
- **FK (Foreign Key)** = Cheie externă (referință către alt tabel)

---

## 🎨 1.6 De Ce Folosim Angular pentru Frontend?

**Angular** este un framework JavaScript modern care ne ajută să:

✅ **Organizăm codul** în componente refolosibile  
✅ **Gestionăm starea** aplicației (date, utilizator logat, coș)  
✅ **Navigăm** între pagini fără reload (SPA - Single Page Application)  
✅ **Facem request-uri** HTTP către backend ușor  
✅ **Actualizăm automat** interfața când datele se schimbă

### Structura unei aplicații Angular:

```
src/app/
├── components/              # Componente vizuale
│   ├── product-list/        # Lista produse
│   ├── product-details/     # Detalii produs
│   ├── cart/                # Coș cumpărături
│   └── checkout/            # Finalizare comandă
├── services/                # Servicii (logică business)
│   ├── product.service.ts   # Operații produse
│   └── cart.service.ts      # Operații coș
├── models/                  # Modele de date (Product, Order)
└── app.module.ts            # Configurare aplicație
```

---

## ⚡ 1.7 De Ce Folosim Spring Boot pentru Backend?

**Spring Boot** este un framework Java care:

✅ **Simplifică** crearea de API-uri REST  
✅ **Gestionează automat** conexiunea la baza de date  
✅ **Oferă securitate** built-in (autentificare, autorizare)  
✅ **Are comunitate mare** și documentație excelentă  
✅ **Scalează ușor** când aplicația crește

### Structura unui proiect Spring Boot:

```
src/main/java/com/luv2code/ecommerce/
├── config/                  # Configurări (Security, CORS)
├── controller/              # REST Controllers (API endpoints)
│   ├── ProductController.java
│   └── OrderController.java
├── service/                 # Business Logic
│   ├── ProductService.java
│   └── CheckoutService.java
├── repository/              # Acces la baza de date
│   └── ProductRepository.java
└── entity/                  # Entități (tabele DB)
    ├── Product.java
    └── Order.java
```

---

## 🔐 1.8 Securitatea Aplicației

### Concepte importante:

**1. Autentificare (Authentication)**
- "Cine ești tu?" → Verificăm identitatea (login cu email + parolă)
- Folosim **Auth0** (serviciu extern sigur)

**2. Autorizare (Authorization)**
- "Ce ai voie să faci?" → Verificăm permisiunile
- Exemplu: Doar admin poate șterge produse

**3. JWT (JSON Web Token)**
- "Bilet de acces" pe care îl primești după login
- Frontend îl atașează la fiecare request
- Backend verifică dacă este valid

```
Flow-ul de autentificare:

User → Login (email + password) 
     → Auth0 verifică datele
     → Returnează JWT Token: "eyJhbGciOiJIUzI1NiIsInR..."
     → Frontend salvează token-ul
     → La fiecare request HTTP: 
        Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
     → Backend verifică token-ul
     → Dacă valid → permite acțiunea
       Dacă invalid → returnează eroare 401 Unauthorized
```

---

## 💳 1.9 Procesarea Plăților cu Stripe

**Stripe** este un serviciu extern care gestionează plățile cu cardul.

### De ce folosim Stripe și nu gestionăm noi plățile?

❌ **NU** ar trebui să stocăm niciodată date de card în propria bază de date!  
✅ Stripe se ocupă de securitate (PCI compliance)  
✅ Suportă diverse metode de plată  
✅ Gestionează fraud detection  

### Flow-ul plății:

```
1. User completează formularul de card pe frontend
2. Frontend trimite datele către Stripe (DIRECT, nu prin backend-ul nostru!)
3. Stripe returnează un "payment_intent" (intenție de plată)
4. Frontend trimite payment_intent la backend-ul nostru
5. Backend confirmă plata cu Stripe
6. Dacă success → Salvăm comanda în DB
7. Dacă fail → Afișăm eroare utilizatorului
```

---

## 📈 1.10 Dashboard Analytics

Panoul admin va afișa **statistici** despre vânzări:

- **Venit total** - Suma totală încasată
- **Număr comenzi** - Câte comenzi au fost plasate
- **Produse top** - Cele mai vândute produse
- **Grafice** - Evoluția vânzărilor în timp

### Cum funcționează?

```
Backend:
- Query complex în MySQL: 
  SELECT SUM(total_price) FROM orders WHERE date >= '2025-01-01'
  
- Procesează datele și returnează JSON:
  {
    "totalRevenue": 125000,
    "totalOrders": 450,
    "topProducts": [...]
  }

Frontend:
- Primește datele
- Folosește Chart.js pentru a crea grafice
- Afișează într-un dashboard frumos
```

---

## 📝 EXERCIȚIU PRACTIC - Lecția 1

### 🎯 Obiectiv
Să înțelegi arhitectura aplicației prin desenarea ei pe hârtie.

### 📋 Pași:

**1. Desenează schema arhitecturii (15 minute)**

Pe o foaie de hârtie, desenează 3 dreptunghiuri reprezentând:
- Frontend (Angular)
- Backend (Spring Boot)
- Database (MySQL)

Desenează săgeți între ele și notează:
- Ce date circulă între componente
- În ce format (HTTP Request/Response, SQL Queries)

**2. Identifică componentele pentru funcționalități (20 minute)**

Pentru fiecare funcționalitate, scrie ce componente sunt implicate:

| Funcționalitate | Frontend | Backend | Database |
|----------------|----------|---------|----------|
| Afișare listă produse | ✓ ProductListComponent | ✓ ProductController | ✓ Tabel product |
| Adaugă în coș | ✓ CartComponent | ✓ CartService | ✓ Tabel cart_items |
| Finalizare comandă | ✓ CheckoutComponent | ✓ OrderController | ✓ Tabel orders |
| Login utilizator | ✓ LoginComponent | ✓ Auth0 Integration | ✓ Tabel customer |

**Completează tu tabelul cu:**
- Dashboard Analytics
- Editare produs (admin)
- Procesare plată

**3. Scrie flow-ul pentru "Cumpără un produs" (25 minute)**

Descrie pas cu pas ce se întâmplă când un utilizator cumpără un produs:

```
1. User vede produsul "Laptop - 2500 Lei" pe pagina principală
2. [TU COMPLETEZI - ce se întâmplă când dă click pe "Adaugă în coș"?]
3. [TU COMPLETEZI - ce request HTTP se trimite?]
4. [TU COMPLETEZI - ce face backend-ul?]
5. [TU COMPLETEZI - ce se salvează în database?]
6. [TU COMPLETEZI - ce vede utilizatorul în final?]
```

**4. Quiz rapid (10 minute)**

Răspunde la următoarele întrebări (verifică răspunsurile la sfârșit):

a) Ce înseamnă REST API?  
b) Care sunt cele 5 metode HTTP principale?  
c) Ce este un JWT token?  
d) De ce folosim Stripe pentru plăți?  
e) Ce înseamnă "full-stack developer"?  

---

### ✅ Răspunsuri Quiz:

a) **REST API** = Set de reguli pentru comunicarea între frontend și backend prin HTTP  
b) **GET** (obține), **POST** (creează), **PUT** (actualizează), **PATCH** (actualizează parțial), **DELETE** (șterge)  
c) **JWT token** = Un "bilet de acces" care dovedește că ești logat, trimis la fiecare request  
d) Pentru **securitate** - nu ar trebui să stocăm date de card în propria DB  
e) **Full-stack developer** = Programator care lucrează atât la frontend (ce vede utilizatorul) cât și la backend (logica aplicației)  

---

### 🎓 Ce ai învățat în Lecția 1:

✅ Arhitectura unei aplicații full-stack (Frontend + Backend + Database)  
✅ Cum comunică componentele prin REST API  
✅ De ce folosim Angular, Spring Boot și MySQL  
✅ Concepte de securitate (autentificare, autorizare, JWT)  
✅ Cum funcționează procesarea plăților cu Stripe  
✅ Structura bazei de date relaționale  

---

### 📚 Următoarea Lecție: Pregătirea Mediului de Dezvoltare

În Lecția 2 vom instala toate tool-urile necesare:
- Java Development Kit (JDK)
- Node.js și npm
- MySQL Server
- Visual Studio Code
- Postman

**Pregătește-te să instalezi software! 🚀**

---

<div style="page-break-after: always;"></div>

# <a name="lectia-2"></a>📘 LECȚIA 2: Pregătirea Mediului de Dezvoltare

**Durata:** 3 ore  
**Obiective:** Să instalezi și configurezi toate tool-urile necesare pentru a începe programarea

---

## 🎓 2.1 Ce vom instala?

Pentru a dezvolta aplicația noastră e-commerce, avem nevoie de următoarele tool-uri:

| Tool | Versiune | Scop |
|------|----------|------|
| **Java JDK** | 17 | Limbaj pentru backend |
| **Node.js** | 20 LTS | Runtime pentru Angular |
| **npm** | 10+ | Manager pachete JavaScript |
| **Angular CLI** | 19 | Tool-uri pentru Angular |
| **MySQL** | 8.0 | Baza de date |
| **MySQL Workbench** | 8.0 | Interfață vizuală pentru DB |
| **Visual Studio Code** | Latest | Editor de cod |
| **Git** | Latest | Control versiune |
| **Postman** | Latest | Testare API |
| **Maven** | 3.9+ | Build tool pentru Java |

---

## 💻 2.2 Instalare Java JDK 17

### De ce avem nevoie de Java?
Java este limbajul în care vom scrie backend-ul nostru (Spring Boot).

### Pași de instalare:

**1. Download JDK:**
- Mergi pe: https://www.oracle.com/java/technologies/downloads/#java17
- Alege versiunea pentru sistemul tău (Windows/Mac/Linux)
- Download **JDK 17** (Java Development Kit)

**2. Instalare:**
```
Windows:
- Rulează installer-ul (.exe)
- Acceptă locația default: C:\Program Files\Java\jdk-17
- Click Next → Install

Mac:
- Rulează .dmg file
- Drag & Drop în Applications

Linux:
sudo apt update
sudo apt install openjdk-17-jdk
```

**3. Verificare instalare:**
Deschide Command Prompt/Terminal și rulează:

```bash
java -version
```

Ar trebui să vezi ceva similar cu:
```
java version "17.0.9" 2023-10-17 LTS
Java(TM) SE Runtime Environment (build 17.0.9+11-LTS-201)
```

**4. Setare variabile de mediu (Windows):**

```
1. Click dreapta pe "This PC" → Properties
2. Advanced system settings → Environment Variables
3. System variables → New:
   Variable name: JAVA_HOME
   Variable value: C:\Program Files\Java\jdk-17

4. Editează Path:
   Adaugă: %JAVA_HOME%\bin
```

Testează:
```bash
echo %JAVA_HOME%
# Ar trebui să afișeze: C:\Program Files\Java\jdk-17
```

---

## 🟢 2.3 Instalare Node.js și npm

### De ce avem nevoie de Node.js?
Angular rulează pe Node.js. npm (Node Package Manager) instalează librăriile JavaScript.

### Pași de instalare:

**1. Download Node.js:**
- Mergi pe: https://nodejs.org/
- Download versiunea **LTS (Long Term Support)** - 20.x
- Alege installer-ul pentru sistemul tău

**2. Instalare:**
```
Windows/Mac:
- Rulează installer-ul
- Acceptă toate opțiunile default
- Asigură-te că "Add to PATH" este bifat
```

**3. Verificare instalare:**

```bash
node --version
# Ar trebui: v20.10.0 (sau similar)

npm --version
# Ar trebui: 10.2.3 (sau similar)
```

---

## 🅰️ 2.4 Instalare Angular CLI

### Ce este Angular CLI?
Command Line Interface pentru Angular - tool-uri pentru a crea și gestiona proiecte Angular.

### Instalare:

```bash
npm install -g @angular/cli@19
```

**Explicație comandă:**
- `npm install` = Instalează un pachet
- `-g` = Global (disponibil în tot sistemul, nu doar într-un proiect)
- `@angular/cli` = Numele pachetului
- `@19` = Versiunea specifică

**Verificare:**

```bash
ng version
```

Output așteptat:
```
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/

Angular CLI: 19.0.0
Node: 20.10.0
Package Manager: npm 10.2.3
```

---

## 🗄️ 2.5 Instalare MySQL Server și Workbench

### Ce este MySQL?
Sistem de management al bazei de date unde vom stoca produse, comenzi, utilizatori.

### Pași de instalare:

**1. Download MySQL:**
- Mergi pe: https://dev.mysql.com/downloads/installer/
- Windows: Download "mysql-installer-community"
- Mac: Download "MySQL Community Server" .dmg

**2. Instalare (Windows):**

```
1. Rulează installer-ul
2. Alege "Developer Default" (instalează Server + Workbench + altele)
3. Click Next → Execute (va instala componentele)

4. Configuration MySQL Server:
   - Type: Development Computer
   - Port: 3306 (default)
   - Root Password: alegeti o parolă PUTERNICĂ (ex: "MySecurePass123!")
     ⚠️ NOTEAZĂ-ȚI PAROLA - vei avea nevoie de ea!
   
5. Windows Service:
   - Service Name: MySQL80
   - Start at System Startup: ✓ (bifat)

6. Apply Configuration → Finish
```

**3. Instalare (Mac):**

```
1. Deschide .dmg file
2. Rulează installer-ul
3. Alege "Use Strong Password Encryption"
4. Setează root password (NOTEAZĂ-L!)
5. Finish
```

**4. Instalare MySQL Workbench (dacă nu e inclus):**
- Download de pe: https://dev.mysql.com/downloads/workbench/
- Instalează ca orice aplicație normală

**5. Verificare instalare:**

Deschide Command Prompt/Terminal:

```bash
mysql --version
# Output: mysql  Ver 8.0.35 for Win64 on x86_64
```

**6. Testare conexiune:**

```bash
mysql -u root -p
# Introduce parola pe care ai setat-o

# Dacă vezi:
mysql>
# Înseamnă că funcționează! ✓

# Ieși cu:
exit;
```

---

## 📝 2.6 Instalare Visual Studio Code

### Ce este VS Code?
Editor de cod modern, gratuit, cu suport excelent pentru Java, TypeScript, și multe altele.

### Instalare:

**1. Download:**
- Mergi pe: https://code.visualstudio.com/
- Download pentru sistemul tău

**2. Instalare:**
```
Windows/Mac:
- Rulează installer-ul
- Acceptă licența
- IMPORTANT: Bifează:
  ✓ Add "Open with Code" action to context menu
  ✓ Add to PATH
```

**3. Verificare:**

```bash
code --version
# Output: 1.85.0 (sau similar)
```

**4. Instalare extensii necesare:**

Deschide VS Code și instalează următoarele extensii (Ctrl+Shift+X):

**Pentru Java:**
- ✓ **Extension Pack for Java** (Microsoft)
- ✓ **Spring Boot Extension Pack** (VMware)
- ✓ **Maven for Java** (Microsoft)

**Pentru Angular:**
- ✓ **Angular Language Service** (Angular)
- ✓ **Angular Snippets** (John Papa)
- ✓ **TypeScript Hero** (Christoph Bühler)

**Utilitare:**
- ✓ **GitLens** (GitKraken)
- ✓ **Path Intellisense** (Christian Kohler)
- ✓ **Prettier** (Prettier)
- ✓ **ES Lint** (Microsoft)
- ✓ **MySQL** (Weijan Chen)

---

## 🔧 2.7 Instalare Maven

### Ce este Maven?
Tool pentru build și management dependințe în proiecte Java.

### Instalare:

**Windows:**

```
1. Download Maven:
   https://maven.apache.org/download.cgi
   Alege: apache-maven-3.9.6-bin.zip

2. Extrage în: C:\Program Files\apache-maven-3.9.6

3. Setare variabile de mediu:
   MAVEN_HOME = C:\Program Files\apache-maven-3.9.6
   Path → Adaugă: %MAVEN_HOME%\bin
```

**Mac/Linux:**

```bash
# Mac (cu Homebrew):
brew install maven

# Linux:
sudo apt install maven
```

**Verificare:**

```bash
mvn --version
# Output:
# Apache Maven 3.9.6
# Maven home: C:\Program Files\apache-maven-3.9.6
# Java version: 17.0.9
```

---

## 📮 2.8 Instalare Postman

### Ce este Postman?
Aplicație pentru testarea API-urilor REST (trimitem request-uri HTTP și vedem răspunsurile).

### Instalare:

**1. Download:**
- Mergi pe: https://www.postman.com/downloads/
- Download pentru sistemul tău

**2. Instalare:**
- Rulează installer-ul
- La prima pornire: "Skip signing in" (nu e nevoie de cont deocamdată)

**3. Testare:**

Hai să testăm Postman cu un API public:

```
1. Deschide Postman
2. Click "New" → "HTTP Request"
3. Setează:
   Method: GET
   URL: https://jsonplaceholder.typicode.com/posts/1
4. Click "Send"

Ar trebui să primești un răspuns JSON:
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere...",
  "body": "quia et suscipit..."
}
```

---

## 🔀 2.9 Instalare Git

### Ce este Git?
Sistem de control al versiunilor - urmărește modificările în cod.

### Instalare:

**Windows:**
```
1. Download: https://git-scm.com/download/win
2. Rulează installer-ul
3. Setări importante:
   - Default editor: "Use Visual Studio Code"
   - Path environment: "Git from command line and also from 3rd-party software"
   - Line ending conversions: "Checkout Windows-style, commit Unix-style"
```

**Mac:**
```bash
# Instalare prin Xcode Command Line Tools:
xcode-select --install

# SAU prin Homebrew:
brew install git
```

**Linux:**
```bash
sudo apt install git
```

**Configurare Git:**

```bash
# Setează numele și email-ul (vor apărea în commit-uri)
git config --global user.name "Numele Tău"
git config --global user.email "email@example.com"

# Verificare:
git config --list
```

---

## ✅ 2.10 Checklist Final - Verificare Instalare

Rulează următoarele comenzi și verifică că toate funcționează:

```bash
# Java
java -version                  # ✓ Should show: java version "17.0.x"
echo %JAVA_HOME%               # ✓ Should show: C:\Program Files\Java\jdk-17

# Node.js & npm
node --version                 # ✓ Should show: v20.x.x
npm --version                  # ✓ Should show: 10.x.x

# Angular CLI
ng version                     # ✓ Should show: Angular CLI: 19.0.0

# MySQL
mysql --version                # ✓ Should show: mysql Ver 8.0.x

# Maven
mvn --version                  # ✓ Should show: Apache Maven 3.9.x

# Git
git --version                  # ✓ Should show: git version 2.x.x

# VS Code
code --version                 # ✓ Should show: 1.85.x
```

**Dacă TOATE comenzile funcționează → Ești gata pentru dezvoltare! 🎉**

---

## 📂 2.11 Organizarea Workspace-ului

Creează o structură de foldere pentru proiect:

```bash
# Creează folderul principal
mkdir C:\Projects\ecommerce-fullstack
cd C:\Projects\ecommerce-fullstack

# Structura finală:
C:\Projects\ecommerce-fullstack\
├── backend\             # Proiectul Spring Boot (va fi creat în Lecția 4)
├── frontend\            # Proiectul Angular (va fi creat în Lecția 8)
├── database\            # Script-uri SQL
└── docs\                # Documentație
```

---

## 📝 EXERCIȚIU PRACTIC - Lecția 2

### 🎯 Obiectiv
Să verifici că toate tool-urile sunt instalate corect și funcționează.

### 📋 Partea 1: Verificare Instalări (30 minute)

**1. Creează un fișier de verificare:**

Creează un fișier `verificare-setup.txt` și completează-l rulând comenzile:

```bash
# Rulează fiecare comandă și notează output-ul:

java -version
# [NOTEAZĂ OUTPUT-UL AICI]

node --version
# [NOTEAZĂ OUTPUT-UL AICI]

npm --version
# [NOTEAZĂ OUTPUT-UL AICI]

ng version
# [NOTEAZĂ OUTPUT-UL AICI]

mysql --version
# [NOTEAZĂ OUTPUT-UL AICI]

mvn --version
# [NOTEAZĂ OUTPUT-UL AICI]

git --version
# [NOTEAZĂ OUTPUT-UL AICI]

code --version
# [NOTEAZĂ OUTPUT-UL AICI]
```

---

### 📋 Partea 2: Testare MySQL (20 minute)

**1. Conectare la MySQL:**

```bash
mysql -u root -p
# Introdu parola pe care ai setat-o
```

**2. Creează prima ta bază de date:**

```sql
-- Creează baza de date pentru proiect
CREATE DATABASE IF NOT EXISTS ecommerce_test;

-- Selectează baza de date
USE ecommerce_test;

-- Creează un tabel simplu de test
CREATE TABLE test_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2)
);

-- Inserează câteva date de test
INSERT INTO test_products (name, price) VALUES
    ('Test Product 1', 10.99),
    ('Test Product 2', 25.50),
    ('Test Product 3', 99.00);

-- Verifică datele
SELECT * FROM test_products;

-- Ar trebui să vezi:
-- +----+----------------+-------+
-- | id | name           | price |
-- +----+----------------+-------+
-- |  1 | Test Product 1 | 10.99 |
-- |  2 | Test Product 2 | 25.50 |
-- |  3 | Test Product 3 | 99.00 |
-- +----+----------------+-------+
```

**3. Testare MySQL Workbench:**

```
1. Deschide MySQL Workbench
2. Click pe conexiunea "Local instance MySQL80"
3. Introdu parola root
4. În stânga, ar trebui să vezi baza de date "ecommerce_test"
5. Click pe ecommerce_test → Tables → test_products
6. Click dreapta pe test_products → "Select Rows"
7. Ar trebui să vezi cele 3 produse inserate
```

---

### 📋 Partea 3: Testare Postman (15 minute)

**1. Testare API public:**

```
1. Deschide Postman
2. New → HTTP Request
3. Method: GET
4. URL: https://fakestoreapi.com/products
5. Click "Send"

Ar trebui să primești o listă de produse în format JSON.
```

**2. Salvare Request:**

```
1. Click "Save" în Postman
2. Create Collection: "E-commerce API Tests"
3. Request name: "Get All Products - Test API"
4. Save to collection
```

**3. Testare POST Request:**

```
1. New Request
2. Method: POST
3. URL: https://jsonplaceholder.typicode.com/posts
4. Click "Body" → "raw" → "JSON"
5. Adaugă:
   {
     "title": "Test from Postman",
     "body": "This is my first POST request",
     "userId": 1
   }
6. Click "Send"

Ar trebui să primești înapoi obiectul cu un id generat.
```

---

### 📋 Partea 4: Testare VS Code + Java (20 minute)

**1. Creează primul tău program Java:**

```
1. Deschide VS Code
2. File → Open Folder → Alege: C:\Projects\ecommerce-fullstack
3. Creează un folder nou: "test-java"
4. În "test-java", creează un fișier: HelloWorld.java
```

**2. Scrie codul:**

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Java version: " + System.getProperty("java.version"));
        
        // Test variabile
        String projectName = "E-commerce Platform";
        int numberOfProducts = 100;
        double totalRevenue = 25000.50;
        
        System.out.println("\nProject: " + projectName);
        System.out.println("Products: " + numberOfProducts);
        System.out.println("Revenue: $" + totalRevenue);
    }
}
```

**3. Compilează și rulează:**

```bash
# În terminal (Ctrl + `)
cd test-java
javac HelloWorld.java    # Compilează (creează HelloWorld.class)
java HelloWorld          # Rulează

# Output așteptat:
# Hello from Java!
# Java version: 17.0.9
# 
# Project: E-commerce Platform
# Products: 100
# Revenue: $25000.5
```

---

### 📋 Partea 5: Testare Angular CLI (25 minute)

**1. Creează primul tău proiect Angular (test):**

```bash
cd C:\Projects\ecommerce-fullstack
ng new test-angular-app

# Va întreba:
? Would you like to add Angular routing? (y/N) → Tastează: y
? Which stylesheet format would you like to use? → Alege: CSS

# Așteaptă instalarea dependințelor (~2-3 minute)
```

**2. Pornește aplicația:**

```bash
cd test-angular-app
ng serve

# Output așteptat:
# ✔ Browser application bundle generation complete.
# ** Angular Live Development Server is listening on localhost:4200 **
```

**3. Vezi aplicația în browser:**

```
1. Deschide browser (Chrome/Firefox)
2. Mergi la: http://localhost:4200
3. Ar trebui să vezi pagina default Angular cu:
   - Logo Angular
   - Linkuri către documentație
   - Text "test-angular-app app is running!"
```

**4. Modifică aplicația:**

Deschide în VS Code:
```
test-angular-app/src/app/app.component.html
```

Șterge tot conținutul și înlocuiește cu:

```html
<div style="text-align: center; padding: 50px;">
  <h1>🛒 E-commerce Platform - Test</h1>
  <p>Acesta este primul meu proiect Angular!</p>
  
  <div style="margin-top: 30px;">
    <h2>Produse</h2>
    <ul style="list-style: none;">
      <li>📱 Laptop - $1200</li>
      <li>📚 Book - $20</li>
      <li>👕 T-Shirt - $35</li>
    </ul>
  </div>
</div>
```

Salvează fișierul (Ctrl+S). Browserul va reîncărca automat și vei vedea schimbările! ✨

**5. Oprește serverul:**

```bash
# În terminal, apasă: Ctrl + C
# Confirmă: Y
```

---

### 📋 Partea 6: Testare Git (15 minute)

**1. Inițializează Git pentru proiect:**

```bash
cd C:\Projects\ecommerce-fullstack
git init

# Output: Initialized empty Git repository in C:/Projects/ecommerce-fullstack/.git/
```

**2. Creează .gitignore:**

```bash
# Creează fișierul .gitignore
code .gitignore
```

Adaugă în fișier:

```
# Foldere Node.js
node_modules/
dist/

# Foldere Java/Maven
target/
.idea/
*.iml

# Foldere de sistem
.DS_Store
Thumbs.db

# Fișiere de configurare locale
application-local.properties
*.log
```

**3. Primul commit:**

```bash
# Adaugă toate fișierele
git add .

# Creează primul commit
git commit -m "Initial commit - Setup development environment"

# Verifică status
git status
# Output: On branch master, nothing to commit, working tree clean

# Vezi istoricul
git log --oneline
# Output: abc1234 (HEAD -> master) Initial commit - Setup development environment
```

---

### ✅ Checklist Final - Exercițiu

Bifează ce ai reușit să finalizezi:

- [ ] Toate comenzile de verificare rulează fără erori
- [ ] MySQL funcționează și ai creat baza de date test
- [ ] MySQL Workbench se conectează și afișează tabele
- [ ] Postman trimite request-uri GET și POST cu succes
- [ ] Java compilează și rulează HelloWorld.java
- [ ] Angular CLI creează proiect și rulează pe localhost:4200
- [ ] Ai modificat un fișier Angular și ai văzut schimbarea live
- [ ] Git este inițializat și ai făcut primul commit

**Dacă ai bifat TOATE → Felicitări! Ești gata pentru Lecția 3! 🎉**

---

### 🎓 Ce ai învățat în Lecția 2:

✅ Instalarea și configurarea Java JDK 17  
✅ Instalarea Node.js, npm și Angular CLI  
✅ Configurarea MySQL Server și MySQL Workbench  
✅ Instalarea și folosirea VS Code cu extensii  
✅ Instalarea Maven pentru build Java  
✅ Testarea API-urilor cu Postman  
✅ Inițializarea și folosirea Git pentru control versiune  
✅ Crearea primului program Java  
✅ Crearea primei aplicații Angular  
✅ Structurarea workspace-ului pentru proiect  

---

### 📚 Următoarea Lecție: Concepte de Bază (HTTP, REST API, JSON)

În Lecția 3 vom învăța:
- Cum funcționează protocolul HTTP
- Ce este un REST API în detaliu
- Formatul JSON pentru schimb de date
- Request/Response cycle
- Status codes (200, 404, 500, etc.)
- Headers și Body în request-uri

**Pregătește-te să înveți comunicarea web! 🌐**

---

<div style="page-break-after: always;"></div>

