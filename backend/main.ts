import 'dotenv/config'
import express,{Request,Response} from "express";
import cors from 'cors';
import mainPath from './src/routes'
import morgan from 'morgan';

import { connecDatabase } from './src/database/connect';

const port = process.env.PORT;

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api',mainPath)

// lado de testing 

app.listen(port,async ()=>{
  connecDatabase()
  console.log(`Server running at port ${port}`)
})



