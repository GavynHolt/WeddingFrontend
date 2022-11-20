import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { mergeMap, Observable, of } from 'rxjs';
import { WeddingService } from '../service/wedding.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private weddingService: WeddingService,
    private router: Router,
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.weddingService.adminToken$.pipe(
      mergeMap((token) => {
        if (token) {
          return of(true);
        }
        this.router.navigate(['admin/login']);
        return of(false);
      })
    );
  }
}
