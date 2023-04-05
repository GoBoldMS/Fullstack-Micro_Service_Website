import express, { Request, Response, } from 'express';
import { body } from 'express-validator';
import { BadRequestError, errorHandler, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ylticketingworld/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty(),
    validateRequest,
], async (req: Request, res: Response) => {

    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    if (!charge) {
        throw new BadRequestError("Charge as failed.");
    }

    const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish(
        {
            id: payment.id,
            orderId: payment.orderId,
            stripId: payment.stripeId
        })

    res.status(201).send({ success: true , id: payment.id });

})


export { router as CreateChargeRouter }


