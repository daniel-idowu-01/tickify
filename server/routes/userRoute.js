import expressRouter from 'express'
import { getUserById, getAllUsers, updateUserById, deleteUserById } from '../controllers/userController.js'

const router = expressRouter()

router.get('/:id', getUserById)
router.get('/', getAllUsers)
router.put('/:id', updateUserById)
router.delete('/:id', deleteUserById)

export default router