import express, { Request, Response, Router } from 'express'
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@ylticketingworld/common'
import { Ticket } from '../models/ticket'


const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    });

    res.send(tickets)
})

export { router as indexTicketRouter };