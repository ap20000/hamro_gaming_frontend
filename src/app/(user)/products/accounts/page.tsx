import { Suspense } from "react";
import AccountList from "./accountList";

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading top-up games...</div>}>
      <AccountList />
    </Suspense>
  );
}
