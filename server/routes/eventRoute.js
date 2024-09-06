import expressRouter from 'express'
import { createEvent, updateEventById } from '../controllers/eventController.js'

const router = expressRouter()

router.post('/:id', createEvent)
router.put("/:id", updateEventById);

export default router