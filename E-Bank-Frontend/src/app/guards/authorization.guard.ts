import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthorizationGuard.canActivate called');
    console.log('Current route:', state.url);
    console.log('Required role:', route.data['role']);

    // First ensure authentication
    if (!this.authService.isAuthenticated) {
      console.log('User is not authenticated, attempting to load token');
      const hasToken = this.authService.loadJwtTokenFromLocalStorage();
      if (!hasToken) {
        console.log('No valid token found, redirecting to login');
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    }

    // Check for admin role
    console.log('Checking ADMIN role. Current roles:', this.authService.roles);
    if (this.authService.hasRole('ADMIN')) {
      console.log('User has ADMIN role, granting access');
      return true;
    }
    
    console.log('User lacks ADMIN role, redirecting to notAuthorized');
    this.router.navigate(['/admin/notAuthorized']);
    return false;
  }

}
