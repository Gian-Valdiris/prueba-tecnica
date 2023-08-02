import jwt from 'jsonwebtoken';
interface Ipayload{
  username:string;
  id:number;
  purchase_quota:number
}
export  function generateJwt(payload:Ipayload):string{
  const token = jwt.sign(payload,`${process.env.SECRET_TOKEN}`,{expiresIn:'5d'})
  return token;
}
export function verifyJwt(token:string):Ipayload|undefined{
  try{
    const decriptedToken = jwt.verify(token,`${process.env.SECRET_TOKEN}`)
    return decriptedToken as Ipayload;
  }
  catch(e){
    return undefined;
  }
}