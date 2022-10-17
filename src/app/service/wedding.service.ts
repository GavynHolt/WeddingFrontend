import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invitation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  userCode$: BehaviorSubject<string | undefined>;
  invitations$: BehaviorSubject<Invitation | undefined>;

  constructor(private http: HttpClient) { 
    this.userCode$ = new BehaviorSubject<string | undefined>(undefined);
    this.invitations$ = new BehaviorSubject<Invitation | undefined>(undefined);
  }
  
  getInvitationByUserCode(userCode: string): Observable<Invitation> {
    const username = userCode.split(":")?.[0];

    return this.http
      .get<Invitation>(`${environment.apiUrl}/invitations/${username}`).pipe(
        tap((res) => {
          this.userCode$.next(userCode);
          this.invitations$.next(res);
        }),
      );
  }

}
