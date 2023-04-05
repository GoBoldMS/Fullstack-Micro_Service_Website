import express, { Request, Response } from 'express'
import { NotFoundError} from '@ylticketingworld/common'
import { Ticket } from '../models/ticket'


const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {

    const t = await Ticket.findById(req.params.id)
    if (!t) {
        throw new NotFoundError();
    }

    res.send(t)

});

export { router as showTicketRouter }