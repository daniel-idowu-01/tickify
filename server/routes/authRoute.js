import expressRouter from 'express'
import { authToken } from '../middleware/authToken.js'
import { signUp, login, changePassword } from '../controllers/authController.js'

const router = expressRouter()

router.post('/', signUp)
router.post('/login', login)
router.put('/change-password', authToken, changePassword)

export default router