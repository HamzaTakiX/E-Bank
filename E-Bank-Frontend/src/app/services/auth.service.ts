import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username: any;
  accessToken!: any;

  constructor(private http:HttpClient,private router : Router) {
    console.log('AuthService initialized');
    this.loadJwtTokenFromLocalStorage();
  }

  public login(username : string, password : string){
    console.log('Attempting login for user:', username);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
    return this.http.post("http://localhost:8085/auth/login", {email :username , password : password}, options);
  }

  loadProfile(data: any) {
    console.log('Loading profile with data:', data);
    if (!data || !data['access-token']) {
      console.error('Invalid login response:', data);
      throw new Error('Invalid login response');
    }

    try {
      this.accessToken = data['access-token'];
      let decodedJwt: any = jwtDecode(this.accessToken);

      if (!decodedJwt || !decodedJwt.sub || !decodedJwt.scope) {
        console.error('Invalid token structure:', decodedJwt);
        throw new Error('Invalid token structure');
      }

      this.isAuthenticated = true;
      this.username = decodedJwt.sub;
      this.roles = decodedJwt.scope.split(' ');

      console.log('Authentication successful:', {
        username: this.username,
        roles: this.roles,
        isAuthenticated: this.isAuthenticated
      });

      window.localStorage.setItem('jwt-token', this.accessToken);
      return this.roles;
    } catch (error) {
      console.error('Error processing token:', error);
      this.logout();
      throw error;
    }
  }

  loadJwtTokenFromLocalStorage() {
    const token = window.localStorage.getItem('jwt-token');
    if (token) {
      try {
        console.log('Found token in localStorage');
        this.accessToken = token;
        let decodedJwt: any = jwtDecode(this.accessToken);
        this.isAuthenticated = true;
        this.username = decodedJwt.sub;
        this.roles = decodedJwt.scope.split(' ');
        console.log('Successfully loaded token from localStorage');
        return true;
      } catch (error) {
        console.error('Error loading token from localStorage:', error);
        this.logout();
        return false;
      }
    }
    console.log('No token found in localStorage');
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    this.accessToken = undefined;
    this.username = undefined;
    this.roles = undefined;
    window.localStorage.removeItem('jwt-token');
    this.router.navigateByUrl("/login");
  }

  hasRole(role: string): boolean {
    console.log('Checking for role:', role);
    console.log('Current roles:', this.roles);
    const hasRole = this.roles && Array.isArray(this.roles) && this.roles.includes(role);
    console.log('Has role result:', hasRole);
    return hasRole;
  }
}
