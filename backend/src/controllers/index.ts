
import { Request,Response} from 'express';
import { Iproducts } from '../interfaces/index'
import { ProductRepository } from '../repositorys/product';
import { generateJwt, verifyJwt } from '../helpers/createToken';

const productsRepository  = new ProductRepository();

export const getProducts=async(req:Request,res:Response)=>{
  const products = await productsRepository.getProducts()
  const productsSold = await productsRepository.getProductsWithSold()
  return res.json(
    {
      products,productsSold
    }
  )
}

export const login=async(req:Request,res:Response)=>{
  const data = await productsRepository.login(req.body);
  return res.json({...data})
}
export const buy= async(req:Request,res:Response)=>{
  
  //@ts-ignore
  const userId = req.userId;
  const { items } = req.body as {items:Iproducts[]};
  console.log({items})
  let totalPrice = 0
  items.forEach(p=>{
    totalPrice = totalPrice + p.price*p.quantity!
  })
  // verificar el total de cupo de compras del usuario 
  const purchase = await productsRepository.veririfyPurchase(userId);
  if (purchase<totalPrice){
    return res.json({
      ok:false,
      msg:'purchase quota fail'
    })
  }
  const {newSaleId,ok,msg}   = await productsRepository.createSale({date:new Date(),user:userId,total:totalPrice})
  if (ok){
    items.forEach(async (p)=>{
      await productsRepository.createSalesProduct({idProduct:p.id,cant:p.quantity!,unit_price:p.price,idSale:newSaleId!})
      await productsRepository.updateTotalSoldProducts({id:p.id,cant:p.quantity!})
    })
    await productsRepository.updatePurchaseUser({id:userId,total:totalPrice})
    return res.json({
      ok:true,
      msg:'success'
    })
  }
  return res.json({
    ok,msg
  })
}

export const verifyToken=async (req:Request,res:Response)=>{
  const token =   req.body.token;

  const isValid = verifyJwt(token);
  if (!isValid){
    return res.json({
      ok:false,
    })
  }
  const purchase = await productsRepository.veririfyPurchase(isValid.id)
  return res.json({
    ok:true,
    id:isValid.id,
    username:isValid.username,
    purchase_quota:purchase,
    token:generateJwt({id:isValid.id,purchase_quota:purchase,username:isValid.username})
  })
}

export const getProductsSold=async (req:Request,res:Response)=>{

  return res.json(await productsRepository.getProductsWithSold())

}