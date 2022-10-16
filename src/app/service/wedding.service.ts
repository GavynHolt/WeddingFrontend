import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invitation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  authToken$: BehaviorSubject<string | undefined>;
  invitations$: BehaviorSubject<Invitation[] | undefined>;

  constructor(private http: HttpClient) { 
    this.authToken$ = new BehaviorSubject<string | undefined>(undefined);
    this.invitations$ = new BehaviorSubject<Invitation[] | undefined>(undefined);
  }
  
  getInvitationByUserCode(userCode: string): Observable<Invitation[]> {
    const username = userCode.split(":")?.[0];

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(userCode)}`,
    });

    return this.http
      .get<Invitation[]>(`${environment.apiUrl}/${username}`, {
        headers,
      })
      .pipe(
        tap((res) => {
          this.authToken$.next(userCode);
          this.invitations$.next(res);
        })
      );
  }

}
