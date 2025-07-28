"use client";

import FullPageLoader from "@/components/ui/full_page_loader";
import { useAdminOrders } from "@/hooks/useOrder";
import OrderList from "@/components/ui/admin/order_list";
import ErrorMessage from "@/components/ui/error_message";
import SuccessMessage from "@/components/ui/success_message";

export default function OrderPage() {
  const { error, loading, orders, verifyOrder, success } = useAdminOrders();

  return (
    <div className="mx-auto p-4 space-y-4">
      {loading ? (
        <FullPageLoader message="Loading Orders..." />
      ) : (
        <>
          {/* Error and Success Message */}

          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}
          <OrderList orders={orders} onVerifyOrder={verifyOrder} />
        </>
      )}
    </div>
  );
}
