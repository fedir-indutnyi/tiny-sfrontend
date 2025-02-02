import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserControllerService} from "../../sdk";

@Injectable({
  providedIn: 'root'
})
export class AdminToolsResolver  {
  constructor(private router: Router,
              private userService: UserControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.userService.userControllerWhoAmI().subscribe((value) => {
        this.userService.userControllerFindById(+value)
          .subscribe((user) => {
            if (Array.isArray(user) || !user || user?.userrole !== 'admin') {
              this.router.navigate(['/**']);
              observer.next(false);
              observer.complete();
            } else if (user.userrole === 'admin') {
              observer.next(true);
              observer.complete();
            }
          });
      });
    });
  }

}
