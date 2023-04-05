import express, { Request, Response, Router } from 'express'
import { body } from 'express-validator';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ylticketingworld/common'
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWarpper } from '../nats-warpper';


const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket Id must be provided')

], async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWarpper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        },
    });

    res.status(200).send(order)
})


export { router as deleteOrderRouter } 