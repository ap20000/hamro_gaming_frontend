import { Suspense } from "react";
import TopUpList from "./topUpList";

export default function TopUpPage() {
  return (
    <Suspense fallback={<div>Loading top-up games...</div>}>
      <TopUpList />
    </Suspense>
  );
}
