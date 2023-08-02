import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Product,dataProduct } from '../../interfaces/products'


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})

export class ProductsComponent implements OnInit {

  products:Product[] = []
  products_sold:Product[]=[]
  cartItems: Product[] = [];
  messagePurchase = ''
  messageCa=''
  nameP=''
  searchProducts:Product[] = []
  constructor(
    private serverService:ServerService
  ) { }

  // load products
  ngOnInit(): void {
    this.serverService.getProduct().subscribe(({products,productsSold}:any)=>{
      this.products=products.map((p:Product)=>({
        ...p,
        quantity:0
      }))
      this.products_sold = productsSold
    })
  }
  get purchaseQuota(){
    return this.serverService.purchaseQuota;
  }
  
  decreaseQuantity(product: Product) {
    if(product.quantity>0){
      product.quantity--
      this.serverService.updatePurchaseQuota(product.price)
      this.messagePurchase = ''
    }
  }

  increaseQuantity(product: Product) {
    if(product.quantity < product.stock){
      if (this.purchaseQuota!>=product.price){
        product.quantity++ 
        this.serverService.updatePurchaseQuota(-product.price)
        this.messagePurchase = ''
      }
      else{
        this.messagePurchase='no puede comprar el articulo cupo de compras alcanzado'
      }
    }
  }
  
  modifyPurchaseQuote(value:number){
    
  }

  addToCart(product: Product) {
    if (product.quantity > 0 && product.quantity <= product.stock) {
      const cartItem = this.cartItems.find(item => item.name === product.name);

      if (cartItem) {
        cartItem.quantity += product.quantity;
      } else {
        this.cartItems.push({ ...product, quantity: product.quantity });
      }
      product.stock -= product.quantity;
      product.quantity = 0;
    }
  }

  checkout() {
    this.serverService.buy(this.cartItems).subscribe(
      (data)=>{
        if(data.ok){
          this.messageCa = 'Su compra se realizo con exito'
        }
        else{
          this.messageCa='Error al  hacer la compra'
        }
      }
    )
    this.cartItems = [];
  }

  searchProduct(){
    this.searchProducts= []
    this.products.forEach((p)=>{
      if(p.name.toLocaleLowerCase().includes(this.nameP.toLocaleLowerCase())){
        this.searchProducts.push(p)
      }
    })
  }

}
