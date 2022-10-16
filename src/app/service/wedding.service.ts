import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  authToken$: BehaviorSubject<string | undefined>;

  constructor(private http: HttpClient) { 
    this.authToken$ = new BehaviorSubject<string | undefined>(undefined);
  }
  
  login(userCode: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(userCode)}`,
    });

    return this.http.get(`${environment.apiUrl}/test`, {
      headers,
      responseType: 'text',
    }).pipe(
      tap(() => {
        this.authToken$.next(userCode);
      })
    );
  }

}
