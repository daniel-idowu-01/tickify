import expressRouter from 'express'
import { createOrganizer } from '../controllers/organizerController.js'

const router = expressRouter()

router.post('/', createOrganizer)

export default router