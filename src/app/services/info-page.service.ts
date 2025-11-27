import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoPageService {

  // URL-ul catre backend
  private baseUrl = environment.luv2shopApiUrl + '/page-contents';

  constructor(private httpClient: HttpClient) { }

  // 1. GET: Preluam continutul din baza de date
  getPageContent(pageType: string): Observable<any> {
    // Folosim endpoint-ul de cautare creat in Repository
    const searchUrl = `${this.baseUrl}/search/findByPageType?pageType=${pageType}`;
    
    return this.httpClient.get<GetResponsePageContent>(searchUrl).pipe(
      map(response => {
        // Returnam obiectul complet (avem nevoie si de _links.self.href pentru update)
        return response; 
      })
    );
  }

  // 2. PUT: Salvam continutul modificat
  savePageContent(pageContentObj: any, newText: string): Observable<any> {
    // Luam URL-ul specific resursei (ex: .../api/page-contents/1)
    // Spring Data REST returneaza link-ul de update in _links.self.href
    const updateUrl = pageContentObj._links.self.href;

    // Construim obiectul de trimis
    const payload = {
      pageType: pageContentObj.pageType,
      content: newText
    };

    return this.httpClient.put(updateUrl, payload);
  }
}

// Interfata pentru a mapa raspunsul JSON de la Spring Data REST
interface GetResponsePageContent {
  pageType: string;
  content: string;
  _links: {
    self: {
      href: string;
    }
  }
}