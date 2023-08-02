export interface Iproducts{
    id: number;
    name: string;
    price: number;
    stock: number;
    quantity?:number
}
export interface Iuser{
  id:number;
  username:string;
  purchase_quota:number;
}
export interface Ilogin{
  username:string;
  password:string
}
export interface ILoginResponse {
  ok: boolean;
  id?: number;
  purchase_quota?: number;
  username?: string;
  token?: string;
  msg?: string;
}
export interface ISaleResponse{
  ok:boolean,
  id?:number,
  msg?:string,
  newSaleId?:number

}
export interface Isale{
  total:number,
  date:Date,
  user:number
}
export interface IcreateSaleProduct{
  idSale:number;
  idProduct:number;
  cant:number;
  unit_price:number;
}
export interface IgenericResponse {
  ok: boolean;
  msg: string;
}
export interface IUpateSoldProduct{
  id:number
  cant:number
}
export interface IUpdatepurchaseUser{
  id:number,
  total:number
}