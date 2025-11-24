import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.luv2shopApiUrl+'/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    // need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
  // [NOU] Metoda pentru a lua comenzile dintr-o anumită dată
  getOrdersByDate(date: string): Observable<GetResponseOrderHistory> {
    // Data selectată vine ca string "YYYY-MM-DD"
    // Trebuie să definim intervalul pentru ziua respectivă (sau +1 zi pentru endDate exclusive)
    
    // Simplificare: Trimitem aceeași dată pentru start, și data următoare pentru end
    // (Spring Data JPA 'Between' este de obicei inclusiv la start și exclusiv/inclusiv la final în funcție de DB, 
    // dar pentru siguranță vom trimite string-urile formatate)
    
    // Nota: Deoarece folosim @DateTimeFormat(pattern = "yyyy-MM-dd") în backend, 
    // putem trimite doar ziua. Dar logica 'Between' cere două date.
    // Vom trimite data selectată ca start și data selectată ca end (dar backend-ul va căuta exact la 00:00 dacă nu specificăm ora).
    // O abordare mai bună pentru "toată ziua" este: Start = Ziua X, End = Ziua X+1
    
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Ziua următoare

    // Formatăm manual la yyyy-MM-dd
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];

    const searchUrl = `${this.orderUrl}/search/findByDateCreatedBetween?startDate=${startString}&endDate=${endString}&projection=orderWithDetails`;

    return this.httpClient.get<GetResponseOrderHistory>(searchUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
