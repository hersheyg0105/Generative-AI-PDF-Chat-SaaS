"use server";

import { adminDB } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  // get customer id from firebase
  const user = await adminDB.collection("users").doc(userId).get();
  const stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new Error("Stripe customer not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return session.url;
}
