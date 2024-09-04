import expressRouter from 'express'
import { createEvent } from '../controllers/eventController.js'

const router = expressRouter()

router.post('/:id', createEvent)

export default router