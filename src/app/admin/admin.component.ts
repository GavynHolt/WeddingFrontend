import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { map, Observable, of } from 'rxjs';
import { Guest } from '../models/models';
import { WeddingService } from '../service/wedding.service';
import { AddInvitationComponent } from './add-invitation/add-invitation.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  @ViewChild(MatTable) table!: MatTable<Guest>;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Guest> = new MatTableDataSource<Guest>();

  displayedColumns: string[] = ['firstName', 'lastName', 'rsvp'];
  weddingRsvps$: Observable<Guest[] | undefined>;
  rsvpCeremony$: Observable<number> = of(0);
  rsvpReception$: Observable<number> = of(0);
  rsvpNo$: Observable<number> = of(0);
  rsvpAwaitingReply$: Observable<number>;

  constructor(private weddingService: WeddingService, private dialog: MatDialog) { 
    this.weddingRsvps$ = weddingService.weddingRsvps$.asObservable();
    this.weddingService.getAllGuestRsvps().subscribe();
    
    this.weddingRsvps$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'rsvp': 
            if (item.rsvp === true && item.rsvpCeremony === true && item.rsvpReception === true) {
              return 4;
            } 
            if (item.rsvp === true && item.rsvpCeremony === true && item.rsvpReception === false) {
              return 3;
            } 
            if (item.rsvp === true && item.rsvpCeremony === false && item.rsvpReception === true) {
              return 2;
            } 
            if (item.rsvp === false) {
              return 1;
            }
            return 0;
          default:
            return item[property];
        }
      }
    });

    this.rsvpCeremony$ = this.weddingRsvps$.pipe(
      map((guests) => guests?.filter((guest) => guest.rsvp === true && guest.rsvpCeremony).length ?? 0)
    );

    this.rsvpReception$ = this.weddingRsvps$.pipe(
      map((guests) => guests?.filter((guest) => guest.rsvp === true && guest.rsvpReception).length ?? 0)
    );

    this.rsvpNo$ = this.weddingRsvps$.pipe(
      map((guests) => guests?.filter((guest) => guest.rsvp === false).length ?? 0)
    );

    this.rsvpAwaitingReply$ = this.weddingRsvps$.pipe(
      map((guests) => guests?.filter((guest) => guest.rsvp === null || guest.rsvp === undefined).length ?? 0)
    );
  }

  openAddInvitationDialog(): void {
    const dialog = this.dialog.open(AddInvitationComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe(() => {
      this.weddingService.getAllGuestRsvps().subscribe((data) => {
        this.weddingRsvps$ = of(data);
      });
    });
  }
}
