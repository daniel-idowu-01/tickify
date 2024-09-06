import expressRouter from 'express'
import { updateUserById, deleteUserById } from '../controllers/userController.js'

const router = expressRouter()

router.put('/:id', updateUserById)

router.delete('/:id', deleteUserById)

export default router