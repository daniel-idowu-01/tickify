import expressRouter from 'express'
import { signUp, login } from '../controllers/authController.js'

const router = expressRouter()

router.post('/', signUp)
router.post('/login', login)

export default router