"use client";

import { Suspense } from "react";
import PaymentComponent from "./paymentComp";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentComponent />
    </Suspense>
  );
}
