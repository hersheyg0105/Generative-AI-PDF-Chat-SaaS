"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

export async function createCheckoutSession(userDetails: UserDetails) {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not available");
  }

  let stripeCustomerId;

  const user = await adminDB.collection("users").doc(userId).get();
  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    //create a new stripe customer
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    await adminDB.collection("users").doc(userId).set({
      stripeCustomerId: customer.id,
    });
    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1PuKvPI9LdMK9uFnCJxiocHg",
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });

  return session.id;
}
