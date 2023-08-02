import {Request,Response,NextFunction} from 'express'
import { stringToSHA1 } from '../helpers/encriptPassword';
export const loginMD= (req:Request,res:Response,next:NextFunction)=>{

  const { password,username } = req.body;
  if (!username || !password){
    return res.status(400).json({
      ok:false,
      msg:'username or password is require'
    })
  }
  req.body.password = stringToSHA1(password)
  return next()
}