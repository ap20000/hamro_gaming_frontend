

export async function getQR() {
    try {
       const res =  await fetch(`/api/payment/qr`, {
            method: 'GET',
            headers: { "Content-Type": "application/json"},
            credentials: "include",
        })
         if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create game");
    }

        const data = await res.json();

        return data.qrImage

    } catch (error) {
        throw error;
    }
}