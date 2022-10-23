import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginErrorComponent } from '../login-error/login-error.component';
import { Invitation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  userCode$: BehaviorSubject<string>;
  invitation$: BehaviorSubject<Invitation | undefined>;

  constructor(private http: HttpClient, private dialog: MatDialog) { 
    
    this.userCode$ = new BehaviorSubject<string>(sessionStorage.getItem("userCode") ?? '');
    this.invitation$ = new BehaviorSubject<Invitation | undefined>(undefined);

    this.userCode$.asObservable().subscribe((userCode) => {
      sessionStorage.setItem("userCode", userCode);
    });
  }
  
  getInvitationByUserCode(userCode: string): Observable<Invitation> {
    const username = userCode.split(":")?.[0];

    return this.http
      .get<Invitation>(`${environment.apiUrl}/invitations/${username}`)
      .pipe(
        catchError((err) => {
          this.dialog.open(LoginErrorComponent, {
            width: '400px',
          });
          throw err;
        }),
        tap((res) => {
          this.userCode$.next(userCode);
          this.invitation$.next(res);
        })
      );
  }

  updateInvitationRsvps(invitationToUpdate: Invitation): Observable<Invitation> {
    return this.http.put<Invitation>(`${environment.apiUrl}/invitations`, invitationToUpdate).pipe(
      tap((res) => {
        this.invitation$.next(res);
      }),
    );
  }

  clearStorage(): void {
    sessionStorage.clear();
  }
}
