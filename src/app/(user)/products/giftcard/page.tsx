import { Suspense } from "react";
import GiftCardList from "./giftCardList";

export default function GiftcardPage() {
  return (
    <Suspense fallback={<div>Loading top-up games...</div>}>
      <GiftCardList />
    </Suspense>
  );
}
