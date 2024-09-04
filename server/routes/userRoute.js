import expressRouter from 'express'
import { updateUserById } from '../controllers/userController.js'

const router = expressRouter()

router.put('/:id', updateUserById)

export default router