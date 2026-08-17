import express, { Application, Request, Response } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { stripe } from "./lib/stripe";
import { globalErrorHandler } from "./middlewares/globalError";
import notFound from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.routes";
import { commentRoutes } from "./modules/comment/comment.routes";
import { postRoutes } from "./modules/post/post.routes";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { userRoutes } from "./modules/user/user.routes";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

const endpointSecret = config.stripe_webhook_secret;

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  (request: Request, response: Response) => {
    let event = request.body;
    console.log("stripe request body", request.body); // buffer
    console.log("stripe request headers", request.headers);
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"]!;
      try {
        // converting event buffer into valid obj
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.status(400).json({
          message: err.message,
        });
      }
    }
    console.log("event after try block", event);
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRoutes);

//? not found route

app.use(notFound);

app.use(globalErrorHandler);

export default app;
