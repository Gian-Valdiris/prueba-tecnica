import { Router } from 'express';
import { buy, getProducts, getProductsSold, login, verifyToken } from '../controllers';
import { loginMD } from '../middlewares/login';
import { validateTokenMD } from '../middlewares/buy';
const router = Router()

router.get('/get-products',getProducts)
router.post('/login',loginMD,login)
router.post('/buy',validateTokenMD,buy)
router.get('/products-sold',getProductsSold)
router.post('/verify-token',verifyToken)

export default router