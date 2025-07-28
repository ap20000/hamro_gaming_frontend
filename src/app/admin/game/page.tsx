import { Suspense } from "react";
import AdminGameClient from "./adminGameClient";

export default function AdminGamePage() {
  return (
    <Suspense fallback={<div>Loading admin games...</div>}>
      <AdminGameClient />
    </Suspense>
  );
}
