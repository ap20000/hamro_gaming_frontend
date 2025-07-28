

export async function getAllOrdersList() {
    try {
      const response  = await fetch(`/api/admin/orders`, {
        method: "GET",
        credentials: "include"
      });
      
      const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    return data.orders;

  } catch (error) {
    throw error;
  }
  }


  export async function verifyOrderById(orderId: string) {
    try {
        const response = await fetch(`/api/admin/verify-order/${orderId}`, {
            method: "PUT",
              headers: {
        "Content-Type": "application/json",
      },
            credentials: "include"
        })
 
      const data = await response.json();


    if (!response.ok) {
         if (data.message?.includes("out of stock")) {
        throw new Error(`Cannot verify order: ${data.message}`);
      }
      throw new Error(data.message || "Failed to verify order");

    }

    return data;

    } catch (error) {
            console.error("Verify order error:", error);
            throw error;

    }
  }