import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm.jsx"
import { useLocation, useNavigate } from "react-router-dom";


const stripePromise = loadStripe("pk_test_51RfMKoGhs9Y6wJCqnWYR0MF9RMAN0wm4Z5x6fVCjMECQFX8ELagpAOzjQNFd6GhTajgA4dlXifSftDo5wrIA6vBJ00k5kZl30g"); // 

export default function DonatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaignId, amount } = location.state || {};

  if (!campaignId || !amount) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Elements stripe={stripePromise}>
        <CheckoutForm campaignId={campaignId} amount={amount} />
      </Elements>
    </div>
  );
}

