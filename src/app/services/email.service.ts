import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailResponse {
  message: string;
  status: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  templateName: string;
  templateData: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = environment.luv2shopApiUrl + '/email';

  constructor(private httpClient: HttpClient) { }

  /**
   * Send a custom email using a template
   */
  sendEmail(emailRequest: EmailRequest): Observable<EmailResponse> {
    return this.httpClient.post<EmailResponse>(`${this.baseUrl}/send`, emailRequest);
  }

  /**
   * Send welcome email to new user
   */
  sendWelcomeEmail(email: string, userName: string): Observable<EmailResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('userName', userName);

    return this.httpClient.post<EmailResponse>(`${this.baseUrl}/welcome`, null, { params });
  }

  /**
   * Send newsletter confirmation email
   */
  subscribeNewsletter(email: string): Observable<EmailResponse> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.post<EmailResponse>(`${this.baseUrl}/newsletter/subscribe`, null, { params });
  }

  /**
   * Send test email (for debugging)
   */
  sendTestEmail(email: string): Observable<EmailResponse> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.post<EmailResponse>(`${this.baseUrl}/test`, null, { params });
  }
}
