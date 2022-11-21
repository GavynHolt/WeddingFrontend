import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginErrorComponent } from '../login-error/login-error.component';
import { Guest, Invitation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  adminToken$: BehaviorSubject<string>;
  userCode$: BehaviorSubject<string>;
  invitation$: BehaviorSubject<Invitation | undefined>;
  weddingRsvps$: BehaviorSubject<Guest[] | undefined>;

  constructor(private http: HttpClient, private dialog: MatDialog) { 
    
    this.adminToken$ = new BehaviorSubject<string>(sessionStorage.getItem("adminToken") ?? '');
    this.userCode$ = new BehaviorSubject<string>(sessionStorage.getItem("userCode") ?? '');
    this.invitation$ = new BehaviorSubject<Invitation | undefined>(undefined);
    this.weddingRsvps$ = new BehaviorSubject<Guest[] | undefined>(undefined);

    this.adminToken$.asObservable().subscribe((adminToken) => {
      sessionStorage.setItem('adminToken', adminToken);
    });

    this.userCode$.asObservable().subscribe((userCode) => {
      sessionStorage.setItem("userCode", userCode);
    });
  }

  adminLogin(username: string, password: string): Observable<any> {
    const credentials = {
      username: username.toLowerCase().trim(),
      password,
    };
    return this.http.post<boolean>(`${environment.apiUrl}/login`, credentials).pipe(
      tap((isValid) => { 
        if (isValid) {
          this.adminToken$.next(btoa(username + ':' + password));
        } else {
          throw new Error('Authentication failed.');
        }
      }),
      catchError((error: Error) => {
        alert(error.message);
        this.adminToken$.next('');
        return of(error);
      })
    )
  }

  getAllGuestRsvps(): Observable<Guest[]> {
    const headers = new HttpHeaders({ 
        'Authorization': 'Basic ' + this.adminToken$.value
    });

    return this.http.get<Guest[]>(`${environment.apiUrl}/admin/rsvps`, { headers }).pipe(
      tap((rsvps) => this.weddingRsvps$.next(rsvps)),
    );
  }
  
  getInvitationByUserCode(userCode: string): Observable<Invitation> {
    const username = userCode.split(":")?.[0];

    return this.http
      .get<Invitation>(`${environment.apiUrl}/invitations/${username}`)
      .pipe(
        catchError((err) => {
          this.dialog.open(LoginErrorComponent, {
            width: '400px',
            panelClass: 'custom-dialog-container',
          });
          throw err;
        }),
        tap((res) => {
          this.userCode$.next(userCode);
          this.invitation$.next(res);
        })
      );
  }

  addInvitation(invitationToAdd: Invitation): Observable<Invitation> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + this.adminToken$.value,
    });
    return this.http.post<Invitation>(`${environment.apiUrl}/admin/invitations`, invitationToAdd, { headers });
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
