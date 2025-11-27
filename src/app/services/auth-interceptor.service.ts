import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

  // Definim endpoint-urile care necesită token
  const theEndpointOrders = environment.luv2shopApiUrl + '/orders';
  const theEndpointPages = environment.luv2shopApiUrl + '/page-contents'; // <--- Adaugă linia asta

  // Le punem pe toate în listă
  const securedEndpoints = [theEndpointOrders, theEndpointPages]; 

  if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
    // Obține token-ul și atașează-l
    await this.auth.getAccessTokenSilently().forEach(token => {
      // ... logica existentă de atașare a token-ului ...
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    });
  }

  return await lastValueFrom(next.handle(request));
}
}