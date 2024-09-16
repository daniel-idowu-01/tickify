import expressRouter from 'express'
import { authToken } from '../middleware/authToken.js'
import { signUp, login, changePassword, confirmEmail } from '../controllers/authController.js'

const router = expressRouter()

router.post('/', signUp)
router.post('/login', login)
router.put('/change-password', authToken, changePassword)
router.get('/confirm-email/:emailToken', confirmEmail)

export default router