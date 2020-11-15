import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderInterface } from './regorder/regorder.component';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private api: HttpClient) {}

  getOrder(order: number, filter?: string): Observable<OrderInterface>{
    return this.api.get<OrderInterface>(`${environment.API_URL}/comandas/${order}?${filter}`);
  }
  getOrders(jwt: string, filter?: string): Observable<OrderInterface[]>{
    return this.api.get<OrderInterface[]>(`${environment.API_URL}/comandas?${filter}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  searchRelatedOrders(phone: number, id: number, jwt: string): Observable<OrderInterface[]>{
    return this.api.get<OrderInterface[]>(`${environment.API_URL}/comandas?_sort=id:DESC&phone_number=${phone}&id_ne=${id}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  deleteOrder(order: number, jwt: string): Observable<OrderInterface>{
    return this.api.delete<OrderInterface>(`${environment.API_URL}/comandas/${order}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  modifyOrder(orderid: number, order: OrderInterface, jwt: string): Observable<OrderInterface>{
    return this.api.put<OrderInterface>(`${environment.API_URL}/comandas/${orderid}`, order, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  login(username: string, password: string): Observable<OrderInterface>{
    return this.api.post<OrderInterface>(`${environment.API_URL}/auth/local`, { identifier: username, password});
  }

  getUserInfo(jwt: string): Observable<OrderInterface>{
    return this.api.get<OrderInterface>(`${environment.API_URL}/users/me`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  registerOrder(jwt: string, order: OrderInterface): Observable<OrderInterface>{
    return this.api.post<OrderInterface>(`${environment.API_URL}/comandas`, order, {headers: {
      Authorization: `Bearer ${jwt}`
    }});
  }

}
