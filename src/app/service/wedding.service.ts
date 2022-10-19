import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invitation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  userCode$: BehaviorSubject<string>;
  invitations$: BehaviorSubject<Invitation | undefined>;

  constructor(private http: HttpClient) { 
    
    this.userCode$ = new BehaviorSubject<string>(sessionStorage.getItem("userCode") ?? '');
    const invitationFromStorage = sessionStorage.getItem('invitation');
    this.invitations$ = new BehaviorSubject<Invitation | undefined>(invitationFromStorage !== null ? JSON.parse(invitationFromStorage) : undefined);

    this.invitations$.asObservable().subscribe((invitation) => {
      sessionStorage.setItem("invitation", JSON.stringify(invitation));
    });

    this.userCode$.asObservable().subscribe((userCode) => {
      sessionStorage.setItem("userCode", userCode);
    });
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

  updateInvitationRsvps(invitationToUpdate: Invitation): Observable<Invitation> {
    return this.http.put<Invitation>(`${environment.apiUrl}/invitations`, invitationToUpdate).pipe(
      tap((res) => {
        this.invitations$.next(res);
      }),
    );
  }

  clearStorage(): void {
    sessionStorage.clear();
  }
}
