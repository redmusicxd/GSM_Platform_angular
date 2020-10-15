import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderInterface } from "./regorder/regorder.component"
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  base: string = environment.production ? "/api" : "";

  constructor(private api: HttpClient) {} 

  getOrder(order: number){
    return this.api.get(`/comandas/${order}`);
  }  
  getOrders(jwt: string){
    return this.api.get(`${this.base}/comandas/`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }    
  deleteOrder(order:string, jwt: string){
    return this.api.delete(`${this.base}/comandas/${order}`, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }  
  modifyOrder(orderid: number, order: OrderInterface, jwt: string){
    return this.api.put(`${this.base}/comandas/${orderid}`, order, {headers : {
      Authorization: `Bearer ${jwt}`
    }});
  }
  login(username: string, password: string){
    return this.api.post(`${this.base}/auth/local`,{identifier: username, password:password})
  }

  getUserInfo(jwt: string){
    return this.api.get(`${this.base}/users/me`, {headers : {
      Authorization: `Bearer ${jwt}`
    }})
  }
  registerOrder(jwt: string, order: OrderInterface){
    return this.api.post(`${this.base}/comandas/`,order,{headers: {
      Authorization: `Bearer ${jwt}`
    }})
  }

}
