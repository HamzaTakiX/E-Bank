import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  public getDashboardInfo(): Observable<any> {
    return this.http.get<any>(`${environment.backendHost}/dashboard/dataV1`);
  }

  public getDashboardChartsInfo(): Observable<any> {
    return this.http.get<any>(`${environment.backendHost}/dashboard/dataV2`);
  }

}
