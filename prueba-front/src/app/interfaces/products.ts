export interface dataProduct{
  id:number;
  name: string;
  price: number;
  stock: number;
  total_sold?:number;
}
export interface Product extends dataProduct {
  quantity: number;
}

