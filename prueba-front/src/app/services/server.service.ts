import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product, dataProduct } from '../interfaces/products';
import { IUser } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private userData:IUser = {
    id:null,
    purchase_quota:null,
    username:null,
    token:null
  }

  

  constructor(private http:HttpClient) { }

  updatePurchaseQuota(purchase:number){
    this.userData.purchase_quota =  this.userData.purchase_quota!+purchase
  }

  isAuth():Observable<any>{
    return this.http.post('http://localhost:8080/api/verify-token',{token:this.userData.token|| localStorage.getItem('token')})
  }

  get purchaseQuota(){
    return this.userData.purchase_quota;
  }
  get token(){
    return this.userData.token;
  }
  get username(){
    return this.userData.username;
  }
  get idUser(){
    return this.userData.id
  }

  setDataUser(data:IUser){
    localStorage.setItem('token',data.token!)
    this.userData = {...data};
  }
  loginUser(username:string,password:string):Observable<any>{

    return this.http.post('http://localhost:8080/api/login',{username,password})

  }
  getProduct():Observable<dataProduct[]>{
    return this.http.get<dataProduct[]>('http://localhost:8080/api/get-products')
  }

  buy(items:Product[]):Observable<any>{
    const headers= new HttpHeaders().append('token',this.userData.token!)
    headers.set('token',this.userData.token!)
    return this.http.post('http://localhost:8080/api/buy',{items},{headers})
  }
}
