import { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

export default function CheckoutForm({ campaignId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    if (!stripe || !elements) {
      setStatus("Stripe is not ready yet.");
      return;
    }

    try {
      const res = await fetch("https://funddaddy-backend.onrender.com/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setStatus("❌ Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setStatus("✅ Payment successful!");

        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("You must be logged in to donate.");
          return;
        }

        const donateRes = await axios.post(
          `https://funddaddy-backend.onrender.com/api/campaigns/${campaignId}/donate`,
          { amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTimeout(() => {
          window.location.href = `/campaign/${campaignId}`;
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setStatus("An error occurred. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <label>Amount: ₹{amount}</label>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: {
              color: "#fa755a",
            },
          },
          hidePostalCode: true,
        }}
      />

      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>

      {status && (
        <div
          className={`text-sm p-2 rounded ${
            status.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </div>
      )}
    </form>
  );
}
