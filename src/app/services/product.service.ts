import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private baseUrl=environment.luv2shopApiUrl+'/products';
 
  private categoryUrl = environment.luv2shopApiUrl+'/product-category';

  // --- MODIFICARE: Adăugăm proprietăți pentru a salva starea paginării ---
  public thePageNumber: number = 1;
  public thePageSize: number = 5;
  public theTotalElements: number = 0;
  public previousCategoryId: number = 1;
  public previousKeyword: string = "";
  // ---------------------------------------------------------------------
   
  constructor(private httpClient:HttpClient) {}

  // Creează un produs nou
  saveProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizează un produs existent
  updateProduct(product: Product): Observable<Product> {
    const updateUrl = `${this.baseUrl}/${product.id}`;
    return this.httpClient.put<Product>(updateUrl, product).pipe(
      catchError(this.handleError)
    );
  }
  
  // Șterge un produs
  deleteProduct(productId: number): Observable<any> {
    const deleteUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.delete(deleteUrl, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  // FILTRARE AVANSATĂ - Căutare cu multiple filtre
  searchProductsWithFilters(
    categoryId?: number,
    priceMin?: number,
    priceMax?: number,
    minRating?: number,
    inStockOnly?: boolean,
    keyword?: string,
    page: number = 0,
    size: number = 12,
    sort: string = 'id,asc'
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search`;
    
    let params: any = {
      page: page.toString(),
      size: size.toString(),
      sort: sort
    };

    if (categoryId !== null && categoryId !== undefined) {
      params.categoryId = categoryId.toString();
    }
    if (priceMin !== null && priceMin !== undefined) {
      params.priceMin = priceMin.toString();
    }
    if (priceMax !== null && priceMax !== undefined) {
      params.priceMax = priceMax.toString();
    }
    if (minRating !== null && minRating !== undefined) {
      params.minRating = minRating.toString();
    }
    if (inStockOnly !== null && inStockOnly !== undefined) {
      params.inStockOnly = inStockOnly.toString();
    }
    if (keyword) {
      params.keyword = keyword;
    }

    return this.httpClient.get<GetResponseProducts>(searchUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Obține toate produsele (inclusiv inactive) - pentru admin
  getAllProducts(): Observable<Product[]> {
    // Folosim endpoint-ul admin pentru a obține toate produsele
    const adminUrl = environment.luv2shopApiUrl + '/admin/products?size=1000';
    return this.httpClient.get<GetResponseProducts>(adminUrl).pipe(
      map(response => {
        // Spring Data REST returnează structura _embedded sau content
        if (response._embedded && response._embedded.products) {
          return response._embedded.products;
        }
        // Dacă răspunsul este direct un array (în cazul controller-ului custom)
        return (response as any).content || [];
      }),
      catchError((error) => {
        console.error('Eroare la getAllProducts:', error);
        return this.handleError(error);
      })
    );
  }

  // Activează un produs
  activateProduct(productId: number): Observable<Product> {
    const activateUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.patch<Product>(activateUrl, { active: true }).pipe(
      catchError(this.handleError)
    );
  }
 
  getProduct(theProductId: number): Observable<Product> {
    const productUrl= `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Caută produs după nume
  getProductByName(name: string): Observable<Product> {
    const searchUrl = `${this.baseUrl}/search/findByName?name=${name}`;
    return this.httpClient.get<Product>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'A apărut o eroare necunoscută!';
    
    if (error.error instanceof ErrorEvent) {
      // Eroare client-side
      errorMessage = `Eroare: ${error.error.message}`;
    } else {
      // Eroare server-side
      errorMessage = `Cod eroare: ${error.status}\nMesaj: ${error.message}`;
    }
    
    console.error('Eroare în ProductService:', errorMessage, error);
    return throwError(() => error);
  }
  getProductListPaginate(thePage:number,
    thePageSize: number,
    theCategoryId:number): Observable<GetResponseProducts>{
 // need to build URL based on category id, page and size - DOAR produse active
    const searchUrl= `${this.baseUrl}/search/findByCategoryIdAndActiveTrue?id=${theCategoryId}`
                     + `&page=${thePage}&size=${thePageSize}`;

    console.log(`getProductListPaginate: ${searchUrl}`);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


    getProductList(theCategoryId:number): Observable<Product[]>{
 
      const searchUrl= `${this.baseUrl}/search/findByCategoryIdAndActiveTrue?id=${theCategoryId}`;

      return this.getProducts(searchUrl);
    }

    searchProducts(theKeyword: string): Observable<Product[]> {
      const searchUrl= `${this.baseUrl}/search/findByNameContainingAndActiveTrue?name=${theKeyword}`;

      return this.getProducts(searchUrl);
    }


     searchProductsPaginate(thePage:number,
                            thePageSize: number,
                            theKeyword: string): Observable<GetResponseProducts>{
 // need to build URL based on keyword, page and size - DOAR produse active
    const searchUrl= `${this.baseUrl}/search/findByNameContainingAndActiveTrue?name=${theKeyword}`
                     + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

    getProductCategories(): Observable<ProductCategory[]> {
         
      return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
        map(response=>response._embedded.productCategory)
      );
    }
  
  }
   
   interface GetResponseProducts{
    _embedded:{
      products:Product[];
    },
    page: {
      size:number,
      totalElements: number,
      totalPages: number,
      number: number
    }
  }

  interface GetResponseProductCategory{
      _embedded:{
        productCategory:ProductCategory[];
      }
  }



