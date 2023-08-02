import mssql from 'mssql'

const { USER_SQL,PASSWORD_SQL,HOST_SQL,DATABASE_SQL, } = process.env;

const config:mssql.config = {
  user: USER_SQL,
  password: PASSWORD_SQL,
  server:HOST_SQL!,
  database: DATABASE_SQL,
};

export async function connecDatabase(){
  try{
    await mssql.connect(config);
    console.log('database connected  ')
  }catch({message}:any){
    console.log(message)
    throw new Error('Can  not connet database')
  }
}