# Angular E-commerce Frontend - AI Agent Guide

## Project Overview
Angular 19 e-commerce SPA with Auth0 authentication, shopping cart, checkout, and admin product management. Backend: REST API at `https://localhost:8443/api` (Spring Boot). Components use **non-standalone architecture** (declared in `app.module.ts`).

## Architecture Patterns

### Component Architecture
- **Non-standalone components**: All components have `standalone: false` and must be declared in `app.module.ts`
- **Exception**: `LoginStatusComponent` is standalone and imported directly in `app.module.ts` imports array
- When creating components: Use `ng generate component component-name` - it auto-configures for this project

### Routing Strategy
Routes defined in `app.module.ts` (not `app-routing.module.ts`). Key patterns:
- Protected routes use `canActivate: [AuthGuard]` from `@auth0/auth0-angular`
- Admin routes: `/admin/product-form`, `/admin/product-form/:id`, `/admin/delete-product/:id`
- Legacy redirects preserved: `/add-product` → `/admin/product-form`

### Authentication & Authorization
**Provider**: Auth0 (config in `src/app/config/my-app-config.ts`)
- **Admin check**: Hardcoded email comparison in `LoginStatusComponent` (`adminEmail: 'dinu_petre26@yahoo.ro'`)
- **HTTP Interceptor** (`AuthInterceptorService`): Attaches Bearer tokens to `/orders`, `/page-contents` (POST/PUT/DELETE only), `/products` (POST/PUT/DELETE only)
- **Public endpoints**: GET requests to `/products` and `/page-contents` are intentionally public (no auth required)
- **User email** stored in `sessionStorage` as `userEmail` (JSON string)

### State Management
- **Cart**: `CartService` uses `BehaviorSubject` for reactive state (`totalPrice`, `totalQuantity`)
  - Persisted in `localStorage` as `cartItems` (JSON array)
  - Methods: `addToCart()`, `removeCart()`, `decrementQuantity()`, `remove()`
- **Product pagination state**: `ProductService` stores `thePageNumber`, `thePageSize`, `theTotalElements`, `previousCategoryId`, `previousKeyword` as public properties

### Data Models
All classes in `src/app/common/` use **constructor-based initialization**:
```typescript
export class Product {
    constructor(
        public id: number,
        public category: ProductCategory
        // ... other fields
    ) {}
}
```
Never use interface-style declaration for domain models.

## Service Patterns

### Error Handling
All services use centralized `handleError()` private method with `catchError(this.handleError)` pipe:
```typescript
return this.httpClient.get<T>(url).pipe(catchError(this.handleError));
```
Component error handling distinguishes:
- `404`: Resource not found
- `403`: Permissions error
- `0`: Network/connection error
- `400`: Validation error
- `409`: Conflict (e.g., duplicate SKU)

### API Base URLs
Use `environment.luv2shopApiUrl` from `src/environments/environment.ts`:
- Default (dev): `https://localhost:8443/api`
- Environments: `environment.ts`, `environment.development.ts`, `environment.qa.ts`

### Pagination
Spring Data REST response structure:
```typescript
interface GetResponseProducts {
    _embedded: { products: Product[] },
    page: { size: number, totalElements: number, totalPages: number, number: number }
}
```
Map responses: `map(response => response._embedded.products)`

## Form Validation

### Custom Validators
Located in `src/app/validators/luv2-shop-validators.ts`:
- `notOnlyWhitespace`: Validates non-empty after trim
- `cardLuhnValidator`: Credit card Luhn algorithm

### Reactive Forms Pattern
Use `FormBuilder` with typed `FormGroup`:
```typescript
this.formGroup = this.formBuilder.group({
  customer: this.formBuilder.group({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
  })
});
```

### Product Form Validation (Admin)
`ProductFormComponent` uses manual validation in `validateProduct()` method (not reactive forms):
- Required: `name`, `sku`, category selection
- Numeric: `unitPrice > 0`, `unitsInStock >= 0`
- Display errors in `errorMessage` property
- Loading states: `isLoading`, `isSaving`

## UI/UX Conventions

### Styling
- **Bootstrap 5**: Imported in `angular.json` styles array
- **FontAwesome**: Via `@fortawesome/angular-fontawesome` and free icons
- Component-specific CSS files for custom overrides

### User Feedback
- **Loading states**: Display spinners with `*ngIf="isLoading"`, disable buttons with `[disabled]="isSaving"`
- **Confirmations**: Use `confirm()` for destructive actions (e.g., delete, cancel with changes)
- **Error display**: User-friendly messages (avoid technical jargon), show in colored alert boxes

### Product Management Refactoring (Dec 2025)
Recent refactor (see `REFACTORING_SUMMARY.md` in Romanian) emphasizes:
- Split responsibilities into private methods (`loadCategories()`, `checkEditMode()`, `validateProduct()`)
- Color-coded headers (blue for edit, green for add)
- Removed confusing "autocomplete" feature (`onNameChange()`)
- ID field disabled in edit mode to prevent accidental changes

## Development Workflow

### Running the App
```bash
npm start  # Runs on https://localhost:4200 with SSL (certs in ssl-localhost/)
```
Note: SSL is configured via npm script with `--ssl=true` flags pointing to local certificates.

### Testing
```bash
npm test  # Karma/Jasmine test runner
```
All components have `.spec.ts` files. Tests use standard Angular testing utilities.

### Build
```bash
ng build  # Production build to dist/
ng build --configuration=development  # Dev build with source maps
ng build --configuration=qa  # QA environment
```

## Common Pitfalls

1. **Component registration**: Don't add standalone components to `declarations` in `app.module.ts` - only to `imports`
2. **Auth bypass**: Remember GET endpoints for products/pages are public - only POST/PUT/DELETE require auth
3. **Storage usage**: Cart uses `localStorage`, user email uses `sessionStorage` - don't mix them
4. **Environment files**: Must match `fileReplacements` config in `angular.json` for each environment
5. **Category reference**: Product has `category: ProductCategory` object (not just `categoryId: number`)
6. **Spring Data REST**: Always check for `_embedded` wrapper in API responses
7. **Strict TypeScript**: Project uses `strict: true` - handle null/undefined explicitly with `!` or optional chaining

## Key Files Reference
- **Main module**: `src/app/app.module.ts` (routes, component declarations, providers)
- **Auth config**: `src/app/config/my-app-config.ts` (Auth0 settings)
- **HTTP interceptor**: `src/app/services/auth-interceptor.service.ts` (token attachment logic)
- **Cart logic**: `src/app/services/cart.service.ts` (state + persistence)
- **Form validators**: `src/app/validators/luv2-shop-validators.ts`
- **Admin components**: `src/app/components/product-form/`, `delete-product/`
