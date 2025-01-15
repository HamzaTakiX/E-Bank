import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('AuthenticationGuard.canActivate called');
    console.log('Current route:', state.url);
    console.log('Authentication state:', {
      isAuthenticated: this.authService.isAuthenticated,
      roles: this.authService.roles
    });

    // Try to load token from localStorage first
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
      console.log('Token loaded successfully');
    }

    // Check if route requires specific role
    if (route.data['role']) {
      const requiredRole = route.data['role'];
      console.log('Route requires role:', requiredRole);
      if (!this.authService.hasRole(requiredRole)) {
        console.log('User lacks required role, redirecting to notAuthorized');
        this.router.navigate(['/admin/notAuthorized']);
        return false;
      }
      console.log('User has required role');
    }

    console.log('Access granted');
    return true;
  }

}
