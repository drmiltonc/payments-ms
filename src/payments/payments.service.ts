import { Injectable } from '@nestjs/common';
import envVars from 'src/config/envs';
import Stripe from 'stripe';
import { PaymenSessionDto, PaymentSessionItemDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {


    private readonly stripe = new Stripe(envVars.STRIPE_SECRET);

    async createPaymentSession(paymentSession: PaymenSessionDto) {

        const { currency, items, orderId } = paymentSession;

        const itemsArray = items.map((item: PaymentSessionItemDto) => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            }
        })



        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                }
            },
            line_items: itemsArray,
            mode: 'payment',
            success_url: envVars.SUCCESS_URL,
            cancel_url: envVars.CANCEL_URL,
        })

        return session;
    }

    async stripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];
        let event: Stripe.Event;
        const endpointSecret = envVars.STRIPE_ENDPOINT_SECRET;

        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
        } catch (e) {
            console.log({e});
             res.status(400).send(`Webhook Error: ${e.message}`);
             return;
        }

        console.log(event);

        switch (event.type) {
            case 'charge.succeeded':
                const session = event.data.object;
                console.log({metadata: session.metadata});
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }


        return res.status(200).json({sig});
    }
}
