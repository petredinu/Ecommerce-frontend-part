# 📋 TODO - CONTINUARE CURS E-COMMERCE FULL-STACK

## ✅ CE AM FINALIZAT ASTĂZI (3 Decembrie 2025)

### Lecții Complete:
- ✅ **Lecția 1** - Introducere în Dezvoltarea Web & Arhitectura Full-Stack (complet cu exercițiu)
- ✅ **Lecția 2** - Pregătirea Mediului de Dezvoltare (complet cu exercițiu)

### Fișier Creat:
- `CURS_ECOMMERCE_FULLSTACK.md` (1379 linii - primele 2 lecții complete)

### Structură Implementată:
- Coperta profesională
- Cuprins complet cu toate cele 20 lecții
- Obiective generale ale cursului
- Tehnologii folosite
- Lecțiile 1-2 cu:
  - Explicații detaliate
  - Diagrame ASCII
  - Cod sursă comentat
  - Exerciții practice complete cu pași
  - Checklist final
  - Rezumat și preview lecție următoare

---

## 🚧 CE TREBUIE CONTINUAT MÂINE

### MODUL 1: FUNDAMENTE (1 lecție rămasă)

#### ❌ LECȚIA 3: Concepte de Bază - HTTP, REST API, JSON (2 ore)
**Conținut de adăugat:**

1. **3.1 Protocolul HTTP**
   - Request/Response cycle
   - Componentele unui HTTP Request (Method, URL, Headers, Body)
   - Componentele unui HTTP Response (Status Code, Headers, Body)
   - Diagram ASCII pentru flow-ul HTTP

2. **3.2 Metodele HTTP în Detaliu**
   - GET (obținere date) - exemplu: GET /api/products
   - POST (creare) - exemplu: POST /api/products cu body JSON
   - PUT (actualizare completă) - exemplu: PUT /api/products/123
   - PATCH (actualizare parțială) - exemplu: PATCH /api/products/123/stock
   - DELETE (ștergere) - exemplu: DELETE /api/products/123
   - Tabel comparativ cu exemple concrete

3. **3.3 Status Codes HTTP**
   - 2xx Success (200 OK, 201 Created, 204 No Content)
   - 3xx Redirect (301, 302)
   - 4xx Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
   - 5xx Server Errors (500 Internal Server Error, 503 Service Unavailable)
   - Exemple concrete pentru fiecare

4. **3.4 Headers HTTP**
   - Request Headers (Authorization, Content-Type, Accept)
   - Response Headers (Content-Type, Set-Cookie)
   - Exemplu complet de request cu headers

5. **3.5 Formatul JSON**
   - Sintaxa JSON (objects, arrays, strings, numbers, booleans, null)
   - Exemplu: Product în format JSON
   - Exemplu: Order cu order_items (nested objects)
   - Comparație JSON vs XML

6. **3.6 REST API Best Practices**
   - Naming conventions (/api/products, nu /api/getProducts)
   - Plural pentru collections
   - Versionare API (/api/v1/products)
   - Filtering, sorting, pagination

7. **EXERCIȚIU PRACTIC - Lecția 3**
   - Testare API public (fakestoreapi.com) cu Postman
   - Creează 10 request-uri diferite:
     * GET all products
     * GET product by id
     * GET products by category
     * POST new product (va returna mock)
     * PUT update product
     * DELETE product
   - Pentru fiecare request:
     * Screenshot Postman
     * Notează status code
     * Analizează headers
     * Verifică body response
   - Quiz final cu răspunsuri

---

### MODUL 2: BACKEND - PRIMII PAȘI (4 lecții)

#### ❌ LECȚIA 4: Spring Boot - Primul API (3 ore)
**Conținut de adăugat:**

1. **4.1 Ce este Spring Boot**
   - Framework-ul Spring
   - De ce Spring Boot (auto-configuration, embedded server)
   - Arhitectura layered (Controller → Service → Repository)

2. **4.2 Crearea Proiectului**
   - Spring Initializr (start.spring.io)
   - Dependințe necesare: Spring Web, Spring Data JPA, MySQL Driver
   - Structura proiectului Maven (pom.xml)
   - Import în VS Code

3. **4.3 Primul REST Controller**
   - Adnotări: @RestController, @RequestMapping, @GetMapping
   - Cod complet: HelloController.java
   - Rularea aplicației: mvn spring-boot:run
   - Testare în browser: http://localhost:8080/api/hello

4. **4.4 Product Controller - CRUD Simplu**
   - Product class (POJO)
   - ProductController cu endpoints:
     * GET /api/products - lista toate
     * GET /api/products/{id} - unul după id
     * POST /api/products - creează nou
   - ArrayList în memorie (fără DB deocamdată)

5. **EXERCIȚIU PRACTIC - Lecția 4**
   - Creează proiect Spring Boot de la zero
   - Implementează ProductController complet
   - Testează cu Postman toate endpoint-urile
   - Adaugă CategoryController (bonus)
   - Rezultat: API funcțional cu produse în memorie

---

#### ❌ LECȚIA 5: MySQL - Tabele și Relații (2.5 ore)
**Conținut de adăugat:**

1. **5.1 Tipuri de Date SQL**
   - INT, BIGINT - pentru id-uri și numere întregi
   - VARCHAR(n) - pentru text
   - DECIMAL(10,2) - pentru prețuri
   - DATE, DATETIME, TIMESTAMP - pentru date
   - TEXT - pentru descrieri lungi
   - BOOLEAN/TINYINT(1) - pentru true/false

2. **5.2 Crearea Bazei de Date**
   ```sql
   CREATE DATABASE ecommerce;
   USE ecommerce;
   ```

3. **5.3 Schema Completă**
   - Tabelul product_category
   - Tabelul product (cu FK către category)
   - Tabelul customer
   - Tabelul orders (cu FK către customer)
   - Tabelul order_item (cu FK către order și product)
   - Diagrama relațiilor (ERD în ASCII)

4. **5.4 Primary Keys și Foreign Keys**
   - Ce este Primary Key (unicitate)
   - Ce este Foreign Key (referință)
   - ON DELETE CASCADE vs RESTRICT

5. **5.5 Relații între Tabele**
   - One-to-Many (Category → Products)
   - Many-to-One (Product → Category)
   - Many-to-Many (Orders ↔ Products prin order_item)

6. **5.6 Inserare Date de Test**
   - Script complet SQL cu:
     * 3 categorii (Books, Electronics, Clothing)
     * 15 produse (5 per categorie)
     * 3 customers
     * 5 orders cu order_items

7. **EXERCIȚIU PRACTIC - Lecția 5**
   - Creează schema completă în MySQL Workbench
   - Rulează script-ul SQL de creare
   - Inserează datele de test
   - Query-uri practice:
     * SELECT toate produsele dintr-o categorie
     * SELECT comenzi cu detalii customer
     * SELECT top 5 produse cele mai scumpe
     * UPDATE stoc pentru un produs
     * DELETE produs (verifică FK constraint)
   - Screenshot rezultate în Workbench

---

#### ❌ LECȚIA 6: Spring Data REST - CRUD Operations (3 ore)
**Conținut de adăugat:**

1. **6.1 Ce este JPA (Java Persistence API)**
   - ORM (Object-Relational Mapping)
   - Maparea clase Java → tabele SQL
   - Avantaje: nu scrii SQL manual

2. **6.2 Entități JPA**
   - Adnotări: @Entity, @Table, @Id, @GeneratedValue
   - @Column pentru customizare
   - @ManyToOne, @OneToMany pentru relații
   - Cod complet: Product.java, ProductCategory.java

3. **6.3 Repository Interfaces**
   - JpaRepository<T, ID>
   - Metode built-in: findAll(), findById(), save(), delete()
   - Query methods: findByName(), findByCategory()
   - Cod: ProductRepository.java

4. **6.4 Spring Data REST**
   - Auto-generare endpoints din Repository
   - Configurare application.properties:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
     spring.datasource.username=root
     spring.datasource.password=parola_ta
     spring.jpa.hibernate.ddl-auto=update
     spring.data.rest.base-path=/api
     ```

5. **6.5 Testare CRUD Complet**
   - GET /api/products - toate produsele
   - GET /api/products/1 - produs cu id=1
   - POST /api/products - creează produs nou
   - PUT /api/products/1 - update produs
   - PATCH /api/products/1 - update parțial
   - DELETE /api/products/1 - șterge produs

6. **EXERCIȚIU PRACTIC - Lecția 6**
   - Conectează Spring Boot la MySQL
   - Creează entitățile Product și ProductCategory
   - Implementează Repository-urile
   - Testează CRUD complet cu Postman
   - Verifică în MySQL Workbench că datele sunt salvate
   - Collection Postman cu toate request-urile

---

#### ❌ LECȚIA 7: Testarea API cu Postman Avansat (2 ore)
**Conținut de adăugat:**

1. **7.1 Collections în Postman**
   - Crearea unei collection
   - Organizarea request-urilor în foldere
   - Descrieri și documentație

2. **7.2 Environment Variables**
   - Crearea unui environment "Development"
   - Variabile: {{baseUrl}}, {{port}}, {{authToken}}
   - Folosirea în request-uri

3. **7.3 Tests și Assertions**
   - JavaScript în tab-ul "Tests"
   - Verificare status code:
     ```javascript
     pm.test("Status is 200", () => {
       pm.response.to.have.status(200);
     });
     ```
   - Verificare body response:
     ```javascript
     pm.test("Product has name", () => {
       pm.expect(pm.response.json().name).to.exist;
     });
     ```

4. **7.4 Pre-request Scripts**
   - Generare date dinamice
   - Setare variabile înainte de request

5. **7.5 Salvarea Response-urilor**
   - Extragere id din response
   - Salvare în variabilă pentru request-uri următoare

6. **EXERCIȚIU PRACTIC - Lecția 7**
   - Creează collection "E-commerce API Complete"
   - Foldere: Products, Categories, Orders
   - Environment cu variabile
   - Tests pentru fiecare request
   - Runner pentru testare automată
   - Export collection și environment (JSON)

---

### MODUL 3: FRONTEND - PRIMII PAȘI (4 lecții)

#### ❌ LECȚIA 8: Angular - Primul Component (3 ore)
#### ❌ LECȚIA 9: Routing și Navigare (2.5 ore)
#### ❌ LECȚIA 10: Services și HTTP Requests (3 ore)
#### ❌ LECȚIA 11: Afișarea Produselor - Listă și Detalii (3 ore)

---

### MODUL 4: FUNCȚIONALITĂȚI PRINCIPALE (4 lecții)

#### ❌ LECȚIA 12: Shopping Cart - Coșul de Cumpărături (3 ore)
#### ❌ LECȚIA 13: Checkout - Procesul de Comandă (3 ore)
#### ❌ LECȚIA 14: Autentificare cu Auth0 (3 ore)
#### ❌ LECȚIA 15: Gestionarea Comenzilor (2.5 ore)

---

### MODUL 5: PANOUL ADMIN (3 lecții)

#### ❌ LECȚIA 16: CRUD Produse Admin (3 ore)
#### ❌ LECȚIA 17: Dashboard Analytics cu Chart.js (3 ore)
#### ❌ LECȚIA 18: Gestionarea Stocului și Alertelor (2.5 ore)

---

### MODUL 6: CONCEPTE AVANSATE & DEPLOYMENT (2 lecții)

#### ❌ LECȚIA 19: Integrarea Stripe pentru Plăți Online (3 ore)
#### ❌ LECȚIA 20: Deployment în Producție + Best Practices (3 ore)

---

## 📊 PROGRES TOTAL

- ✅ **Completate:** 2/20 lecții (10%)
- ❌ **Rămase:** 18/20 lecții (90%)
- 📄 **Linii scrise:** 1379 / ~7000 estimate (20%)
- 📖 **Pagini estimate:** ~50 / ~250 total

---

## 🎯 PRIORITATE PENTRU MÂINE

### Ordinea recomandată:
1. **Lecția 3** - Completează Modul 1 (Fundamente)
2. **Lecțiile 4-7** - Modul 2 Backend complet
3. **Lecțiile 8-11** - Modul 3 Frontend
4. **Lecțiile 12-15** - Modul 4 Funcționalități
5. **Lecțiile 16-18** - Modul 5 Admin
6. **Lecțiile 19-20** - Modul 6 Avansate

---

## 📝 PROMPT PENTRU MÂINE (COPIE ȘI LIPEȘTE)

```
Continuă cursul E-commerce Full-Stack de unde am rămas. Am finalizat Lecțiile 1 și 2. 
Adaugă la fișierul CURS_ECOMMERCE_FULLSTACK.md următoarele lecții în aceeași structură detaliată:

LECȚIA 3: Concepte de Bază - HTTP, REST API, JSON
- Protocolul HTTP (request/response cycle)
- Metodele HTTP (GET, POST, PUT, DELETE, PATCH) cu exemple
- Status codes (200, 404, 401, 403, 500)
- Headers și Body
- Format JSON cu exemple concrete
- Exercițiu practic: Testare API cu Postman (10 request-uri diferite)

LECȚIA 4: Spring Boot - Primul API
- Ce este Spring Boot și de ce îl folosim
- Creare proiect cu Spring Initializr
- Structura proiectului Maven (pom.xml)
- Primul REST Controller (HelloController)
- Product Controller cu CRUD în memorie (fără DB)
- Exercițiu: Implementează API complet și testează cu Postman

LECȚIA 5: MySQL - Tabele și Relații
- Tipuri de date SQL
- Schema completă (product_category, product, customer, orders, order_item)
- Primary Keys și Foreign Keys
- Relații One-to-Many, Many-to-Many
- Script SQL complet cu date de test (15 produse, 3 categorii)
- Exercițiu: Creează DB și rulează query-uri practice

Păstrează formatul:
- Stil informal, prietenos pentru începători
- Cod sursă complet comentat
- Diagrame ASCII
- Exerciții practice detaliate cu pași
- Checklist final
- Rezumat și preview lecție următoare

Fiecare lecție trebuie să fie la fel de detaliată ca Lecțiile 1 și 2!
```

---

## 📌 NOTE IMPORTANTE

### Stil de Scriere:
- ✅ Informal, conversațional
- ✅ Explică FIECARE termen tehnic
- ✅ Emoji-uri pentru secțiuni
- ✅ Exemple concrete din viața reală
- ✅ Comparații simple (ex: "ca în Excel, dar...")

### Structură Obligatorie Fiecare Lecție:
1. Titlu cu emoji și număr
2. Durata și Obiective
3. Secțiuni numerotate (X.1, X.2, etc.)
4. Cod sursă COMPLET (nu "...existing code...")
5. Diagrame ASCII pentru concepte vizuale
6. Exercițiu practic DETALIAT
7. Checklist final
8. Rezumat "Ce ai învățat"
9. Preview lecție următoare
10. Page break (`<div style="page-break-after: always;"></div>`)

### Cod Sursă:
- Comentat în română
- Complet (nu fragmente)
- Cu explicații linie cu linie pentru code complex
- Highlighting Markdown cu limbaj specific (```java, ```sql, ```typescript)

### Exerciții:
- Pași numerotați
- Comenzi exacte de rulat
- Output așteptat
- Screenshot instructions unde e cazul
- Verificare rezultate
- Troubleshooting common errors

---

## 🔗 LEGĂTURI ÎNTRE LECȚII

### Flow-ul Logic:
```
Lecția 1-2: Setup mediu
    ↓
Lecția 3: Înțelegi HTTP/REST/JSON
    ↓
Lecția 4-7: Backend Spring Boot + MySQL
    ↓
Lecția 8-11: Frontend Angular + consume API
    ↓
Lecția 12-15: Funcționalități (cart, checkout, auth, orders)
    ↓
Lecția 16-18: Admin panel (CRUD, analytics, stock)
    ↓
Lecția 19-20: Advanced (Stripe, deployment)
```

### Dependințe între Lecții:
- Lecția 4 necesită: Lecția 2 (Java instalat), Lecția 3 (înțelege REST)
- Lecția 5 necesită: Lecția 2 (MySQL instalat)
- Lecția 6 necesită: Lecția 4 (Spring Boot project), Lecția 5 (DB schema)
- Lecția 8 necesită: Lecția 2 (Node.js, Angular CLI)
- Lecția 10 necesită: Lecția 6 (Backend API funcțional)
- Lecția 14 necesită: Lecția 8-10 (Angular basics)
- Lecția 19 necesită: Lecția 13 (Checkout implementat)

---

## 💾 BACKUP & VERSIONING

### Fișiere Create:
- `CURS_ECOMMERCE_FULLSTACK.md` - Conținut principal
- `CURS_TODO_CONTINUARE.md` - Acest fișier (TODO list)

### Recomandare Git:
```bash
git add CURS_ECOMMERCE_FULLSTACK.md CURS_TODO_CONTINUARE.md
git commit -m "Curs e-commerce: Lecțiile 1-2 complete + TODO pentru continuare"
git push
```

---

## ⏰ ESTIMARE TIMP RĂMAS

### Pentru completarea cursului:
- Lecția 3: ~1 oră scriere
- Lecții 4-7 (Modul 2): ~3 ore scriere
- Lecții 8-11 (Modul 3): ~3 ore scriere
- Lecții 12-15 (Modul 4): ~3 ore scriere
- Lecții 16-18 (Modul 5): ~2 ore scriere
- Lecții 19-20 (Modul 6): ~2 ore scriere
- **TOTAL**: ~14 ore scriere efectivă

### Strategie:
- Sesiunea 1 (mâine): Lecțiile 3-7 (Modul 1-2 complet) - 4 ore
- Sesiunea 2: Lecțiile 8-11 (Modul 3 complet) - 3 ore
- Sesiunea 3: Lecțiile 12-15 (Modul 4 complet) - 3 ore
- Sesiunea 4: Lecțiile 16-20 (Modul 5-6 complet) - 4 ore

---

## ✅ FINAL DELIVERABLE

### La sfârșitul cursului:
1. **CURS_ECOMMERCE_FULLSTACK.md** - Document complet (7000+ linii)
2. **Conversie la PDF:**
   ```bash
   # Opțiune 1: Pandoc
   pandoc CURS_ECOMMERCE_FULLSTACK.md -o CURS_ECOMMERCE_FULLSTACK.pdf --toc --number-sections
   
   # Opțiune 2: VS Code extension "Markdown PDF"
   # Click dreapta pe .md → "Markdown PDF: Export (pdf)"
   ```
3. **Fișiere suport:**
   - SQL scripts (database-setup.sql)
   - Postman collections (ecommerce-api.postman_collection.json)
   - Screenshots folder
4. **README pentru profesori** - Cum să folosească cursul

---

**🎯 MÂINE: Începe cu promptul de mai sus și continuă cu Lecția 3!**

**Data salvare:** 3 Decembrie 2025, 23:30  
**Status:** Ready to continue ✅
