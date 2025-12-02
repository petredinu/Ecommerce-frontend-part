import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap } from 'rxjs'; //
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Definim endpoint-urile securizate
    const theEndpointOrders = environment.luv2shopApiUrl + '/orders';
    const theEndpointPages = environment.luv2shopApiUrl + '/page-contents';
    const theEndpointProducts = environment.luv2shopApiUrl + '/products';
    const theEndpointAdmin = environment.luv2shopApiUrl + '/admin';

    const securedEndpoints = [theEndpointOrders, theEndpointPages, theEndpointProducts, theEndpointAdmin];

    // Verificam daca URL-ul cererii contine unul din endpoint-urile securizate
    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      // Toate endpoint-urile /admin necesită autentificare
      if (request.urlWithParams.includes(theEndpointAdmin)) {
        return this.auth.getAccessTokenSilently().pipe(
          switchMap(token => {
            const authRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next.handle(authRequest);
          })
        );
      }

      // Dacă cererea este către 'page-contents' DAR este de tip GET (citire),
      // o lăsăm să treacă fără să atașăm token-ul (pentru a fi publică).
      if (request.urlWithParams.includes(theEndpointPages) && request.method === 'GET') {
        return next.handle(request);
      }

      // Pentru products, doar operațiunile POST, PUT, DELETE, PATCH necesită autentificare
      // GET-urile (listare/vizualizare produse) rămân publice
      if (request.urlWithParams.includes(theEndpointProducts) && request.method === 'GET') {
        return next.handle(request);
      }
      // -----------------------------
      // Folosim switchMap pentru a obtine token-ul si a continua cu cererea
      return this.auth.getAccessTokenSilently().pipe(
        switchMap(token => {
          // Clonam cererea si adaugam header-ul
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          // Trimitem cererea modificata
          return next.handle(authRequest);
        })
      );
    }

    // Daca nu e endpoint securizat, trimitem cererea originala
    return next.handle(request);
  }
}