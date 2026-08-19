import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

import config from "../../config";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });
    //old subscriber
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      //new subscriber
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });
    return session.url;
  });

  return {
    payment: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  //Handle the event

  switch (event.type) {
    case "checkout.session.completed":
      //Occurs when a Checkout Session has been successfully completed.
      // console.log("event.data.object", event.data.object);

      await handleCheckoutCompleted(event.data.object);

      break;
    case "customer.subscription.updated":
      //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).

      await handleChangeSubscription(event.data.object);

      /**
       to test this run this command in terminalstripe subscriptions cancel sub_1U62txFGBbT0VwfX9mnDWHIw
       */
      break;

    case "customer.subscription.deleted":
      //Occurs whenever a customer’s subscription ends.
      await handleChangeSubscription(event.data.object);
      /**
       to test this run this command in terminalstripe subscriptions cancel sub_1U62txFGBbT0VwfX9mnDWHIw
       */
      break;

    default:
      // Unexpected event type
      console.log(`No Event Matched. Unhandled event type ${event.type}`);
      break;
  }
};

export const subscriptionServices = {
  createCheckoutSession,
  handleWebhook,
};
