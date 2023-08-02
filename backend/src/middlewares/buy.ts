
import {Request,Response,NextFunction} from 'express';
import { verifyJwt } from '../helpers/createToken';
export const validateTokenMD = async(req:Request,res:Response,next:NextFunction)=>{

  const token = req.headers['token']

  const data =  verifyJwt(`${token}`)
  if (!data){
    return res.status(401).json({
      ok:false,
      msg:'Unautorised'
    })
  }
  //@ts-ignore
  req.userId = data.id
  console.log(data)
  return next()

}