
import mssql from 'mssql';
import { Ilogin, Iproducts, Iuser,Isale, ILoginResponse, IcreateSaleProduct, ISaleResponse, IUpateSoldProduct, IgenericResponse, IUpdatepurchaseUser} from '../interfaces'
import { storesProedures } from '../interfaces/enums';
import { generateJwt } from '../helpers/createToken';

class ProductRepository{

  constructor(){}

  async getProducts():Promise<Iproducts[]>{
    const products = await mssql.query(`exec ${storesProedures.GET_PRODUCTS}`)
    return products.recordset
  }
  async login({username,password}:Ilogin):Promise<ILoginResponse>{
    const req = new mssql.Request()
    req.input('username',username)
    req.input('password',password)
    const {id,purchase_quota} = (await req.execute(storesProedures.LOGIN)).recordset[0] as Iuser || {};
    if (id){
      return {
        ok:true,
        id:id,
        purchase_quota,
        username,
        token:generateJwt({id,username,purchase_quota})
      }
    }
    return {
      ok:false,
      msg:'can not start session'
    }
  }

  async createSale({date,user,total}:Isale):Promise<ISaleResponse>{
    const req = new mssql.Request()
    req.input('total',total)
      .input('date',date)
      .input('user',user)
    const res =  (await req.execute(storesProedures.CREATE_SALE)).recordset
    const saleId=   res[0].newSaleId
    if (saleId){
      return {ok:true,newSaleId:saleId}
    }
    return {
      ok:false,
      msg:'Can not create sale id'
    }
  }
  
  async createSalesProduct({idSale,idProduct,cant,unit_price}:IcreateSaleProduct):
  Promise<IgenericResponse>{
    const req = new mssql.Request()
    req.input('id_sale',idSale)
      .input('id_product',idProduct)
      .input('cant',cant)
      .input('unit_price',unit_price)
    const res =  (await req.execute(
      storesProedures.ADD_SALES_PRODUCT
    )).rowsAffected[0] || 0
    if (res===1){
      return {ok:true,msg:'sucess create sale product'}
    }
    return {ok:false,msg:'can not create sale product'}
  }

  async updateTotalSoldProducts({id,cant}:IUpateSoldProduct):Promise<IgenericResponse>{
    const req = new mssql.Request()
    req.input('id',id)
    .input('cant',cant)
    const { rowsAffected } = (await req.execute(storesProedures.UPDATE_SOLD_PRODUCT))
    if (rowsAffected[0]===1){
      return {ok:true,msg:'sold product update'}
    }
    return {ok:false,msg:'can not update sold product'}
  }

  async updatePurchaseUser({id,total}:IUpdatepurchaseUser):Promise<IgenericResponse>{
    const req = new mssql.Request()
    req.input('id',id)
    .input('total',total)
    const {rowsAffected } = await req.execute(storesProedures.UPDATE_PURCHASE_USER)
    if (rowsAffected[0] === 1){
      return {ok:true,msg:'purchase user updated'}
    }
    return {ok:false,msg:'can not purchase user updated'}   
  }

  async veririfyPurchase(id:number):Promise<number>{
    const data = await mssql.query(`exec ${storesProedures.VERIFY_PURCHASE_USER} ${id}`)
    return data.recordset[0].purchase_quota
  }
  async getProductsWithSold():Promise<Iproducts[]>{
    const dat = await mssql.query<Iproducts>(`exec ${storesProedures.GET_PRODUCTS_WITH_SOLD}`)
    return dat.recordset
  }
}
export {ProductRepository};


