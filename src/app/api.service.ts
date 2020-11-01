import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderInterface } from "./regorder/regorder.component"
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private api: HttpClient) {} 

  getOrder(order: number){
    return this.api.get(`${environment.API_URL}/comandas/${order}`);
  }  
  getOrders(jwt: string){
    return this.api.get(`${environment.API_URL}/comandas?_sort=id:DESC`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  searchRelatedOrders(phone: number, id: number, jwt: string){
    return this.api.get(`${environment.API_URL}/comandas?_sort=id:DESC&phone_number=${phone}&id_ne=${id}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  deleteOrder(order:number, jwt: string){
    return this.api.delete(`${environment.API_URL}/comandas/${order}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }  
  modifyOrder(orderid: number, order: OrderInterface, jwt: string){
    return this.api.put(`${environment.API_URL}/comandas/${orderid}`, order, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  login(username: string, password: string){
    return this.api.post(`${environment.API_URL}/auth/local`,{identifier: username, password:password})
  }

  getUserInfo(jwt: string){
    return this.api.get(`${environment.API_URL}/users/me`, {headers : {
      Authorization: `Bearer ${jwt}`
    }})
  }
  registerOrder(jwt: string, order: OrderInterface){
    return this.api.post(`${environment.API_URL}/comandas`,order,{headers: {
      Authorization: `Bearer ${jwt}`
    }})
  }

}
