

export const claimGiftcard = async (orderId: string) => {
  try {
    const res = await fetch(`/api/product/orders/${orderId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to claim giftcard");
    }

    return data;
 } catch (err: unknown) {
  if (err instanceof Error) {
    throw new Error(err.message);
  }
  throw new Error("Something went wrong");
}
};
